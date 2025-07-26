"use client";

import { useState } from "react";
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
  Grid3X3,
  List,
  Star,
  Archive,
  Copy,
  Share2,
  FileText,
  Users,
  UserCheck,
  Target,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  Square,
} from "lucide-react";
import FileCard from "./FileCard";
import FileListItem from "./FileListItem";

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

interface FilesTabProps {
  files: UploadedFile[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  isEditing: string | null;
  editingTranscript: string;
  setEditingTranscript: (transcript: string) => void;
  editingSummary: string;
  setEditingSummary: (summary: string) => void;
  editingBulletPoints: string[];
  setEditingBulletPoints: (points: string[]) => void;
  editingKeyTopics: string[];
  setEditingKeyTopics: (topics: string[]) => void;
  editingActionItems: string[];
  setEditingActionItems: (items: string[]) => void;
  currentPlayingAudio: string | null;
  audioRefs: { [key: string]: HTMLAudioElement };
  setAudioRefs: (refs: { [key: string]: HTMLAudioElement }) => void;
  onPlayAudio: (fileId: string) => void;
  onToggleFavorite: (fileId: string) => void;
  onToggleArchive: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onBulkDelete: () => void;
  onStartEditing: (fileId: string) => void;
  onSaveEdits: (fileId: string) => void;
  onCancelEditing: () => void;
  onExportFile: (file: UploadedFile) => void;
}

export default function FilesTab({
  files,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  selectedFiles,
  setSelectedFiles,
  isEditing,
  editingTranscript,
  setEditingTranscript,
  editingSummary,
  setEditingSummary,
  editingBulletPoints,
  setEditingBulletPoints,
  editingKeyTopics,
  setEditingKeyTopics,
  editingActionItems,
  setEditingActionItems,
  currentPlayingAudio,
  audioRefs,
  setAudioRefs,
  onPlayAudio,
  onToggleFavorite,
  onToggleArchive,
  onDeleteFile,
  onBulkDelete,
  onStartEditing,
  onSaveEdits,
  onCancelEditing,
  onExportFile,
}: FilesTabProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.id));
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files, tags, or participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-xl text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
            />
          </div>

          {/* Filters and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Filter Button */}
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-xl px-4 py-3 text-orange-100 focus:outline-none focus:border-primary transition-colors duration-300"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="duration">Duration</option>
              <option value="size">Size</option>
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

            {/* View Mode */}
            <div className="flex bg-surface/20 rounded-xl p-1 border border-border/30">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-primary to-orange-500 text-black"
                    : "text-orange-300 hover:text-primary hover:bg-primary/10"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-primary to-orange-500 text-black"
                    : "text-orange-300 hover:text-primary hover:bg-primary/10"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="flex flex-wrap gap-3">
              {["all", "favorites"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedFilter === filter
                      ? "bg-gradient-to-r from-primary to-orange-500 text-black"
                      : "bg-gradient-to-r from-primary/10 to-orange-500/10 text-orange-300 hover:text-primary hover:bg-primary/20 border border-primary/30"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 backdrop-blur-xl border border-primary/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-primary font-medium">
                {selectedFiles.length} file(s) selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-orange-300 hover:text-primary transition-colors duration-300"
              >
                {selectedFiles.length === files.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onBulkDelete}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg border border-red-500/30 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={() => handleSelectFile(file.id)}
              isEditing={isEditing === file.id}
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
              showActions={showActions === file.id}
              setShowActions={setShowActions}
              onPlayAudio={onPlayAudio}
              onToggleFavorite={onToggleFavorite}
              onToggleArchive={onToggleArchive}
              onDeleteFile={onDeleteFile}
              onStartEditing={onStartEditing}
              onSaveEdits={onSaveEdits}
              onCancelEditing={onCancelEditing}
              onExportFile={onExportFile}
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
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <FileListItem
              key={file.id}
              file={file}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={() => handleSelectFile(file.id)}
              isEditing={isEditing === file.id}
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
              showActions={showActions === file.id}
              setShowActions={setShowActions}
              onPlayAudio={onPlayAudio}
              onToggleFavorite={onToggleFavorite}
              onToggleArchive={onToggleArchive}
              onDeleteFile={onDeleteFile}
              onStartEditing={onStartEditing}
              onSaveEdits={onSaveEdits}
              onCancelEditing={onCancelEditing}
              onExportFile={onExportFile}
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
          ))}
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <div className="text-center py-12">
          <FileAudio className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">
            No files found
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
