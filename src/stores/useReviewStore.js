//src/stores/useReviewStore.js

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const REVIEWS_KEY = 'user_reviews';
const PENDING_REVIEWS_KEY = 'pending_reviews';

let _storage = null;
const getStorage = () => {
  if (!_storage) _storage = new MMKV();
  return _storage;
};

const loadFromStorage = (key) => {
  try {
    const stored = getStorage().getString(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const useReviewStore = create((set, get) => ({
  reviews: loadFromStorage(REVIEWS_KEY),
  pendingReviews: loadFromStorage(PENDING_REVIEWS_KEY),

  addPendingReview: (appointment) =>
    set((state) => {
      if (state.pendingReviews.some((p) => p.appointmentId === appointment.id))
        return state;
      const updated = [
        ...state.pendingReviews,
        {
          appointmentId: appointment.id,
          businessName: appointment.businessName,
          businessLogo: appointment.businessLogo,
          serviceName: appointment.serviceName,
          employeeName: appointment.employeeName,
          date: appointment.date,
          time: appointment.time,
          addedAt: Date.now(),
        },
      ];
      try {
        getStorage().set(PENDING_REVIEWS_KEY, JSON.stringify(updated));
      } catch {}
      return { pendingReviews: updated };
    }),

  submitReview: (appointmentId, reviewData) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      appointmentId,
      ...reviewData,
      submittedAt: Date.now(),
    };
    set((state) => {
      const newReviews = [...state.reviews, newReview];
      const newPending = state.pendingReviews.filter(
        (p) => p.appointmentId !== appointmentId
      );
      try {
        getStorage().set(REVIEWS_KEY, JSON.stringify(newReviews));
        getStorage().set(PENDING_REVIEWS_KEY, JSON.stringify(newPending));
      } catch {}
      return { reviews: newReviews, pendingReviews: newPending };
    });
    return newReview;
  },

  dismissPendingReview: (appointmentId) =>
    set((state) => {
      const updated = state.pendingReviews.filter(
        (p) => p.appointmentId !== appointmentId
      );
      try {
        getStorage().set(PENDING_REVIEWS_KEY, JSON.stringify(updated));
      } catch {}
      return { pendingReviews: updated };
    }),

  hasReviewFor: (appointmentId) =>
    get().reviews.some((r) => r.appointmentId === appointmentId),
}));