// src/screens/manageBusiness/AllAppointmentsScreen.js
import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import AppointmentFilters from '../../components/manageBusiness/AppointmentFilters';
import AppointmentSearchBar from '../../components/manageBusiness/AppointmentSearchBar';
import AppointmentCard from '../../components/manageBusiness/AppointmentCard';
import AppointmentDetailSheet from '../../components/manageBusiness/AppointmentDetailSheet';
import VerifyCodeModal from '../../components/manageBusiness/VerifyCodeModal';
import CancelReasonModal from '../../components/manageBusiness/CancelReasonModal';

const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    customerName: 'نازنین کریمی',
    customerPhone: '09121112233',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: { jy: 1403, jm: 4, jd: 20 },
    time: '۱۰:۳۰',
    status: 'reserved',
    price: 675000,
    depositPaid: 200000,
    verificationCode: '5892', // ✅ 4 رقم
    bookedAt: '۱۴۰۳/۰۴/۱۰ - ۱۴:۳۲',
  },
  {
    id: 'apt_2',
    customerName: 'الهام محمدی',
    customerPhone: '09124445566',
    serviceName: 'کاشت ناخن ژله‌ای',
    employeeName: 'مریم رضایی',
    date: { jy: 1403, jm: 4, jd: 20 },
    time: '۱۴:۳۰',
    status: 'reserved',
    price: 450000,
    depositPaid: 100000,
    verificationCode: '2571', // ✅ 4 رقم
    bookedAt: '۱۴۰۳/۰۴/۱۵ - ۱۱:۲۰',
  },
  {
    id: 'apt_3',
    customerName: 'زهرا حسینی',
    customerPhone: '09127778899',
    serviceName: 'لیزر فول بادی',
    employeeName: 'دکتر رضایی',
    date: { jy: 1403, jm: 4, jd: 18 },
    time: '۱۶:۰۰',
    status: 'done',
    price: 2125000,
    depositPaid: 500000,
    verificationCode: '7456', // ✅ 4 رقم
    bookedAt: '۱۴۰۳/۰۴/۱۰ - ۰۹:۱۵',
    verifiedAt: '۱۴۰۳/۰۴/۱۸ - ۱۶:۴۵',
  },
  {
    id: 'apt_4',
    customerName: 'مریم احمدی',
    customerPhone: '09123334455',
    serviceName: 'رنگ و لایت مو',
    employeeName: 'الناز کریمی',
    date: { jy: 1403, jm: 4, jd: 17 },
    time: '۱۱:۰۰',
    status: 'cancelled_by_salon',
    price: 1440000,
    depositPaid: 300000,
    verificationCode: '—',
    bookedAt: '۱۴۰۳/۰۴/۱۲ - ۱۸:۰۰',
    cancellationReason: 'سالن در این تاریخ تعطیل است',
    refundAmount: 300000,
  },
  {
    id: 'apt_6',
    customerName: 'سمیرا قاسمی',
    customerPhone: '09126665544',
    serviceName: 'فیشیال VIP عروس',
    employeeName: 'سارا احمدی',
    date: { jy: 1403, jm: 4, jd: 22 },
    time: '۰۹:۰۰',
    status: 'reserved',
    price: 950000,
    depositPaid: 300000,
    verificationCode: '8147', // ✅ 4 رقم
    bookedAt: '۱۴۰۳/۰۴/۱۸ - ۲۰:۳۰',
  },
];

export default function AllAppointmentsScreen({ navigation }) {
  const { colors } = useTheme();
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedApt, setSelectedApt] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const filteredAppointments = useMemo(() => {
    let result = appointments;
    if (activeFilter !== 'all') {
      if (activeFilter === 'cancelled') {
        result = result.filter(a => a.status === 'cancelled_by_salon');
      } else {
        result = result.filter(a => a.status === activeFilter);
      }
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        a =>
          a.customerName.toLowerCase().includes(query) ||
          a.serviceName.toLowerCase().includes(query) ||
          a.employeeName.toLowerCase().includes(query) ||
          a.customerPhone.includes(query),
      );
    }
    if (dateFilter) {
      const todayJalaali = { jy: 1403, jm: 4, jd: 20 };
      result = result.filter(a => {
        const aptDate = a.date;
        if (dateFilter === 'today') {
          return (
            aptDate.jy === todayJalaali.jy &&
            aptDate.jm === todayJalaali.jm &&
            aptDate.jd === todayJalaali.jd
          );
        }
        if (dateFilter === 'week') {
          return aptDate.jd >= todayJalaali.jd && aptDate.jd <= todayJalaali.jd + 7;
        }
        if (dateFilter === 'month') {
          return aptDate.jm === todayJalaali.jm;
        }
        return true;
      });
    }
    return result;
  }, [appointments, activeFilter, searchQuery, dateFilter]);

  const counts = useMemo(() => {
    return {
      all: appointments.length,
      reserved: appointments.filter(a => a.status === 'reserved').length,
      cancelled: appointments.filter(a => a.status === 'cancelled_by_salon').length,
      done: appointments.filter(a => a.status === 'done').length,
    };
  }, [appointments]);

  const openDetail = apt => {
    setSelectedApt(apt);
    setDetailVisible(true);
  };
  const closeDetail = () => {
    setDetailVisible(false);
    setTimeout(() => setSelectedApt(null), 300);
  };

  const handleOpenVerify = apt => {
    setVerifyTarget(apt);
    if (detailVisible) {
      setDetailVisible(false);
      setTimeout(() => setVerifyModalVisible(true), 350);
    } else {
      setVerifyModalVisible(true);
    }
  };
  const handleCloseVerify = () => {
    setVerifyModalVisible(false);
    setTimeout(() => setVerifyTarget(null), 300);
  };
  const handleConfirmVerify = aptId => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === aptId
          ? { ...a, status: 'done', verifiedAt: new Date().toLocaleString('fa-IR') }
          : a,
      ),
    );
    setVerifyModalVisible(false);
    setVerifyTarget(null);
    setToast({
      visible: true,
      message: '✓ خدمت تایید شد • بیعانه به حساب شما واریز می‌شود',
      type: 'success',
    });
  };

  const handleOpenCancel = apt => {
    setCancelTarget(apt);
    if (detailVisible) {
      setDetailVisible(false);
      setTimeout(() => setCancelModalVisible(true), 350);
    } else {
      setCancelModalVisible(true);
    }
  };
  const handleCloseCancel = () => {
    setCancelModalVisible(false);
    setTimeout(() => setCancelTarget(null), 300);
  };
  const handleConfirmCancel = (aptId, reason) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === aptId
          ? {
              ...a,
              status: 'cancelled_by_salon',
              cancellationReason: reason,
              refundAmount: a.depositPaid,
            }
          : a,
      ),
    );
    setCancelModalVisible(false);
    setCancelTarget(null);
    setToast({
      visible: true,
      message: 'نوبت لغو شد • بیعانه به مشتری مسترد و پیامک ارسال می‌شود',
      type: 'info',
    });
  };

  const getEmptyStateConfig = () => {
    if (searchQuery || dateFilter) {
      return {
        icon: '🔍',
        title: 'نتیجه‌ای یافت نشد',
        description: 'فیلترهای جستجو را تغییر دهید',
      };
    }
    const configs = {
      all: {
        icon: '📅',
        title: 'هنوز نوبتی ثبت نشده است',
        description: 'پس از رزرو اولین نوبت توسط مشتریان، نوبت‌ها اینجا نمایش داده می‌شود',
      },
      reserved: {
        icon: '📋',
        title: 'نوبت رزرو شده‌ای وجود ندارد',
        description: 'در حال حاضر هیچ نوبت فعالی برای نمایش وجود ندارد',
      },
      cancelled: {
        icon: '❌',
        title: 'نوبت لغو شده‌ای وجود ندارد',
        description: 'هیچ نوبتی توسط سالن لغو نشده است',
      },
      done: {
        icon: '✅',
        title: 'نوبت انجام شده‌ای وجود ندارد',
        description: 'هنوز هیچ خدمتی تکمیل و تایید نشده است',
      },
    };
    return configs[activeFilter] || configs.all;
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <AppointmentSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
      <AppointmentFilters activeFilter={activeFilter} counts={counts} onChange={setActiveFilter} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.listContainer}>
        {filteredAppointments.length > 0 ? (
          <View style={s.list}>
            {filteredAppointments.map(apt => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onDetails={openDetail}
                onVerify={handleOpenVerify}
                onCancel={handleOpenCancel}
              />
            ))}
          </View>
        ) : (
          <EmptyState {...getEmptyStateConfig()} />
        )}
      </ScrollView>

      <AppointmentDetailSheet visible={detailVisible} appointment={selectedApt} onClose={closeDetail} />
      <VerifyCodeModal
        visible={verifyModalVisible}
        appointment={verifyTarget}
        onClose={handleCloseVerify}
        onConfirm={handleConfirmVerify}
      />
      <CancelReasonModal
        visible={cancelModalVisible}
        appointment={cancelTarget}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  listContainer: { padding: 16, paddingBottom: 120 },
  list: { gap: 12 },
});