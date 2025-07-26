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
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer for OpenAI
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 1: Transcribe audio using Whisper
    console.log("Transcribing audio...");
    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], audioFile.name, { type: audioFile.type }),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    const transcript = transcription.text;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "Could not transcribe audio. Please ensure the audio contains clear speech.",
        },
        { status: 400 }
      );
    }

    // Step 2: Generate summary and insights using GPT-4
    console.log("Generating AI summary...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert meeting analyst. Analyze the following meeting transcript and provide:
1. A concise main summary (2-3 sentences)
2. 5 key bullet points of the most important topics discussed
3. 5 main topics/themes that were covered
4. 5 actionable items or next steps mentioned

Format your response as JSON with these exact keys:
{
  "mainSummary": "string",
  "bulletPoints": ["string", "string", ...],
  "keyTopics": ["string", "string", ...],
  "actionItems": ["string", "string", ...]
}

Keep responses professional and business-focused.`,
        },
        {
          role: "user",
          content: `Please analyze this meeting transcript: ${transcript}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let summary;
    try {
      summary = JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse AI response:", aiResponse);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Return the results
    return NextResponse.json({
      success: true,
      transcript: transcript,
      summary: summary,
      processingTime: Date.now(),
    });
  } catch (error) {
    console.error("Error processing audio:", error);

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
      if (error.message.includes("file")) {
        return NextResponse.json(
          { error: "Invalid audio file format. Please use MP3, WAV, or M4A." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process audio file. Please try again." },
      { status: 500 }
    );
  }
}
