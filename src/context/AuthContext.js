// ./src/context/AuthContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MMKV } from 'react-native-mmkv';

let storage = null;
function getStorage() {
  if (!storage) {
    try {
      storage = new MMKV();
    } catch (e) {
      console.log('❌ MMKV init error:', e);
      // یک mock storage برگردان تا اپ کرش نکند
      return {
        set: () => {},
        getString: () => null,
        delete: () => {},
      };
    }
  }
  return storage;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ✅ یک state واحد به جای دو setState جداگانه
  // دو setState جداگانه داخل async function باعث race condition میشه
  const [authState, setAuthState] = useState(() => {
    try {
      const token = getStorage().getString(TOKEN_KEY);
      const raw = getStorage().getString(USER_KEY);
      const user = raw ? JSON.parse(raw) : null;
      console.log('🔐 AuthContext init — token:', !!token);
      return {
        isAuthenticated: !!token,
        user,
      };
    } catch (e) {
      console.log('❌ AuthContext init error:', e);
      return { isAuthenticated: false, user: null };
    }
  });

  const login = useCallback((phone, token = 'mock_token_' + Date.now()) => {
    const userData = { phone, name: 'کاربر زیبانو', avatar: null };
    
    // ابتدا MMKV را آپدیت کن (با try/catch جداگانه)
    try {
      const store = getStorage();
      store.set(TOKEN_KEY, token);
      store.set(USER_KEY, JSON.stringify(userData));
      console.log('✅ MMKV saved');
    } catch (e) {
      console.log('⚠️ MMKV save error (ignored):', e);
      // خطا را ignore کن و ادامه بده
    }

    // ✅ همیشه state را آپدیت کن - حتی اگر MMKV خطا داد
    setAuthState({ isAuthenticated: true, user: userData });
    console.log('✅ AuthContext: login done — isAuthenticated → true');
  }, []);

  const logout = useCallback(() => {
    try {
      getStorage().delete(TOKEN_KEY);
      getStorage().delete(USER_KEY);
      setAuthState({ isAuthenticated: false, user: null });
      console.log('✅ AuthContext: logout done');
    } catch (e) {
      console.log('❌ Logout error:', e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  return ctx;
};
