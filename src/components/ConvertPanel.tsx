import { useState } from 'react';
import { VideoItem, TrimSettings, ConversionState } from '../types';
import { simulateConversion, formatTime, formatFFmpegTime } from '../utils';

interface ConvertPanelProps {
  video: VideoItem | null;
}

export function ConvertPanel({ video }: ConvertPanelProps) {
  const [trim, setTrim] = useState<TrimSettings>({ startTime: 0, duration: 30 });
  const [conversion, setConversion] = useState<ConversionState>({ status: 'idle', progress: 0 });
  const [cancelFn, setCancelFn] = useState<(() => void) | null>(null);

  const handleConvert = () => {
    if (!video) return;

    if (trim.duration > 30) {
      setConversion({ status: 'error', progress: 0, error: 'Duration must not exceed 30 seconds' });
      return;
    }

    if (trim.startTime + trim.duration > video.duration) {
      setConversion({ status: 'error', progress: 0, error: 'Trim range exceeds video duration' });
      return;
    }

    setConversion({ status: 'converting', progress: 0 });

    const cancel = simulateConversion(
      video,
      trim,
      (p) => setConversion({ status: 'converting', progress: p }),
      (outputPath) => {
        setConversion({ status: 'completed', progress: 100, outputPath });
      },
      (error) => {
        setConversion({ status: 'error', progress: 0, error });
      }
    );

    setCancelFn(() => cancel);
  };

  const handleCancel = () => {
    if (cancelFn) {
      cancelFn();
      setConversion({ status: 'idle', progress: 0 });
      setCancelFn(null);
    }
  };

  const handleRevealInFinder = () => {
    // In a real Tauri app, this would open Finder
    alert('In the real app, this would open Finder at:\n' + conversion.outputPath);
  };

  if (!video) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Convert to .m4r</h2>
            <p className="text-sm text-gray-500">Create iPhone ringtone from video</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Select a video to convert</p>
          <p className="text-gray-300 text-xs mt-1">Choose from your library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Convert to .m4r</h2>
          <p className="text-sm text-gray-500 truncate max-w-[200px]">{video.title}</p>
        </div>
      </div>

      {/* Video info */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Source duration</span>
          <span className="text-gray-700 font-medium">{formatTime(video.duration)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1.5">
          <span className="text-gray-500">File size</span>
          <span className="text-gray-700 font-medium">{video.size}</span>
        </div>
      </div>

      {/* Trim controls */}
      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Start Time
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={Math.max(0, video.duration - trim.duration)}
              value={trim.startTime}
              onChange={(e) => setTrim({ ...trim, startTime: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={conversion.status === 'converting'}
            />
            <span className="text-sm font-mono text-gray-600 w-12 text-right">
              {formatTime(trim.startTime)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Duration <span className="text-gray-400 font-normal">(max 30s)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={30}
              value={Math.min(trim.duration, video.duration - trim.startTime)}
              onChange={(e) => setTrim({ ...trim, duration: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              disabled={conversion.status === 'converting'}
            />
            <span className="text-sm font-mono text-gray-600 w-12 text-right">
              {trim.duration}s
            </span>
          </div>
        </div>

        {/* Visual timeline */}
        <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-200 to-green-200 border-2 border-blue-400 rounded-lg transition-all duration-200"
            style={{
              left: `${(trim.startTime / video.duration) * 100}%`,
              width: `${(trim.duration / video.duration) * 100}%`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(trim.startTime)} → {formatTime(trim.startTime + trim.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* FFmpeg command preview */}
      <div className="bg-gray-900 rounded-xl p-3 mb-4 overflow-x-auto">
        <p className="text-xs text-gray-400 mb-1">ffmpeg command:</p>
        <code className="text-xs text-green-400 font-mono break-all">
          ffmpeg -y -ss {formatFFmpegTime(trim.startTime)} -t {trim.duration} -i {video.filename} -vn -c:a aac -b:a 128k -ar 44100 -ac 2 output.m4r
        </code>
      </div>

      {/* Conversion progress */}
      {conversion.status === 'converting' && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Converting...</span>
            <span className="text-green-600 font-medium">{Math.round(conversion.progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill bg-gradient-to-r from-green-400 to-green-600" style={{ width: `${conversion.progress}%` }} />
          </div>
        </div>
      )}

      {/* Error */}
      {conversion.status === 'error' && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5 mb-4">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {conversion.error}
        </div>
      )}

      {/* Success */}
      {conversion.status === 'completed' && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-green-800">Ringtone ready!</span>
          </div>
          <p className="text-xs text-green-600 font-mono mb-3">{conversion.outputPath}</p>
          <button
            onClick={handleRevealInFinder}
            className="text-xs text-green-700 hover:text-green-900 underline font-medium"
          >
            Reveal in Finder →
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {conversion.status === 'converting' ? (
          <button onClick={handleCancel} className="btn-secondary w-full">
            Cancel
          </button>
        ) : (
          <button
            onClick={handleConvert}
            className="btn-primary w-full flex items-center justify-center gap-2"
            style={{ background: conversion.status === 'completed' ? undefined : undefined }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {conversion.status === 'completed' ? 'Convert Again' : 'Convert to .m4r'}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Output:</strong> AAC codec, 44.1 kHz, stereo, ≤30s. 
          Sync with iPhone via Finder or Music app.
        </p>
      </div>
    </div>
  );
}
