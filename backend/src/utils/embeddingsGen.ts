import axios from "axios";
import { ollama } from "../config";

export const getEmbeddings = async (code: string) => {
  try {
    const res = await axios.post(
      ollama.api,
      {
        model: ollama.embeddingModel,
        prompt: code,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res) {
      throw new Error(`Failed to fetch embeddings: ${res}`);
    }

    return res.data;
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    throw error;
  }
};
