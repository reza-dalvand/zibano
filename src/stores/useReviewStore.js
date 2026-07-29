// src/stores/useReviewStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [],
      pendingReviews: [],

      addPendingReview: (appointment) =>
        set((state) => {
          if (
            state.pendingReviews.some(
              (p) => p.appointmentId === appointment.id
            )
          )
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
          return { pendingReviews: updated };
        }),

      submitReview: (appointmentId, reviewData) => {
        const newReview = {
          id: `rev_${Date.now()}`,
          appointmentId,
          ...reviewData,
          submittedAt: Date.now(),
        };
        set((state) => ({
          reviews: [...state.reviews, newReview],
          pendingReviews: state.pendingReviews.filter(
            (p) => p.appointmentId !== appointmentId
          ),
        }));
        return newReview;
      },

      dismissPendingReview: (appointmentId) =>
        set((state) => ({
          pendingReviews: state.pendingReviews.filter(
            (p) => p.appointmentId !== appointmentId
          ),
        })),

      hasReviewFor: (appointmentId) =>
        get().reviews.some((r) => r.appointmentId === appointmentId),
    }),
    {
      name: 'review-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        reviews: state.reviews,
        pendingReviews: state.pendingReviews,
      }),
    }
  )
);