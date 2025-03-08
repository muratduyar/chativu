'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js 13+ için useRouter

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const router = useRouter(); // useRouter hook'unu ekledik

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateName = (name: string) => {
    const regex = /^[A-Za-z]+$/;
    return regex.test(name);
  };

  const handleAuth = async () => {
    setEmailError('');
    setPasswordError('');
    setFirstNameError('');
    setLastNameError('');
    setError('');
    setSuccessMessage('');

    if (isSignUp) {
      if (!firstName) {
        setFirstNameError('Ad alanı boş bırakılamaz.');
      } else if (!validateName(firstName)) {
        setFirstNameError('Ad yalnızca harfler içermelidir.');
      }

      if (!lastName) {
        setLastNameError('Soyad alanı boş bırakılamaz.');
      } else if (!validateName(lastName)) {
        setLastNameError('Soyad yalnızca harfler içermelidir.');
      }
    }

    if (!email) {
      setEmailError('E-posta alanı boş bırakılamaz.');
    } else if (!validateEmail(email)) {
      setEmailError('Geçerli bir e-posta adresi girin.');
    }

    if (!password) {
      setPasswordError('Şifre alanı boş bırakılamaz.');
    } else if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır.');
    }

    if (emailError || passwordError || firstNameError || lastNameError) {
      return;
    }

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage(
          'Kayıt başarılı! noreply@mail.app.supabase.io adresinden gelen e-postayı onaylayarak kullanmaya başlayabilirsiniz.'
        );
        setTimeout(() => {
          setIsSignUp(false); // Kayıt başarılıysa giriş ekranına geç
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
        }, 3000);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          onClose(); // Popup'ı kapat
          router.push('/'); // Ana sayfaya yönlendir
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition"
          >
            ✕
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 mb-4 text-sm">{successMessage}</p>
        )}
        <div className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Ad"
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value.replace(/[^A-Za-z]/g, ''));
                    setFirstNameError('');
                  }}
                />
                {firstNameError && (
                  <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Soyad"
                  className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value.replace(/[^A-Za-z]/g, ''));
                    setLastNameError('');
                  }}
                />
                {lastNameError && (
                  <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
                )}
              </div>
            </>
          )}
          <div>
            <input
              type="email"
              placeholder="E-posta"
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.replace(/\s/g, ''));
                setEmailError('');
              }}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Şifre"
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-transform transform hover:scale-105"
            >
              {isSignUp ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
            <button
              onClick={handleAuth}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}