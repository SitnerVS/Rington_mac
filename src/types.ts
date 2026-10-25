export interface VideoItem {
  id: string;
  title: string;
  url: string;
  filename: string;
  duration: number; // seconds
  size: string;
  thumbnail?: string;
  downloadedAt: Date;
  status: 'downloading' | 'completed' | 'error';
  progress: number;
}

export interface TrimSettings {
  startTime: number; // seconds
  duration: number; // seconds, max 30
}

export interface ConversionState {
  status: 'idle' | 'converting' | 'completed' | 'error';
  progress: number;
  outputPath?: string;
  error?: string;
}

export type AppView = 'download' | 'library';
