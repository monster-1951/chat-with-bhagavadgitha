import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import "dotenv/config";
import { vectorStore } from "@/lib/Retriever";


const loadPDFData = async (pdfPath: string) => {
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitDocuments(docs);

  // 🟢 Insert into MongoDB Atlas Vector Search
  await vectorStore.addDocuments(chunks);
  console.log("✅ PDF content embedded into MongoDB Atlas Vector Search.");
};
export async function GET() {
  try {
    const pdfPath = "./public/sample.pdf"; // Change this to your actual PDF path
    await loadPDFData(pdfPath);

    console.log("✅ PDF Loaded Successfully!");
    return NextResponse.json({
      success: true,
      message: "PDF data loaded and indexed!",
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
