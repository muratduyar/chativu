'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export default function Navbar({ onAuthClick }: { onAuthClick: () => void }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user as User);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="bg-white/10 backdrop-blur-md p-4 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Chativu
        </h1>
        <div className="space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src={user.user_metadata.avatar_url || '/default-avatar.png'}
                alt="Profil"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{user.user_metadata.first_name} {user.user_metadata.last_name}</span>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-transform transform hover:scale-105"
            >
              Giriş Yap / Kayıt Ol
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}