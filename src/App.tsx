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
      {/* macOS-style title bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
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
              Tauri + yt-dlp + ffmpeg
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Video to Ringtone
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Download videos and convert them to iPhone ringtones (.m4r). 
            Powered by yt-dlp and ffmpeg.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Download */}
          <div className="lg:col-span-5 space-y-6">
            <DownloadPanel onVideoDownloaded={handleVideoDownloaded} />
          </div>

          {/* Middle column - Library */}
          <div className="lg:col-span-3">
            <VideoLibrary
              videos={videos}
              selectedVideo={selectedVideo}
              onSelectVideo={setSelectedVideo}
            />
          </div>

          {/* Right column - Convert */}
          <div className="lg:col-span-4">
            <ConvertPanel video={selectedVideo} />
          </div>
        </div>

        {/* Architecture info */}
        <div className="mt-10 card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Architecture</h3>
              <p className="text-sm text-gray-500">How this app works under the hood</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <span className="text-sm font-semibold text-blue-900">Frontend</span>
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">
                HTML/CSS/JS interface handles URL input, progress display, and file selection. 
                Sends commands to Rust backend via Tauri IPC.
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <span className="text-sm font-semibold text-purple-900">Rust Backend</span>
              </div>
              <p className="text-xs text-purple-700 leading-relaxed">
                Tauri commands spawn yt-dlp and ffmpeg as child processes. 
                Arguments passed safely — no shell injection risk.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <span className="text-sm font-semibold text-green-900">Output</span>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">
                Final .m4r file saved to ~/Downloads/Ringtones/. 
                Sync to iPhone via Finder or Music app.
              </p>
            </div>
          </div>

          {/* Commands reference */}
          <div className="mt-5 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Core Commands</h4>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Download (yt-dlp):</p>
                  <code className="text-xs text-green-400 font-mono">
                    yt-dlp --no-playlist -f bestvideo+bestaudio/best --merge-output-format mp4 -o "%(title).80s.%(ext)s" "URL"
                  </code>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <p className="text-xs text-gray-400 mb-1">Convert (ffmpeg):</p>
                  <code className="text-xs text-green-400 font-mono">
                    ffmpeg -y -i input.mp4 -t 30 -vn -c:a aac -b:a 128k -ar 44100 -ac 2 -movflags +faststart output.m4r
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            For personal use only. Respect copyright and platform terms of service.
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Built with Tauri • React • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
