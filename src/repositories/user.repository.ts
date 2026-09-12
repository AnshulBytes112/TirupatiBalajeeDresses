import { BaseRepository } from "./base.repository";
import { User, Role } from "@prisma/client";

export class UserRepository extends BaseRepository {
  /**
   * Idempotently finds or creates an application user record from verified Supabase Auth user.
   * Ensures no duplicates are created under concurrent authentication requests.
   */
  async findOrCreateFromSupabaseAuth(supabaseUser: {
    id: string;
    email?: string | null;
    user_metadata?: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
      picture?: string;
      phone?: string;
    };
    phone?: string | null;
  }): Promise<User> {
    const supabaseId = supabaseUser.id;
    const email = supabaseUser.email?.toLowerCase().trim() || null;
    const name =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      (email ? email.split("@")[0] : "Valued Customer");
    const image =
      supabaseUser.user_metadata?.avatar_url ||
      supabaseUser.user_metadata?.picture ||
      null;
    const phone = supabaseUser.phone || supabaseUser.user_metadata?.phone || null;

    // 1. Try finding by supabaseUserId
    const existingBySupabaseId = await this.db.user.findUnique({
      where: { supabaseUserId: supabaseId },
    });

    if (existingBySupabaseId) {
      // Update last login and missing details if needed
      return this.db.user.update({
        where: { id: existingBySupabaseId.id },
        data: {
          lastLoginAt: new Date(),
          ...(image && !existingBySupabaseId.image ? { image } : {}),
          ...(email && !existingBySupabaseId.email ? { email } : {}),
        },
      });
    }

    // 2. Try finding by email to link existing user if any
    if (email) {
      const existingByEmail = await this.db.user.findUnique({
        where: { email },
      });

      if (existingByEmail) {
        return this.db.user.update({
          where: { id: existingByEmail.id },
          data: {
            supabaseUserId: supabaseId,
            lastLoginAt: new Date(),
            ...(image && !existingByEmail.image ? { image } : {}),
          },
        });
      }
    }

    // 3. Create fresh customer profile
    return this.db.user.create({
      data: {
        supabaseUserId: supabaseId,
        email,
        name,
        image,
        phone,
        role: Role.CUSTOMER,
        isActive: true,
        isSuspended: false,
        isDeleted: false,
        lastLoginAt: new Date(),
      },
    });
  }

  async findById(id: string) {
    return this.db.user.findUnique({
      where: { id, isDeleted: false },
    });
  }

  async findBySupabaseUserId(supabaseUserId: string) {
    return this.db.user.findUnique({
      where: { supabaseUserId, isDeleted: false },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string | null;
      image?: string | null;
    }
  ) {
    return this.db.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name.trim() } : {}),
        ...(data.phone !== undefined ? { phone: data.phone ? data.phone.trim() : null } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
      },
    });
  }

  async getProfileWithStats(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId, isDeleted: false },
      include: {
        addresses: {
          where: { isDeleted: false },
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
        _count: {
          select: {
            orders: { where: { isDeleted: false } },
            reviews: true,
          },
        },
      },
    });

    if (!user) return null;

    // Check wishlist count
    const wishlist = await this.db.wishlist.findUnique({
      where: { userId },
      include: {
        _count: { select: { items: true } },
      },
    });

    return {
      ...user,
      stats: {
        ordersCount: user._count.orders,
        addressesCount: user.addresses.length,
        wishlistCount: wishlist?._count.items || 0,
        reviewsCount: user._count.reviews,
      },
    };
  }
}

export const userRepository = new UserRepository();
