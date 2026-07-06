// src/screens/profile/PaymentHistoryScreen.js
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Share, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Dropdown from '../../components/common/Dropdown';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

const MOCK_PAYMENTS = [
  {
    id: 'pay_1', type: 'deposit', title: 'بیعانه رزرو - فیشیال تخصصی',
    businessName: 'سالن نیلارام', date: '۱۴۰۳/۰۴/۱۰', month: 4, year: 1403,
    amount: 200000, status: 'success', trackingCode: 'TRK-1234567890', refNumber: 'REF-2024-001',
  },
  {
    id: 'pay_2', type: 'deposit', title: 'بیعانه رزرو - لیزر فول بادی',
    businessName: 'مرکز لیزر رویال', date: '۱۴۰۳/۰۴/۰۵', month: 4, year: 1403,
    amount: 500000, status: 'success', trackingCode: 'TRK-9876543210', refNumber: 'REF-2024-002',
  },
  {
    id: 'pay_3', type: 'service', title: 'خرید سرویس ویژه پرمیوم',
    businessName: 'زیبانو', date: '۱۴۰۳/۰۳/۲۰', month: 3, year: 1403,
    amount: 150000, status: 'success', trackingCode: 'TRK-5555555555', refNumber: 'REF-2024-003',
  },
  {
    id: 'pay_4', type: 'deposit', title: 'بیعانه رزرو - کاشت ناخن',
    businessName: 'ناخن گالری پریا', date: '۱۴۰۳/۰۳/۱۵', month: 3, year: 1403,
    amount: 100000, status: 'failed', trackingCode: '-', refNumber: 'REF-2024-004',
  },
  {
    id: 'pay_5', type: 'deposit', title: 'بیعانه رزرو - رنگ مو',
    businessName: 'سالن افرا', date: '۱۴۰۲/۱۲/۲۵', month: 12, year: 1402,
    amount: 300000, status: 'success', trackingCode: 'TRK-7777777777', refNumber: 'REF-2023-005',
  },
];

const MONTHS = [
  { id: 0, label: 'همه ماه‌ها' }, { id: 1, label: 'فروردین' }, { id: 2, label: 'اردیبهشت' },
  { id: 3, label: 'خرداد' }, { id: 4, label: 'تیر' }, { id: 5, label: 'مرداد' },
  { id: 6, label: 'شهریور' }, { id: 7, label: 'مهر' }, { id: 8, label: 'آبان' },
  { id: 9, label: 'آذر' }, { id: 10, label: 'دی' }, { id: 11, label: 'بهمن' },
  { id: 12, label: 'اسفند' },
];

const YEARS = [
  { id: 0, label: 'همه سال‌ها' }, { id: 1403, label: '۱۴۰۳' },
  { id: 1402, label: '۱۴۰۲' }, { id: 1401, label: '۱۴۰۱' },
];

const STATUS_META = {
  success: { label: 'موفق', color: '#43A047', icon: 'check-circle' },
  failed:  { label: 'ناموفق', color: '#E53935', icon: 'cancel' },
  pending: { label: 'در انتظار', color: '#FFA000', icon: 'schedule' },
};

export default function PaymentHistoryScreen() {
  const { colors } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(
    () =>
      MOCK_PAYMENTS.filter((p) => {
        if (selectedMonth !== 0 && p.month !== selectedMonth) return false;
        if (selectedYear !== 0 && p.year !== selectedYear) return false;
        return true;
      }),
    [selectedMonth, selectedYear]
  );

  const stats = useMemo(() => {
    const success = filteredPayments.filter((p) => p.status === 'success');
    return {
      total: success.reduce((sum, p) => sum + p.amount, 0),
      successCount: success.length,
      failedCount: filteredPayments.filter((p) => p.status === 'failed').length,
    };
  }, [filteredPayments]);

  const openInvoice = (payment) => {
    setSelectedPayment(payment);
    setInvoiceModalVisible(true);
  };

  const shareInvoice = async () => {
    if (!selectedPayment) return;
    try {
      await Share.share({
        message:
          `🧾 فاکتور زیبانو\n\n` +
          `عنوان: ${selectedPayment.title}\n` +
          `کسب‌وکار: ${selectedPayment.businessName}\n` +
          `تاریخ: ${selectedPayment.date}\n` +
          `مبلغ: ${formatPrice(selectedPayment.amount)}\n` +
          `کد پیگیری: ${selectedPayment.trackingCode}\n` +
          `شماره ارجاع: ${selectedPayment.refNumber}\n\n` +
          `✅ زیبانو - رزرو آنلاین خدمات زیبایی`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری فاکتور وجود ندارد');
    }
  };

  const downloadInvoice = () => {
    Alert.alert(
      'دانلود فاکتور PDF',
      'در نسخه نهایی، فاکتور به صورت PDF دانلود خواهد شد.\nفعلاً می‌توانید فاکتور را از طریق اشتراک‌گذاری ذخیره کنید.',
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'اشتراک‌گذاری', onPress: shareInvoice },
      ]
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      <View style={[s.filterContainer, { backgroundColor: colors.background }]}>
        <View style={s.filterRow}>
          <View style={s.filterItem}>
            <Dropdown label="ماه" value={selectedMonth} options={MONTHS} onSelect={setSelectedMonth} />
          </View>
          <View style={s.filterItem}>
            <Dropdown label="سال" value={selectedYear} options={YEARS} onSelect={setSelectedYear} />
          </View>
        </View>
      </View>

      {filteredPayments.length > 0 && (
        <View style={s.statsContainer}>
          <Card variant="elevated" padding={16} radius={16} style={s.statsCard}>
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <Icon name="account-balance-wallet" size={22} color="#43A047" />
                <Text style={[s.statValue, { color: colors.textMain }]}>
                  {formatPrice(stats.total).replace(' تومان', '')}
                </Text>
                <Text style={[s.statLabel, { color: colors.textSecondary }]}>
                  مجموع پرداخت‌ها
                </Text>
              </View>
              <View style={[s.statDivider, { backgroundColor: colors.border }]} />
              <View style={s.statItem}>
                <Icon name="receipt" size={22} color={colors.primary} />
                <Text style={[s.statValue, { color: colors.textMain }]}>
                  {toPersianDigit(stats.successCount)}
                </Text>
                <Text style={[s.statLabel, { color: colors.textSecondary }]}>
                  تراکنش موفق
                </Text>
              </View>
            </View>
          </Card>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContainer}
      >
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => {
            const meta = STATUS_META[payment.status] || STATUS_META.pending;
            return (
              <Card key={payment.id} variant="elevated" padding={16} radius={16} style={s.payCard}>
                <View style={s.payHeader}>
                  <View
                    style={[
                      s.payIconBox,
                      {
                        backgroundColor: payment.type === 'deposit' ? '#2196F320' : '#9C27B020',
                      },
                    ]}
                  >
                    <Icon
                      name={payment.type === 'deposit' ? 'event-available' : 'workspace-premium'}
                      size={22}
                      color={payment.type === 'deposit' ? '#2196F3' : '#9C27B0'}
                    />
                  </View>
                  <View style={s.payInfo}>
                    <Text style={[s.payTitle, { color: colors.textMain }]} numberOfLines={1}>
                      {payment.title}
                    </Text>
                    <Text style={[s.payBusiness, { color: colors.textSecondary }]} numberOfLines={1}>
                      {payment.businessName}
                    </Text>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: meta.color + '20' }]}>
                    <Icon name={meta.icon} size={11} color={meta.color} />
                    <Text style={[s.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>

                <View style={[s.payDivider, { backgroundColor: colors.border }]} />

                <View style={s.payDetails}>
                  <View style={s.payDetailRow}>
                    <Icon name="event" size={14} color={colors.textSecondary} />
                    <Text style={[s.payDetailText, { color: colors.textMain }]}>{payment.date}</Text>
                  </View>
                  <View style={s.payDetailRow}>
                    <Icon name="tag" size={14} color={colors.textSecondary} />
                    <Text style={[s.payDetailText, { color: colors.textMain }]}>
                      {payment.trackingCode}
                    </Text>
                  </View>
                </View>

                <View style={[s.payFooter, { borderTopColor: colors.border }]}>
                  <Text style={[s.payAmount, { color: colors.primary }]}>
                    {formatPrice(payment.amount)}
                  </Text>
                  {payment.status === 'success' && (
                    <TouchableOpacity
                      style={[s.invoiceBtn, { borderColor: colors.primary + '50', backgroundColor: colors.primary + '10' }]}
                      onPress={() => openInvoice(payment)}
                    >
                      <Icon name="receipt-long" size={14} color={colors.primary} />
                      <Text style={[s.invoiceBtnText, { color: colors.primary }]}>
                        مشاهده فاکتور
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon="💳"
            title="پرداختی ثبت نشده"
            description={
              selectedMonth !== 0 || selectedYear !== 0
                ? 'در این بازه زمانی هیچ پرداختی ثبت نشده است. فیلترها را تغییر دهید.'
                : 'پس از اولین پرداخت، سوابق مالی شما اینجا نمایش داده می‌شود'
            }
            actionLabel={selectedMonth !== 0 || selectedYear !== 0 ? 'حذف فیلترها' : null}
            onAction={() => {
              setSelectedMonth(0);
              setSelectedYear(0);
            }}
          />
        )}
      </ScrollView>

      <Modal
        visible={invoiceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInvoiceModalVisible(false)}
      >
        <TouchableOpacity
          style={s.invoiceBackdrop}
          activeOpacity={1}
          onPress={() => setInvoiceModalVisible(false)}
        >
          <View style={s.invoiceModalSpacer} />
          {selectedPayment && (
            <View style={[s.invoiceModal, { backgroundColor: colors.cardBackground }]}>
              <View style={s.invoiceHeader}>
                <View style={s.invoiceHeaderInfo}>
                  <Icon name="receipt" size={28} color={colors.primary} />
                  <Text style={[s.invoiceTitle, { color: colors.textMain }]}>
                    فاکتور پرداخت
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setInvoiceModalVisible(false)}
                  style={s.invoiceCloseBtn}
                >
                  <Icon name="close" size={22} color={colors.textMain} />
                </TouchableOpacity>
              </View>

              <View style={[s.invoiceBody, { borderColor: colors.border }]}>
                <Text style={[s.invoiceBizName, { color: colors.primary }]}>
                  {selectedPayment.businessName}
                </Text>
                <Text style={[s.invoicePayTitle, { color: colors.textMain }]}>
                  {selectedPayment.title}
                </Text>

                <View style={[s.invoiceDivider, { backgroundColor: colors.border }]} />

                <View style={s.invoiceRow}>
                  <Text style={[s.invoiceLabel, { color: colors.textSecondary }]}>تاریخ پرداخت</Text>
                  <Text style={[s.invoiceValue, { color: colors.textMain }]}>{selectedPayment.date}</Text>
                </View>
                <View style={s.invoiceRow}>
                  <Text style={[s.invoiceLabel, { color: colors.textSecondary }]}>کد پیگیری</Text>
                  <Text style={[s.invoiceValue, { color: colors.textMain }]}>
                    {selectedPayment.trackingCode}
                  </Text>
                </View>
                <View style={s.invoiceRow}>
                  <Text style={[s.invoiceLabel, { color: colors.textSecondary }]}>شماره ارجاع</Text>
                  <Text style={[s.invoiceValue, { color: colors.textMain }]}>
                    {selectedPayment.refNumber}
                  </Text>
                </View>
                <View style={s.invoiceRow}>
                  <Text style={[s.invoiceLabel, { color: colors.textSecondary }]}>وضعیت</Text>
                  <Text
                    style={[
                      s.invoiceValue,
                      { color: STATUS_META[selectedPayment.status]?.color },
                    ]}
                  >
                    {STATUS_META[selectedPayment.status]?.label}
                  </Text>
                </View>

                <View style={[s.invoiceDivider, { backgroundColor: colors.border }]} />

                <View style={s.invoiceTotalRow}>
                  <Text style={[s.invoiceTotalLabel, { color: colors.textMain }]}>مبلغ کل</Text>
                  <Text style={[s.invoiceTotalValue, { color: colors.primary }]}>
                    {formatPrice(selectedPayment.amount)}
                  </Text>
                </View>
              </View>

              <View style={s.invoiceFooter}>
                <Button
                  title="دانلود PDF"
                  onPress={downloadInvoice}
                  variant="outline"
                  size="md"
                  style={s.halfBtn}
                  icon={<Icon name="file-download" size={18} color={colors.primary} />}
                  iconPosition="right"
                />
                <Button
                  title="اشتراک‌گذاری"
                  onPress={shareInvoice}
                  variant="primary"
                  size="md"
                  style={s.halfBtn}
                  icon={<Icon name="share" size={18} color="#fff" />}
                  iconPosition="right"
                />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  filterContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  filterRow: { flexDirection: 'row', gap: 12 },
  filterItem: { flex: 1 },
  statsContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  statsCard: { marginBottom: 0 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Vazir' },
  statDivider: { width: 1, height: 40 },
  listContainer: { padding: 16, paddingBottom: 100, gap: 12 },
  payCard: { marginBottom: 0 },
  payHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  payIconBox: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  payInfo: { flex: 1, gap: 2 },
  payTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  payBusiness: { fontSize: 12, fontFamily: 'Vazir' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  statusText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  payDivider: { height: 1, marginVertical: 10 },
  payDetails: { gap: 6, marginBottom: 10 },
  payDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  payDetailText: { fontSize: 12, fontFamily: 'Vazir' },
  payFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1,
  },
  payAmount: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  invoiceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1,
  },
  invoiceBtnText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  invoiceBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', paddingHorizontal: 20,
  },
  invoiceModalSpacer: { flex: 1 },
  invoiceModal: { borderRadius: 20, padding: 20, maxHeight: '80%' },
  invoiceHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  invoiceHeaderInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  invoiceTitle: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  invoiceCloseBtn: { padding: 4 },
  invoiceBody: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 10, marginBottom: 16 },
  invoiceBizName: { fontSize: 13, fontFamily: 'Vazir-Medium', textAlign: 'center' },
  invoicePayTitle: { fontSize: 15, fontFamily: 'Vazir-Bold', textAlign: 'center', marginBottom: 4 },
  invoiceDivider: { height: 1, marginVertical: 4 },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceLabel: { fontSize: 13, fontFamily: 'Vazir' },
  invoiceValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  invoiceTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 4,
  },
  invoiceTotalLabel: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  invoiceTotalValue: { fontSize: 17, fontFamily: 'Vazir-Bold' },
  invoiceFooter: { flexDirection: 'row', gap: 10 },
  halfBtn: { flex: 1 },
});