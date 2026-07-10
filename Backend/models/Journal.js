const mongoose = require("mongoose");
const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

const getEncryptionKey = () => {
  let key = process.env.ENCRYPTION_KEY;
  if (!key) {
    // Fallback for development if env is not set
    key = "12345678901234567890123456789012";
  }
  if (Buffer.isBuffer(key)) return key;
  if (key.length === 64) return Buffer.from(key, "hex");
  if (key.length === 32) return Buffer.from(key, "utf8");
  return crypto.scryptSync(key, "salt", 32);
};

function encrypt(text) {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getEncryptionKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    return text;
  }
}

function decrypt(text) {
  if (!text || !text.includes(":")) return text;
  try {
    const parts = text.split(":");
    const iv = Buffer.from(parts.shift(), "hex");
    const encryptedText = parts.join(":");
    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return text;
  }
}

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      default: "neutral",
    },
    sentiment: {
      type: String,
      default: "neutral",
    },
    stressLevel: {
      type: Number,
      default: 0,
    },
    keywords: {
      type: [String],
      default: [],
    },
    distortions: {
      type: [String],
      default: [],
    },
    crisisProbability: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

journalSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.title = encrypt(this.title);
  }
  if (this.isModified("content") || this.isNew) {
    this.content = encrypt(this.content);
  }
  next();
});

journalSchema.post("init", function (doc) {
  if (doc.title) {
    doc.title = decrypt(doc.title);
  }
  if (doc.content) {
    doc.content = decrypt(doc.content);
  }
});

journalSchema.post("save", function (doc) {
  if (doc.title) {
    doc.title = decrypt(doc.title);
  }
  if (doc.content) {
    doc.content = decrypt(doc.content);
  }
});

module.exports = mongoose.model("Journal", journalSchema);
