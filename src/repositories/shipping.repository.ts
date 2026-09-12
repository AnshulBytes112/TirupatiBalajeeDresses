import { BaseRepository } from "./base.repository";
import { Prisma } from "@prisma/client";

export class ShippingRepository extends BaseRepository {
  async ensureDefaults() {
    const count = await this.db.shippingZone.count();
    if (count === 0) {
      // Create Default National, Regional, and Local zones
      const localZone = await this.db.shippingZone.create({
        data: {
          name: "Local / Same State",
          code: "ZONE_LOCAL",
          description: "Same city and local region express delivery",
          shippingCharge: new Prisma.Decimal(0.0),
          freeShippingThreshold: new Prisma.Decimal(0.0),
          minDeliveryDays: 1,
          maxDeliveryDays: 2,
          isCodAvailable: true,
          dispatchSla: "Same Day Dispatch",
          isActive: true,
        },
      });

      const regionalZone = await this.db.shippingZone.create({
        data: {
          name: "Regional Zone",
          code: "ZONE_REGIONAL",
          description: "Adjacent states and metropolitan hubs",
          shippingCharge: new Prisma.Decimal(49.0),
          freeShippingThreshold: new Prisma.Decimal(499.0),
          minDeliveryDays: 2,
          maxDeliveryDays: 4,
          isCodAvailable: true,
          dispatchSla: "Same Day Dispatch",
          isActive: true,
        },
      });

      const nationalZone = await this.db.shippingZone.create({
        data: {
          name: "National Zone (Rest of India)",
          code: "ZONE_NATIONAL",
          description: "Standard pan-India coverage",
          shippingCharge: new Prisma.Decimal(79.0),
          freeShippingThreshold: new Prisma.Decimal(999.0),
          minDeliveryDays: 3,
          maxDeliveryDays: 6,
          isCodAvailable: true,
          dispatchSla: "Next Business Day",
          isActive: true,
        },
      });

      // Sample key pincodes
      const samplePincodes = [
        { pincode: "110001", zoneId: localZone.id, city: "New Delhi", state: "Delhi" },
        { pincode: "110002", zoneId: localZone.id, city: "New Delhi", state: "Delhi" },
        { pincode: "110016", zoneId: localZone.id, city: "South Delhi", state: "Delhi" },
        { pincode: "110092", zoneId: localZone.id, city: "East Delhi", state: "Delhi" },
        { pincode: "201301", zoneId: localZone.id, city: "Noida", state: "Uttar Pradesh" },
        { pincode: "122001", zoneId: localZone.id, city: "Gurugram", state: "Haryana" },
        { pincode: "800001", zoneId: regionalZone.id, city: "Patna", state: "Bihar" },
        { pincode: "400001", zoneId: regionalZone.id, city: "Mumbai", state: "Maharashtra" },
        { pincode: "560001", zoneId: nationalZone.id, city: "Bengaluru", state: "Karnataka" },
        { pincode: "700001", zoneId: nationalZone.id, city: "Kolkata", state: "West Bengal" },
        { pincode: "600001", zoneId: nationalZone.id, city: "Chennai", state: "Tamil Nadu" },
        { pincode: "500001", zoneId: nationalZone.id, city: "Hyderabad", state: "Telangana" },
      ];

      for (const p of samplePincodes) {
        await this.db.shippingPincode.upsert({
          where: { pincode: p.pincode },
          update: {},
          create: {
            pincode: p.pincode,
            zoneId: p.zoneId,
            city: p.city,
            state: p.state,
            isServiceable: true,
          },
        });
      }
    }
  }

  async findPincodeWithZone(pincode: string) {
    await this.ensureDefaults();

    // 1. Check exact pincode rule
    const specificPincode = await this.db.shippingPincode.findUnique({
      where: { pincode },
      include: { zone: true },
    });

    if (specificPincode && specificPincode.isActive) {
      return specificPincode;
    }

    // 2. If no specific override, fall back to Default National Zone
    const fallbackZone = await this.db.shippingZone.findFirst({
      where: { isActive: true },
      orderBy: { code: "desc" }, // Falls back to ZONE_NATIONAL or first active zone
    });

    if (!fallbackZone) return null;

    return {
      id: "virtual-fallback",
      pincode,
      zoneId: fallbackZone.id,
      isServiceable: true,
      isCodAvailable: null,
      minDeliveryDays: null,
      maxDeliveryDays: null,
      city: null,
      state: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      zone: fallbackZone,
    };
  }

  async getAllZones() {
    await this.ensureDefaults();
    return this.db.shippingZone.findMany({
      include: {
        _count: {
          select: { pincodes: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getZoneById(id: string) {
    return this.db.shippingZone.findUnique({
      where: { id },
      include: { pincodes: true },
    });
  }

  async createZone(data: Prisma.ShippingZoneCreateInput) {
    return this.db.shippingZone.create({ data });
  }

  async updateZone(id: string, data: Prisma.ShippingZoneUpdateInput) {
    return this.db.shippingZone.update({ where: { id }, data });
  }

  async deleteZone(id: string) {
    return this.db.shippingZone.delete({ where: { id } });
  }

  async getPincodes(page = 1, limit = 50, search?: string, zoneId?: string) {
    await this.ensureDefaults();
    const skip = (page - 1) * limit;
    const where: Prisma.ShippingPincodeWhereInput = {
      ...(zoneId ? { zoneId } : {}),
      ...(search
        ? {
            OR: [
              { pincode: { contains: search } },
              { city: { contains: search, mode: "insensitive" } },
              { state: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [pincodes, total] = await Promise.all([
      this.db.shippingPincode.findMany({
        where,
        skip,
        take: limit,
        include: { zone: true },
        orderBy: { pincode: "asc" },
      }),
      this.db.shippingPincode.count({ where }),
    ]);

    return {
      pincodes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async upsertPincode(data: {
    pincode: string;
    zoneId: string;
    isServiceable?: boolean;
    isCodAvailable?: boolean | null;
    minDeliveryDays?: number | null;
    maxDeliveryDays?: number | null;
    city?: string | null;
    state?: string | null;
    isActive?: boolean;
  }) {
    return this.db.shippingPincode.upsert({
      where: { pincode: data.pincode },
      update: {
        zoneId: data.zoneId,
        isServiceable: data.isServiceable ?? true,
        isCodAvailable: data.isCodAvailable,
        minDeliveryDays: data.minDeliveryDays,
        maxDeliveryDays: data.maxDeliveryDays,
        city: data.city,
        state: data.state,
        isActive: data.isActive ?? true,
      },
      create: {
        pincode: data.pincode,
        zoneId: data.zoneId,
        isServiceable: data.isServiceable ?? true,
        isCodAvailable: data.isCodAvailable,
        minDeliveryDays: data.minDeliveryDays,
        maxDeliveryDays: data.maxDeliveryDays,
        city: data.city,
        state: data.state,
        isActive: data.isActive ?? true,
      },
    });
  }

  async getPincodeById(id: string) {
    return this.db.shippingPincode.findUnique({
      where: { id },
      include: { zone: true },
    });
  }

  async updatePincode(
    id: string,
    data: Prisma.ShippingPincodeUpdateInput
  ) {
    return this.db.shippingPincode.update({
      where: { id },
      data,
      include: { zone: true },
    });
  }

  async deletePincode(id: string) {
    return this.db.shippingPincode.delete({ where: { id } });
  }

  async bulkImportPincodes(records: Array<{
    pincode: string;
    zoneCode: string;
    isServiceable?: boolean;
    isCodAvailable?: boolean | null;
    minDeliveryDays?: number | null;
    maxDeliveryDays?: number | null;
    city?: string | null;
    state?: string | null;
  }>) {
    await this.ensureDefaults();
    const zones = await this.db.shippingZone.findMany();
    const zoneMap = new Map(zones.map((z) => [z.code, z.id]));

    let imported = 0;
    let errors = 0;

    for (const row of records) {
      const zoneId = zoneMap.get(row.zoneCode.toUpperCase()) || zones[0]?.id;
      if (!zoneId) {
        errors++;
        continue;
      }

      await this.upsertPincode({
        pincode: row.pincode,
        zoneId,
        isServiceable: row.isServiceable ?? true,
        isCodAvailable: row.isCodAvailable,
        minDeliveryDays: row.minDeliveryDays,
        maxDeliveryDays: row.maxDeliveryDays,
        city: row.city,
        state: row.state,
      });
      imported++;
    }

    return { imported, errors };
  }
}

export const shippingRepository = new ShippingRepository();
