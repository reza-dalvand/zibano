// src/components/profile/paymentHistory/PaymentCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';
import Avatar from '../../common/Avatar';
import StatusBadge from '../../common/StatusBadge';
import InfoRow from '../../common/InfoRow';
import { toPersianDigit, formatPrice } from '../../../utils/numberUtils';
import {
  STATUS_META,
  APPOINTMENT_STATUS_META,
  PAYMENT_METHOD_META,
  PAYMENT_TYPE_META,
} from '../../../constants/meta';

export default function PaymentCard({ payment, onOpenInvoice, onCopyCode }) {
  const { colors } = useTheme();
  
  const statusMeta = STATUS_META[payment.status] || STATUS_META.pending;
  const typeMeta = PAYMENT_TYPE_META[payment.type] || PAYMENT_TYPE_META.deposit;
  const aptMeta = payment.appointmentStatus ? APPOINTMENT_STATUS_META[payment.appointmentStatus] : null;
  const methodMeta = PAYMENT_METHOD_META[payment.paymentMethod] || PAYMENT_METHOD_META.online;
  
  const isSuccess = payment.status === 'success' || payment.status === 'refunded';

  const handleCopyTracking = () => {
    if (payment.trackingCode) {
      Clipboard.setString(payment.trackingCode);
      onCopyCode?.(payment.trackingCode);
    }
  };

  return (
    <Card variant="elevated" padding={0} radius={20} style={s.payCard}>
      {/* هدر */}
      <View style={[s.payHeader, { borderBottomColor: colors.border }]}>
        <View style={s.payHeaderRow}>
          <Avatar uri={payment.businessLogo} name={payment.businessName} size="md" />
          <View style={s.payHeaderInfo}>
            <Text style={[s.payBusinessName, { color: colors.textMain }]} numberOfLines={1}>
              {payment.businessName}
            </Text>
            <Text style={[s.payServiceName, { color: colors.textSecondary }]} numberOfLines={1}>
              {payment.serviceName}
            </Text>
          </View>
        </View>
        <StatusBadge meta={statusMeta} size="md" />
      </View>

      {/* متا */}
      <View style={[s.metaRow, { borderBottomColor: colors.border }]}>
        <View style={[s.typeBadge, { backgroundColor: typeMeta.color + '18' }]}>
          <Icon name={typeMeta.icon} size={12} color={typeMeta.color} />
          <Text style={[s.typeBadgeText, { color: typeMeta.color }]}>
            {typeMeta.label}
          </Text>
        </View>
        <View style={s.dateTimeRow}>
          <Icon name="event" size={13} color={colors.textSecondary} />
          <Text style={[s.dateTimeText, { color: colors.textMain }]}>
            {payment.dayName} {payment.date}
          </Text>
          <View style={[s.dot, { backgroundColor: colors.border }]} />
          <Icon name="schedule" size={13} color={colors.textSecondary} />
          <Text style={[s.dateTimeText, { color: colors.textMain }]}>
            {payment.time}
          </Text>
        </View>
      </View>

      {/* اطلاعات نوبت */}
      {payment.appointmentDate && aptMeta && (
        <View style={[s.aptInfoBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <InfoRow 
            icon="event-available"
            label="نوبت:"
            value={`${payment.appointmentDate} - ساعت ${payment.appointmentTime}`}
          />
          <InfoRow 
            icon="person"
            label="کارمند:"
            value={payment.employeeName}
          />
          <InfoRow 
            icon={aptMeta.icon}
            iconColor={aptMeta.color}
            label="وضعیت نوبت:"
            value={aptMeta.label}
            valueColor={aptMeta.color}
            valueBold
          />
        </View>
      )}

      {/* جزئیات مالی */}
      {isSuccess && (
        <View style={[s.financeBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={s.financeHeader}>
            <Icon name="account-balance" size={16} color={colors.primary} />
            <Text style={[s.financeHeaderTitle, { color: colors.primary }]}>
              جزئیات مالی
            </Text>
          </View>

          <InfoRow 
            icon="receipt-long"
            label="مبلغ کل خدمت"
            value={formatPrice(payment.originalPrice).replace(' تومان', '')}
          />

          {payment.discountPercent > 0 && (
            <InfoRow 
              icon="local-offer"
              iconColor="#43A047"
              label={`تخفیف (${toPersianDigit(payment.discountPercent)}٪)`}
              value={`- ${formatPrice(payment.discountAmount).replace(' تومان', '')}`}
              valueColor="#43A047"
            />
          )}

          <InfoRow 
            icon="calculate"
            label="مبلغ نهایی خدمت"
            value={formatPrice(payment.totalPrice).replace(' تومان', '')}
            valueBold
            showDivider
          />

          <View style={[s.highlightRow, { backgroundColor: colors.primary + '08', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 8, marginTop: 4 }]}>
            <InfoRow 
              icon="payments"
              iconColor={colors.primary}
              label="مبلغ پرداختی شما"
              value={formatPrice(payment.paidAmount).replace(' تومان', '')}
              valueColor={colors.primary}
              valueBold
            />
          </View>

          {payment.depositAmount > 0 && payment.type === 'deposit' && (
            <InfoRow 
              icon="account-balance-wallet"
              iconColor="#FF9800"
              label="مبلغ بیعانه"
              value={formatPrice(payment.depositAmount).replace(' تومان', '')}
              valueColor="#FF9800"
            />
          )}

          {payment.remainingAmount > 0 && (
            <InfoRow 
              icon="store"
              iconColor="#2196F3"
              label="پرداخت در سالن"
              value={formatPrice(payment.remainingAmount).replace(' تومان', '')}
              valueColor="#2196F3"
            />
          )}

          {payment.refundAmount > 0 && (
            <InfoRow 
              icon="undo"
              iconColor="#1E88E5"
              label="مبلغ مسترد شده"
              value={`+ ${formatPrice(payment.refundAmount).replace(' تومان', '')}`}
              valueColor="#1E88E5"
            />
          )}
        </View>
      )}

      {/* اطلاعات پرداخت */}
      <View style={[s.paymentInfoBox, { borderBottomColor: colors.border }]}>
        <View style={s.paymentInfoRow}>
          <View style={s.paymentInfoItem}>
            <Icon name={methodMeta.icon} size={14} color={methodMeta.color} />
            <View>
              <Text style={[s.paymentInfoLabel, { color: colors.textSecondary }]}>
                روش پرداخت
              </Text>
              <Text style={[s.paymentInfoValue, { color: colors.textMain }]}>
                {methodMeta.label}
              </Text>
            </View>
          </View>
          {payment.paymentGateway && isSuccess && (
            <View style={s.paymentInfoItem}>
              <Icon name="account-balance" size={14} color={colors.textSecondary} />
              <View>
                <Text style={[s.paymentInfoLabel, { color: colors.textSecondary }]}>
                  درگاه
                </Text>
                <Text style={[s.paymentInfoValue, { color: colors.textMain }]} numberOfLines={1}>
                  {payment.paymentGateway}
                </Text>
              </View>
            </View>
          )}
        </View>

        {payment.cardNumber && (
          <View style={[s.cardNumberBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={s.cardNumberLabelRow}>
              <Icon name="credit-card" size={14} color={colors.primary} />
              <Text style={[s.cardNumberLabel, { color: colors.textSecondary }]}>
                شماره کارت
              </Text>
              {payment.cardBank && (
                <View style={[s.cardBankBadge, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
                  <Text style={[s.cardBankText, { color: colors.primary }]}>{payment.cardBank}</Text>
                </View>
              )}
            </View>
            <Text style={[s.cardNumberValue, { color: colors.textMain }]} selectable numberOfLines={1}>
              {payment.cardNumber}
            </Text>
          </View>
        )}
      </View>

      {/* کدهای پیگیری */}
      <View style={[s.trackingBox, { borderBottomColor: colors.border }]}>
        <View style={s.trackingRow}>
          <View style={s.trackingLabelRow}>
            <Icon name="tag" size={14} color={colors.textSecondary} />
            <Text style={[s.trackingLabel, { color: colors.textSecondary }]}>کد پیگیری</Text>
          </View>
          <View style={s.trackingValueRow}>
            <Text style={[s.trackingValue, { color: colors.textMain }]} selectable>
              {payment.trackingCode}
            </Text>
            <TouchableOpacity onPress={handleCopyTracking} style={[s.copyBtn, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="content-copy" size={12} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <InfoRow 
          icon="fingerprint"
          label="شماره ارجاع"
          value={payment.refNumber}
        />

        {payment.verificationCode && isSuccess && (
          <View style={[s.trackingRow, { paddingTop: 8, marginTop: 4, borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={s.trackingLabelRow}>
              <Icon name="verified-user" size={14} color={colors.primary} />
              <Text style={[s.trackingLabel, { color: colors.primary, fontFamily: 'Vazir-Bold' }]}>
                کد تایید نوبت
              </Text>
            </View>
            <View style={[s.verificationCodeBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
              <Text style={[s.verificationCodeText, { color: colors.primary }]}>
                {payment.verificationCode}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* فوتر */}
      {isSuccess && (
        <View style={[s.payFooter, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            onPress={() => onOpenInvoice(payment)}
            style={[s.invoiceBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Icon name="receipt-long" size={16} color="#fff" />
            <Text style={[s.invoiceBtnText, { color: '#fff' }]}>مشاهده فاکتور کامل</Text>
            <Icon name="arrow-back" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  payCard: { marginBottom: 0, overflow: 'hidden' },
  payHeader: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, gap: 8 },
  payHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  payHeaderInfo: { flex: 1, gap: 2 },
  payBusinessName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  payServiceName: { fontSize: 12, fontFamily: 'Vazir' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  typeBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  dateTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateTimeText: { fontSize: 11, fontFamily: 'Vazir' },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: 2 },
  aptInfoBox: { margin: 12, marginTop: 0, padding: 12, borderRadius: 14, borderWidth: 1, gap: 4 },
  financeBox: { margin: 12, marginTop: 12, padding: 14, borderRadius: 14, borderWidth: 1, gap: 6 },
  financeHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#00000010' },
  financeHeaderTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  highlightRow: {},
  paymentInfoBox: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, gap: 8 },
  paymentInfoRow: { flexDirection: 'row', gap: 16 },
  paymentInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  paymentInfoLabel: { fontSize: 10, fontFamily: 'Vazir' },
  paymentInfoValue: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  cardNumberBox: { marginTop: 10, padding: 12, borderRadius: 14, borderWidth: 1, gap: 8 },
  cardNumberLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardNumberLabel: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  cardBankBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  cardBankText: { fontSize: 10, fontFamily: 'Vazir-Bold' },
  cardNumberValue: { fontSize: 17, fontFamily: 'Vazir-Bold', letterSpacing: 2, textAlign: 'center', paddingVertical: 4 },
  trackingBox: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, gap: 4 },
  trackingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  trackingLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trackingLabel: { fontSize: 12, fontFamily: 'Vazir' },
  trackingValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trackingValue: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  copyBtn: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  verificationCodeBox: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  verificationCodeText: { fontSize: 13, fontFamily: 'Vazir-Bold', letterSpacing: 2 },
  payFooter: { paddingHorizontal: 14, paddingVertical: 12 },
  invoiceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 14, elevation: 2 },
  invoiceBtnText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
});