export type GenderType = "BOYS" | "GIRLS" | "UNISEX";
export type SeasonType = "SUMMER" | "WINTER" | "ALL_SEASON";
export type UserRole = "CUSTOMER" | "ADMIN" | "STORE_STAFF";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
