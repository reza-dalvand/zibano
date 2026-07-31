// src/components/profile/paymentHistory/InvoiceModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import Avatar from '../../common/Avatar';
import Button from '../../common/Button';
import InfoRow from '../../common/InfoRow';
import PriceBreakdown from '../../common/PriceBreakdown';
import { formatPrice } from '../../../utils/numberUtils';
import { APPOINTMENT_STATUS_META } from '../../../constants/meta';
import { useModalBackHandler } from '../../../hooks/useModalBackHandler';

export default function InvoiceModal({ visible, payment, onClose, onShare }) {
  const { colors } = useTheme();
  const { onRequestClose } = useModalBackHandler(visible, onClose);

  if (!payment) return null;

  const aptMeta = APPOINTMENT_STATUS_META[payment.appointmentStatus];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onRequestClose}>
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose}>
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
                  <Text style={[s.subtitle, { color: colors.textSecondary }]}>{payment.refNumber}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[s.closeBtn, { backgroundColor: colors.background }]}
              >
                <Icon name="close" size={20} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.bodyScroll}>
              {/* کسب‌وکار */}
              <View style={[s.bizCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Avatar uri={payment.businessLogo} name={payment.businessName} size="md" />
                <View style={s.bizInfo}>
                  <Text style={[s.bizName, { color: colors.textMain }]}>{payment.businessName}</Text>
                  <Text style={[s.bizService, { color: colors.textSecondary }]}>{payment.serviceName}</Text>
                </View>
              </View>

              {/* اطلاعات نوبت */}
              <View style={s.section}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات نوبت</Text>
                <View style={[s.infoBox, { borderColor: colors.border }]}>
                  <InfoRow 
                    icon="event"
                    label="تاریخ و ساعت"
                    value={`${payment.appointmentDate} - ساعت ${payment.appointmentTime}`}
                  />
                  <InfoRow 
                    icon="person"
                    label="کارمند"
                    value={payment.employeeName}
                  />
                  {aptMeta && (
                    <InfoRow 
                      icon={aptMeta.icon}
                      iconColor={aptMeta.color}
                      label="وضعیت نوبت"
                      value={aptMeta.label}
                      valueColor={aptMeta.color}
                      valueBold
                    />
                  )}
                </View>
              </View>

              {/* جزئیات مالی - استفاده از PriceBreakdown */}
              <View style={s.section}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>جزئیات مالی</Text>
                <PriceBreakdown
                  originalPrice={payment.originalPrice}
                  discountPercent={payment.discountPercent}
                  finalPrice={payment.totalPrice}
                  hasDeposit={payment.depositAmount > 0}
                  depositAmount={payment.depositAmount}
                  showRemaining={payment.remainingAmount > 0}
                  variant="detailed"
                />
                {payment.remainingAmount > 0 && (
                  <View style={[s.remainingBox, { backgroundColor: '#2196F308', borderColor: '#2196F330', marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1 }]}>
                    <InfoRow 
                      icon="store"
                      iconColor="#2196F3"
                      label="باقیمانده (پرداخت در سالن)"
                      value={formatPrice(payment.remainingAmount).replace(' تومان', '') + ' تومان'}
                      valueColor="#2196F3"
                    />
                  </View>
                )}
                <View style={[s.paidBox, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30', marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 1.5 }]}>
                  <InfoRow 
                    icon="payments"
                    iconColor={colors.primary}
                    label="مبلغ پرداختی شما"
                    value={formatPrice(payment.paidAmount).replace(' تومان', '') + ' تومان'}
                    valueColor={colors.primary}
                    valueBold
                  />
                </View>
              </View>

              {/* اطلاعات تراکنش */}
              <View style={s.section}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات تراکنش</Text>
                <View style={[s.infoBox, { borderColor: colors.border }]}>
                  <InfoRow 
                    icon="schedule"
                    label="تاریخ تراکنش"
                    value={`${payment.dayName} ${payment.date} - ${payment.time}`}
                  />
                  <InfoRow 
                    icon="account-balance"
                    label="درگاه پرداخت"
                    value={payment.paymentGateway}
                  />
                  {payment.cardNumber && (
                    <View style={[s.cardBox, { backgroundColor: colors.background, borderColor: colors.border, marginVertical: 8, padding: 12, borderRadius: 12, borderWidth: 1 }]}>
                      <View style={s.cardLabelRow}>
                        <Icon name="credit-card" size={14} color={colors.primary} />
                        <Text style={[s.cardLabel, { color: colors.textSecondary }]}>
                          شماره کارت
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
                  <InfoRow 
                    icon="tag"
                    label="کد پیگیری"
                    value={payment.trackingCode}
                    monospace
                  />
                  <InfoRow 
                    icon="fingerprint"
                    label="شماره ارجاع"
                    value={payment.refNumber}
                    monospace
                  />
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
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', elevation: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  subtitle: { fontSize: 12, fontFamily: 'Vazir', marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  bodyScroll: { padding: 20, gap: 16 },
  bizCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  bizInfo: { flex: 1, gap: 2 },
  bizName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  bizService: { fontSize: 12, fontFamily: 'Vazir' },
  section: { gap: 8 },
  sectionTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  infoBox: { borderWidth: 1, borderRadius: 12, padding: 8, gap: 2 },
  cardBox: {},
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 },
  cardLabel: { fontSize: 12, fontFamily: 'Vazir', flex: 1 },
  cardBankText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  cardValue: { fontSize: 18, fontFamily: 'Vazir-Bold', letterSpacing: 2.5, textAlign: 'center', paddingVertical: 4 },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, gap: 10 },
});