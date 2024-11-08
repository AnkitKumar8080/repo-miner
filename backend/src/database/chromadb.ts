import { ChromaClient, GetCollectionParams } from "chromadb";

// create a new chroma client
const chromaClient = new ChromaClient({ path: "http://localhost:8003" });

export const createChromaDbCollection = async (name: string): Promise<any> => {
  try {
    // check for existing collection
    const exisCol = await chromaClient.getCollection({
      name,
    } as GetCollectionParams);

    if (exisCol) {
      console.log(`collection ${name} exists, deleting...`);
      await chromaClient.deleteCollection({ name });
    }
  } catch (error: any) {
    console.log(error.message);
  }

  // create a new collection in chroma db with repo hash
  const collection = await chromaClient.createCollection({ name });
  if (collection) {
    console.log("created chroma db collection: " + name);
  }
  return collection;
};

// add to chromadb collection
export const addEmbChunkContentToCollection = async (
  name: string,
  startLine: number,
  endLine: number,
  content: string,
  filePath: string,
  embedding: []
): Promise<void> => {
  const collection = await chromaClient.getCollection({
    name,
  } as GetCollectionParams);

  try {
    // push embeddings into chromadb collection
    await collection.upsert({
      ids: [`${startLine}-${endLine}`],
      embeddings: [embedding],
      metadatas: [{ startLine, endLine, filePath }],
      documents: [content],
    });
  } catch (error: any) {
    throw new Error(
      "Error while upserting embedding to chromaDb: " + error.message
    );
  }
};
