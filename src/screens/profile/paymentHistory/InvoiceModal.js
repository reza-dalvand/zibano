// src/screens/profile/paymentHistory/InvoiceModal.js
import React from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Avatar from '../../../components/common/Avatar';
import Button from '../../../components/common/Button';
import { toPersianDigit, formatPrice } from './helpers';
import { APPOINTMENT_STATUS_META } from './constants';

export default function InvoiceModal({ visible, payment, onClose, onShare }) {
  const { colors } = useTheme();

  if (!payment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={s.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={s.spacer} />
        <TouchableOpacity activeOpacity={1}>
          <View style={[s.modal, { backgroundColor: colors.cardBackground }]}>
            {/* هدر */}
            <View style={s.header}>
              <View style={s.headerInfo}>
                <View style={[s.iconBox, { backgroundColor: colors.primary + '20' }]}>
                  <Icon name="receipt-long" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={[s.title, { color: colors.textMain }]}>فاکتور پرداخت</Text>
                  <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                    {payment.refNumber}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[s.closeBtn, { backgroundColor: colors.background }]}
              >
                <Icon name="close" size={20} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            {/* محتوا */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.bodyScroll}>
              {/* کسب‌وکار */}
              <View style={[s.bizCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Avatar uri={payment.businessLogo} name={payment.businessName} size="md" />
                <View style={s.bizInfo}>
                  <Text style={[s.bizName, { color: colors.textMain }]}>
                    {payment.businessName}
                  </Text>
                  <Text style={[s.bizService, { color: colors.textSecondary }]}>
                    {payment.serviceName}
                  </Text>
                </View>
              </View>

              {/* اطلاعات نوبت */}
              <View style={s.section}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات نوبت</Text>
                <View style={[s.infoBox, { borderColor: colors.border }]}>
                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>تاریخ و ساعت نوبت</Text>
                    <Text style={[s.infoValue, { color: colors.textMain }]}>
                      {payment.appointmentDate} - ساعت {payment.appointmentTime}
                    </Text>
                  </View>
                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>کارمند</Text>
                    <Text style={[s.infoValue, { color: colors.textMain }]}>
                      {payment.employeeName}
                    </Text>
                  </View>
                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>وضعیت نوبت</Text>
                    <Text
                      style={[
                        s.infoValue,
                        { color: APPOINTMENT_STATUS_META[payment.appointmentStatus]?.color },
                      ]}
                    >
                      {APPOINTMENT_STATUS_META[payment.appointmentStatus]?.label}
                    </Text>
                  </View>
                </View>
              </View>

              {/* جزئیات مالی */}
              <View style={s.section}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>جزئیات مالی</Text>
                <View style={[s.infoBox, { borderColor: colors.border }]}>
                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>مبلغ کل خدمت</Text>
                    <Text style={[s.infoValue, { color: colors.textMain }]}>
                      {formatPrice(payment.originalPrice)}
                    </Text>
                  </View>
                  {payment.discountPercent > 0 && (
                    <View style={s.infoRow}>
                      <Text style={[s.infoLabel, { color: colors.textSecondary }]}>
                        تخفیف ({toPersianDigit(payment.discountPercent)}٪)
                      </Text>
                      <Text style={[s.infoValue, { color: '#43A047' }]}>
                        - {formatPrice(payment.discountAmount)}
                      </Text>
                    </View>
                  )}
                  <View style={s.infoRow}>
                    <Text
                      style={[
                        s.infoLabel,
                        { color: colors.textSecondary, fontFamily: 'Vazir-Bold' },
                      ]}
                    >
                      مبلغ نهایی خدمت
                    </Text>
                    <Text
                      style={[
                        s.infoValue,
                        { color: colors.textMain, fontFamily: 'Vazir-Bold' },
                      ]}
                    >
                      {formatPrice(payment.totalPrice)}
                    </Text>
                  </View>
                  <View style={[s.divider, { backgroundColor: colors.border }]} />
                  <View style={s.infoRow}>
                    <Text
                      style={[s.infoLabel, { color: colors.primary, fontFamily: 'Vazir-Bold' }]}
                    >
                      پرداختی شما
                    </Text>
                    <Text
                      style={[
                        s.infoValue,
                        { color: colors.primary, fontFamily: 'Vazir-Bold', fontSize: 15 },
                      ]}
                    >
                      {formatPrice(payment.paidAmount)}
                    </Text>
                  </View>
                  {payment.remainingAmount > 0 && (
                    <View style={s.infoRow}>
                      <Text style={[s.infoLabel, { color: colors.textSecondary }]}>
                        باقیمانده (پرداخت در سالن)
                      </Text>
                      <Text style={[s.infoValue, { color: '#2196F3' }]}>
                        {formatPrice(payment.remainingAmount)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* اطلاعات تراکنش */}
              <View style={s.section}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات تراکنش</Text>
                <View style={[s.infoBox, { borderColor: colors.border }]}>
                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>تاریخ تراکنش</Text>
                    <Text style={[s.infoValue, { color: colors.textMain }]}>
                      {payment.dayName} {payment.date} - {payment.time}
                    </Text>
                  </View>
                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>درگاه پرداخت</Text>
                    <Text style={[s.infoValue, { color: colors.textMain }]}>
                      {payment.paymentGateway}
                    </Text>
                  </View>

                  {payment.cardNumber && (
                    <View
                      style={[
                        s.cardBox,
                        { backgroundColor: colors.background, borderColor: colors.border },
                      ]}
                    >
                      <View style={s.cardLabelRow}>
                        <Icon name="credit-card" size={14} color={colors.primary} />
                        <Text style={[s.cardLabel, { color: colors.textSecondary }]}>
                          شماره کارت پرداخت‌کننده
                        </Text>
                        {payment.cardBank && (
                          <Text style={[s.cardBankText, { color: colors.primary }]}>
                            ({payment.cardBank})
                          </Text>
                        )}
                      </View>
                      <Text style={[s.cardValue, { color: colors.textMain }]} selectable>
                        {payment.cardNumber}
                      </Text>
                    </View>
                  )}

                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>کد پیگیری</Text>
                    <Text style={[s.infoValue, { color: colors.textMain }]} selectable>
                      {payment.trackingCode}
                    </Text>
                  </View>
                  <View style={s.infoRow}>
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>شماره ارجاع</Text>
                    <Text style={[s.infoValue, { color: colors.textMain }]} selectable>
                      {payment.refNumber}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* فوتر */}
            <View style={[s.footer, { borderTopColor: colors.border, backgroundColor: colors.cardBackground }]}>
              <Button
                title="اشتراک‌گذاری فاکتور"
                onPress={onShare}
                variant="primary"
                size="md"
                fullWidth
                icon={<Icon name="share" size={18} color="#fff" />}
                iconPosition="right"
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  spacer: { flex: 1 },
  modal: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  subtitle: { fontSize: 12, fontFamily: 'Vazir', marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  bodyScroll: { padding: 20, gap: 16 },
  bizCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1,
  },
  bizInfo: { flex: 1, gap: 2 },
  bizName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  bizService: { fontSize: 12, fontFamily: 'Vazir' },
  section: { gap: 8 },
  sectionTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  infoBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2,
  },
  infoLabel: { fontSize: 12, fontFamily: 'Vazir', flex: 1 },
  infoValue: { fontSize: 12, fontFamily: 'Vazir-Bold', flex: 1.2, textAlign: 'right' },
  divider: { height: 1, marginVertical: 4 },
  cardBox: { marginVertical: 6, padding: 12, borderRadius: 12, borderWidth: 1, gap: 6 },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardLabel: { fontSize: 12, fontFamily: 'Vazir', flex: 1 },
  cardBankText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  cardValue: {
    fontSize: 18, fontFamily: 'Vazir-Bold', letterSpacing: 2.5,
    textAlign: 'center', paddingVertical: 4,
  },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, gap: 10 },
});