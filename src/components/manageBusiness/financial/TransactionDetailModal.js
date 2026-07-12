// مدال جزئیات تراکنش
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Button from '../../common/Button';
import { formatPrice, TX_STATUS_META } from './constants';

export default function TransactionDetailModal({ visible, onClose, tx }) {
  const { colors } = useTheme();
  if (!tx) return null;
  const meta = TX_STATUS_META[tx.status];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={modalS.backdrop}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={[modalS.modal, { backgroundColor: colors.cardBackground }]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalS.body}
          >
            {/* هدر */}
            <View style={[modalS.header, { backgroundColor: meta.bg }]}>
              <View style={[modalS.iconCircle, { backgroundColor: '#fff' }]}>
                <Icon name={meta.icon} size={26} color={meta.color} />
              </View>
              <Text style={[modalS.statusLabel, { color: meta.color }]}>
                {meta.label}
              </Text>
            </View>

            {/* عنوان اصلی */}
            <View style={modalS.mainTitleBox}>
              {tx.customerName && (
                <Text style={[modalS.mainTitle, { color: colors.textMain }]}>
                  {tx.title || `بیعانه نوبت - ${tx.customerName}`}
                </Text>
              )}
              {!tx.customerName && (
                <Text style={[modalS.mainTitle, { color: colors.textMain }]}>
                  {tx.title || 'تراکنش مالی'}
                </Text>
              )}
              <Text style={[modalS.amountBig, { color: colors.primary }]}>
                {formatPrice(tx.amount)}
              </Text>
            </View>

            {/* ردیف‌های اطلاعات */}
            {[
              tx.customerName && { icon: 'person', label: 'نام مشتری', value: tx.customerName },
              tx.serviceName && { icon: 'spa', label: 'خدمت', value: tx.serviceName },
              tx.appointmentDate && {
                icon: 'event',
                label: 'تاریخ نوبت',
                value: `${tx.appointmentDate} • ${tx.appointmentTime || '—'}`,
              },
              (tx.createdAt || tx.completedAt) && {
                icon: 'schedule',
                label: tx.status === 'settled' ? 'تسویه در' : tx.completedAt ? 'تایید خدمت در' : 'پرداخت در',
                value: tx.settledAt || tx.completedAt || tx.createdAt,
              },
              tx.estimatedSettlement && {
                icon: 'schedule',
                label: 'پیش‌بینی واریز',
                value: tx.estimatedSettlement,
                highlight: true,
              },
              tx.destinationBank && {
                icon: 'account-balance',
                label: 'بانک مقصد',
                value: `حساب تایید شده - ${tx.destinationBank}`,
              },
              tx.reason && {
                icon: 'info-outline',
                label: 'دلیل',
                value: tx.reason,
                warn: true,
              },
              tx.trackingCode && {
                icon: 'tag',
                label: 'کد پیگیری',
                value: tx.trackingCode,
                monospace: true,
              },
            ]
              .filter(Boolean)
              .map((row, i) => (
                <View
                  key={i}
                  style={[
                    modalS.row,
                    { borderBottomColor: colors.border + '50' },
                  ]}
                >
                  <Icon name={row.icon} size={18} color={row.warn ? '#E53935' : colors.textSecondary} />
                  <View style={modalS.rowContent}>
                    <Text style={[modalS.rowLabel, { color: colors.textSecondary }]}>
                      {row.label}
                    </Text>
                    <Text
                      style={[
                        modalS.rowValue,
                        {
                          color: row.highlight
                            ? '#2196F3'
                            : row.warn
                            ? '#E53935'
                            : colors.textMain,
                          fontFamily: row.monospace || row.highlight || row.warn ? 'Vazir-Bold' : 'Vazir-Medium',
                          letterSpacing: row.monospace ? 1 : 0,
                        },
                      ]}
                    >
                      {row.value}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
          <View style={modalS.footer}>
            <Button title="بستن" onPress={onClose} variant="outline" size="lg" fullWidth />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const modalS = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '92%',
    minHeight: 520,
  },
  body: {
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 16,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginTop: 10,
  },
  mainTitleBox: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 0.5,
  },
  mainTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  amountBig: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  rowLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  rowValue: {
    fontSize: 13.5,
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});