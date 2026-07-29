// src/stores/useBusinessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_BUSINESS_DATA = {
  id: 'biz_1',
  name: 'سالن زیبایی نیلارام',
  category: 'کلینیک پوست و مو',
  address: 'تهران، سعادت‌آباد',
  phone: '۰۲۱-۲۲۳۳۴۴۵۵',
  services: [
    {
      id: 'svc_1',
      name: 'فیشیال تخصصی پوست',
      typeId: 'facial',
      typeName: 'فیشیال و پاکسازی پوست',
      originalPrice: 750000,
      discountPercent: 10,
      finalPrice: 675000,
      duration: 60,
      hasDeposit: true,
      depositAmount: 200000,
      isActive: true,
      description: 'فیشیال VIP با ماسک طلا',
    },
  ],
  team: [],
  schedules: {},
  appointments: [],
  portfolios: [],
};

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      businessData: INITIAL_BUSINESS_DATA,

      addService: (service) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            services: [
              ...state.businessData.services,
              { ...service, id: `svc_${Date.now()}` },
            ],
          },
        })),

      updateService: (serviceId, updates) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            services: state.businessData.services.map((s) =>
              s.id === serviceId ? { ...s, ...updates } : s
            ),
          },
        })),

      deleteService: (serviceId) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            services: state.businessData.services.filter(
              (s) => s.id !== serviceId
            ),
          },
        })),

      addTeamMember: (member) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            team: [
              ...state.businessData.team,
              { ...member, id: `emp_${Date.now()}` },
            ],
          },
        })),

      updateTeamMember: (memberId, updates) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            team: state.businessData.team.map((m) =>
              m.id === memberId ? { ...m, ...updates } : m
            ),
          },
        })),

      deleteTeamMember: (memberId) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            team: state.businessData.team.filter((m) => m.id !== memberId),
          },
        })),

      updateSchedule: (employeeId, serviceId, dayKey, scheduleData) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            schedules: {
              ...state.businessData.schedules,
              [employeeId]: {
                ...(state.businessData.schedules[employeeId] || {}),
                [serviceId]: {
                  ...(state.businessData.schedules[employeeId]?.[serviceId] || {}),
                  [dayKey]: scheduleData,
                },
              },
            },
          },
        })),

      deleteScheduleDay: (employeeId, serviceId, dayKey) =>
        set((state) => {
          const currentEmployeeSchedules =
            state.businessData.schedules[employeeId] || {};
          const currentServiceSchedules =
            currentEmployeeSchedules[serviceId] || {};
          const { [dayKey]: removed, ...remainingDays } =
            currentServiceSchedules;
          return {
            businessData: {
              ...state.businessData,
              schedules: {
                ...state.businessData.schedules,
                [employeeId]: {
                  ...currentEmployeeSchedules,
                  [serviceId]: remainingDays,
                },
              },
            },
          };
        }),

      updateAppointmentStatus: (appointmentId, newStatus) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            appointments: state.businessData.appointments.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            ),
          },
        })),

      addPortfolio: (portfolio) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            portfolios: [
              ...state.businessData.portfolios,
              { ...portfolio, id: `pf_${Date.now()}` },
            ],
          },
        })),

      updatePortfolio: (portfolioId, updates) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            portfolios: state.businessData.portfolios.map((p) =>
              p.id === portfolioId ? { ...p, ...updates } : p
            ),
          },
        })),

      deletePortfolio: (portfolioId) =>
        set((state) => ({
          businessData: {
            ...state.businessData,
            portfolios: state.businessData.portfolios.filter(
              (p) => p.id !== portfolioId
            ),
          },
        })),

      updateBusinessInfo: (updates) =>
        set((state) => ({
          businessData: { ...state.businessData, ...updates },
        })),

      deleteBusiness: () => {
        set({ businessData: INITIAL_BUSINESS_DATA });
        return true;
      },

      getActiveServices: () =>
        get().businessData.services.filter((s) => s.isActive !== false),

      getServiceById: (id) =>
        get().businessData.services.find((s) => s.id === id),
    }),
    {
      name: 'business-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        businessData: state.businessData,
      }),
    }
  )
);