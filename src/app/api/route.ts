import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    console.log(process.env.GOOGLE_GEMINI_API_KEY)
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Using 1.5 Flash for faster, cost-effective summaries. Change to "gemini-2.0-flash-exp" if you want the latest experimental model.
    });

    const prompt = `Provide a concise, engaging summary (50-60 words) of the following blog post. Make it readable and capture the main points, key insights, and tone. Title: "${title}"

Content: ${content}

Format the response as plain text, starting directly with the summary.`;

    const result = await model.generateContent(prompt);
    const summary = await result.response.text();

    return NextResponse.json({ summary });

  } catch (error) {
    console.log(process.env.GOOGLE_GEMINI_API_KEY)
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 }
    );
  }
}