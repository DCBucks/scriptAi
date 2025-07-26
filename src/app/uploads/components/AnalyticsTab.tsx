"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Clock,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  FileAudio,
  Brain,
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
  PieChart,
  LineChart,
  BarChart,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

interface AnalyticsTabProps {
  analytics: Analytics | null;
  files: UploadedFile[];
  tasks: Task[];
}

export default function AnalyticsTab({
  analytics,
  files,
  tasks,
}: AnalyticsTabProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("meetings");

  // Calculate additional analytics
  const calculatedAnalytics = useMemo(() => {
    if (!analytics) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter data based on time range
    const filteredFiles = files.filter((file) => {
      const fileDate = new Date(file.uploadDate);
      switch (timeRange) {
        case "7d":
          return fileDate >= sevenDaysAgo;
        case "30d":
          return fileDate >= thirtyDaysAgo;
        default:
          return true;
      }
    });

    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      switch (timeRange) {
        case "7d":
          return taskDate >= sevenDaysAgo;
        case "30d":
          return taskDate >= thirtyDaysAgo;
        default:
          return true;
      }
    });

    // Meeting type distribution
    const meetingTypeStats = filteredFiles.reduce(
      (acc, file) => {
        acc[file.meetingType] = (acc[file.meetingType] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number }
    );

    // Participant statistics
    const allParticipants = filteredFiles.flatMap((file) => file.participants);
    const participantStats = allParticipants.reduce(
      (acc, participant) => {
        acc[participant] = (acc[participant] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number }
    );

    // Task priority distribution
    const taskPriorityStats = filteredTasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number }
    );

    // Task status distribution
    const taskStatusStats = filteredTasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number }
    );

    // Average processing time
    const avgProcessingTime =
      filteredFiles.length > 0
        ? filteredFiles.reduce((sum, file) => sum + file.processingTime, 0) /
          filteredFiles.length
        : 0;

    // Most active participants
    const mostActiveParticipants = Object.entries(participantStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Most common tags
    const allTags = filteredFiles.flatMap((file) => file.tags);
    const tagStats = allTags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number }
    );

    const mostCommonTags = Object.entries(tagStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return {
      ...analytics,
      meetingTypeStats,
      participantStats,
      taskPriorityStats,
      taskStatusStats,
      avgProcessingTime,
      mostActiveParticipants,
      mostCommonTags,
      filteredFiles,
      filteredTasks,
    };
  }, [analytics, files, tasks, timeRange]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatFileSize = (size: string) => {
    return size; // Already formatted in the data
  };

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "meetings":
        return <FileAudio className="w-5 h-5" />;
      case "tasks":
        return <Target className="w-5 h-5" />;
      case "participants":
        return <Users className="w-5 h-5" />;
      case "duration":
        return <Clock className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  if (!calculatedAnalytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary mb-2">
          No analytics available
        </h3>
        <p className="text-orange-300">
          Upload some files to see your analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">
            Analytics Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-4 py-2 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 text-primary px-4 py-2 rounded-lg border border-primary/30 transition-all duration-300">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <FileAudio className="w-6 h-6 text-primary" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-primary mb-2">
            {calculatedAnalytics.filteredFiles.length}
          </h3>
          <p className="text-orange-300 mb-1">Total Meetings</p>
          <p className="text-sm text-green-400">+12% from last period</p>
        </div>

        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-primary mb-2">
            {formatDuration(calculatedAnalytics.totalDuration)}
          </h3>
          <p className="text-orange-300 mb-1">Total Duration</p>
          <p className="text-sm text-green-400">+8% from last period</p>
        </div>

        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-primary mb-2">
            {calculatedAnalytics.filteredTasks.length}
          </h3>
          <p className="text-orange-300 mb-1">Total Tasks</p>
          <p className="text-sm text-red-400">-3% from last period</p>
        </div>

        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-primary mb-2">
            {calculatedAnalytics.taskCompletionRate}%
          </h3>
          <p className="text-orange-300 mb-1">Completion Rate</p>
          <p className="text-sm text-green-400">+5% from last period</p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Type Distribution */}
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Meeting Types
          </h3>
          <div className="space-y-3">
            {Object.entries(calculatedAnalytics.meetingTypeStats).map(
              ([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-orange-100">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-border/50 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                        style={{
                          width: `${(count / calculatedAnalytics.filteredFiles.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-primary font-medium">{count}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Task Status
          </h3>
          <div className="space-y-3">
            {Object.entries(calculatedAnalytics.taskStatusStats).map(
              ([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status === "completed"
                          ? "bg-green-400"
                          : status === "in-progress"
                            ? "bg-blue-400"
                            : "bg-orange-400"
                      }`}
                    ></div>
                    <span className="text-orange-100 capitalize">
                      {status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-border/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status === "completed"
                            ? "bg-green-400"
                            : status === "in-progress"
                              ? "bg-blue-400"
                              : "bg-orange-400"
                        }`}
                        style={{
                          width: `${(count / calculatedAnalytics.filteredTasks.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-primary font-medium">{count}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Most Active Participants */}
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Most Active Participants
          </h3>
          <div className="space-y-3">
            {calculatedAnalytics.mostActiveParticipants.map(
              (participant, index) => (
                <div
                  key={participant.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {participant.name.charAt(0)}
                    </div>
                    <span className="text-orange-100">{participant.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary font-medium">
                      {participant.count} meetings
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Most Common Topics */}
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Most Common Topics
          </h3>
          <div className="space-y-3">
            {calculatedAnalytics.mostCommonTags.map((tag, index) => (
              <div key={tag.tag} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-100 capitalize">{tag.tag}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary font-medium">
                    {tag.count} mentions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {formatDuration(calculatedAnalytics.averageMeetingLength)}
            </div>
            <p className="text-orange-300">Average Meeting Length</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {calculatedAnalytics.avgProcessingTime.toFixed(1)}s
            </div>
            <p className="text-orange-300">Average Processing Time</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {calculatedAnalytics.mostActiveParticipants.length}
            </div>
            <p className="text-orange-300">Active Participants</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          AI Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Positive Trend</span>
            </div>
            <p className="text-orange-100 text-sm">
              Your meeting frequency has increased by 12% this month, indicating
              improved team collaboration.
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-medium">
                Attention Needed
              </span>
            </div>
            <p className="text-orange-100 text-sm">
              Task completion rate is below target. Consider reviewing task
              priorities and deadlines.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Team Engagement</span>
            </div>
            <p className="text-orange-100 text-sm">
              Team standups are your most common meeting type, showing good
              daily communication practices.
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">
                Efficiency Gain
              </span>
            </div>
            <p className="text-orange-100 text-sm">
              Average processing time has improved by 15%, making your workflow
              more efficient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
