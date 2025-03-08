'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function CreateRoomModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setError('Oda oluşturmak için giriş yapmalısınız.');
      return;
    }

    if (!password) {
      setError('Şifre zorunludur.');
      return;
    }

    const { data, error: roomError } = await supabase
      .from('rooms')
      .insert([{ name, video_url: videoUrl, password, owner_id: user.user.id }])
      .select();
    if (roomError) setError(roomError.message);
    else {
      alert('Oda başarıyla oluşturuldu!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-white">Oda Oluştur</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Oda Adı"
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Video URL"
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              İptal
            </button>
            <button
              onClick={handleCreateRoom}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}