'use client';
import { useEffect, useState } from 'react';
import socket from '@/lib/socket';

interface Message {
  sender: string;
  message: string;
}

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', { roomId, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className="h-96 flex flex-col justify-between">
      <div className="overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="text-white mb-2">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          placeholder="Mesajınızı yazın..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}