// import { NextRequest, NextResponse } from "next/server";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import formidable from "formidable";
// import { IncomingMessage } from "http";
// import { Readable } from "stream";
// import fs from "fs";

// export const config = {
//   api: {
//     bodyParser: false, // Required for file uploads
//   },
// };

// let vectorStore: MemoryVectorStore | null = null;

// /**
//  * Converts a NextRequest into an IncomingMessage for formidable
//  */
// function convertNextRequestToIncomingMessage(req: NextRequest): IncomingMessage {
//   const readable = Readable.from(req.body as any);
//   const incomingMessage = Object.assign(readable, {
//     headers: Object.fromEntries(req.headers),
//     method: req.method,
//     url: req.nextUrl.pathname,
//   }) as IncomingMessage;
//   return incomingMessage;
// }

// /**
//  * Parses the uploaded file using Formidable
//  */
// async function parseForm(req: NextRequest): Promise<{ files: formidable.Files }> {
//   const form = formidable({ multiples: false });

//   return new Promise((resolve, reject) => {
//     const incomingReq = convertNextRequestToIncomingMessage(req);
//     form.parse(incomingReq, (err, _, files) => {
//       if (err) reject(err);
//       else resolve({ files });
//     });
//   });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { files } = await parseForm(req);
//     const file = files?.pdfFile?.[0];

//     if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

//     const fileBuffer = await fs.promises.readFile(file.filepath); // Read file into memory

//     // Load PDF directly from memory
//     const loader = new PDFLoader(new Blob([fileBuffer]), { splitPages: true });
//     const docs = await loader.load();

//     // Split into chunks
//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 100,
//     });
//     const docSplits = await textSplitter.splitDocuments(docs);

//     // Store in vector DB
//     vectorStore = await MemoryVectorStore.fromDocuments(
//       docSplits,
//       new OpenAIEmbeddings()
//     );
//     return NextResponse.json({ message: "File uploaded & processed successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
//   }
// }

// export async function GET() {
//     if (!vectorStore) {
//       return NextResponse.json({ error: "No PDF uploaded yet" }, { status: 400 });
//     }
  
//     // Retrieve all stored documents
//     const documents = await vectorStore.similaritySearch(" ", 50); // Fetch top 10 chunks
  
//     return NextResponse.json({ message: "Stored documents", data: documents });
//   }
  