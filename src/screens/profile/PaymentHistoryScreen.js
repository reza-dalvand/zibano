// src/screens/profile/PaymentHistoryScreen.js
import React, { useState, useMemo } from 'react';
import { ScrollView, Share, Alert, StyleSheet, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import Dropdown from '../../components/common/Dropdown';

import {
  MOCK_PAYMENTS,
  MONTHS,
  YEARS,
} from './paymentHistory/constants';
import { formatPrice } from './paymentHistory/helpers';
import PaymentCard from './paymentHistory/PaymentCard';
import InvoiceModal from './paymentHistory/InvoiceModal';

export default function PaymentHistoryScreen() {
  const { colors } = useTheme();

  // 🆕 state های فیلتر ماه و سال
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // 🎯 فیلتر تراکنش‌ها بر اساس ماه و سال
  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((p) => {
      if (selectedMonth !== 0 && p.month !== selectedMonth) return false;
      if (selectedYear !== 0 && p.year !== selectedYear) return false;
      return true;
    });
  }, [selectedMonth, selectedYear]);

  const handleOpenInvoice = (payment) => {
    setSelectedPayment(payment);
    setInvoiceModalVisible(true);
  };

  const handleCopyCode = (code) => {
    Clipboard.setString(code);
    setToast({ visible: true, message: 'کد پیگیری کپی شد', type: 'success' });
  };

  const handleShareInvoice = async () => {
    if (!selectedPayment) return;
    try {
      const msg =
        `🧾 فاکتور زیبانو\n` +
        `📋 ${selectedPayment.title}\n` +
        `🏪 ${selectedPayment.businessName}\n` +
        `📅 ${selectedPayment.dayName} ${selectedPayment.date} - ساعت ${selectedPayment.time}\n` +
        `💰 مبلغ پرداختی: ${formatPrice(selectedPayment.paidAmount)}\n` +
        `🔖 کد پیگیری: ${selectedPayment.trackingCode}\n` +
        `✅ زیبانو - رزرو آنلاین خدمات زیبایی`;
      await Share.share({ message: msg });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری فاکتور وجود ندارد');
    }
  };

  // 🎯 حذف فیلترها
  const handleClearFilters = () => {
    setSelectedMonth(0);
    setSelectedYear(0);
  };

  const hasActiveFilter = selectedMonth !== 0 || selectedYear !== 0;

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      {/* 🆕 فیلتر ماه و سال */}
      <View style={[s.filterContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={s.filterRow}>
          <View style={s.filterItem}>
            <Dropdown
              label="ماه"
              value={selectedMonth}
              options={MONTHS}
              onSelect={setSelectedMonth}
            />
          </View>
          <View style={s.filterItem}>
            <Dropdown
              label="سال"
              value={selectedYear}
              options={YEARS}
              onSelect={setSelectedYear}
            />
          </View>
        </View>
      </View>

      {/* 📋 لیست تراکنش‌ها */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.listContainer}>
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onOpenInvoice={handleOpenInvoice}
              onCopyCode={handleCopyCode}
            />
          ))
        ) : (
          <EmptyState
            icon="💳"
            title="پرداختی ثبت نشده"
            description={
              hasActiveFilter
                ? 'در این بازه زمانی هیچ پرداختی ثبت نشده است. فیلترها را تغییر دهید.'
                : 'پس از اولین پرداخت، سوابق مالی شما اینجا نمایش داده می‌شود'
            }
            actionLabel={hasActiveFilter ? 'حذف فیلترها' : null}
            onAction={hasActiveFilter ? handleClearFilters : null}
          />
        )}
      </ScrollView>

      {/* 📄 مدال فاکتور */}
      <InvoiceModal
        visible={invoiceModalVisible}
        payment={selectedPayment}
        onClose={() => setInvoiceModalVisible(false)}
        onShare={handleShareInvoice}
      />

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  // ========== فیلتر ==========
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  filterRow: { flexDirection: 'row', gap: 12 },
  filterItem: { flex: 1 },

  // ========== لیست ==========
  listContainer: { padding: 16, paddingBottom: 100, gap: 14 },
});