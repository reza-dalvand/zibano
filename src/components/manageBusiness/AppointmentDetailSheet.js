// src/components/manageBusiness/AppointmentDetailSheet.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import BottomSheet from '../common/BottomSheet';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import Divider from '../common/Divider';

const toPersianDigit = (str) => String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const formatPrice = (num) => `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

const STATUS_META = {
  reserved: { label: 'رزرو شده', color: '#2196F3', icon: 'event-available', bg: '#2196F320' },
  cancelled_by_salon: { label: 'لغو توسط سالن', color: '#E53935', icon: 'cancel', bg: '#E5393520' },
  done: { label: 'انجام شده', color: '#43A047', icon: 'task-alt', bg: '#43A04720' },
};

// 🎯 پروپ‌های اکشن حذف شدند
export default function AppointmentDetailSheet({ visible, appointment, onClose }) {
  const { colors } = useTheme();
  if (!appointment) return null;

  const meta = STATUS_META[appointment.status] || STATUS_META.reserved;
  const isCancelledBySalon = appointment.status === 'cancelled_by_salon';
  const isDone = appointment.status === 'done';
  const isReserved = appointment.status === 'reserved';

  const dateStr = appointment.date
    ? `${toPersianDigit(appointment.date.jy)}/${toPersianDigit(appointment.date.jm)}/${toPersianDigit(appointment.date.jd)}`
    : '—';

  return (
    <BottomSheet visible={visible} onClose={onClose} title="جزئیات نوبت" snapPoint={0.85}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* مشتری */}
        <View style={s.customerSection}>
          <Avatar name={appointment.customerName} size="xl" />
          <Text style={[s.customerName, { color: colors.textMain }]}>{appointment.customerName}</Text>
          <View style={[s.phoneBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Icon name="phone" size={16} color={colors.primary} />
            <Text style={[s.phoneText, { color: colors.textMain }]}>
              {toPersianDigit(appointment.customerPhone || '—')}
            </Text>
          </View>
          <View style={[s.statusPill, { backgroundColor: meta.bg }]}>
            <Icon name={meta.icon} size={14} color={meta.color} />
            <Text style={[s.statusPillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>

        {/* جزئیات نوبت */}
        <Card variant="default" padding={14} radius={14} style={s.detailCard}>
          <Text style={[s.cardTitle, { color: colors.textMain }]}>جزئیات نوبت</Text>
          <Divider spacing={10} />
          {[
            { icon: 'spa', label: 'خدمت', value: appointment.serviceName },
            { icon: 'person', label: 'کارمند', value: appointment.employeeName },
            { icon: 'event', label: 'تاریخ', value: dateStr },
            { icon: 'schedule', label: 'ساعت', value: appointment.time },
          ].map((item, i) => (
            <View key={i} style={s.infoRow}>
              <View style={s.infoLabel}>
                <Icon name={item.icon} size={16} color={colors.primary} />
                <Text style={[s.infoLabelText, { color: colors.textSecondary }]}>{item.label}</Text>
              </View>
              <Text style={[s.infoValue, { color: colors.textMain }]}>{item.value}</Text>
            </View>
          ))}
        </Card>

        {/* مالی */}
        <Card variant="default" padding={14} radius={14} style={s.detailCard}>
          <Text style={[s.cardTitle, { color: colors.textMain }]}>جزئیات مالی</Text>
          <Divider spacing={10} />
          <View style={s.priceRow}>
            <Text style={[s.priceLabel, { color: colors.textSecondary }]}>مبلغ کل خدمت</Text>
            <Text style={[s.priceValue, { color: colors.textMain }]}>{formatPrice(appointment.price)}</Text>
          </View>
          {appointment.depositPaid > 0 && (
            <View style={[s.priceRow, s.highlightRow]}>
              <View style={s.priceLabelRow}>
                <Icon name="account-balance-wallet" size={14} color="#43A047" />
                <Text style={[s.priceLabelBold, { color: colors.textMain }]}>بیعانه پرداخت شده</Text>
              </View>
              <Text style={[s.priceValueLarge, { color: '#43A047' }]}>{formatPrice(appointment.depositPaid)}</Text>
            </View>
          )}
          <View style={s.priceRow}>
            <Text style={[s.priceLabel, { color: colors.textSecondary }]}>باقیمانده (پرداخت در سالن)</Text>
            <Text style={[s.priceValue, { color: '#2196F3' }]}>
              {formatPrice(appointment.price - (appointment.depositPaid || 0))}
            </Text>
          </View>
          {isDone && appointment.depositPaid > 0 && (
            <View style={[s.settlementBox, { backgroundColor: '#43A04710', borderColor: '#43A04740' }]}>
              <Icon name="check-circle" size={18} color="#43A047" />
              <Text style={[s.settlementText, { color: '#43A047' }]}>بیعانه به حساب شما واریز شد</Text>
            </View>
          )}
        </Card>

        {/* دلیل لغو */}
        {isCancelledBySalon && appointment.cancellationReason && (
          <Card variant="default" padding={14} radius={14} style={[s.detailCard, { borderColor: '#E5393540', backgroundColor: '#E5393508' }]}>
            <View style={s.reasonHeader}>
              <Icon name="info" size={20} color="#E53935" />
              <Text style={[s.reasonTitle, { color: '#E53935' }]}>دلیل لغو نوبت</Text>
            </View>
            <Text style={[s.reasonText, { color: colors.textMain }]}>{appointment.cancellationReason}</Text>
          </Card>
        )}

        {/* راهنما برای رزرو شده */}
        {isReserved && (
          <Card variant="default" padding={14} radius={14} style={[s.detailCard, { borderColor: colors.primary + '40', backgroundColor: colors.primary + '08' }]}>
            <View style={s.helpHeader}>
              <Icon name="lightbulb" size={20} color={colors.primary} />
              <Text style={[s.helpTitle, { color: colors.textMain }]}>راهنمای تکمیل خدمت</Text>
            </View>
            <View style={s.helpSteps}>
              {['خدمت را برای مشتری انجام دهید', 'کد تایید ۶ رقمی مشتری را از او بپرسید', 'کد را وارد کرده و خدمت را تایید کنید تا بیعانه آزاد شود'].map((text, i) => (
                <View key={i} style={s.helpStep}>
                  <View style={[s.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={s.stepNumberText}>{toPersianDigit(i + 1)}</Text>
                  </View>
                  <Text style={[s.stepText, { color: colors.textSecondary }]}>{text}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 20 },
  customerSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  customerName: { fontSize: 17, fontFamily: 'Vazir-Bold', marginTop: 4 },
  phoneBox: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  phoneText: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, marginTop: 4 },
  statusPillText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  detailCard: { marginBottom: 12 },
  cardTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  infoLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoLabelText: { fontSize: 13, fontFamily: 'Vazir' },
  infoValue: { fontSize: 13, fontFamily: 'Vazir-Bold', flex: 1, textAlign: 'left' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  highlightRow: { paddingVertical: 8, marginVertical: 4 },
  priceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceLabel: { fontSize: 13, fontFamily: 'Vazir' },
  priceLabelBold: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  priceValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  priceValueLarge: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  settlementBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  settlementText: { fontSize: 12, fontFamily: 'Vazir-Bold', flex: 1 },
  reasonHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  reasonTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  reasonText: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 22 },
  helpHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  helpTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  helpSteps: { gap: 10 },
  helpStep: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: '#fff', fontSize: 12, fontFamily: 'Vazir-Bold' },
  stepText: { fontSize: 12, fontFamily: 'Vazir', flex: 1, lineHeight: 20 },
});