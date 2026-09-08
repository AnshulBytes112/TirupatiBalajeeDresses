import crypto from "crypto";

/**
 * Hashes password securely using standard PBKDF2 with salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain password against stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(":");
  const hashToTest = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return originalHash === hashToTest;
}

/**
 * Generates a clean temporary username based on user's name
 */
export function generateTemporaryUsername(name?: string, role: string = "STAFF"): string {
  const cleanName = (name || "user")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const rolePrefix = role.toLowerCase().replace("_", "").slice(0, 5);
  return `${cleanName}_${rolePrefix}_${randomSuffix}`;
}

/**
 * Generates a strong temporary password
 */
export function generateTemporaryPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "@#$&*!";

  const getRandom = (charset: string) =>
    charset[Math.floor(Math.random() * charset.length)];

  const parts = [
    "TB",
    getRandom(upper),
    getRandom(lower),
    getRandom(numbers),
    getRandom(numbers),
    getRandom(symbols),
    getRandom(numbers),
    getRandom(numbers),
  ];

  return parts.join("");
}

/**
 * Simulates sending credentials email to user
 */
export async function sendTemporaryCredentialsEmail(params: {
  name: string;
  email: string;
  username: string;
  tempPassword: string;
  role: string;
  loginUrl?: string;
}) {
  const { name, email, username, tempPassword, role, loginUrl } = params;

  // Formatted email content for dispatch logging
  const emailContent = {
    to: email,
    subject: "Welcome to TirupatiBalajee Dresses Admin Portal - Your Temporary Credentials",
    body: `
Dear ${name || "User"},

You have been granted access to the TirupatiBalajee Dresses Management Portal as ${role}.

Here are your temporary login credentials:
- Portal URL: ${loginUrl || "http://localhost:3000/admin/users"}
- Temporary Username: ${username}
- Temporary Password: ${tempPassword}

SECURITY NOTICE:
For your account security, you are required to change your temporary password immediately upon your first login before you can access system features.

Best regards,
TirupatiBalajee Dresses Administration
`,
    sentAt: new Date().toISOString(),
    status: "DELIVERED",
  };

  console.log("📨 [ONBOARDING EMAIL DISPATCHED]:", emailContent);
  return emailContent;
}
