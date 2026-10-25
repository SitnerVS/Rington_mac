import { useState } from 'react';
import { VideoItem } from '../types';
import { simulateDownload } from '../utils';

interface DownloadPanelProps {
  onVideoDownloaded: (video: VideoItem) => void;
}

export function DownloadPanel({ onVideoDownloaded }: DownloadPanelProps) {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [cancelFn, setCancelFn] = useState<(() => void) | null>(null);

  const handleDownload = () => {
    if (!url.trim()) {
      setError('Вставьте ссылку на видео');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Введите корректную ссылку');
      return;
    }

    setError('');
    setIsDownloading(true);
    setProgress(0);

    const cancel = simulateDownload(
      url,
      (p) => setProgress(p),
      (video) => {
        setIsDownloading(false);
        setProgress(0);
        setUrl('');
        onVideoDownloaded(video);
      },
      (err) => {
        setIsDownloading(false);
        setProgress(0);
        setError(err);
      }
    );

    setCancelFn(() => cancel);
  };

  const handleCancel = () => {
    if (cancelFn) {
      cancelFn();
      setIsDownloading(false);
      setProgress(0);
      setCancelFn(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
    } catch {
      setError('Нет доступа к буферу обмена');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Загрузка видео</h2>
          <p className="text-sm text-gray-500">Вставьте ссылку, чтобы скачать видео</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="url"
            className="input-field flex-1"
            placeholder="https://www.instagram.com/reel/..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            disabled={isDownloading}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isDownloading) handleDownload(); }}
          />
          <button
            onClick={handlePaste}
            className="btn-secondary whitespace-nowrap"
            disabled={isDownloading}
          >
            Вставить
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </div>
        )}

        {isDownloading && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Загрузка...</span>
              <span className="text-blue-600 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {isDownloading ? (
            <button onClick={handleCancel} className="btn-secondary w-full">
              Отменить
            </button>
          ) : (
            <button onClick={handleDownload} className="btn-primary w-full flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Загрузить видео
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Важно:</strong> Скачивайте только свои видео или материалы, 
          на которые у вас есть разрешение правообладателя.
        </p>
      </div>
    </div>
  );
}
