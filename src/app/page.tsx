'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CreateRoomModal from '@/components/CreateRoomModal';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabaseClient';

interface Room {
  id: string;
  name: string;
  video_url: string;
  password: string;
  created_at: string;
  owner_id: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [password, setPassword] = useState('');
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setRooms(data);
    };
    fetchRooms();
  }, []);

  const handleJoinRoom = async (room: Room) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setShowLoginWarning(true);
      setTimeout(() => setShowLoginWarning(false), 10000); // 10 saniye sonra otomatik kapat
      return;
    }
    setSelectedRoom(room);
  };

  const confirmJoinRoom = () => {
    if (password === selectedRoom?.password) {
      window.location.href = `/rooms/${selectedRoom.id}`;
    } else {
      alert('Şifre yanlış!');
    }
    setSelectedRoom(null);
    setPassword('');
  };

  const displayedRooms = showAllRooms ? rooms : rooms.slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      <div className="container mx-auto p-4 pt-24">
        <div className="text-center mt-10">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Chativu
          </h1>
          <p className="text-gray-300 mb-8 text-lg">Canlı sohbet ve video izleme platformu</p>
          <div className="space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-transform transform hover:scale-105"
            >
              Oda Oluştur
            </button>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-4xl font-semibold mb-8 text-white">Aktif Odalar</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow transform hover:-translate-y-2"
              >
                <h3 className="text-2xl font-bold text-white">{room.name}</h3>
                <p className="text-gray-300 mt-2">
                  Oluşturulma Tarihi: {new Date(room.created_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleJoinRoom(room)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-purple-600 transition"
                >
                  Katıl
                </button>
              </div>
            ))}
          </div>
          {rooms.length > 20 && !showAllRooms && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllRooms(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Tüm Odaları Göster
              </button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <CreateRoomModal onClose={() => setIsModalOpen(false)} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-96">
            <h2 className="text-2xl font-bold mb-6 text-white">Odaya Katıl</h2>
            <input
              type="password"
              placeholder="Şifre"
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setSelectedRoom(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                İptal
              </button>
              <button
                onClick={confirmJoinRoom}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Katıl
              </button>
            </div>
          </div>
        </div>
      )}
      {showLoginWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-96">
            <h2 className="text-2xl font-bold mb-6 text-white">Giriş Yap</h2>
            <p className="text-gray-300 mb-4">
              Odaya katılmak için giriş yapmalısınız.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLoginWarning(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Kapat
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Giriş Yap / Kayıt Ol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}