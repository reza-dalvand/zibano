// src/screens/profile/paymentHistory/PaymentCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../../components/common/Card';
import Avatar from '../../../components/common/Avatar';
import { toPersianDigit, formatPrice } from './helpers';
import {
  STATUS_META,
  APPOINTMENT_STATUS_META,
  PAYMENT_METHOD_META,
  PAYMENT_TYPE_META,
} from './constants';

export default function PaymentCard({ payment, onOpenInvoice, onCopyCode }) {
  const { colors } = useTheme();

  const statusMeta = STATUS_META[payment.status] || STATUS_META.pending;
  const typeMeta = PAYMENT_TYPE_META[payment.type] || PAYMENT_TYPE_META.deposit;
  const aptMeta = payment.appointmentStatus
    ? APPOINTMENT_STATUS_META[payment.appointmentStatus]
    : null;
  const methodMeta =
    PAYMENT_METHOD_META[payment.paymentMethod] || PAYMENT_METHOD_META.online;
  const isSuccess =
    payment.status === 'success' || payment.status === 'refunded';

  return (
    <Card variant="elevated" padding={0} radius={20} style={s.payCard}>
      {/* 🔝 هدر: کسب‌وکار + Badge وضعیت */}
      <View style={[s.payHeader, { borderBottomColor: colors.border }]}>
        <View style={s.payHeaderRow}>
          <Avatar
            uri={payment.businessLogo}
            name={payment.businessName}
            size="md"
          />
          <View style={s.payHeaderInfo}>
            <Text
              style={[s.payBusinessName, { color: colors.textMain }]}
              numberOfLines={1}
            >
              {payment.businessName}
            </Text>
            <Text
              style={[s.payServiceName, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {payment.serviceName}
            </Text>
          </View>
        </View>
        <View style={[s.statusBadge, { backgroundColor: statusMeta.bg }]}>
          <Icon name={statusMeta.icon} size={12} color={statusMeta.color} />
          <Text style={[s.statusText, { color: statusMeta.color }]}>
            {statusMeta.label}
          </Text>
        </View>
      </View>

      {/* 🏷️ Badge نوع تراکنش + تاریخ و ساعت */}
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

      {/* 📋 اطلاعات نوبت */}
      {payment.appointmentDate && aptMeta && (
        <View
          style={[
            s.aptInfoBox,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View style={s.aptInfoRow}>
            <Icon name="event-available" size={15} color={colors.primary} />
            <Text style={[s.aptInfoLabel, { color: colors.textSecondary }]}>
              نوبت:
            </Text>
            <Text style={[s.aptInfoValue, { color: colors.textMain }]}>
              {payment.appointmentDate} - ساعت {payment.appointmentTime}
            </Text>
          </View>
          <View style={s.aptInfoRow}>
            <Icon name="person" size={15} color={colors.textSecondary} />
            <Text style={[s.aptInfoLabel, { color: colors.textSecondary }]}>
              کارمند:
            </Text>
            <Text style={[s.aptInfoValue, { color: colors.textMain }]}>
              {payment.employeeName}
            </Text>
          </View>
          <View style={s.aptInfoRow}>
            <Icon name={aptMeta.icon} size={15} color={aptMeta.color} />
            <Text style={[s.aptInfoLabel, { color: colors.textSecondary }]}>
              وضعیت نوبت:
            </Text>
            <Text
              style={[
                s.aptInfoValue,
                { color: aptMeta.color, fontFamily: 'Vazir-Bold' },
              ]}
            >
              {aptMeta.label}
            </Text>
          </View>
        </View>
      )}

      {/* 💰 جزئیات مالی - فقط برای تراکنش‌های موفق */}
      {isSuccess && (
        <View
          style={[
            s.financeBox,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <View style={s.financeHeader}>
            <Icon name="account-balance" size={16} color={colors.primary} />
            <Text style={[s.financeHeaderTitle, { color: colors.primary }]}>
              جزئیات مالی
            </Text>
          </View>

          {/* ردیف مبلغ کل خدمت */}
          <View style={s.financeRow}>
            <View style={s.financeLabelRow}>
              <Icon
                name="receipt-long"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={[s.financeLabel, { color: colors.textSecondary }]}>
                مبلغ کل خدمت
              </Text>
            </View>
            <Text style={[s.financeValue, { color: colors.textMain }]}>
              {formatPrice(payment.originalPrice)}
            </Text>
          </View>

          {/* ردیف تخفیف */}
          {payment.discountPercent > 0 && (
            <View style={s.financeRow}>
              <View style={s.financeLabelRow}>
                <Icon name="local-offer" size={14} color="#43A047" />
                <Text style={[s.financeLabel, { color: colors.textSecondary }]}>
                  تخفیف اعمال‌شده
                </Text>
                <View
                  style={[
                    s.discountPercentBadge,
                    { backgroundColor: '#43A04720' },
                  ]}
                >
                  <Text style={[s.discountPercentText, { color: '#43A047' }]}>
                    {toPersianDigit(payment.discountPercent)}٪
                  </Text>
                </View>
              </View>
              <Text style={[s.financeValue, { color: '#43A047' }]}>
                - {formatPrice(payment.discountAmount)}
              </Text>
            </View>
          )}

          {/* ردیف مبلغ نهایی خدمت */}
          <View style={s.financeRow}>
            <View style={s.financeLabelRow}>
              <Icon name="calculate" size={14} color={colors.textSecondary} />
              <Text style={[s.financeLabel, { color: colors.textSecondary }]}>
                مبلغ نهایی خدمت
              </Text>
            </View>
            <Text
              style={[
                s.financeValue,
                { color: colors.textMain, fontFamily: 'Vazir-Bold' },
              ]}
            >
              {formatPrice(payment.totalPrice)}
            </Text>
          </View>

          <View
            style={[s.financeDivider, { backgroundColor: colors.border }]}
          />

          {/* ردیف مبلغ پرداختی شما */}
          <View style={[s.financeRow, s.highlightRow]}>
            <View style={s.financeLabelRow}>
              <View
                style={[
                  s.financeIconCircle,
                  { backgroundColor: colors.primary + '25' },
                ]}
              >
                <Icon name="payments" size={12} color={colors.primary} />
              </View>
              <Text style={[s.financeLabelBold, { color: colors.textMain }]}>
                مبلغ پرداختی شما
              </Text>
            </View>
            <Text style={[s.financeValueLarge, { color: colors.primary }]}>
              {formatPrice(payment.paidAmount)}
            </Text>
          </View>

          {/* ردیف بیعانه */}
          {payment.depositAmount > 0 && payment.type === 'deposit' && (
            <View style={s.financeRow}>
              <View style={s.financeLabelRow}>
                <Icon name="account-balance-wallet" size={14} color="#FF9800" />
                <Text style={[s.financeLabel, { color: colors.textSecondary }]}>
                  مبلغ بیعانه
                </Text>
              </View>
              <Text style={[s.financeValue, { color: '#FF9800' }]}>
                {formatPrice(payment.depositAmount)}
              </Text>
            </View>
          )}

          {/* ردیف پرداخت در سالن */}
          {payment.remainingAmount > 0 && (
            <View style={s.financeRow}>
              <View style={s.financeLabelRow}>
                <Icon name="store" size={14} color="#2196F3" />
                <Text style={[s.financeLabel, { color: colors.textSecondary }]}>
                  پرداخت در سالن
                </Text>
              </View>
              <Text style={[s.financeValue, { color: '#2196F3' }]}>
                {formatPrice(payment.remainingAmount)}
              </Text>
            </View>
          )}

          {/* ردیف استرداد */}
          {payment.refundAmount > 0 && (
            <View style={s.financeRow}>
              <View style={s.financeLabelRow}>
                <Icon name="undo" size={14} color="#1E88E5" />
                <Text style={[s.financeLabel, { color: colors.textSecondary }]}>
                  مبلغ مسترد شده
                </Text>
              </View>
              <Text style={[s.financeValue, { color: '#1E88E5' }]}>
                + {formatPrice(payment.refundAmount)}
              </Text>
            </View>
          )}

          {/* ردیف جریمه لغو */}
          {/* {payment.cancellationFee > 0 && (
            <View style={s.financeRow}>
              <View style={s.financeLabelRow}>
                <Icon name="gavel" size={14} color="#E53935" />
                <Text style={[s.financeLabel, { color: colors.textSecondary }]}>جریمه لغو</Text>
              </View>
              <Text style={[s.financeValue, { color: '#E53935' }]}>
                - {formatPrice(payment.cancellationFee)}
              </Text>
            </View>
          )} */}
        </View>
      )}

      {/* ❌ بخش دلیل خطا کاملاً حذف شد */}

      {/* 💳 اطلاعات پرداخت */}
      <View style={[s.paymentInfoBox, { borderBottomColor: colors.border }]}>
        <View style={s.paymentInfoRow}>
          <View style={s.paymentInfoItem}>
            <Icon name={methodMeta.icon} size={14} color={methodMeta.color} />
            <Text style={[s.paymentInfoLabel, { color: colors.textSecondary }]}>
              روش پرداخت
            </Text>
            <Text style={[s.paymentInfoValue, { color: colors.textMain }]}>
              {methodMeta.label}
            </Text>
          </View>
          {payment.paymentGateway && isSuccess && (
            <View style={s.paymentInfoItem}>
              <Icon
                name="account-balance"
                size={14}
                color={colors.textSecondary}
              />
              <Text
                style={[s.paymentInfoLabel, { color: colors.textSecondary }]}
              >
                درگاه پرداخت
              </Text>
              <Text
                style={[s.paymentInfoValue, { color: colors.textMain }]}
                numberOfLines={1}
              >
                {payment.paymentGateway}
              </Text>
            </View>
          )}
        </View>

        {/* کارت شماره کارت */}
        {payment.cardNumber && (
          <View
            style={[
              s.cardNumberBox,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={s.cardNumberLabelRow}>
              <View
                style={[
                  s.cardIconCircle,
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <Icon name="credit-card" size={14} color={colors.primary} />
              </View>
              <Text
                style={[s.cardNumberLabel, { color: colors.textSecondary }]}
              >
                شماره کارت پرداخت‌کننده
              </Text>
              {payment.cardBank && (
                <View
                  style={[
                    s.cardBankBadge,
                    {
                      backgroundColor: colors.primary + '15',
                      borderColor: colors.primary + '40',
                    },
                  ]}
                >
                  <Text style={[s.cardBankText, { color: colors.primary }]}>
                    {payment.cardBank}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[s.cardNumberValue, { color: colors.textMain }]}
              selectable
              numberOfLines={1}
            >
              {payment.cardNumber}
            </Text>
          </View>
        )}
      </View>

      {/* 🔖 کدهای پیگیری */}
      <View style={[s.trackingBox, { borderBottomColor: colors.border }]}>
        <View style={s.trackingRow}>
          <View style={s.trackingLabelRow}>
            <Icon name="tag" size={14} color={colors.textSecondary} />
            <Text style={[s.trackingLabel, { color: colors.textSecondary }]}>
              کد پیگیری
            </Text>
          </View>
          <View style={s.trackingValueRow}>
            <Text
              style={[s.trackingValue, { color: colors.textMain }]}
              selectable
            >
              {payment.trackingCode}
            </Text>
            <TouchableOpacity
              onPress={() => onCopyCode(payment.trackingCode)}
              style={[s.copyBtn, { backgroundColor: colors.primary + '15' }]}
            >
              <Icon name="content-copy" size={12} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.trackingRow}>
          <View style={s.trackingLabelRow}>
            <Icon name="fingerprint" size={14} color={colors.textSecondary} />
            <Text style={[s.trackingLabel, { color: colors.textSecondary }]}>
              شماره ارجاع
            </Text>
          </View>
          <Text
            style={[s.trackingValue, { color: colors.textMain }]}
            selectable
          >
            {payment.refNumber}
          </Text>
        </View>

        {payment.verificationCode && isSuccess && (
          <View
            style={[
              s.trackingRow,
              {
                paddingTop: 8,
                marginTop: 4,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              },
            ]}
          >
            <View style={s.trackingLabelRow}>
              <Icon name="verified-user" size={14} color={colors.primary} />
              <Text
                style={[
                  s.trackingLabel,
                  { color: colors.primary, fontFamily: 'Vazir-Bold' },
                ]}
              >
                کد تایید نوبت
              </Text>
            </View>
            <View
              style={[
                s.verificationCodeBox,
                {
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary + '40',
                },
              ]}
            >
              <Text style={[s.verificationCodeText, { color: colors.primary }]}>
                {payment.verificationCode}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 🎯 فوتر: فقط دکمه مشاهده فاکتور برای تراکنش‌های موفق */}
      {isSuccess && (
        <View style={[s.payFooter, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            onPress={() => onOpenInvoice(payment)}
            style={[s.invoiceBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Icon name="receipt-long" size={16} color="#fff" />
            <Text style={[s.invoiceBtnText, { color: '#fff' }]}>
              مشاهده فاکتور کامل
            </Text>
            <Icon name="arrow-back" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* ❌ دکمه تلاش مجدد برای تراکنش ناموفق حذف شد */}
    </Card>
  );
}

const s = StyleSheet.create({
  payCard: { marginBottom: 0, overflow: 'hidden' },

  payHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  payHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  payHeaderInfo: { flex: 1, gap: 2 },
  payBusinessName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  payServiceName: { fontSize: 12, fontFamily: 'Vazir' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 11, fontFamily: 'Vazir-Bold' },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  typeBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  dateTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateTimeText: { fontSize: 11, fontFamily: 'Vazir' },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: 2 },

  aptInfoBox: {
    margin: 12,
    marginTop: 0,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  aptInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aptInfoLabel: { fontSize: 12, fontFamily: 'Vazir', marginLeft: 4 },
  aptInfoValue: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'right',
  },

  financeBox: {
    margin: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  financeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#00000010',
  },
  financeHeaderTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  highlightRow: { paddingVertical: 6 },
  financeLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  financeLabel: { fontSize: 12, fontFamily: 'Vazir' },
  financeLabelBold: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  financeValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  financeValueLarge: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  financeDivider: { height: 1, marginVertical: 4 },
  financeIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountPercentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountPercentText: { fontSize: 10, fontFamily: 'Vazir-Bold' },

  // ❌ استایل‌های failReasonBox حذف شد

  paymentInfoBox: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  paymentInfoRow: { flexDirection: 'row', gap: 16 },
  paymentInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  paymentInfoLabel: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  paymentInfoValue: { fontSize: 12, fontFamily: 'Vazir-Bold' },

  cardNumberBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  cardNumberLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  cardIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumberLabel: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  cardBankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardBankText: { fontSize: 10, fontFamily: 'Vazir-Bold' },
  cardNumberValue: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    letterSpacing: 2,
    textAlign: 'center',
    paddingVertical: 4,
  },

  trackingBox: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 6,
  },
  trackingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  trackingLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trackingLabel: { fontSize: 12, fontFamily: 'Vazir' },
  trackingValue: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  trackingValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  copyBtn: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationCodeBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  verificationCodeText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    letterSpacing: 2,
  },

  payFooter: { paddingHorizontal: 14, paddingVertical: 12 },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // ❌ استایل retryBtn حذف شد
  invoiceBtnText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
});
