'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface Room {
  id: string;
  name: string;
  created_at: string;
}

export default function ProfilePage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { data } = await supabase
          .from('rooms')
          .select('*')
          .eq('owner_id', user.user.id);
        if (data) setRooms(data);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Navbar onAuthClick={() => {}} /> {/* onAuthClick prop'u eklendi */}
      <div className="container mx-auto p-4 pt-24">
        <h1 className="text-4xl font-bold mb-6 text-white">Profilim</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold text-white">{room.name}</h3>
              <p className="text-gray-300 mt-2">
                Oda ID: {room.id}
              </p>
              <p className="text-gray-300 mt-2">
                Oluşturulma Tarihi: {new Date(room.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}