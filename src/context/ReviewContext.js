// src/context/ReviewContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MMKV } from 'react-native-mmkv';

let storage = null;
function getStorage() {
  if (!storage) {
    try {
      storage = new MMKV();
    } catch (e) {
      return { set: () => {}, getString: () => null, delete: () => {} };
    }
  }
  return storage;
}

const REVIEWS_KEY = 'user_reviews';
const PENDING_REVIEWS_KEY = 'pending_reviews';

const ReviewContext = createContext(null);

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = getStorage().getString(REVIEWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [pendingReviews, setPendingReviews] = useState(() => {
    try {
      const stored = getStorage().getString(PENDING_REVIEWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // اضافه کردن نوبت به لیست در انتظار نظر
  const addPendingReview = useCallback((appointment) => {
    setPendingReviews((prev) => {
      // جلوگیری از تکرار
      if (prev.some((p) => p.appointmentId === appointment.id)) return prev;
      const updated = [
        ...prev,
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
      return updated;
    });
  }, []);

  // ثبت نظر
  const submitReview = useCallback((appointmentId, reviewData) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      appointmentId,
      ...reviewData,
      submittedAt: Date.now(),
    };

    setReviews((prev) => {
      const updated = [...prev, newReview];
      try {
        getStorage().set(REVIEWS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // حذف از لیست در انتظار
    setPendingReviews((prev) => {
      const updated = prev.filter((p) => p.appointmentId !== appointmentId);
      try {
        getStorage().set(PENDING_REVIEWS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return newReview;
  }, []);

  // حذف نوبت از لیست در انتظار (اگر کاربر نخواهد نظر بدهد)
  const dismissPendingReview = useCallback((appointmentId) => {
    setPendingReviews((prev) => {
      const updated = prev.filter((p) => p.appointmentId !== appointmentId);
      try {
        getStorage().set(PENDING_REVIEWS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // بررسی اینکه آیا برای یک نوبت نظر داده شده
  const hasReviewFor = useCallback(
    (appointmentId) => reviews.some((r) => r.appointmentId === appointmentId),
    [reviews],
  );

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        pendingReviews,
        addPendingReview,
        submitReview,
        dismissPendingReview,
        hasReviewFor,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export const useReview = () => {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReview باید داخل ReviewProvider استفاده شود');
  return ctx;
};