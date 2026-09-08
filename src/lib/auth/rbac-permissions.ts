import { Role } from "@prisma/client";

export interface PermissionDefinition {
  key: string;
  name: string;
  description: string;
  module: string;
}

export const RBAC_MODULES = [
  {
    id: "HOMEPAGE",
    name: "Homepage CMS & Design",
    description: "Manage hero slides, category cards, promos, combos, and live publish.",
  },
  {
    id: "PRODUCTS",
    name: "Products & Uniform Catalog",
    description: "Manage uniforms, sizes, pricing, and stock items.",
  },
  {
    id: "ORDERS",
    name: "Orders & Fulfillment",
    description: "View customer orders, update tracking status, manage returns/refunds.",
  },
  {
    id: "SCHOOLS",
    name: "Schools & Institutions",
    description: "Manage affiliated school boards, uniform catalogs, and logos.",
  },
  {
    id: "USERS",
    name: "User Management & RBAC",
    description: "Create staff/admin accounts, assign feature permissions, suspend, and soft-delete.",
  },
  {
    id: "AUDIT_LOGS",
    name: "Audit Trail & Logs",
    description: "View all user visits, operations, modifications, and system timestamps.",
  },
  {
    id: "REPORTS",
    name: "Sales & Analytics",
    description: "View revenue metrics, store performance, and export reports.",
  },
  {
    id: "SETTINGS",
    name: "System Settings",
    description: "Configure store policies, contact details, payment keys, and branding.",
  },
];

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Homepage CMS
  { key: "HOMEPAGE:READ", name: "View Homepage CMS", description: "View drafts and preview homepage components", module: "HOMEPAGE" },
  { key: "HOMEPAGE:WRITE", name: "Edit Homepage Content", description: "Modify cards, banners, hero slides, and promos", module: "HOMEPAGE" },
  { key: "HOMEPAGE:UPLOAD", name: "Upload Homepage Media", description: "Upload photos and banners to homepage storage", module: "HOMEPAGE" },
  { key: "HOMEPAGE:PUBLISH", name: "Publish Live to Storefront", description: "Push draft updates to the live website", module: "HOMEPAGE" },

  // Products
  { key: "PRODUCTS:READ", name: "View Products", description: "Browse catalog, products, and inventory", module: "PRODUCTS" },
  { key: "PRODUCTS:CREATE", name: "Create Products", description: "Add new products and school uniforms", module: "PRODUCTS" },
  { key: "PRODUCTS:UPDATE", name: "Update Products", description: "Edit prices, images, descriptions, and stock", module: "PRODUCTS" },
  { key: "PRODUCTS:DELETE", name: "Delete Products", description: "Remove or archive products from catalog", module: "PRODUCTS" },

  // Orders
  { key: "ORDERS:READ", name: "View Orders", description: "View customer orders, receipts, and invoices", module: "ORDERS" },
  { key: "ORDERS:UPDATE_STATUS", name: "Update Order Status", description: "Move orders to Processing, Shipped, Delivered", module: "ORDERS" },
  { key: "ORDERS:CANCEL", name: "Cancel & Refund Orders", description: "Process order cancellations and refund flows", module: "ORDERS" },

  // Schools
  { key: "SCHOOLS:READ", name: "View Schools", description: "View listed schools and uniforms", module: "SCHOOLS" },
  { key: "SCHOOLS:CREATE", name: "Add New School", description: "Onboard new partner schools", module: "SCHOOLS" },
  { key: "SCHOOLS:UPDATE", name: "Update School Info", description: "Edit school uniforms, logos, and contacts", module: "SCHOOLS" },
  { key: "SCHOOLS:DELETE", name: "Delete School", description: "Deactivate or delete school profiles", module: "SCHOOLS" },

  // Users & RBAC
  { key: "USERS:READ", name: "View Users", description: "View admin/staff and customer accounts", module: "USERS" },
  { key: "USERS:CREATE", name: "Create New User", description: "Create staff users with temp credentials", module: "USERS" },
  { key: "USERS:UPDATE_PERMISSIONS", name: "Assign Feature Permissions", description: "Customize module/feature capabilities", module: "USERS" },
  { key: "USERS:SUSPEND", name: "Suspend User Accounts", description: "Temporarily freeze access for users", module: "USERS" },
  { key: "USERS:DELETE", name: "Soft Delete Users", description: "Deactivate and soft-delete user accounts", module: "USERS" },
  { key: "USERS:RESET_PASSWORD", name: "Reset User Password", description: "Generate new temporary credentials", module: "USERS" },

  // Audit Logs
  { key: "AUDIT_LOGS:READ", name: "View Audit Logs", description: "Inspect system actions, user visits, and timestamps", module: "AUDIT_LOGS" },
  { key: "AUDIT_LOGS:EXPORT", name: "Export Audit Logs", description: "Export activity logs as CSV/JSON", module: "AUDIT_LOGS" },

  // Reports
  { key: "REPORTS:READ", name: "View Reports", description: "View sales, inventory, and activity analytics", module: "REPORTS" },
  { key: "REPORTS:EXPORT", name: "Export Reports", description: "Download CSV reports of store data", module: "REPORTS" },

  // Settings
  { key: "SETTINGS:READ", name: "View Settings", description: "View store configuration", module: "SETTINGS" },
  { key: "SETTINGS:WRITE", name: "Edit Settings", description: "Modify system preferences and credentials", module: "SETTINGS" },
];

/**
 * Returns default module/feature permissions for a standard role
 */
export function getRoleDefaultPermissions(role: Role | string): string[] {
  if (role === "SUPER_ADMIN") {
    return ALL_PERMISSIONS.map((p) => p.key);
  }

  if (role === "ADMIN") {
    return ALL_PERMISSIONS.filter(
      (p) => !p.key.startsWith("USERS:DELETE") && !p.key.startsWith("SETTINGS:WRITE")
    ).map((p) => p.key);
  }

  if (role === "STORE_STAFF") {
    return [
      "HOMEPAGE:READ",
      "PRODUCTS:READ",
      "PRODUCTS:UPDATE",
      "ORDERS:READ",
      "ORDERS:UPDATE_STATUS",
      "SCHOOLS:READ",
    ];
  }

  return [];
}

/**
 * Checks whether a user has a specific module/feature permission
 */
export function hasPermission(
  user: { role?: string; permissions?: any; isSuspended?: boolean; isDeleted?: boolean } | null,
  requiredPermission: string
): boolean {
  if (!user || user.isSuspended || user.isDeleted) {
    return false;
  }

  // Super Admin has all permissions
  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  const userPerms: string[] = Array.isArray(user.permissions)
    ? user.permissions
    : getRoleDefaultPermissions(user.role || "CUSTOMER");

  // Wildcard match
  if (userPerms.includes("*") || userPerms.includes("*:*")) {
    return true;
  }

  // Exact match
  if (userPerms.includes(requiredPermission)) {
    return true;
  }

  // Module wildcard match, e.g. "HOMEPAGE:*" matches "HOMEPAGE:READ"
  const [module] = requiredPermission.split(":");
  if (module && userPerms.includes(`${module}:*`)) {
    return true;
  }

  return false;
}
