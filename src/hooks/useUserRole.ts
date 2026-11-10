import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }
    const fetchRole = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Failed to fetch role', error);
        setRole(null);
      } else {
        const prof = data as Profile;
        setRole(prof.role ?? null);
      }
      setLoading(false);
    };
    fetchRole();
  }, [userId]);

  return { role, loading };
};
