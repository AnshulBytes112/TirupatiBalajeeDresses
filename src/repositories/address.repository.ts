import { BaseRepository } from "./base.repository";
import { AddressInput, UpdateAddressInput } from "@/validations/address.schema";
import { NotFoundError } from "@/lib/errors";

export class AddressRepository extends BaseRepository {
  /**
   * Retrieves all non-deleted addresses owned by a specific customer.
   */
  async findByUserId(userId: string) {
    return this.db.address.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  /**
   * Retrieves a single address strictly checking customer ownership.
   */
  async findByIdAndUserId(id: string, userId: string) {
    return this.db.address.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });
  }

  /**
   * Creates a new customer address with automatic default atomicity.
   */
  async create(userId: string, data: AddressInput) {
    return this.db.$transaction(async (tx) => {
      // Check existing active addresses count
      const existingCount = await tx.address.count({
        where: { userId, isDeleted: false },
      });

      const shouldBeDefault = data.isDefault || existingCount === 0;

      // If this address should be default, unset any existing default
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true, isDeleted: false },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          fullName: data.fullName.trim(),
          phoneNumber: data.phoneNumber.trim(),
          addressLine1: data.addressLine1.trim(),
          addressLine2: data.addressLine2 ? data.addressLine2.trim() : null,
          landmark: data.landmark ? data.landmark.trim() : null,
          city: data.city.trim(),
          state: data.state.trim(),
          postalCode: data.postalCode.trim(),
          isDefault: shouldBeDefault,
          isDeleted: false,
        },
      });
    });
  }

  /**
   * Updates an existing customer address strictly scoped to owner.
   */
  async update(id: string, userId: string, data: UpdateAddressInput) {
    return this.db.$transaction(async (tx) => {
      const existing = await tx.address.findFirst({
        where: { id, userId, isDeleted: false },
      });

      if (!existing) {
        throw new NotFoundError("Address not found or unauthorized");
      }

      if (data.isDefault === true) {
        await tx.address.updateMany({
          where: { userId, isDefault: true, isDeleted: false, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data: {
          ...(data.fullName !== undefined ? { fullName: data.fullName.trim() } : {}),
          ...(data.phoneNumber !== undefined ? { phoneNumber: data.phoneNumber.trim() } : {}),
          ...(data.addressLine1 !== undefined ? { addressLine1: data.addressLine1.trim() } : {}),
          ...(data.addressLine2 !== undefined ? { addressLine2: data.addressLine2 ? data.addressLine2.trim() : null } : {}),
          ...(data.landmark !== undefined ? { landmark: data.landmark ? data.landmark.trim() : null } : {}),
          ...(data.city !== undefined ? { city: data.city.trim() } : {}),
          ...(data.state !== undefined ? { state: data.state.trim() } : {}),
          ...(data.postalCode !== undefined ? { postalCode: data.postalCode.trim() } : {}),
          ...(data.isDefault !== undefined ? { isDefault: data.isDefault } : {}),
        },
      });
    });
  }

  /**
   * Atomically sets a customer address as default and unsets all others.
   */
  async setDefault(id: string, userId: string) {
    return this.db.$transaction(async (tx) => {
      const target = await tx.address.findFirst({
        where: { id, userId, isDeleted: false },
      });

      if (!target) {
        throw new NotFoundError("Address not found or unauthorized");
      }

      await tx.address.updateMany({
        where: { userId, isDefault: true, isDeleted: false },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  }

  /**
   * Soft-deletes a customer address and promotes another address to default if needed.
   */
  async delete(id: string, userId: string) {
    return this.db.$transaction(async (tx) => {
      const target = await tx.address.findFirst({
        where: { id, userId, isDeleted: false },
      });

      if (!target) {
        throw new NotFoundError("Address not found or unauthorized");
      }

      const wasDefault = target.isDefault;

      await tx.address.update({
        where: { id },
        data: { isDeleted: true, isDefault: false },
      });

      // If the deleted address was default, promote another active address if available
      if (wasDefault) {
        const nextAddress = await tx.address.findFirst({
          where: { userId, isDeleted: false },
          orderBy: { createdAt: "desc" },
        });

        if (nextAddress) {
          await tx.address.update({
            where: { id: nextAddress.id },
            data: { isDefault: true },
          });
        }
      }

      return { success: true };
    });
  }
}

export const addressRepository = new AddressRepository();
