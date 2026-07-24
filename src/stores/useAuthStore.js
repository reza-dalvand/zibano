import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

let _storage = null;
const getStorage = () => {
  if (!_storage) _storage = new MMKV();
  return _storage;
};

const getInitialState = () => {
  try {
    const token = getStorage().getString(TOKEN_KEY);
    const raw = getStorage().getString(USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    return { isAuthenticated: !!token, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),

  login: (phone, token = 'mock_token_' + Date.now()) => {
    const userData = { phone, name: 'کاربر زیبانو', avatar: null };
    try {
      getStorage().set(TOKEN_KEY, token);
      getStorage().set(USER_KEY, JSON.stringify(userData));
    } catch (e) {
      console.log('MMKV save error:', e);
    }
    set({ isAuthenticated: true, user: userData });
  },

  logout: () => {
    try {
      getStorage().delete(TOKEN_KEY);
      getStorage().delete(USER_KEY);
    } catch (e) {
      console.log('Logout error:', e);
    }
    set({ isAuthenticated: false, user: null });
  },

  updateUser: (updates) =>
    set((state) => {
      const newUser = { ...state.user, ...updates };
      try {
        getStorage().set(USER_KEY, JSON.stringify(newUser));
      } catch {}
      return { user: newUser };
    }),
}));