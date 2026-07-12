// یک ردیف تراکنش در تاریخچه
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { Alert } from 'react-native';
import Card from '../../common/Card';
import { useTheme } from '../../../theme/ThemeContext';
import { TX_STATUS_META, formatPrice, toPersianDigit } from './constants';

export default function TransactionItem({ tx, onPress }) {
  const { colors } = useTheme();
  const meta = TX_STATUS_META[tx.status];

  const handleCopy = (val, label) => {
    Clipboard.setString(val);
    Alert.alert('کپی شد', `${label} در کلیپ‌بورد کپی شد`);
  };

  const getSignAndColor = () => {
    if (tx.status === 'refunded') return { sign: '', value: tx.amount, color: '#E53935' };
    if (tx.type === 'settlement' && tx.status === 'settled') {
      return { sign: '', value: tx.amount, color: '#43A047' };
    }
    return { sign: '', value: tx.amount, color: meta.color };
  };
  const { sign, value, color: amtColor } = getSignAndColor();

  const getMainTitle = () => {
    if (tx.type === 'deposit' || tx.type === 'refund') return tx.customerName;
    return tx.title || 'تراکنش';
  };

  return (
    <TouchableOpacity onPress={() => onPress?.(tx)} activeOpacity={0.82}>
      <Card variant="elevated" padding={0} radius={18} style={s.card}>
        {/* هدر تراکنش */}
        <View style={s.header}>
          <View style={[s.iconBox, { backgroundColor: meta.bg }]}>
            <Icon name={meta.icon} size={22} color={meta.color} />
          </View>
          <View style={s.titleCol}>
            <Text style={[s.title, { color: colors.textMain }]} numberOfLines={1}>
              {getMainTitle()}
            </Text>
            {tx.serviceName && (
              <Text style={[s.serviceName, { color: colors.textSecondary }]} numberOfLines={1}>
                {tx.serviceName}
              </Text>
            )}
          </View>
          <View style={s.amountBox}>
            <Text style={[s.amount, { color: amtColor }]}>
              {formatPrice(value)}
            </Text>
            <View style={[s.statusBadge, { backgroundColor: meta.bg }]}>
              <Icon name={meta.icon} size={10} color={meta.color} />
              <Text style={[s.statusText, { color: meta.color }]}>{meta.shortLabel}</Text>
            </View>
          </View>
        </View>

        {/* توضیح کوتاه */}
        {tx.type !== 'settlement' && (
          <View style={s.descriptionBox}>
            <Text style={[s.desc, { color: colors.textSecondary }]}>
              {meta.description}
            </Text>
          </View>
        )}

        {/* ردیف‌های جزئیات */}
        <View style={[s.detailsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {tx.type === 'deposit' && tx.appointmentDate && (
            <View style={s.detailRow}>
              <Icon name="event" size={14} color={colors.textSecondary} />
              <Text style={[s.detailLabel, { color: colors.textSecondary }]}>تاریخ نوبت:</Text>
              <Text style={[s.detailValue, { color: colors.textMain }]}>
                {tx.appointmentDate} • {tx.appointmentTime}
              </Text>
            </View>
          )}
          {tx.type === 'settlement' && tx.status === 'settled' && (
            <>
              <View style={s.detailRow}>
                <Icon name="schedule" size={14} color={colors.textSecondary} />
                <Text style={[s.detailLabel, { color: colors.textSecondary }]}>تسویه در:</Text>
                <Text style={[s.detailValue, { color: '#43A047', fontFamily: 'Vazir-Bold' }]}>
                  {tx.settledAt}
                </Text>
              </View>
              {tx.destinationBank && (
                <View style={s.detailRow}>
                  <Icon name="store" size={14} color={colors.textSecondary} />
                  <Text style={[s.detailLabel, { color: colors.textSecondary }]}>مقصد:</Text>
                  <Text style={[s.detailValue, { color: colors.textMain }]}>
                    حساب تایید شده • {tx.destinationBank}
                  </Text>
                </View>
              )}
            </>
          )}
          {tx.type === 'refund' && (
            <>
              <View style={s.detailRow}>
                <Icon name="schedule" size={14} color={colors.textSecondary} />
                <Text style={[s.detailLabel, { color: colors.textSecondary }]}>تاریخ استرداد:</Text>
                <Text style={[s.detailValue, { color: colors.textMain }]}>{tx.createdAt}</Text>
              </View>
              {tx.reason && (
                <View style={s.detailRow}>
                  <Icon name="info" size={14} color="#E53935" />
                  <Text style={[s.detailLabel, { color: '#E53935' }]}>دلیل:</Text>
                  <Text style={[s.detailValue, { color: '#E53935', fontFamily: 'Vazir-Bold' }]}>
                    {tx.reason}
                  </Text>
                </View>
              )}
            </>
          )}
          {tx.status === 'settling' && tx.estimatedSettlement && (
            <View style={[s.detailRow, s.highlight]}>
              <Icon name="sync" size={14} color="#2196F3" />
              <Text style={[s.detailLabel, { color: '#2196F3', fontFamily: 'Vazir-Bold' }]}>
                تخمین واریز:
              </Text>
              <Text style={[s.detailValue, { color: '#2196F3', fontFamily: 'Vazir-Bold' }]}>
                {tx.estimatedSettlement}
              </Text>
            </View>
          )}
          {tx.status === 'blocked' && tx.createdAt && (
            <View style={s.detailRow}>
              <Icon name="schedule" size={14} color={colors.textSecondary} />
              <Text style={[s.detailLabel, { color: colors.textSecondary }]}>پرداخت در:</Text>
              <Text style={[s.detailValue, { color: colors.textMain }]}>{tx.createdAt}</Text>
            </View>
          )}

          {/* رد کد پیگیری */}
          {tx.trackingCode && (
            <>
              <View style={[s.divider, { backgroundColor: colors.border }]} />
              <TouchableOpacity
                onPress={(e) => { e.stopPropagation(); handleCopy(tx.trackingCode, 'کد پیگیری'); }}
                style={s.codeRow}
                activeOpacity={0.7}
              >
                <View style={s.codeLabelRow}>
                  <Icon name="tag" size={14} color={colors.textSecondary} />
                  <Text style={[s.codeLabelText, { color: colors.textSecondary }]}>
                    کد پیگیری
                  </Text>
                </View>
                <View style={s.codeValueRow}>
                  <Text style={[s.codeText, { color: colors.textMain }]}>
                    {toPersianDigit(tx.trackingCode)}
                  </Text>
                  <Icon name="content-copy" size={14} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 13.5,
    fontFamily: 'Vazir-Bold',
  },
  serviceName: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  amountBox: {
    alignItems: 'flex-end',
    gap: 5,
  },
  amount: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  descriptionBox: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  desc: {
    fontSize: 10.5,
    fontFamily: 'Vazir',
    lineHeight: 16,
  },
  detailsBox: {
    borderTopWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlight: {
    backgroundColor: '#2196F310',
    marginVertical: 3,
    padding: 6,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  detailValue: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    flex: 1,
    textAlign: 'left',
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    gap: 10,
  },
  codeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  codeLabelText: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  codeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(168,139,125,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    letterSpacing: 1.5,
  },
});