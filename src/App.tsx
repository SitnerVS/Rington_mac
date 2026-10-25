import { useState } from 'react';
import { VideoItem } from './types';
import { DownloadPanel } from './components/DownloadPanel';
import { VideoLibrary } from './components/VideoLibrary';
import { ConvertPanel } from './components/ConvertPanel';

function App() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const handleVideoDownloaded = (video: VideoItem) => {
    setVideos((prev) => [video, ...prev]);
    setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Заголовок окна в стиле macOS */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Светофор */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dea123]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
            </div>
            <div className="flex items-center gap-2 ml-3">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h1 className="text-base font-semibold text-gray-800">Ringtone Maker</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
              v1.0.0
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
              macOS
            </span>
          </div>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Видео в рингтон
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Скачивайте видео и создавайте из них рингтоны для iPhone (.m4r).
            Всё работает локально на вашем Mac.
          </p>
        </div>

        {/* Основная сетка */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Левая колонка — Загрузка */}
          <div className="lg:col-span-5 space-y-6">
            <DownloadPanel onVideoDownloaded={handleVideoDownloaded} />
          </div>

          {/* Средняя колонка — Библиотека */}
          <div className="lg:col-span-3">
            <VideoLibrary
              videos={videos}
              selectedVideo={selectedVideo}
              onSelectVideo={setSelectedVideo}
            />
          </div>

          {/* Правая колонка — Конвертация */}
          <div className="lg:col-span-4">
            <ConvertPanel video={selectedVideo} />
          </div>
        </div>

        {/* Информация о приложении */}
        <div className="mt-10 card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Как это работает</h3>
              <p className="text-sm text-gray-500">Три простых шага до готового рингтона</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <span className="text-sm font-semibold text-blue-900">Загрузка</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                Вставьте ссылку на видео. Приложение скачает файл 
                и сохранит его в формате MP4 на ваш Mac.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <span className="text-sm font-semibold text-purple-900">Выбор фрагмента</span>
              </div>
              <p className="text-xs text-purple-700 leading-relaxed">
                Выберите начало и длительность рингтона — до 30 секунд. 
                Визуальная шкала поможет точно настроить нужный фрагмент.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <span className="text-sm font-semibold text-green-900">Готовый рингтон</span>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">
                Файл .m4r сохраняется в папку «Загрузки». Перенесите его 
                на iPhone через Finder или приложение «Музыка».
              </p>
            </div>
          </div>

          {/* Требования */}
          <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Требования для рингтона iPhone</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-600">Формат .m4r</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-600">Кодек AAC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-600">44.1 кГц</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-600">До 30 секунд</span>
              </div>
            </div>
          </div>
        </div>

        {/* Предупреждение */}
        <div className="mt-6 card bg-amber-50/50 border-amber-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-1">Юридическое предупреждение</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Используйте приложение только для собственных видео или материалов, 
                на которые у вас есть разрешение правообладателя. Загрузка контента 
                из социальных сетей может нарушать правила платформы и авторские права. 
                Если в исходном видео есть водяной знак, он останется в рингтоне.
              </p>
            </div>
          </div>
        </div>

        {/* Подвал */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Для личного использования. Уважайте авторские права и условия платформ.
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Создано для macOS
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
