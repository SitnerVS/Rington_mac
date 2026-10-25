import { VideoItem } from '../types';
import { formatTime } from '../utils';

interface VideoLibraryProps {
  videos: VideoItem[];
  selectedVideo: VideoItem | null;
  onSelectVideo: (video: VideoItem) => void;
}

export function VideoLibrary({ videos, selectedVideo, onSelectVideo }: VideoLibraryProps) {
  if (videos.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Библиотека</h2>
            <p className="text-sm text-gray-500">Скачанные видео</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Пока нет загруженных видео</p>
          <p className="text-gray-300 text-xs mt-1">Скачайте видео, чтобы начать</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Библиотека</h2>
            <p className="text-sm text-gray-500">
              {videos.length} {videos.length === 1 ? 'видео' : videos.length < 5 ? 'видео' : 'видео'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${
              selectedVideo?.id === video.id
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedVideo?.id === video.id ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                <svg className={`w-4 h-4 ${selectedVideo?.id === video.id ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  selectedVideo?.id === video.id ? 'text-blue-900' : 'text-gray-800'
                }`}>
                  {video.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{formatTime(video.duration)}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-400">{video.size}</span>
                </div>
              </div>
              {selectedVideo?.id === video.id && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
