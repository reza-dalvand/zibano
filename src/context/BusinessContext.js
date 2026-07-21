// src/context/BusinessContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MMKV } from 'react-native-mmkv';

let _storage = null;

function getStorage() {
  if (!_storage) {
    try {
      _storage = new MMKV();
    } catch (e) {
      console.log('❌ BusinessContext MMKV init error:', e);
      return { set: () => {}, getString: () => null, delete: () => {} };
    }
  }
  return _storage;
}

const BUSINESS_KEY = 'business_data';

const BusinessContext = createContext(null);

// ============ دیتای موقت اولیه ============
const INITIAL_BUSINESS_DATA = {
  id: 'biz_1',
  name: 'سالن زیبایی نیلارام',
  category: 'کلینیک پوست و مو',
  address: 'تهران، سعادت‌آباد',
  phone: '۰۲۱-۲۲۳۳۴۴۵۵',
  // خدمات
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
    {
      id: 'svc_2',
      name: 'کاشت ناخن ژله‌ای',
      typeId: 'nail',
      typeName: 'کاشت و طراحی ناخن',
      originalPrice: 450000,
      discountPercent: 0,
      finalPrice: 450000,
      duration: 90,
      hasDeposit: false,
      depositAmount: 0,
      isActive: true,
    },
  ],
  // اعضای تیم
  team: [
    {
      id: 'emp_1',
      name: 'سارا احمدی',
      phone: '09121234567',
      role: 'متخصص پوست',
      services: ['svc_1'],
    },
    {
      id: 'emp_2',
      name: 'مریم رضایی',
      phone: '09129876543',
      role: 'ناخن‌کار',
      services: ['svc_2'],
    },
  ],
  // زمان‌بندی
  schedules: {
    emp_1: {
      svc_1: {
        sat: { active: true, start: '10:00', end: '18:00', slotDuration: 60 },
        sun: { active: true, start: '10:00', end: '18:00', slotDuration: 60 },
        mon: { active: true, start: '10:00', end: '18:00', slotDuration: 60 },
        tue: { active: false },
        wed: { active: true, start: '14:00', end: '20:00', slotDuration: 60 },
        thu: { active: true, start: '10:00', end: '14:00', slotDuration: 60 },
        fri: { active: false },
      },
    },
    emp_2: {
      svc_2: {
        sat: { active: true, start: '09:00', end: '17:00', slotDuration: 90 },
        sun: { active: true, start: '09:00', end: '17:00', slotDuration: 90 },
        mon: { active: false },
        tue: { active: true, start: '09:00', end: '17:00', slotDuration: 90 },
        wed: { active: true, start: '09:00', end: '17:00', slotDuration: 90 },
        thu: { active: true, start: '09:00', end: '13:00', slotDuration: 90 },
        fri: { active: false },
      },
    },
  },
  // نوبت‌ها
  appointments: [
    {
      id: 'apt_1',
      customerId: 'cust_1',
      customerName: 'نازنین کریمی',
      customerPhone: '09121112233',
      serviceId: 'svc_1',
      serviceName: 'فیشیال تخصصی پوست',
      employeeId: 'emp_1',
      employeeName: 'سارا احمدی',
      date: { jy: 1403, jm: 3, jd: 15 },
      time: '10:00',
      status: 'confirmed',
      price: 675000,
      depositPaid: 200000,
    },
    {
      id: 'apt_2',
      customerId: 'cust_2',
      customerName: 'الهام محمدی',
      customerPhone: '09124445566',
      serviceId: 'svc_2',
      serviceName: 'کاشت ناخن ژله‌ای',
      employeeId: 'emp_2',
      employeeName: 'مریم رضایی',
      date: { jy: 1403, jm: 3, jd: 15 },
      time: '14:30',
      status: 'pending',
      price: 450000,
      depositPaid: 0,
    },
  ],
  // نمونه‌کارها
  portfolios: [
    {
      id: 'pf_1',
      title: 'فیشیال VIP عروس',
      coverImage: 'https://picsum.photos/400/400?random=60',
      images: [
        'https://picsum.photos/800/800?random=60',
        'https://picsum.photos/800/800?random=160',
      ],
      description: 'فیشیال تخصصی عروس',
      serviceId: 'svc_1',
    },
  ],
};

export function BusinessProvider({ children }) {
  const [businessData, setBusinessData] = useState(() => {
    try {
      const stored = getStorage().getString(BUSINESS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_BUSINESS_DATA;
    } catch (e) {
      console.log('❌ BusinessContext init error:', e);
      return INITIAL_BUSINESS_DATA;
    }
  });

  // ذخیره در MMKV
  const saveToStorage = useCallback((data) => {
    try {
      getStorage().set(BUSINESS_KEY, JSON.stringify(data));
    } catch (e) {
      console.log('⚠️ MMKV save error:', e);
    }
  }, []);

  // ============ Services CRUD ============
  const addService = useCallback((service) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        services: [...prev.services, { ...service, id: `svc_${Date.now()}` }],
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateService = useCallback((serviceId, updates) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        services: prev.services.map((s) =>
          s.id === serviceId ? { ...s, ...updates } : s
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteService = useCallback((serviceId) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        services: prev.services.filter((s) => s.id !== serviceId),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // ============ Team CRUD ============
  const addTeamMember = useCallback((member) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        team: [...prev.team, { ...member, id: `emp_${Date.now()}` }],
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateTeamMember = useCallback((memberId, updates) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        team: prev.team.map((m) =>
          m.id === memberId ? { ...m, ...updates } : m
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteTeamMember = useCallback((memberId) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        team: prev.team.filter((m) => m.id !== memberId),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // ============ Schedule Management ============
  const updateSchedule = useCallback((employeeId, serviceId, dayKey, scheduleData) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        schedules: {
          ...prev.schedules,
          [employeeId]: {
            ...(prev.schedules[employeeId] || {}),
            [serviceId]: {
              ...(prev.schedules[employeeId]?.[serviceId] || {}),
              [dayKey]: scheduleData,
            },
          },
        },
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // ============ Appointments Management ============
  const updateAppointmentStatus = useCallback((appointmentId, newStatus) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        appointments: prev.appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteAppointment = useCallback((appointmentId) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        appointments: prev.appointments.filter((apt) => apt.id !== appointmentId),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // ============ Portfolio Management ============
  const addPortfolio = useCallback((portfolio) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        portfolios: [...prev.portfolios, { ...portfolio, id: `pf_${Date.now()}` }],
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const updatePortfolio = useCallback((portfolioId, updates) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        portfolios: prev.portfolios.map((p) =>
          p.id === portfolioId ? { ...p, ...updates } : p
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const deletePortfolio = useCallback((portfolioId) => {
    setBusinessData((prev) => {
      const updated = {
        ...prev,
        portfolios: prev.portfolios.filter((p) => p.id !== portfolioId),
      };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // ============ Business Info Update ============
  const updateBusinessInfo = useCallback((updates) => {
    setBusinessData((prev) => {
      const updated = { ...prev, ...updates };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // ============ 🆕 Delete Business (فقط کسب و کار، نه پروفایل کاربری) ============
  // ============ 🆕 Delete Business ============
  const deleteBusiness = useCallback(() => {
    try {
      getStorage().delete(BUSINESS_KEY);
      console.log('✅ Business data deleted from storage');
    } catch (e) {
      console.log('⚠️ Error deleting business data:', e);
    }
    setBusinessData(INITIAL_BUSINESS_DATA);
    return true;
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        businessData,
        // Services
        addService,
        updateService,
        deleteService,
        // Team
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        // Schedule
        updateSchedule,
        // Appointments
        updateAppointmentStatus,
        deleteAppointment,
        // Portfolio
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        // Business Info
        updateBusinessInfo,
        // 🆕 حذف کسب‌وکار
        deleteBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusiness = () => {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness باید داخل BusinessProvider استفاده شود');
  return ctx;
};