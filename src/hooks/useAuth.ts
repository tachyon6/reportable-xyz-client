import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState<null | { id: string }>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    navigate('/login');
  };

  const signOut = async () => {
    setUser(null);
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut
  };
}