"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "../../hooks/useUser";
import {
  getUserAudioFiles,
  getSummaryByAudioFileId,
} from "../../lib/audio-data";
import {
  FileAudio,
  Search,
  Filter,
  Download,
  Trash2,
  Edit3,
  Eye,
  Play,
  Pause,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Plus,
  FolderOpen,
  BarChart3,
  Brain,
  MessageCircle,
  Share2,
  Settings,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Bookmark,
  Archive,
  Copy,
  ExternalLink,
  FileText,
  Users,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Lightbulb,
  Briefcase,
  Home,
  Building,
  Phone,
  Video,
  Users2,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  UserCog,
  UserEdit,
  UserSearch,
  UserVoice,
  UserClock,
  UserCheck2,
  UserX2,
  UserPlus2,
  UserMinus2,
  UserCog2,
  UserEdit2,
  UserSearch2,
  UserVoice2,
  UserClock2,
  Menu,
  FileUp,
  Crown,
  HelpCircle,
} from "lucide-react";
import FilesTab from "./components/FilesTab";
import TasksTab from "./components/TasksTab";

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
      icon: <FileAudio className="w-5 h-5" />,
      label: "Transcriber",
      href: "/",
      isActive: false,
    },
    {
      icon: <FileUp className="w-5 h-5" />,
      label: "Uploads",
      href: "/uploads",
      isActive: true,
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

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  duration: string;
  uploadDate: Date;
  transcript: string;
  summary: {
    mainSummary: string;
    bulletPoints: string[];
    keyTopics: string[];
    actionItems: string[];
  };
  tags: string[];
  meetingType: string;
  participants: string[];
  status: "completed" | "failed";
  processingTime: number;
  audioUrl?: string;
  isFavorite: boolean;
  isArchived: boolean;
}

interface Task {
  id: string;
  description: string;
  meetingId: string;
  meetingName: string;
  assignedTo?: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
}

interface Analytics {
  totalMeetings: number;
  totalDuration: number;
  totalTasks: number;
  completedTasks: number;
  averageMeetingLength: number;
  mostCommonTopics: { topic: string; count: number }[];
  taskCompletionRate: number;
  meetingFrequency: { date: string; count: number }[];
}

export default function UploadsPage() {
  const { userId, isSignedIn } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingTranscript, setEditingTranscript] = useState("");
  const [editingSummary, setEditingSummary] = useState("");
  const [editingBulletPoints, setEditingBulletPoints] = useState<string[]>([]);
  const [editingKeyTopics, setEditingKeyTopics] = useState<string[]>([]);
  const [editingActionItems, setEditingActionItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"files" | "tasks" | "assign">(
    "files"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState<string | null>(
    null
  );
  const [audioRefs, setAudioRefs] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});
  const [showActions, setShowActions] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Load user's audio files from Supabase
  useEffect(() => {
    async function loadUserFiles() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const audioFiles = await getUserAudioFiles(userId);

        // Transform Supabase data to match the UploadedFile interface
        const transformedFiles: UploadedFile[] = await Promise.all(
          audioFiles.map(async (file) => {
            // Get summary for this file
            let summary = {
              mainSummary: "",
              bulletPoints: [],
              keyTopics: [],
              actionItems: [],
            };

            try {
              const summaryData = await getSummaryByAudioFileId(file.id);
              if (summaryData) {
                summary = {
                  mainSummary: summaryData.main_summary,
                  bulletPoints: summaryData.bullet_points,
                  keyTopics: summaryData.key_topics,
                  actionItems: summaryData.action_items,
                };
              }
            } catch (error) {
              console.log("No summary found for file:", file.id);
            }

            return {
              id: file.id,
              name: file.filename,
              size: `${(file.file_size / (1024 * 1024)).toFixed(2)} MB`,
              duration: file.duration,
              uploadDate: new Date(file.created_at),
              transcript: file.transcript || "",
              summary,
              tags: [], // Not implemented yet
              meetingType: "Meeting", // Default
              participants: [], // Not implemented yet
              status:
                file.processing_status === "completed" ? "completed" : "failed",
              processingTime: 0, // Not tracked yet
              isFavorite: false, // Not implemented yet
              isArchived: false, // Not implemented yet
            };
          })
        );

        setUploadedFiles(transformedFiles);
        setAnalytics(null); // Not implemented yet
      } catch (error) {
        console.error("Error loading user files:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFiles();
  }, [userId]);

  // Regenerate tasks whenever uploadedFiles changes
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const generatedTasks: Task[] = [];

      uploadedFiles.forEach((file) => {
        if (file.summary.actionItems && file.summary.actionItems.length > 0) {
          file.summary.actionItems.forEach((actionItem, index) => {
            generatedTasks.push({
              id: `${file.id}-task-${index}`,
              description: actionItem,
              meetingId: file.id,
              meetingName: file.name,
              assignedTo: undefined,
              dueDate: undefined,
              priority: "medium" as const,
              status: "pending" as const,
              createdAt: file.uploadDate,
            });
          });
        }
      });

      setTasks(generatedTasks);
    }
  }, [uploadedFiles]);

  // Filter and sort files
  const filteredFiles = uploadedFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      file.participants.some((participant) =>
        participant.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "favorites" && file.isFavorite) ||
      (selectedFilter === "archived" && file.isArchived) ||
      file.meetingType.toLowerCase().includes(selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "date":
        comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "duration":
        comparison = parseFloat(a.duration) - parseFloat(b.duration);
        break;
      case "size":
        comparison = parseFloat(a.size) - parseFloat(b.size);
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Audio playback functions
  const handlePlayAudio = (fileId: string) => {
    if (currentPlayingAudio === fileId) {
      // Pause current audio
      if (audioRefs[fileId]) {
        audioRefs[fileId].pause();
      }
      setCurrentPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (currentPlayingAudio && audioRefs[currentPlayingAudio]) {
        audioRefs[currentPlayingAudio].pause();
      }
      // Start new audio
      if (audioRefs[fileId]) {
        audioRefs[fileId].play();
        setCurrentPlayingAudio(fileId);
      }
    }
  };

  // File management functions
  const toggleFavorite = (fileId: string) => {
    setUploadedFiles((files) =>
      files.map((file) =>
        file.id === fileId ? { ...file, isFavorite: !file.isFavorite } : file
      )
    );
  };

  const toggleArchive = (fileId: string) => {
    setUploadedFiles((files) =>
      files.map((file) =>
        file.id === fileId ? { ...file, isArchived: !file.isArchived } : file
      )
    );
  };

  const deleteFile = (fileId: string) => {
    setUploadedFiles((files) => files.filter((file) => file.id !== fileId));
    setTasks((tasks) => tasks.filter((task) => task.meetingId !== fileId));
  };

  const bulkDelete = () => {
    setUploadedFiles((files) =>
      files.filter((file) => !selectedFiles.includes(file.id))
    );
    setTasks((tasks) =>
      tasks.filter((task) => !selectedFiles.includes(task.meetingId))
    );
    setSelectedFiles([]);
  };

  // Task management functions
  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
  };

  const addTask = (description: string, meetingId?: string) => {
    const newTask: Task = {
      id: `manual-task-${Date.now()}`,
      description,
      meetingId: meetingId || "manual",
      meetingName: meetingId
        ? uploadedFiles.find((f) => f.id === meetingId)?.name || "Manual Task"
        : "Manual Task",
      assignedTo: undefined,
      dueDate: undefined,
      priority: "medium",
      status: "pending",
      createdAt: new Date(),
    };
    setTasks((tasks) => [...tasks, newTask]);
  };

  // Edit functions
  const startEditing = (fileId: string) => {
    const file = uploadedFiles.find((f) => f.id === fileId);
    if (file) {
      setIsEditing(fileId);
      setEditingTranscript(file.transcript);
      setEditingSummary(file.summary.mainSummary);
      setEditingBulletPoints([...file.summary.bulletPoints]);
      setEditingKeyTopics([...file.summary.keyTopics]);
      setEditingActionItems([...file.summary.actionItems]);
    }
  };

  const saveEdits = (fileId: string) => {
    setUploadedFiles((files) =>
      files.map((file) =>
        file.id === fileId
          ? {
              ...file,
              transcript: editingTranscript,
              summary: {
                ...file.summary,
                mainSummary: editingSummary,
                bulletPoints: editingBulletPoints,
                keyTopics: editingKeyTopics,
                actionItems: editingActionItems,
              },
            }
          : file
      )
    );

    // Regenerate tasks for this file
    setTasks((currentTasks) => {
      // Remove existing tasks for this file
      const tasksWithoutFile = currentTasks.filter(
        (task) => task.meetingId !== fileId
      );

      // Add new tasks from updated action items
      const updatedFile = uploadedFiles.find((file) => file.id === fileId);
      if (updatedFile && editingActionItems.length > 0) {
        const newTasks: Task[] = editingActionItems.map(
          (actionItem, index) => ({
            id: `${fileId}-task-${index}`,
            description: actionItem,
            meetingId: fileId,
            meetingName: updatedFile.name,
            assignedTo: undefined,
            dueDate: undefined,
            priority: "medium" as const,
            status: "pending" as const,
            createdAt: updatedFile.uploadDate,
          })
        );

        return [...tasksWithoutFile, ...newTasks];
      }

      return tasksWithoutFile;
    });

    setIsEditing(null);
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  // Export functions
  const exportFile = (file: UploadedFile) => {
    const data = {
      file: file,
      tasks: tasks.filter((task) => task.meetingId === file.id),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAll = () => {
    const data = {
      files: uploadedFiles,
      tasks: tasks,
      analytics: analytics,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uploads-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper functions for editing
  const addBulletPoint = () => {
    setEditingBulletPoints([...editingBulletPoints, ""]);
  };

  const removeBulletPoint = (index: number) => {
    setEditingBulletPoints(editingBulletPoints.filter((_, i) => i !== index));
  };

  const updateBulletPoint = (index: number, value: string) => {
    const newPoints = [...editingBulletPoints];
    newPoints[index] = value;
    setEditingBulletPoints(newPoints);
  };

  const addKeyTopic = () => {
    setEditingKeyTopics([...editingKeyTopics, ""]);
  };

  const removeKeyTopic = (index: number) => {
    setEditingKeyTopics(editingKeyTopics.filter((_, i) => i !== index));
  };

  const updateKeyTopic = (index: number, value: string) => {
    const newTopics = [...editingKeyTopics];
    newTopics[index] = value;
    setEditingKeyTopics(newTopics);
  };

  const addActionItem = () => {
    setEditingActionItems([...editingActionItems, ""]);
  };

  const removeActionItem = (index: number) => {
    setEditingActionItems(editingActionItems.filter((_, i) => i !== index));
  };

  const updateActionItem = (index: number, value: string) => {
    const newItems = [...editingActionItems];
    newItems[index] = value;
    setEditingActionItems(newItems);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    return status === "completed" ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "team standup":
        return <Users className="w-4 h-4" />;
      case "client meeting":
        return <User className="w-4 h-4" />;
      case "1:1 meeting":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <FileAudio className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-orange-300 text-xl">Loading your uploads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Uploads Dashboard
              </h1>
              <p className="text-orange-300">
                Manage your meeting recordings and insights
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-surface/20 rounded-xl p-1 backdrop-blur-sm border border-border/30">
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "files"
                  ? "bg-gradient-to-r from-primary to-orange-500 text-black shadow-lg"
                  : "text-orange-300 hover:text-primary hover:bg-primary/10"
              }`}
            >
              <FileAudio className="w-4 h-4 inline mr-2" />
              Files ({uploadedFiles.length})
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "tasks"
                  ? "bg-gradient-to-r from-primary to-orange-500 text-black shadow-lg"
                  : "text-orange-300 hover:text-primary hover:bg-primary/10"
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("assign")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "assign"
                  ? "bg-gradient-to-r from-primary to-orange-500 text-black shadow-lg"
                  : "text-orange-300 hover:text-primary hover:bg-primary/10"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Assign
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "files" && (
          <FilesTab
            files={sortedFiles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            isEditing={isEditing}
            editingTranscript={editingTranscript}
            setEditingTranscript={setEditingTranscript}
            editingSummary={editingSummary}
            setEditingSummary={setEditingSummary}
            editingBulletPoints={editingBulletPoints}
            setEditingBulletPoints={setEditingBulletPoints}
            editingKeyTopics={editingKeyTopics}
            setEditingKeyTopics={setEditingKeyTopics}
            editingActionItems={editingActionItems}
            setEditingActionItems={setEditingActionItems}
            currentPlayingAudio={currentPlayingAudio}
            audioRefs={audioRefs}
            setAudioRefs={setAudioRefs}
            showActions={showActions}
            setShowActions={setShowActions}
            onPlayAudio={handlePlayAudio}
            onToggleFavorite={toggleFavorite}
            onToggleArchive={toggleArchive}
            onDeleteFile={deleteFile}
            onBulkDelete={bulkDelete}
            onStartEditing={startEditing}
            onSaveEdits={saveEdits}
            onCancelEditing={cancelEditing}
            onExportFile={exportFile}
            addBulletPoint={addBulletPoint}
            removeBulletPoint={removeBulletPoint}
            updateBulletPoint={updateBulletPoint}
            addKeyTopic={addKeyTopic}
            removeKeyTopic={removeKeyTopic}
            updateKeyTopic={updateKeyTopic}
            addActionItem={addActionItem}
            removeActionItem={removeActionItem}
            updateActionItem={updateActionItem}
            formatDate={formatDate}
            getStatusIcon={getStatusIcon}
            getMeetingTypeIcon={getMeetingTypeIcon}
          />
        )}

        {activeTab === "tasks" && (
          <TasksTab
            tasks={tasks}
            files={uploadedFiles}
            onUpdateTaskStatus={updateTaskStatus}
            onDeleteTask={deleteTask}
            onAddTask={addTask}
          />
        )}

        {activeTab === "assign" && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              Assign Tasks
            </h3>
            <p className="text-orange-300">
              Assign tasks to team members and track progress.
            </p>
          </div>
        )}
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
