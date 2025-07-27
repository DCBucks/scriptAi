"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../hooks/useUser";
import {
  saveAudioFile,
  saveSummary,
  saveChatMessage,
  updateAudioFileWithTranscript,
} from "../../lib/audio-data";
import {
  checkUserPremiumStatus,
  incrementTranscriptionCount,
  checkTranscriptionLimit,
} from "../../lib/subscription";
import ClientOnly from "../../components/ClientOnly";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Upload,
  FileAudio,
  Clock,
  CheckCircle,
  AlertCircle,
  Mic,
  Activity,
  Brain,
  Sparkles,
  Download,
  BarChart3,
  Send,
  MessageCircle,
  RefreshCw,
  X,
  FileText,
  Share2,
  Menu,
  FileUp,
  Crown,
  HelpCircle,
  Users,
} from "lucide-react";

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  duration: string;
}

interface ProcessingStatus {
  stage: "idle" | "uploading" | "processing" | "completed" | "error";
  progress: number;
  message: string;
}

interface Summary {
  mainSummary: string;
  bulletPoints: string[];
  keyTopics: string[];
  actionItems: string[];
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

// Cache for questions to avoid repeated API calls
const questionCache = new Map<string, string>();

// File validation constants
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (OpenAI Whisper limit)
const ALLOWED_AUDIO_TYPES = [
  "audio/mp3",
  "audio/mpeg",
  "audio/wav",
  "audio/m4a",
  "audio/mp4",
];

// Audio Uploader Component
const AudioUploader = ({ onFileSelect }: { onFileSelect: () => void }) => (
  <div className="text-center">
    <div
      className="relative border-2 border-dashed border-border/60 rounded-xl p-16 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] hover:border-primary/50"
      onClick={onFileSelect}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Upload className="w-20 h-20 text-primary group-hover:scale-110 transition-all duration-300" />
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-primary">
          Upload Your Meeting Audio
        </h3>
        <p className="text-orange-300 mb-8 text-lg max-w-md mx-auto">
          Click to select MP3, WAV, or M4A files from your recordings
        </p>
        <button className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105">
          <Upload className="w-5 h-5 inline mr-2" />
          Choose Audio File
        </button>
        <div className="mt-6 text-sm text-orange-400">
          Supported formats: MP3, WAV, M4A • Max size: 25MB
        </div>
      </div>
    </div>
  </div>
);

// Processing Status Component
const ProcessingStatus = ({ status }: { status: ProcessingStatus }) => (
  <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 mb-8 shadow-2xl shadow-primary/5">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {status.stage === "completed" ? (
          <div className="relative">
            <CheckCircle className="w-8 h-8 text-primary" />
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          </div>
        ) : status.stage === "error" ? (
          <AlertCircle className="w-8 h-8 text-orange-500" />
        ) : (
          <div className="relative">
            <Clock className="w-8 h-8 text-primary animate-spin" />
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          </div>
        )}
        <div>
          <span className="font-bold text-xl text-primary">
            {status.progress === 99 ? "Finalizing..." : status.message}
          </span>
          <div className="text-sm text-orange-400 mt-1">
            {status.stage === "uploading"
              ? "Transferring your audio file..."
              : status.stage === "processing" && status.progress === 99
                ? "Finishing things up..."
                : status.stage === "processing"
                  ? "Our AI is working its magic..."
                  : "Ready to review your insights!"}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-primary">
          {Math.floor(status.progress)}%
        </div>
        <div className="text-sm text-orange-400">Complete</div>
      </div>
    </div>

    <div className="relative">
      <div className="w-full bg-border/50 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{
            width: `${status.progress}%`,
            background: "linear-gradient(90deg, #f97316, #fb923c, #fdba74)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
      <div
        className="absolute -top-1 rounded-full w-5 h-5 bg-primary shadow-lg shadow-primary/50 transition-all duration-300 ease-out"
        style={{ left: `calc(${status.progress}% - 10px)` }}
      ></div>
    </div>

    {/* Real-time progress indicators */}
    {status.stage === "processing" && (
      <div className="mt-4 flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.6s" }}
        ></div>
        <span className="text-sm text-orange-300 ml-2">
          {status.progress === 99 ? "Finalizing..." : "AI is analyzing..."}
        </span>
      </div>
    )}
  </div>
);

// Summary Display Component
const SummaryDisplay = ({
  summary,
  onExport,
}: {
  summary: Summary;
  onExport: () => void;
}) => (
  <div className="space-y-8 animate-fadeIn">
    {/* Main Summary */}
    <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 transform hover:scale-[1.01] transition-transform duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center text-primary">
          <div className="relative mr-3">
            <CheckCircle className="w-8 h-8" />
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md"></div>
          </div>
          Meeting Summary
        </h2>
        <button
          onClick={onExport}
          className="flex items-center space-x-2 bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg border border-primary/30 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
      <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-xl p-6 border border-primary/10">
        <p className="text-orange-100 leading-relaxed text-lg">
          {summary.mainSummary}
        </p>
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-8">
      {/* Key Points */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 transform hover:scale-[1.01] transition-transform duration-300">
        <h3 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Key Points
        </h3>
        <ul className="space-y-4">
          {summary.bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start group">
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                <span className="text-black text-sm font-bold">
                  {index + 1}
                </span>
              </div>
              <span className="text-orange-100 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Topics Discussed */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 transform hover:scale-[1.01] transition-transform duration-300">
        <h3 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <Brain className="w-6 h-6 mr-2" />
          Topics Discussed
        </h3>
        <div className="flex flex-wrap gap-3">
          {summary.keyTopics.map((topic, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-primary/20 to-orange-500/20 text-primary px-4 py-2 rounded-full text-sm border border-primary/30 hover:scale-105 transition-all duration-300 cursor-default backdrop-blur-sm"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Action Items */}
    <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5 transform hover:scale-[1.01] transition-transform duration-300">
      <h3 className="text-2xl font-bold mb-6 text-primary flex items-center">
        <CheckCircle className="w-6 h-6 mr-2" />
        Action Items
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {summary.actionItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center group p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300"
          >
            <input
              type="checkbox"
              className="w-5 h-5 text-primary bg-transparent border-2 border-primary/50 rounded focus:ring-primary focus:ring-2 mr-4 hover:border-primary transition-colors duration-300"
            />
            <label className="text-orange-100 cursor-pointer group-hover:text-primary transition-colors duration-300">
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Chat Interface Component
const ChatInterface = ({
  messages,
  currentQuestion,
  onQuestionChange,
  onSendQuestion,
  isAskingQuestion,
}: {
  messages: ChatMessage[];
  currentQuestion: string;
  onQuestionChange: (question: string) => void;
  onSendQuestion: () => void;
  isAskingQuestion: boolean;
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/5">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-8 h-8 text-primary mr-3" />
        <h3 className="text-2xl font-bold text-primary">
          Ask Follow-up Questions
        </h3>
      </div>

      {/* Chat Messages */}
      <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-xl p-6 border border-primary/10 mb-6 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-orange-300 text-center">
            Ask me anything about your meeting!
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-primary to-orange-500 text-black"
                      : "bg-gradient-to-r from-primary/20 to-orange-500/20 text-orange-100 border border-primary/30"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isAskingQuestion && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-primary/20 to-orange-500/20 text-orange-100 border border-primary/30 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Question Input */}
      <div className="flex space-x-4">
        <input
          type="text"
          value={currentQuestion}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSendQuestion()}
          placeholder="Ask a specific question about the meeting..."
          className="flex-1 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-xl px-4 py-3 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
          disabled={isAskingQuestion}
        />
        <button
          onClick={onSendQuestion}
          disabled={!currentQuestion.trim() || isAskingQuestion}
          className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105 disabled:transform-none"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Navigation Component
const NavigationDrawer = ({
  isOpen,
  onClose,
  setIsNavOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  setIsNavOpen: (open: boolean) => void;
}) => {
  const navItems = [
    {
      icon: <Mic className="w-5 h-5" />,
      label: "Transcriber",
      href: "/",
      isActive: true,
    },
    {
      icon: <FileUp className="w-5 h-5" />,
      label: "Uploads",
      href: "/uploads",
      isActive: false,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Team",
      href: "/team",
      isActive: false,
    },
    {
      icon: <Crown className="w-5 h-5" />,
      label: "Upgrade",
      href: "/upgrade",
      isActive: false,
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Support",
      href: "/support",
      isActive: false,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-surface/95 to-surface/90 backdrop-blur-xl border-l border-border/50 shadow-2xl shadow-primary/10 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onMouseLeave={() => setIsNavOpen(false)}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">ScriptAi</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group ${
                  item.isActive
                    ? "bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 text-primary"
                    : "hover:bg-primary/10 text-orange-300 hover:text-primary"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    item.isActive
                      ? "bg-gradient-to-r from-primary to-orange-500 text-black"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {item.isActive && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-border/50 pt-4">
              <p className="text-sm text-orange-400 text-center">
                AI-powered meeting intelligence
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// File Preview Component
const FilePreview = ({
  file,
  onProcess,
  onReset,
  onChangeFile,
  processingStatus,
}: {
  file: UploadedFile;
  onProcess: () => void;
  onReset: () => void;
  onChangeFile: () => void;
  processingStatus: ProcessingStatus;
}) => (
  <div className="flex items-center justify-between bg-gradient-to-r from-border/60 to-border/40 backdrop-blur-sm rounded-xl p-6 border border-border/30">
    <div className="flex items-center space-x-6">
      <div className="relative">
        <FileAudio className="w-12 h-12 text-primary" />
        <Activity className="w-4 h-4 text-orange-300 absolute -bottom-1 -right-1 animate-pulse" />
      </div>
      <div>
        <h4 className="font-bold text-lg text-primary">{file.name}</h4>
        <p className="text-orange-300">
          {file.size} • {file.duration} • Ready for processing
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      {processingStatus.stage === "idle" && (
        <>
          <button
            onClick={onChangeFile}
            className="bg-gradient-to-r from-surface/60 to-surface/40 hover:from-surface/80 hover:to-surface/60 text-primary font-semibold py-2 px-4 rounded-lg border border-border/50 transition-all duration-300 hover:scale-105"
          >
            Change File
          </button>
          <button
            onClick={onProcess}
            className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105"
          >
            <Brain className="w-5 h-5 inline mr-2" />
            Process with AI
          </button>
        </>
      )}
      {processingStatus.stage === "completed" && (
        <button
          onClick={onReset}
          className="bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 text-primary font-semibold py-2 px-6 rounded-lg border border-primary/30 transition-all duration-30 hover:scale-105"
        >
          Upload New File
        </button>
      )}
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({
  error,
  onRetry,
  onDismiss,
}: {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
}) => (
  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/50 rounded-2xl p-6 mb-8 shadow-2xl shadow-red-500/10">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <div>
          <h3 className="text-lg font-bold text-red-300">Processing Error</h3>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg border border-red-500/30 transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
        <button
          onClick={onDismiss}
          className="text-red-300 hover:text-red-200 transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

const UpgradePrompt = ({
  onUpgrade,
  onDismiss,
}: {
  onUpgrade: () => void;
  onDismiss: () => void;
}) => (
  <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/50 rounded-2xl p-6 mb-8 shadow-2xl shadow-orange-500/10">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Crown className="w-8 h-8 text-orange-400" />
        <div>
          <h3 className="text-lg font-bold text-orange-300">
            Upgrade to Premium
          </h3>
          <p className="text-orange-200">
            You&apos;ve reached your free transcription limit. Upgrade to
            premium for unlimited transcriptions!
          </p>
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onUpgrade}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Crown className="w-4 h-4" />
          <span>Upgrade Now</span>
        </button>
        <button
          onClick={onDismiss}
          className="text-orange-300 hover:text-orange-200 transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

function DashboardContent() {
  const router = useRouter();
  const { clerkUser, isSignedIn, isLoaded, userId, isInitialized } = useUser();

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/landing");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (!isLoaded || !isInitialized) {
    return <LoadingSpinner />;
  }

  // Don't render content if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    stage: "idle",
    progress: 0,
    message: "",
  });
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation function
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File too large (max 25MB)";
    }
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      return "Invalid file type. Please use MP3, WAV, or M4A files";
    }
    return null;
  }, []);

  // Get audio duration
  const getAudioDuration = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      };
      audio.onerror = () => {
        resolve("Unknown");
      };
    });
  }, []);

  // Handle file processing
  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        const duration = await getAudioDuration(file);
        const uploadedFile: UploadedFile = {
          file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          duration,
        };
        setUploadedFile(uploadedFile);
        setError(null);
        // Do not automatically start processing - let user click "Process with AI"
      } catch (err) {
        setError("Failed to process audio file");
      }
    },
    [validateFile, getAudioDuration]
  );

  // Retry mechanism
  const retryProcessing = useCallback(
    async (file: UploadedFile, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await processAudioWithAI(file);
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    },
    []
  );

  const processAudioWithAI = useCallback(
    async (file?: UploadedFile) => {
      const targetFile = file || uploadedFile;
      if (!targetFile || !userId) return;

      try {
        // Check transcription limits for free users
        const limits = await checkTranscriptionLimit(clerkUser?.id || "");
        if (limits.hasReachedLimit) {
          setShowUpgradePrompt(true);
          return;
        }

        setError(null);
        setProcessingStatus({
          stage: "processing",
          progress: 0,
          message: "Transcribing audio with AI...",
        });

        // Save audio file to database first
        const audioFileData = {
          user_id: userId,
          filename: targetFile.name,
          file_size: targetFile.file.size,
          duration: targetFile.duration,
          processing_status: "processing" as const,
        };

        const savedAudioFile = await saveAudioFile(audioFileData);

        const formData = new FormData();
        formData.append("audio", targetFile.file);

        // Steady progress from 0% to 99% - 1% at a time
        const progressInterval = setInterval(() => {
          setProcessingStatus((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 1, 99), // Go up 1% at a time, max 99%
          }));
        }, 200); // Update every 200ms for smooth progression

        const response = await fetch("/api/process-audio", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to process audio");
        }

        const result = await response.json();

        if (result.success) {
          // Update audio file with transcript and completed status
          await updateAudioFileWithTranscript(
            savedAudioFile.id,
            result.transcript,
            "completed"
          );

          // Save summary to database
          await saveSummary({
            audio_file_id: savedAudioFile.id,
            main_summary: result.summary.mainSummary,
            bullet_points: result.summary.bulletPoints,
            key_topics: result.summary.keyTopics,
            action_items: result.summary.actionItems,
          });

          // Increment transcription count for free users
          await incrementTranscriptionCount(userId);

          setProcessingStatus({
            stage: "completed",
            progress: 100,
            message: "Analysis complete!",
          });

          setSummary(result.summary);
          setTranscript(result.transcript);

          const initialMessage: ChatMessage = {
            id: Date.now().toString(),
            type: "ai",
            content: `I&apos;ve analyzed your meeting and here&apos;s what I found:\n\n**Summary:** ${result.summary.mainSummary}\n\n**Key Points:**\n${result.summary.bulletPoints.map((point: string) => `• ${point}`).join("\n")}\n\nFeel free to ask me any specific questions about the meeting!`,
            timestamp: new Date(),
          };

          // Save initial AI message to database
          await saveChatMessage({
            audio_file_id: savedAudioFile.id,
            type: "ai",
            content: initialMessage.content,
            timestamp: initialMessage.timestamp.toISOString(),
          });

          setChatMessages([initialMessage]);
        } else {
          throw new Error("Failed to process audio");
        }
      } catch (error) {
        console.error("Error processing audio:", error);
        setProcessingStatus({
          stage: "error",
          progress: 0,
          message:
            error instanceof Error ? error.message : "Failed to process audio",
        });
        setError(
          error instanceof Error ? error.message : "Failed to process audio"
        );
      }
    },
    [uploadedFile, userId, clerkUser?.id]
  );

  const askFollowUpQuestion = useCallback(async () => {
    if (!currentQuestion.trim() || !transcript) return;

    // Check cache first
    const cacheKey = `${currentQuestion.toLowerCase().trim()}-${transcript.substring(0, 100)}`;
    if (questionCache.has(cacheKey)) {
      const cachedAnswer = questionCache.get(cacheKey)!;
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: cachedAnswer,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "user",
          content: currentQuestion,
          timestamp: new Date(),
        },
        aiMessage,
      ]);
      setCurrentQuestion("");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentQuestion,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentQuestion("");
    setIsAskingQuestion(true);

    try {
      const response = await fetch("/api/ask-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          transcript: transcript,
          summary: summary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const result = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: result.answer,
        timestamp: new Date(),
      };

      // Cache the answer
      questionCache.set(cacheKey, result.answer);

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAskingQuestion(false);
    }
  }, [currentQuestion, transcript, summary]);

  const resetUpload = useCallback(() => {
    setUploadedFile(null);
    setProcessingStatus({ stage: "idle", progress: 0, message: "" });
    setSummary(null);
    setTranscript("");
    setChatMessages([]);
    setCurrentQuestion("");
    setError(null);
    setUploadProgress(0);
    setProcessingProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleChangeFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRetry = useCallback(() => {
    if (uploadedFile) {
      retryProcessing(uploadedFile);
    }
  }, [uploadedFile, retryProcessing]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const handleUpgrade = useCallback(() => {
    // Navigate to the upgrade page
    window.location.href = "/upgrade";
  }, []);

  const handleDismissUpgrade = useCallback(() => {
    setShowUpgradePrompt(false);
  }, []);

  const exportSummary = useCallback(() => {
    if (!summary || !transcript) return;

    const data = {
      summary,
      transcript,
      chatMessages,
      metadata: {
        fileName: uploadedFile?.name,
        fileSize: uploadedFile?.size,
        duration: uploadedFile?.duration,
        processedAt: new Date().toISOString(),
        version: "1.0",
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-summary-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [summary, transcript, chatMessages, uploadedFile]);

  // Memoized components for performance
  const audioUploader = useMemo(
    () => <AudioUploader onFileSelect={handleFileSelect} />,
    [handleFileSelect]
  );

  const filePreview = useMemo(
    () =>
      uploadedFile && (
        <FilePreview
          file={uploadedFile}
          onProcess={() => processAudioWithAI()}
          onReset={resetUpload}
          onChangeFile={handleChangeFile}
          processingStatus={processingStatus}
        />
      ),
    [
      uploadedFile,
      processingStatus,
      processAudioWithAI,
      resetUpload,
      handleChangeFile,
    ]
  );

  const summaryDisplay = useMemo(
    () =>
      summary &&
      processingStatus.stage === "completed" && (
        <SummaryDisplay summary={summary} onExport={exportSummary} />
      ),
    [summary, processingStatus.stage, exportSummary]
  );

  const chatInterface = useMemo(
    () =>
      summary &&
      processingStatus.stage === "completed" && (
        <ChatInterface
          messages={chatMessages}
          currentQuestion={currentQuestion}
          onQuestionChange={setCurrentQuestion}
          onSendQuestion={askFollowUpQuestion}
          isAskingQuestion={isAskingQuestion}
        />
      ),
    [
      summary,
      processingStatus.stage,
      chatMessages,
      currentQuestion,
      askFollowUpQuestion,
      isAskingQuestion,
    ]
  );

  return (
    <div className="min-h-screen bg-background text-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Navigation Button */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onMouseEnter={() => setIsNavOpen(true)}
            className="p-3 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 backdrop-blur-xl border border-primary/30 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Brain className="w-16 h-16 text-primary animate-pulse" />
              <Sparkles className="w-6 h-6 text-orange-300 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-300 to-orange-500 bg-clip-text text-transparent">
            ScriptAi
          </h1>
          <p className="text-xl text-orange-300 max-w-2xl mx-auto leading-relaxed">
            Transform your meeting recordings into actionable insights with our
            advanced AI technology
          </p>
          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-orange-400">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4" />
              <span>High-quality transcription</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI-powered analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Actionable insights</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorDisplay
            error={error}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />
        )}

        {/* Upgrade Prompt */}
        {showUpgradePrompt && (
          <UpgradePrompt
            onUpgrade={handleUpgrade}
            onDismiss={handleDismissUpgrade}
          />
        )}

        {/* Upload Section */}
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 mb-8 shadow-2xl shadow-primary/5">
          {!uploadedFile ? audioUploader : filePreview}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Processing Status */}
        {processingStatus.stage !== "idle" && (
          <ProcessingStatus status={processingStatus} />
        )}

        {/* Results Section */}
        {summaryDisplay}

        {/* Chat Interface */}
        {chatInterface}
      </div>

      {/* Navigation Drawer */}
      <NavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        setIsNavOpen={setIsNavOpen}
      />
    </div>
  );
}

export default function AudioSummarizer() {
  return (
    <ClientOnly fallback={<LoadingSpinner />}>
      <DashboardContent />
    </ClientOnly>
  );
}
