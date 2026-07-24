//src/stores/useBusinessStore.js

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const BUSINESS_KEY = 'business_data';

let _storage = null;
const getStorage = () => {
  if (!_storage) _storage = new MMKV();
  return _storage;
};

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

const loadInitialData = () => {
  try {
    const stored = getStorage().getString(BUSINESS_KEY);
    return stored ? JSON.parse(stored) : INITIAL_BUSINESS_DATA;
  } catch {
    return INITIAL_BUSINESS_DATA;
  }
};

const saveToStorage = (data) => {
  try {
    getStorage().set(BUSINESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.log('MMKV save error:', e);
  }
};

export const useBusinessStore = create((set, get) => ({
  businessData: loadInitialData(),

  addService: (service) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        services: [
          ...state.businessData.services,
          { ...service, id: `svc_${Date.now()}` },
        ],
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  updateService: (serviceId, updates) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        services: state.businessData.services.map((s) =>
          s.id === serviceId ? { ...s, ...updates } : s
        ),
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  deleteService: (serviceId) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        services: state.businessData.services.filter((s) => s.id !== serviceId),
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  addTeamMember: (member) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        team: [...state.businessData.team, { ...member, id: `emp_${Date.now()}` }],
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  updateTeamMember: (memberId, updates) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        team: state.businessData.team.map((m) =>
          m.id === memberId ? { ...m, ...updates } : m
        ),
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  deleteTeamMember: (memberId) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        team: state.businessData.team.filter((m) => m.id !== memberId),
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  updateSchedule: (employeeId, serviceId, dayKey, scheduleData) =>
    set((state) => {
      const updated = {
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
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  updateAppointmentStatus: (appointmentId, newStatus) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        appointments: state.businessData.appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ),
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  addPortfolio: (portfolio) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        portfolios: [
          ...state.businessData.portfolios,
          { ...portfolio, id: `pf_${Date.now()}` },
        ],
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  updatePortfolio: (portfolioId, updates) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        portfolios: state.businessData.portfolios.map((p) =>
          p.id === portfolioId ? { ...p, ...updates } : p
        ),
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  deletePortfolio: (portfolioId) =>
    set((state) => {
      const updated = {
        ...state.businessData,
        portfolios: state.businessData.portfolios.filter(
          (p) => p.id !== portfolioId
        ),
      };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  updateBusinessInfo: (updates) =>
    set((state) => {
      const updated = { ...state.businessData, ...updates };
      saveToStorage(updated);
      return { businessData: updated };
    }),

  deleteBusiness: () => {
    try {
      getStorage().delete(BUSINESS_KEY);
    } catch {}
    set({ businessData: INITIAL_BUSINESS_DATA });
    return true;
  },

  getActiveServices: () =>
    get().businessData.services.filter((s) => s.isActive !== false),

  getServiceById: (id) =>
    get().businessData.services.find((s) => s.id === id),
}));