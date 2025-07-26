import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key is not set");
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { question, transcript, summary } = await request.json();

    if (!question || !transcript) {
      return NextResponse.json(
        { error: "Question and transcript are required" },
        { status: 400 }
      );
    }

    console.log("Processing follow-up question:", question);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert meeting analyst assistant. You have access to a complete meeting transcript and summary. 

Your role is to answer specific questions about the meeting content in a helpful, professional manner. 

Guidelines:
- Base your answers on the actual transcript content
- Be specific and provide concrete details when possible
- If the information isn't in the transcript, say so clearly
- Keep responses concise but informative
- Use a professional, business-friendly tone
- If asked about timing, speakers, or specific details, reference the transcript accurately

Available information:
- Full meeting transcript
- Meeting summary with key points, topics, and action items`,
        },
        {
          role: "user",
          content: `Meeting Transcript: ${transcript}

Meeting Summary: ${JSON.stringify(summary, null, 2)}

User Question: ${question}

Please answer the user's question based on the meeting content above.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        { error: "Failed to generate answer" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      answer: answer,
      question: question,
    });
  } catch (error) {
    console.error("Error processing question:", error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Please check your configuration." },
          { status: 401 }
        );
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "OpenAI API quota exceeded. Please check your account." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process question. Please try again." },
      { status: 500 }
    );
  }
}
