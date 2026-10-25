import { VideoItem, TrimSettings } from './types';

// Симуляция процесса загрузки видео
export function simulateDownload(
  url: string,
  onProgress: (progress: number) => void,
  onComplete: (video: VideoItem) => void,
  onError: (error: string) => void
): () => void {
  let cancelled = false;
  let progress = 0;

  const titles = [
    'Закат над морем',
    'Ночные огни города',
    'Морские волны',
    'Горное приключение',
    'Прогулка по городу',
  ];

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];

  const interval = setInterval(() => {
    if (cancelled) {
      clearInterval(interval);
      return;
    }

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
        size: `${(Math.random() * 50 + 5).toFixed(1)} МБ`,
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
    onError('Загрузка отменена');
  };
}

// Симуляция процесса конвертации
export function simulateConversion(
  video: VideoItem,
  trim: TrimSettings,
  onProgress: (progress: number) => void,
  onComplete: (outputPath: string) => void,
  onError: (error: string) => void
): () => void {
  let cancelled = false;
  let progress = 0;

  if (trim.duration > 30) {
    onError('Длительность не должна превышать 30 секунд');
    return () => {};
  }

  if (trim.startTime + trim.duration > video.duration) {
    onError('Выбранный диапазон выходит за пределы длительности видео');
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
      const outputPath = `~/Загрузки/Рингтоны/${video.title.replace(/\s+/g, '_')}.m4r`;
      onComplete(outputPath);
    }
  }, 200);

  return () => {
    cancelled = true;
    clearInterval(interval);
    onError('Конвертация отменена');
  };
}

// Форматирование секунд в мм:сс
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
