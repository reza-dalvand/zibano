// src/components/manageBusiness/AppointmentDetailSheet.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import BottomSheet from '../common/BottomSheet';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import InfoRow from '../common/InfoRow';
import { toPersianDigit, formatPrice } from '../../utils/numberUtils';
import { APPOINTMENT_STATUS_META } from '../../constants/meta';

export default function AppointmentDetailSheet({ visible, appointment, onClose }) {
  const { colors } = useTheme();
  if (!appointment) return null;
  const meta = APPOINTMENT_STATUS_META[appointment.status] || APPOINTMENT_STATUS_META.reserved;
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
          <StatusBadge meta={meta} size="lg" />
        </View>

        {/* جزئیات نوبت */}
        <Card variant="default" padding={14} radius={14} style={s.detailCard}>
          <Text style={[s.cardTitle, { color: colors.textMain }]}>جزئیات نوبت</Text>
          <InfoRow icon="spa" label="خدمت" value={appointment.serviceName} />
          <InfoRow icon="person" label="کارمند" value={appointment.employeeName} />
          <InfoRow icon="event" label="تاریخ" value={dateStr} />
          <InfoRow icon="schedule" label="ساعت" value={appointment.time} />
          <InfoRow icon="phone" label="شماره تماس" value={toPersianDigit(appointment.customerPhone || '—')} monospace />
        </Card>

        {/* مالی */}
        <Card variant="default" padding={14} radius={14} style={s.detailCard}>
          <Text style={[s.cardTitle, { color: colors.textMain }]}>جزئیات مالی</Text>
          <InfoRow icon="receipt-long" label="مبلغ کل خدمت" value={formatPrice(appointment.price)} />
          {appointment.depositPaid > 0 && (
            <InfoRow 
              icon="account-balance-wallet"
              iconColor="#43A047"
              label="بیعانه پرداخت شده"
              value={formatPrice(appointment.depositPaid)}
              valueColor="#43A047"
              valueBold
              highlight
            />
          )}
          <InfoRow 
            icon="store"
            iconColor="#2196F3"
            label="باقیمانده (پرداخت در سالن)"
            value={formatPrice(appointment.price - (appointment.depositPaid || 0))}
            valueColor="#2196F3"
          />
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

        {/* راهنما */}
        {isReserved && (
          <Card variant="default" padding={14} radius={14} style={[s.detailCard, { borderColor: colors.primary + '40', backgroundColor: colors.primary + '08' }]}>
            <View style={s.helpHeader}>
              <Icon name="lightbulb" size={20} color={colors.primary} />
              <Text style={[s.helpTitle, { color: colors.textMain }]}>راهنمای تکمیل خدمت</Text>
            </View>
            <View style={s.helpSteps}>
              {[
                'خدمت را برای مشتری انجام دهید',
                'کد تایید ۴ رقمی مشتری را از او بپرسید',
                'کد را وارد کرده و خدمت را تایید کنید تا بیعانه آزاد شود',
              ].map((text, i) => (
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
  detailCard: { marginBottom: 12 },
  cardTitle: { fontSize: 14, fontFamily: 'Vazir-Bold', marginBottom: 8 },
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