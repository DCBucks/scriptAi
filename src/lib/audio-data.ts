import { supabase } from "./supabase";

export interface AudioFileData {
  id?: string;
  user_id: string;
  filename: string;
  file_size: number;
  duration: string;
  upload_url?: string | null;
  processing_status?: "pending" | "processing" | "completed" | "error";
}

export interface SummaryData {
  audio_file_id: string;
  main_summary: string;
  bullet_points: string[];
  key_topics: string[];
  action_items: string[];
}

export interface ChatMessageData {
  audio_file_id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
}

// Audio File Management
export async function saveAudioFile(audioData: AudioFileData) {
  try {
    const { data, error } = await supabase
      .from("audio_files")
      .insert(audioData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving audio file:", error);
    throw error;
  }
}

export async function updateAudioFileStatus(
  audioFileId: string,
  status: "pending" | "processing" | "completed" | "error"
) {
  try {
    const { data, error } = await supabase
      .from("audio_files")
      .update({
        processing_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", audioFileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating audio file status:", error);
    throw error;
  }
}

export async function updateAudioFileWithTranscript(
  audioFileId: string,
  transcript: string,
  status: "pending" | "processing" | "completed" | "error" = "completed"
) {
  try {
    const { data, error } = await supabase
      .from("audio_files")
      .update({
        transcript,
        processing_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", audioFileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating audio file with transcript:", error);
    throw error;
  }
}

export async function getUserAudioFiles(userId: string) {
  try {
    const { data, error } = await supabase
      .from("audio_files")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user audio files:", error);
    throw error;
  }
}

// Summary Management
export async function saveSummary(summaryData: SummaryData) {
  try {
    const { data, error } = await supabase
      .from("summaries")
      .insert(summaryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving summary:", error);
    throw error;
  }
}

export async function getSummaryByAudioFileId(audioFileId: string) {
  try {
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("audio_file_id", audioFileId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error;
  }
}

// Chat Message Management
export async function saveChatMessage(messageData: ChatMessageData) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
}

export async function getChatMessages(audioFileId: string) {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("audio_file_id", audioFileId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
}

// Combined data fetching
export async function getAudioFileWithSummaryAndChat(audioFileId: string) {
  try {
    const [audioFile, summary, chatMessages] = await Promise.all([
      supabase.from("audio_files").select("*").eq("id", audioFileId).single(),
      supabase
        .from("summaries")
        .select("*")
        .eq("audio_file_id", audioFileId)
        .single(),
      supabase
        .from("chat_messages")
        .select("*")
        .eq("audio_file_id", audioFileId)
        .order("created_at", { ascending: true }),
    ]);

    if (audioFile.error) throw audioFile.error;

    return {
      audioFile: audioFile.data,
      summary: summary.data,
      chatMessages: chatMessages.data || [],
    };
  } catch (error) {
    console.error("Error fetching audio file data:", error);
    throw error;
  }
}
