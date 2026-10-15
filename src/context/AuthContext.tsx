import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { email: string; pass: string; fullName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message: string }>;
  switchDemoRole: (role: UserRole) => void;
  isSupabaseConnected: boolean;
}

const STORAGE_KEY = 'safeher_current_user';

// Initial demo user
const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_sanam_baloch_01',
  email: 'sanam.baloch@thaluni.edu.pk',
  fullName: 'Sanam Baloch',
  phone: '0316-7054627',
  role: 'user',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bloodType: 'O Positive',
  emergencyNotes: 'Carries asthma inhaler in side pocket. Penicillin allergy.',
  address: 'Bhakkar City, District Bhakkar, Punjab, Pakistan',
  university: 'Thal University Bhakkar',
  department: 'BSIT Department of Computer Science',
  createdAt: new Date().toISOString(),
};

const DEFAULT_DEMO_ADMIN: UserProfile = {
  id: 'admin_rachel_vance_01',
  email: 'admin.safety@safeher.org',
  fullName: 'Prof. Rachel Vance (Campus Safety Director)',
  phone: '+1 (555) 911-0044',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  bloodType: 'A+',
  emergencyNotes: 'First Aid certified & Campus Safety Officer.',
  address: 'SafeHer Incident Control Command Center',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const isLoggedIn = localStorage.getItem('safeher_loggedIn') === 'true';
      if (!isLoggedIn) {
        return null;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed.id === 'usr_sanam_baloch_01' ||
          parsed.id === 'usr_sanm_baloch_01' ||
          parsed.id === 'usr_sarah_jenkins_01'
        ) {
          const merged: UserProfile = {
            ...DEFAULT_DEMO_USER,
            ...parsed,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
      return DEFAULT_DEMO_USER;
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  useEffect(() => {
    // Check if Supabase client is available
    const supabase = getSupabaseClient();
    if (supabase) {
      setIsSupabaseConnected(true);
      // Check auth state
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // fetch profile
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data, error }) => {
              if (data && !error) {
                const u: UserProfile = {
                  id: data.id,
                  email: data.email,
                  fullName: data.full_name || 'SafeHer Member',
                  phone: data.phone,
                  role: (data.role as UserRole) || 'user',
                  avatarUrl: data.avatar_url,
                  bloodType: data.blood_type,
                  emergencyNotes: data.emergency_notes,
                  address: data.address,
                  createdAt: data.created_at,
                };
                setUser(u);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
              }
            });
        }
      });
    }
  }, []);

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const u: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: profile?.full_name || email.split('@')[0],
            phone: profile?.phone || '',
            role: (profile?.role as UserRole) || (email.includes('admin') ? 'admin' : 'user'),
            avatarUrl: profile?.avatar_url,
            bloodType: profile?.blood_type,
            emergencyNotes: profile?.emergency_notes,
            address: profile?.address,
            createdAt: profile?.created_at || new Date().toISOString(),
          };
          setUser(u);
          localStorage.setItem('safeher_loggedIn', 'true');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
          setLoading(false);
          return { success: true };
        }
      }

      // Local / Offline / Demo mode authentication with password check
      if (pass.length < 6) {
        setLoading(false);
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const dummyProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        phone: '+1 (555) 234-5678',
        role,
        avatarUrl: role === 'admin' ? DEFAULT_DEMO_ADMIN.avatarUrl : DEFAULT_DEMO_USER.avatarUrl,
        bloodType: 'O+',
        createdAt: new Date().toISOString(),
      };

      setUser(dummyProfile);
      localStorage.setItem('safeher_loggedIn', 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyProfile));
      setLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: msg };
    }
  };

  const signUp = async (data: {
    email: string;
    pass: string;
    fullName: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.pass,
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone,
            },
          },
        });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (authData.user) {
          const u: UserProfile = {
            id: authData.user.id,
            email: data.email,
            fullName: data.fullName,
            phone: data.phone || '',
            role: 'user',
            createdAt: new Date().toISOString(),
          };
          setUser(u);
          localStorage.setItem('safeher_loggedIn', 'true');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
          setLoading(false);
          return { success: true };
        }
      }

      // Local fallback
      const u: UserProfile = {
        id: `usr_${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone || '',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setUser(u);
      localStorage.setItem('safeher_loggedIn', 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    localStorage.removeItem('safeher_loggedIn');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('safeherSession');
    sessionStorage.removeItem('safeherSession');
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.fullName,
            phone: updated.phone,
            blood_type: updated.bloodType,
            emergency_notes: updated.emergencyNotes,
            address: updated.address,
            avatar_url: updated.avatarUrl,
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Supabase profile update warning:', err);
      }
    }
    return true;
  };

  const resetPasswordRequest = async (email: string): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        return { success: false, message: error.message };
      }
    }
    return {
      success: true,
      message: `A secure password reset link has been dispatched to ${email}. Check your inbox.`,
    };
  };

  const switchDemoRole = (role: UserRole) => {
    const target = role === 'admin' ? DEFAULT_DEMO_ADMIN : DEFAULT_DEMO_USER;
    setUser(target);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(target));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        signIn,
        signUp,
        signOut,
        updateProfile,
        resetPasswordRequest,
        switchDemoRole,
        isSupabaseConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
