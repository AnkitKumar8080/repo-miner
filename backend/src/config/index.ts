import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const corsUrl = process.env.CORS_URL?.split(",") || [];
export const nodeEnv = process.env.NODE_ENV || "developement";

export const jwtconfig = {
  secretKey: process.env.JWT_SECRET_KEY || "",
  accessTokenValidity: parseInt(process.env.JWT_ACCESS_TOKEN_VALIDITY ?? "0"),
  refreshTokenValidity: parseInt(process.env.JWT_REFRESH_TOKEN_VALIDITY ?? "0"),
};

export const redisConnection = {
  host: "127.0.0.1", // or your Redis server IP
  port: 6379, // Redis port
  connectTimeout: 15000, // 15 seconds
  maxRetriesPerRequest: null, // Recommended for BullMQ
};

export const ollama = {
  api: process.env.OLLAMA_API || "http://localhost:11434/api/embeddings",
  embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || "",
};
