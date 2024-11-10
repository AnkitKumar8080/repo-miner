import axios from "axios";
import { ollama } from "../config";
import nlp from "compromise/three";

export const getEmbeddings = async (data: string) => {
  try {
    const res = await axios.post(
      ollama.api,
      {
        model: ollama.embeddingModel,
        prompt: data,
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

export const extractKeywordsFromQuery = (query: string) => {
  const doc = nlp(query);
  const nouns = doc.nouns().out("text");
  return nouns;
};
