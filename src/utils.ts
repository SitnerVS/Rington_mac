import { VideoItem, TrimSettings } from './types';

// Simulate yt-dlp download process
export function simulateDownload(
  url: string,
  onProgress: (progress: number) => void,
  onComplete: (video: VideoItem) => void,
  onError: (error: string) => void
): () => void {
  let cancelled = false;
  let progress = 0;

  const titles = [
    'Amazing Sunset Timelapse',
    'City Night Lights 4K',
    'Ocean Waves Relaxation',
    'Mountain Adventure',
    'Street Photography Walk',
  ];

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];

  const interval = setInterval(() => {
    if (cancelled) {
      clearInterval(interval);
      return;
    }

    // Simulate non-linear progress
    const increment = Math.random() * 8 + 2;
    progress = Math.min(progress + increment, 100);
    onProgress(progress);

    if (progress >= 100) {
      clearInterval(interval);
      const video: VideoItem = {
        id: crypto.randomUUID(),
        title: randomTitle,
        url,
        filename: `${randomTitle.replace(/\s+/g, '_').toLowerCase()}.mp4`,
        duration: Math.floor(Math.random() * 180) + 30,
        size: `${(Math.random() * 50 + 5).toFixed(1)} MB`,
        downloadedAt: new Date(),
        status: 'completed',
        progress: 100,
      };
      onComplete(video);
    }
  }, 300);

  return () => {
    cancelled = true;
    clearInterval(interval);
    onError('Download cancelled');
  };
}

// Simulate ffmpeg conversion process
export function simulateConversion(
  video: VideoItem,
  trim: TrimSettings,
  onProgress: (progress: number) => void,
  onComplete: (outputPath: string) => void,
  onError: (error: string) => void
): () => void {
  let cancelled = false;
  let progress = 0;

  // Validate trim settings
  if (trim.duration > 30) {
    onError('Duration must not exceed 30 seconds for .m4r format');
    return () => {};
  }

  if (trim.startTime + trim.duration > video.duration) {
    onError('Trim range exceeds video duration');
    return () => {};
  }

  const interval = setInterval(() => {
    if (cancelled) {
      clearInterval(interval);
      return;
    }

    const increment = Math.random() * 12 + 3;
    progress = Math.min(progress + increment, 100);
    onProgress(progress);

    if (progress >= 100) {
      clearInterval(interval);
      const outputPath = `~/Downloads/Ringtones/${video.title.replace(/\s+/g, '_').toLowerCase()}.m4r`;
      onComplete(outputPath);
    }
  }, 200);

  return () => {
    cancelled = true;
    clearInterval(interval);
    onError('Conversion cancelled');
  };
}

// Format seconds to mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format time for ffmpeg (hh:mm:ss)
export function formatFFmpegTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
