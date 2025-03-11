// src/lib/Retriever.ts
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";

const {
  MONGODB_ATLAS_URI,
  MONGODB_ATLAS_DB_NAME,
  MONGODB_ATLAS_COLLECTION_NAME,
  OPENAI_API_KEY,
} = process.env;
const client = new MongoClient(MONGODB_ATLAS_URI!);
const collection = client
  .db(MONGODB_ATLAS_DB_NAME!)
  .collection(MONGODB_ATLAS_COLLECTION_NAME!);

  
const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY! });
export const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: collection,
  indexName: "vector_index", // Ensure this exists in your MongoDB
  textKey: "text",
  embeddingKey: "embedding",
});

export const retrieverTool = vectorStore.asRetriever();
