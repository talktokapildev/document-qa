import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { question, documentId } = await req.json();

    if (!question?.trim() || !documentId) {
      return new Response("Missing question or documentId", { status: 400 });
    }
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      filter: { documentId },
    });

    const results = await vectorStore.similaritySearch(question, 4);

    if (results.length === 0) {
      return NextResponse.json({
        answer: "I don't know the answer to that question",
      });
    }

    const contentText = results.map((r) => r.pageContent).join("\n");

    const openai = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const prompt = `You are a helpful AI assistant. Using the following context from a document, 
    please answer the user's question accurately and concisely. If the context doesn't contain 
    relevant information to answer the question, please say so.

Context:
${contentText}

Question: ${question}

    Answer:`;

    const response = await openai.invoke(prompt);

    return NextResponse.json({
      answer: response,
    });
  } catch (error) {
    console.error("Error processing question:", error);
    return NextResponse.json({
      answer: "An error occurred while processing your question.",
    });
  }
}