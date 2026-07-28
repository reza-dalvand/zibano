// src/components/manageBusiness/AppointmentCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import InfoRow from '../common/InfoRow';
import { toPersianDigit, formatPrice } from '../../utils/numberUtils';
import { APPOINTMENT_STATUS_META } from '../../constants/meta';

export default function AppointmentCard({
  appointment,
  onDetails,
  onVerify,
  onCancel,
}) {
  const { colors } = useTheme();
  const meta = APPOINTMENT_STATUS_META[appointment.status] || APPOINTMENT_STATUS_META.reserved;
  const isReserved = appointment.status === 'reserved';
  const isCancelledBySalon = appointment.status === 'cancelled_by_salon';
  const isDone = appointment.status === 'done';
  const dateStr = appointment.date
    ? `${toPersianDigit(appointment.date.jy)}/${toPersianDigit(appointment.date.jm)}/${toPersianDigit(appointment.date.jd)}`
    : '—';

  return (
    <Card variant="elevated" padding={0} radius={18} style={s.card}>
      {/* 🔝 هدر */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onDetails?.(appointment)}
        style={[s.header, { paddingHorizontal: 14, paddingVertical: 12, borderBottomColor: colors.border }]}
      >
        <View style={s.customerRow}>
          <Avatar name={appointment.customerName} size="md" />
          <View style={s.customerInfo}>
            <Text style={[s.customerName, { color: colors.textMain }]}>
              {appointment.customerName}
            </Text>
            <InfoRow 
              icon="phone"
              value={toPersianDigit(appointment.customerPhone || '—')}
              label=""
            />
          </View>
        </View>
        <StatusBadge meta={meta} size="md" />
      </TouchableOpacity>

      {/* 📋 خدمت */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onDetails?.(appointment)}
        style={[s.serviceBox, { paddingHorizontal: 14, paddingVertical: 10 }]}
      >
        <InfoRow icon="spa" label="خدمت:" value={appointment.serviceName} />
        <InfoRow icon="person" label="کارمند:" value={appointment.employeeName} />
      </TouchableOpacity>

      {/* 🕐 تاریخ و مبلغ */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onDetails?.(appointment)}
        style={[s.footer, { paddingHorizontal: 14, paddingVertical: 12, borderTopColor: colors.border, backgroundColor: colors.background + '40' }]}
      >
        <View style={s.timeBox}>
          <View style={s.timeRow}>
            <Icon name="event" size={14} color={colors.primary} />
            <Text style={[s.timeText, { color: colors.primary }]}>{dateStr}</Text>
          </View>
          <View style={[s.dot, { backgroundColor: colors.border }]} />
          <View style={s.timeRow}>
            <Icon name="schedule" size={14} color={colors.primary} />
            <Text style={[s.timeText, { color: colors.primary }]}>{appointment.time}</Text>
          </View>
        </View>
        <View style={s.priceCol}>
          {isReserved && appointment.depositPaid > 0 && (
            <View style={s.depositRow}>
              <Text style={[s.depositLabel, { color: colors.textSecondary }]}>بیعانه:</Text>
              <Text style={[s.depositValue, { color: '#43A047' }]}>
                {formatPrice(appointment.depositPaid)}
              </Text>
            </View>
          )}
          <Text style={[s.totalPrice, { color: colors.textMain }]}>
            {formatPrice(appointment.price)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* پیام‌ها */}
      {isCancelledBySalon && appointment.cancellationReason && (
        <View style={[s.hintBox, { backgroundColor: '#E5393510', borderTopColor: colors.border }]}>
          <Icon name="info-outline" size={14} color="#E53935" />
          <Text style={[s.hintText, { color: '#E53935' }]} numberOfLines={2}>
            {appointment.cancellationReason}
          </Text>
        </View>
      )}
      {isDone && (
        <View style={[s.hintBox, { backgroundColor: '#43A04710', borderTopColor: colors.border }]}>
          <Icon name="verified-user" size={14} color="#43A047" />
          <Text style={[s.hintText, { color: '#43A047' }]}>خدمت انجام شد • بیعانه آزاد شد</Text>
        </View>
      )}
      {isDone && appointment.verificationCode && (
        <View style={[s.verifiedCodeBox, { borderTopColor: colors.border, backgroundColor: '#43A04708' }]}>
          <Icon name="key" size={14} color="#43A047" />
          <Text style={[s.verifiedCodeLabel, { color: colors.textSecondary }]}>کد تایید وارد شده:</Text>
          <Text style={[s.verifiedCodeValue, { color: '#43A047' }]}>
            {toPersianDigit(appointment.verificationCode)}
          </Text>
        </View>
      )}

      {/* 🎯 دکمه‌های اکشن */}
      {isReserved && (
        <View style={[s.actionsContainer, { borderTopColor: colors.border, backgroundColor: colors.background + '60' }]}>
          <View style={s.topActionsRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onCancel?.(appointment)}
              style={[s.actionBtn, { borderColor: '#E5393540', backgroundColor: '#E5393508' }]}
            >
              <Icon name="cancel" size={16} color="#E53935" />
              <Text style={[s.actionBtnText, { color: '#E53935' }]}>لغو نوبت</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onDetails?.(appointment)}
              style={[s.actionBtn, { borderColor: colors.primary + '40', backgroundColor: colors.primary + '08' }]}
            >
              <Icon name="info-outline" size={16} color={colors.primary} />
              <Text style={[s.actionBtnText, { color: colors.primary }]}>جزئیات نوبت</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onVerify?.(appointment)}
            style={[s.verifyBtn, { backgroundColor: '#43A047' }]}
          >
            <Icon name="verified-user" size={18} color="#fff" />
            <View style={s.verifyTextCol}>
              <Text style={[s.verifyBtnTitle, { color: '#fff' }]}>تایید انجام خدمت</Text>
              <Text style={[s.verifyBtnSubtitle, { color: '#ffffffcc' }]}>وارد کردن کد ۴ رقمی مشتری</Text>
            </View>
            <Icon name="chevron-left" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  card: { marginBottom: 0, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, gap: 10 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  customerInfo: { flex: 1, gap: 3 },
  customerName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  serviceBox: { gap: 6, paddingHorizontal: 14, paddingVertical: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  timeBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  dot: { width: 3, height: 3, borderRadius: 1.5 },
  priceCol: { alignItems: 'flex-end', gap: 2 },
  depositRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  depositLabel: { fontSize: 10, fontFamily: 'Vazir' },
  depositValue: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  totalPrice: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  hintBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  hintText: { fontSize: 11, fontFamily: 'Vazir', flex: 1, lineHeight: 17 },
  verifiedCodeBox: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  verifiedCodeLabel: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  verifiedCodeValue: { fontSize: 13, fontFamily: 'Vazir-Bold', letterSpacing: 2 },
  actionsContainer: { paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, gap: 8 },
  topActionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  verifyBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12 },
  verifyTextCol: { flex: 1, gap: 1 },
  verifyBtnTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  verifyBtnSubtitle: { fontSize: 10, fontFamily: 'Vazir' },
});