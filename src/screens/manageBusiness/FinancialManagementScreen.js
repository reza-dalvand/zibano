// src/screens/manageBusiness/FinancialManagementScreen.js
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Toast from '../../components/common/Toast';
import EmptyState from '../../components/common/EmptyState';
import { useTheme } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useBusinessStore } from '../../stores/useBusinessStore';

import {
  FinancialStatsCards,
  BankInfoCard,
  BankEditModal,
  FinancialTabs,
  TransactionItem,
  TransactionDetailModal,
  MOCK_TRANSACTIONS,
  MOCK_BANK_INFO,
  toPersianDigit,
} from '../../components/manageBusiness/financial';

export default function FinancialManagementScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const businessData = useBusinessStore((s) => s.businessData);

  // state‌های اصلی
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState('all');
  const [bankInfo, setBankInfo] = useState(MOCK_BANK_INFO);
  const [bankEditVisible, setBankEditVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txDetailVisible, setTxDetailVisible] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
  });

  // نام تایید شده صاحب کسب و کار (از احراز هویت)
  const businessOwnerName = businessData?.verifiedName || user?.name || '';

  // محاسبه آمار از روی transactions
  const stats = useMemo(() => {
    const sumBy = status =>
      transactions
        .filter(t => t.status === status)
        .reduce((s, t) => s + (t.amount || 0), 0);
    const totalAmount = transactions.reduce((s, t) => s + (t.amount || 0), 0);
    return {
      blockedAmount: sumBy('blocked'),
      settlingAmount: sumBy('settling'),
      settledAmount: sumBy('settled'),
      refundedAmount: sumBy('refunded'),
      totalAmount,
    };
  }, [transactions]);

  const tabCounts = useMemo(() => {
    const c = status => transactions.filter(t => t.status === status).length;
    return {
      all: transactions.length,
      blocked: c('blocked'),
      settling: c('settling'),
      settled: c('settled'),
      refunded: c('refunded'),
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    return transactions.filter(t => t.status === activeTab);
  }, [transactions, activeTab]);

  const hasPendingMoney =
    stats.blockedAmount > 0 || stats.settlingAmount > 0;

  // handlers
  const handleOpenBankEdit = () => setBankEditVisible(true);

  const handleSaveBankInfo = (data) => {
    setBankInfo(prev => ({
      ...prev,
      ...data,
      isRegistered: true,
      isVerified: false, // بعد از ثبت وارد مرحله بررسی
    }));
    setBankEditVisible(false);
    setToast({
      visible: true,
      message: '✓ اطلاعات حساب بانکی ثبت شد و وارد چرخه تایید شد',
      type: 'success',
    });
  };

  const handleTxPress = tx => {
    setSelectedTx(tx);
    setTxDetailVisible(true);
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header
        title="مدیریت مالی و تسویه"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* بنر وضعیت سریع - فقط زمانی نمایش می‌دهد که حساب تایید نشده باشد */}
        {(!bankInfo.isRegistered || !bankInfo.isVerified) && hasPendingMoney && (
          <Card
            variant="default"
            padding={12}
            radius={14}
            style={[s.statusBanner, { borderColor: '#FF980045', backgroundColor: '#FF980012', borderWidth: 1 }]}
          >
            <Icon name="priority-high" size={22} color="#FF9800" />
            <View style={s.statusText}>
              <Text style={[s.statusBannerTitle, { color: '#FF9800' }]}>
                حساب بانکی شما هنوز {bankInfo.isRegistered ? 'تایید' : 'ثبت'} نشده است
              </Text>
              <Text style={[s.statusBannerHint, { color: colors.textSecondary }]}>
                برای دریافت {bankInfo.isRegistered ? '' : 'تسویه‌ها'} باید حساب تایید شده‌ای داشته باشید
              </Text>
            </View>
          </Card>
        )}

        {/* کارت آمار */}
        <View style={s.sectionHeaderRow}>
          <Icon name="insights" size={20} color={colors.primary} />
          <Text style={[s.sectionHeader, { color: colors.textMain }]}>
            وضعیت حساب شما
          </Text>
        </View>
        <FinancialStatsCards stats={stats} />

        {/* اطلاعات حساب */}
        <BankInfoCard
          bankInfo={bankInfo}
          onEdit={handleOpenBankEdit}
          businessOwnerName={businessOwnerName}
          hasActiveAppointments={stats.blockedAmount > 0}
        />

        {/* عنوان تاریخچه */}
        <View style={[s.sectionHeaderRow, { marginTop: 8 }]}>
          <Icon name="receipt-long" size={20} color={colors.primary} />
          <Text style={[s.sectionHeader, { color: colors.textMain }]}>
            تاریخچه تراکنش‌ها
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={[s.countBadge, { color: colors.textSecondary }]}>
            {toPersianDigit(filteredTransactions.length)} تراکنش
          </Text>
        </View>

        {/* تب‌ها */}
        <FinancialTabs
          active={activeTab}
          counts={tabCounts}
          onChange={setActiveTab}
        />

        {/* لیست تراکنش‌ها */}
        <View style={s.txList}>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(tx => (
              <TransactionItem
                key={tx.id}
                tx={tx}
                onPress={handleTxPress}
              />
            ))
          ) : (
            <Card variant="elevated" padding={0} radius={16} style={s.emptyBox}>
              <EmptyState
                icon="🧾"
                title="تراکنشی یافت نشد"
                description="در این دسته‌بندی هنوز تراکنشی ثبت نشده است"
              />
            </Card>
          )}
        </View>
      </ScrollView>

      {/* مدال ویرایش حساب بانکی */}
      <BankEditModal
        visible={bankEditVisible}
        onClose={() => setBankEditVisible(false)}
        onSave={handleSaveBankInfo}
        bankInfo={bankInfo}
        businessOwnerName={businessOwnerName}
      />

      {/* مدال جزئیات تراکنش */}
      <TransactionDetailModal
        visible={txDetailVisible}
        tx={selectedTx}
        onClose={() => {
          setTxDetailVisible(false);
          setSelectedTx(null);
        }}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  statusBanner: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  statusText: {
    flex: 1,
    gap: 3,
  },
  statusBannerTitle: {
    fontSize: 12.5,
    fontFamily: 'Vazir-Bold',
  },
  statusBannerHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  countBadge: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  txList: {
    marginTop: 8,
  },
  emptyBox: {
    minHeight: 240,
  },
});