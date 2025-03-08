'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import Chat from '@/components/Chat';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

interface Room {
  id: string;
  name: string;
  video_url: string;
  password?: string;
  created_at: string;
  owner_id: string;
}

export default function RoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRoom = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        alert('Odaya erişmek için giriş yapmalısınız.');
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', params.id)
        .single();
      if (error) setError(error.message);
      else setRoom(data);
    };
    fetchRoom();
  }, [params.id, router]);

  if (!room) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Navbar onAuthClick={() => {}} />
      <div className="container mx-auto p-4 pt-24">
        <h1 className="text-4xl font-bold mb-6 text-white">{room.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-white">Video</h2>
            <VideoPlayer url={room.video_url} roomId={params.id} />
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-white">Sohbet</h2>
            <Chat roomId={params.id} />
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}