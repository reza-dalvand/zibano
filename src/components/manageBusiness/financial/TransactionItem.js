// src/components/manageBusiness/financial/TransactionItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Card from '../../common/Card';
import StatusBadge from '../../common/StatusBadge';
import InfoRow from '../../common/InfoRow';
import { useTheme } from '../../../stores/useThemeStore';
import { TX_STATUS_META, formatPrice, toPersianDigit } from './constants';

export default function TransactionItem({ tx, onPress }) {
  const { colors } = useTheme();
  const meta = TX_STATUS_META[tx.status];

  const handleCopy = (val, label) => {
    Clipboard.setString(val);
    Alert.alert('کپی شد', `${label} در کلیپ‌بورد کپی شد`);
  };

  const getSignAndColor = () => {
    if (tx.status === 'refunded') return { value: tx.amount, color: '#E53935' };
    if (tx.type === 'settlement' && tx.status === 'settled') return { value: tx.amount, color: '#43A047' };
    return { value: tx.amount, color: meta.color };
  };

  const { value, color: amtColor } = getSignAndColor();
  const mainTitle = (tx.type === 'deposit' || tx.type === 'refund') ? tx.customerName : (tx.title || 'تراکنش');

  return (
    <TouchableOpacity onPress={() => onPress?.(tx)} activeOpacity={0.82}>
      <Card variant="elevated" padding={0} radius={18} style={s.card}>
        {/* هدر */}
        <View style={s.header}>
          <View style={[s.iconBox, { backgroundColor: meta.bg }]}>
            <Icon name={meta.icon} size={22} color={meta.color} />
          </View>
          <View style={s.titleCol}>
            <Text style={[s.title, { color: colors.textMain }]} numberOfLines={1}>{mainTitle}</Text>
            {tx.serviceName && (
              <Text style={[s.serviceName, { color: colors.textSecondary }]} numberOfLines={1}>
                {tx.serviceName}
              </Text>
            )}
          </View>
          <View style={s.amountBox}>
            <Text style={[s.amount, { color: amtColor }]}>{formatPrice(value)}</Text>
            <StatusBadge meta={meta} size="sm" />
          </View>
        </View>

        {/* توضیح */}
        {tx.type !== 'settlement' && (
          <View style={s.descriptionBox}>
            <Text style={[s.desc, { color: colors.textSecondary }]}>{meta.description}</Text>
          </View>
        )}

        {/* جزئیات */}
        <View style={[s.detailsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {tx.type === 'deposit' && tx.appointmentDate && (
            <InfoRow 
              icon="event"
              label="تاریخ نوبت:"
              value={`${tx.appointmentDate} • ${tx.appointmentTime}`}
            />
          )}
          {tx.type === 'settlement' && tx.status === 'settled' && (
            <>
              <InfoRow 
                icon="schedule"
                label="تسویه در:"
                value={tx.settledAt}
                valueColor="#43A047"
                valueBold
              />
              {tx.destinationBank && (
                <InfoRow icon="store" label="مقصد:" value={`حساب تایید شده • ${tx.destinationBank}`} />
              )}
            </>
          )}
          {tx.type === 'refund' && (
            <>
              <InfoRow icon="schedule" label="تاریخ استرداد:" value={tx.createdAt} />
              {tx.reason && (
                <InfoRow icon="info" label="دلیل:" value={tx.reason} warn />
              )}
            </>
          )}
          {tx.status === 'settling' && tx.estimatedSettlement && (
            <InfoRow 
              icon="sync"
              label="تخمین واریز:"
              value={tx.estimatedSettlement}
              valueColor="#2196F3"
              valueBold
              highlight
            />
          )}
          {tx.status === 'blocked' && tx.createdAt && (
            <InfoRow icon="schedule" label="پرداخت در:" value={tx.createdAt} />
          )}

          {/* کد پیگیری */}
          {tx.trackingCode && (
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); handleCopy(tx.trackingCode, 'کد پیگیری'); }}
              style={s.codeRow}
              activeOpacity={0.7}
            >
              <View style={s.codeLabelRow}>
                <Icon name="tag" size={14} color={colors.textSecondary} />
                <Text style={[s.codeLabelText, { color: colors.textSecondary }]}>کد پیگیری</Text>
              </View>
              <View style={s.codeValueRow}>
                <Text style={[s.codeText, { color: colors.textMain }]}>
                  {toPersianDigit(tx.trackingCode)}
                </Text>
                <Icon name="content-copy" size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { marginBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  titleCol: { flex: 1, gap: 3 },
  title: { fontSize: 13.5, fontFamily: 'Vazir-Bold' },
  serviceName: { fontSize: 11, fontFamily: 'Vazir' },
  amountBox: { alignItems: 'flex-end', gap: 5 },
  amount: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  descriptionBox: { paddingHorizontal: 12, paddingBottom: 10 },
  desc: { fontSize: 10.5, fontFamily: 'Vazir', lineHeight: 16 },
  detailsBox: { borderTopWidth: 1, paddingVertical: 6, paddingHorizontal: 12, gap: 2 },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5, gap: 10 },
  codeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  codeLabelText: { fontSize: 10, fontFamily: 'Vazir' },
  codeValueRow: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(168,139,125,0.08)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  codeText: { fontSize: 11, fontFamily: 'Vazir-Bold', letterSpacing: 1.5 },
});