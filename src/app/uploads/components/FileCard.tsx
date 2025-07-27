"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileAudio,
  Play,
  Pause,
  Edit3,
  Eye,
  Download,
  Trash2,
  Star,
  Archive,
  MoreVertical,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle,
  AlertCircle,
  Users,
  UserCheck,
  X,
  Check,
  Plus,
  Square,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Brain,
  BarChart3,
  MessageCircle,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react";

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

interface FileCardProps {
  file: UploadedFile;
  isSelected: boolean;
  onSelect: () => void;
  isEditing: boolean;
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
  showActions: boolean;
  setShowActions: (fileId: string | null) => void;
  onPlayAudio: (fileId: string) => void;
  onToggleFavorite: (fileId: string) => void;
  onToggleArchive: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onStartEditing: (fileId: string) => void;
  onSaveEdits: (fileId: string) => void;
  onCancelEditing: () => void;
  onExportFile: (file: UploadedFile) => void;
  addBulletPoint: () => void;
  removeBulletPoint: (index: number) => void;
  updateBulletPoint: (index: number, value: string) => void;
  addKeyTopic: () => void;
  removeKeyTopic: (index: number) => void;
  updateKeyTopic: (index: number, value: string) => void;
  addActionItem: () => void;
  removeActionItem: (index: number) => void;
  updateActionItem: (index: number, value: string) => void;
  formatDate: (date: Date) => string;
  getStatusIcon: (status: string) => React.JSX.Element;
  getMeetingTypeIcon: (type: string) => React.JSX.Element;
}

export default function FileCard({
  file,
  isSelected,
  onSelect,
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
  showActions,
  setShowActions,
  onPlayAudio,
  onToggleFavorite,
  onToggleArchive,
  onDeleteFile,
  onStartEditing,
  onSaveEdits,
  onCancelEditing,
  onExportFile,
  addBulletPoint,
  removeBulletPoint,
  updateBulletPoint,
  addKeyTopic,
  removeKeyTopic,
  updateKeyTopic,
  addActionItem,
  removeActionItem,
  updateActionItem,
  formatDate,
  getStatusIcon,
  getMeetingTypeIcon,
}: FileCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      setAudioRefs({ ...audioRefs, [file.id]: audioRef.current });
    }
  }, [file.id, setAudioRefs]);

  const handlePlayAudio = () => {
    onPlayAudio(file.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(file.id);
  };

  const handleToggleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleArchive(file.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteFile(file.id);
  };

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExportFile(file);
  };

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartEditing(file.id);
  };

  const handleSaveEdits = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSaveEdits(file.id);
  };

  const handleCancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancelEditing();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative group">
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onSelect}
          className="p-1 bg-surface/80 backdrop-blur-sm rounded-lg border border-border/50 transition-all duration-300 hover:bg-primary/20"
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-primary" />
          ) : (
            <Square className="w-4 h-4 text-orange-300" />
          )}
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 group-hover:shadow-2xl shadow-primary/5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getMeetingTypeIcon(file.meetingType)}
              <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full">
                {file.meetingType}
              </span>
              {getStatusIcon(file.status)}
            </div>
            <h3 className="font-bold text-lg text-primary truncate">
              {file.name}
            </h3>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(showActions ? null : file.id)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors duration-300"
            >
              <MoreVertical className="w-4 h-4 text-orange-300" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-20">
                <div className="p-2 space-y-1">
                  <button
                    onClick={handleStartEditing}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
                  >
                    <Star
                      className={`w-4 h-4 ${file.isFavorite ? "text-yellow-400 fill-current" : ""}`}
                    />
                    <span>
                      {file.isFavorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </span>
                  </button>
                  <button
                    onClick={handleToggleArchive}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-orange-300 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-300"
                  >
                    <Archive className="w-4 h-4" />
                    <span>{file.isArchived ? "Unarchive" : "Archive"}</span>
                  </button>
                  <div className="border-t border-border/30 my-1"></div>
                  <button
                    onClick={handleDelete}
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

        {/* File Info */}
        <div className="flex items-center space-x-4 text-sm text-orange-300 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(file.uploadDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{file.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileAudio className="w-3 h-3" />
            <span>{file.size}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">
              Participants
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {file.participants.slice(0, 3).map((participant, index) => (
              <span
                key={index}
                className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
              >
                {participant}
              </span>
            ))}
            {file.participants.length > 3 && (
              <span className="text-xs text-orange-400">
                +{file.participants.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {file.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayAudio}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-black rounded-lg transition-all duration-300 hover:scale-105"
            >
              {currentPlayingAudio === file.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <div className="flex-1">
              <div className="w-full bg-border/50 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-orange-300">{file.duration}</span>
          </div>
          <audio ref={audioRef} src={file.audioUrl} preload="none" />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center space-x-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-300"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Transcript</span>
          </button>
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center space-x-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-300"
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm">Summary</span>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors duration-300"
          >
            <Target className="w-4 h-4" />
            <span className="text-sm">Tasks</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="space-y-4 border-t border-border/30 pt-4">
            {/* Action Items */}
            <div>
              <h4 className="font-semibold text-primary mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Action Items ({file.summary.actionItems.length})
              </h4>
              <div className="space-y-2">
                {file.summary.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-primary bg-transparent border-2 border-primary/50 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-orange-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transcript Preview */}
        {showTranscript && (
          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-primary flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Transcript
              </h4>
              <button
                onClick={() => copyToClipboard(file.transcript)}
                className="text-orange-400 hover:text-primary transition-colors duration-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-lg p-3 max-h-32 overflow-y-auto">
              <p className="text-sm text-orange-100 leading-relaxed">
                {file.transcript.length > 200
                  ? `${file.transcript.substring(0, 200)}...`
                  : file.transcript}
              </p>
            </div>
          </div>
        )}

        {/* Summary Preview */}
        {showSummary && (
          <div className="border-t border-border/30 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-primary flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Summary
              </h4>
              <button
                onClick={() => copyToClipboard(file.summary.mainSummary)}
                className="text-orange-400 hover:text-primary transition-colors duration-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-lg p-3">
              <p className="text-sm text-orange-100 leading-relaxed">
                {file.summary.mainSummary}
              </p>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="border-t border-border/30 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-primary">Edit Content</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveEdits}
                  className="flex items-center space-x-2 px-3 py-2 bg-primary hover:bg-primary-hover text-black rounded-lg transition-colors duration-300"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Save</span>
                </button>
                <button
                  onClick={handleCancelEditing}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">Cancel</span>
                </button>
              </div>
            </div>

            {/* Edit Transcript */}
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-2">
                Transcript
              </label>
              <textarea
                value={editingTranscript}
                onChange={(e) => setEditingTranscript(e.target.value)}
                className="w-full h-24 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                placeholder="Edit transcript..."
              />
            </div>

            {/* Edit Summary */}
            <div>
              <label className="block text-sm font-medium text-orange-300 mb-2">
                Main Summary
              </label>
              <textarea
                value={editingSummary}
                onChange={(e) => setEditingSummary(e.target.value)}
                className="w-full h-20 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                placeholder="Edit main summary..."
              />
            </div>

            {/* Edit Bullet Points */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-orange-300">
                  Key Points
                </label>
                <button
                  onClick={addBulletPoint}
                  className="flex items-center space-x-1 text-primary hover:text-primary-hover transition-colors duration-300"
                >
                  <Plus className="w-3 h-3" />
                  <span className="text-xs">Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {editingBulletPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => updateBulletPoint(index, e.target.value)}
                      className="flex-1 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
                      placeholder="Key point..."
                    />
                    <button
                      onClick={() => removeBulletPoint(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Key Topics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-orange-300">
                  Key Topics
                </label>
                <button
                  onClick={addKeyTopic}
                  className="flex items-center space-x-1 text-primary hover:text-primary-hover transition-colors duration-300"
                >
                  <Plus className="w-3 h-3" />
                  <span className="text-xs">Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {editingKeyTopics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateKeyTopic(index, e.target.value)}
                      className="flex-1 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
                      placeholder="Key topic..."
                    />
                    <button
                      onClick={() => removeKeyTopic(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Action Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-orange-300">
                  Action Items
                </label>
                <button
                  onClick={addActionItem}
                  className="flex items-center space-x-1 text-primary hover:text-primary-hover transition-colors duration-300"
                >
                  <Plus className="w-3 h-3" />
                  <span className="text-xs">Add</span>
                </button>
              </div>
              <div className="space-y-2">
                {editingActionItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateActionItem(index, e.target.value)}
                      className="flex-1 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/30 rounded-lg px-3 py-2 text-orange-100 placeholder-orange-400 focus:outline-none focus:border-primary transition-colors duration-300"
                      placeholder="Action item..."
                    />
                    <button
                      onClick={() => removeActionItem(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
