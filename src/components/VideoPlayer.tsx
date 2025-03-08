'use client';
import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import socket from '@/lib/socket';

interface VideoPlayerProps {
  url: string;
  roomId: string;
}

export default function VideoPlayer({ url, roomId }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    socket.on('play', () => setIsPlaying(true));
    socket.on('pause', () => setIsPlaying(false));
    socket.on('seek', (time: number) => setProgress(time));

    return () => {
      socket.off('play');
      socket.off('pause');
      socket.off('seek');
    };
  }, []);

  const handlePlay = () => {
    socket.emit('play', roomId);
  };

  const handlePause = () => {
    socket.emit('pause', roomId);
  };

  const handleSeek = (seconds: number) => {
    socket.emit('seek', { roomId, time: seconds });
  };

  return (
    <div className="w-full h-96">
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="100%"
        playing={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        progressInterval={1000}
        onProgress={({ playedSeconds }) => setProgress(playedSeconds)}
      />
    </div>
  );
}