"use client";

import { useState } from "react";
import {
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Filter,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Archive,
  Star,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Check,
  Square,
  CheckSquare,
  FileText,
  Brain,
  BarChart3,
  TrendingUp,
  TrendingDown,
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
} from "lucide-react";

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

interface TasksTabProps {
  tasks: Task[];
  files: UploadedFile[];
  onUpdateTaskStatus: (taskId: string, status: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (description: string, meetingId?: string) => void;
}

export default function TasksTab({
  tasks,
  files,
  onUpdateTaskStatus,
  onDeleteTask,
  onAddTask,
}: TasksTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [editingAssignedTo, setEditingAssignedTo] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [editingPriority, setEditingPriority] =
    useState<Task["priority"]>("medium");
  const [showActions, setShowActions] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskMeetingId, setNewTaskMeetingId] = useState("");

  // Filter and sort tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.meetingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignedTo &&
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === "all";

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;

    return matchesSearch && matchesFilter && matchesPriority && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "created":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "due":
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "status":
        const statusOrder = { "in-progress": 2, pending: 1, completed: 0 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkUpdateStatus = (status: Task["status"]) => {
    selectedTasks.forEach((taskId) => {
      onUpdateTaskStatus(taskId, status);
    });
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach((taskId) => {
      onDeleteTask(taskId);
    });
    setSelectedTasks([]);
  };

  const startEditing = (task: Task) => {
    setIsEditing(task.id);
    setEditingDescription(task.description);
    setEditingAssignedTo(task.assignedTo || "");
    setEditingDueDate(
      task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
    );
    setEditingPriority(task.priority);
  };

  const saveEdits = (taskId: string) => {
    // In a real app, you would update the task here
    setIsEditing(null);
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "low":
        return "text-green-400 bg-green-500/20";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20";
      case "in-progress":
        return "text-blue-400 bg-blue-500/20";
      case "pending":
        return "text-orange-400 bg-orange-500/20";
    }
  };

  const getPriorityIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <Clock className="w-4 h-4" />;
      case "low":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Activity className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;

    return { total, completed };
  };

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-orange-300">Total Tasks</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {stats.completed}
          </div>
          <div className="text-sm text-green-300">Completed</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks, meetings, or assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-xl text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black px-4 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 text-primary px-4 py-3 rounded-xl border border-primary/30 transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-xl px-4 py-3 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
              style={{ colorScheme: "dark" }}
            >
              <option value="created" className="bg-gray-900 text-orange-100">
                Created Date
              </option>
              <option value="due" className="bg-gray-900 text-orange-100">
                Due Date
              </option>
              <option value="priority" className="bg-gray-900 text-orange-100">
                Priority
              </option>
              <option value="status" className="bg-gray-900 text-orange-100">
                Status
              </option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-3 bg-gradient-to-r from-primary/20 to-orange-500/20 hover:from-primary/30 hover:to-orange-500/30 text-primary rounded-xl border border-primary/30 transition-all duration-300"
            >
              {sortOrder === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* New Task Form */}
        {isAddingTask && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Task Description
                  </label>
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Enter task description..."
                    className="w-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Related Meeting (Optional)
                  </label>
                  <select
                    value={newTaskMeetingId}
                    onChange={(e) => setNewTaskMeetingId(e.target.value)}
                    className="w-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" className="bg-gray-900 text-orange-100">
                      No specific meeting
                    </option>
                    {files.map((file) => (
                      <option
                        key={file.id}
                        value={file.id}
                        className="bg-gray-900 text-orange-100"
                      >
                        {file.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (newTaskDescription.trim()) {
                      onAddTask(
                        newTaskDescription.trim(),
                        newTaskMeetingId || undefined
                      );
                      setNewTaskDescription("");
                      setNewTaskMeetingId("");
                      setIsAddingTask(false);
                    }
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskDescription("");
                    setNewTaskMeetingId("");
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-surface/60 to-surface/40 hover:from-surface/80 hover:to-surface/60 text-primary px-4 py-2 rounded-lg border border-border/50 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="all" className="bg-gray-900 text-orange-100">
                    All Statuses
                  </option>
                  <option
                    value="pending"
                    className="bg-gray-900 text-orange-100"
                  >
                    Pending
                  </option>
                  <option
                    value="in-progress"
                    className="bg-gray-900 text-orange-100"
                  >
                    In Progress
                  </option>
                  <option
                    value="completed"
                    className="bg-gray-900 text-orange-100"
                  >
                    Completed
                  </option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="all" className="bg-gray-900 text-orange-100">
                    All Priorities
                  </option>
                  <option value="high" className="bg-gray-900 text-orange-100">
                    High
                  </option>
                  <option
                    value="medium"
                    className="bg-gray-900 text-orange-100"
                  >
                    Medium
                  </option>
                  <option value="low" className="bg-gray-900 text-orange-100">
                    Low
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 backdrop-blur-xl border border-primary/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-primary font-medium">
                {selectedTasks.length} task(s) selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-orange-300 hover:text-primary transition-colors duration-300"
              >
                {selectedTasks.length === filteredTasks.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <select
                onChange={(e) =>
                  handleBulkUpdateStatus(e.target.value as Task["status"])
                }
                className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                style={{ colorScheme: "dark" }}
              >
                <option value="" className="bg-gray-900 text-orange-100">
                  Update Status
                </option>
                <option value="pending" className="bg-gray-900 text-orange-100">
                  Mark as Pending
                </option>
                <option
                  value="in-progress"
                  className="bg-gray-900 text-orange-100"
                >
                  Mark as In Progress
                </option>
                <option
                  value="completed"
                  className="bg-gray-900 text-orange-100"
                >
                  Mark as Completed
                </option>
              </select>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg border border-red-500/30 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex items-start space-x-4">
              {/* Selection Checkbox */}
              <button
                onClick={() => handleSelectTask(task.id)}
                className="flex-shrink-0 p-1 bg-surface/80 backdrop-blur-sm rounded-lg border border-border/50 transition-all duration-300 hover:bg-primary/20"
              >
                {selectedTasks.includes(task.id) ? (
                  <CheckSquare className="w-4 h-4 text-primary" />
                ) : (
                  <Square className="w-4 h-4 text-orange-300" />
                )}
              </button>

              {/* Task Status Checkbox */}
              <button
                onClick={() =>
                  onUpdateTaskStatus(
                    task.id,
                    task.status === "completed" ? "pending" : "completed"
                  )
                }
                className="flex-shrink-0 p-1 bg-surface/80 backdrop-blur-sm rounded-lg border border-border/50 transition-all duration-300 hover:bg-primary/20"
              >
                {task.status === "completed" ? (
                  <CheckSquare className="w-4 h-4 text-green-400" />
                ) : (
                  <Square className="w-4 h-4 text-orange-300" />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                {isEditing === task.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      className="w-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                      rows={2}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editingAssignedTo}
                        onChange={(e) => setEditingAssignedTo(e.target.value)}
                        placeholder="Assign to..."
                        className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
                      />
                      <input
                        type="date"
                        value={editingDueDate}
                        onChange={(e) => setEditingDueDate(e.target.value)}
                        className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                      />
                      <select
                        value={editingPriority}
                        onChange={(e) =>
                          setEditingPriority(e.target.value as Task["priority"])
                        }
                        className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => saveEdits(task.id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-primary hover:bg-primary-hover text-black rounded-lg transition-colors duration-300"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Save</span>
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-300"
                      >
                        <X className="w-4 h-4" />
                        <span className="text-sm">Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-lg ${task.status === "completed" ? "line-through text-orange-400" : "text-primary"}`}
                        >
                          {task.description}
                        </h3>
                        <p className="text-sm text-orange-300 mt-1">
                          From: {task.meetingName}
                        </p>
                      </div>

                      {/* Actions Menu */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() =>
                            setShowActions(
                              showActions === task.id ? null : task.id
                            )
                          }
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300"
                        >
                          <MoreVertical className="w-4 h-4 text-orange-300" />
                        </button>

                        {showActions === task.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-surface/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-20">
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => startEditing(task)}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  onUpdateTaskStatus(
                                    task.id,
                                    task.status === "completed"
                                      ? "pending"
                                      : "completed"
                                  )
                                }
                                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>
                                  {task.status === "completed"
                                    ? "Mark Incomplete"
                                    : "Mark Complete"}
                                </span>
                              </button>
                              <div className="border-t border-border/30 my-1"></div>
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      {/* Priority */}
                      <span
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {getPriorityIcon(task.priority)}
                        <span>
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                      </span>

                      {/* Status */}
                      <span
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                      >
                        {getStatusIcon(task.status)}
                        <span>
                          {task.status.charAt(0).toUpperCase() +
                            task.status.slice(1)}
                        </span>
                      </span>

                      {/* Assigned To */}
                      {task.assignedTo && (
                        <div className="flex items-center space-x-1 text-orange-300">
                          <User className="w-3 h-3" />
                          <span>{task.assignedTo}</span>
                        </div>
                      )}

                      {/* Created Date */}
                      <div className="flex items-center space-x-1 text-orange-300">
                        <Clock className="w-3 h-3" />
                        <span>Created {formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">
            No tasks found
          </h3>
          <p className="text-orange-300">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </div>
  );
}
