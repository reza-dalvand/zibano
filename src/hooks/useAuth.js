// src/hooks/useAuth.js
import { create } from 'zustand';
import { useAuthStore } from '../stores/useAuthStore';

/**
 * 🎯 Store سراسری برای مدیریت مدال احراز هویت
 * این store مستقل از AuthStore است و فقط وضعیت مدال را نگه می‌دارد
 */
export const useAuthModalStore = create((set, get) => ({
  showAuthModal: false,
  pendingAction: null,

  openAuthModal: (action = null) => {
    set({ showAuthModal: true, pendingAction: action });
  },

  closeAuthModal: () => {
    set({ showAuthModal: false });
    // اجرای pendingAction بعد از لاگین موفق
    const { pendingAction } = get();
    if (pendingAction && useAuthStore.getState().isAuthenticated) {
      setTimeout(() => {
        pendingAction();
        set({ pendingAction: null });
      }, 300);
    } else {
      set({ pendingAction: null });
    }
  },

  cancelAuthModal: () => {
    set({ showAuthModal: false, pendingAction: null });
  },
}));

/**
 * 🎯 Hook اصلی برای استفاده در کامپوننت‌ها
 * 
 * استفاده:
 * const { requireAuth, isAuthenticated } = useAuth();
 * 
 * requireAuth(() => {
 *   // کدی که نیاز به لاگین دارد
 * });
 */
export const useAuth = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  const requireAuth = (action) => {
    if (isAuthenticated) {
      // کاربر لاگین است - اجرای مستقیم
      action?.();
    } else {
      // کاربر لاگین نیست - باز کردن مدال با ذخیره اکشن
      console.log('🔒 Auth required - opening modal');
      openAuthModal(action);
    }
  };

  return {
    isAuthenticated,
    requireAuth,
  };
};

/**
 * 🎯 Hook مخصوص App.js برای مدیریت مدال
 */
export const useAuthModal = () => {
  const showAuthModal = useAuthModalStore((s) => s.showAuthModal);
  const closeAuthModal = useAuthModalStore((s) => s.closeAuthModal);
  const cancelAuthModal = useAuthModalStore((s) => s.cancelAuthModal);

  return {
    showAuthModal,
    closeAuthModal,
    cancelAuthModal,
  };
};