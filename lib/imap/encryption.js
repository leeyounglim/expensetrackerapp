import crypto from "crypto";

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("Missing ENCRYPTION_KEY");
}

const ALGORITHM = "aes-256-gcm";

// Convert hex key from env → buffer
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// 🔒 Encrypt
export function encrypt(text) {
  const iv = crypto.randomBytes(12); // recommended for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  // Store iv + tag + encrypted
  return [
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex")
  ].join(":");
}

// 🔓 Decrypt
export function decrypt(encryptedString) {
  const [ivHex, tagHex, dataHex] = encryptedString.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encryptedText = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}