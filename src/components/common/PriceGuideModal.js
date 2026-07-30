// src/components/common/PriceGuideModal.js
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
import { useTheme } from '../../stores/useThemeStore';
import Button from './Button';
import {
  toPersianDigit,
  formatPrice,
  APP_FEE_TIERS,
  getCurrentFeeTier,
} from '../../utils/numberUtils';

export default function PriceGuideModal({ visible, onClose, currentPrice }) {
  const { colors } = useTheme();
  const currentTier = currentPrice > 0 ? getCurrentFeeTier(currentPrice) : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={s.backdrop}
      >
        <TouchableOpacity activeOpacity={1} style={s.container}>
          <View
            style={[
              s.modal,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Handle Bar */}
            <View style={s.handleArea}>
              <View style={[s.handle, { backgroundColor: colors.border }]} />
            </View>

            {/* هدر */}
            <View
              style={[s.header, { borderBottomColor: colors.border }]}
            >
              <View style={s.headerLeft}>
                <View
                  style={[
                    s.headerIconBox,
                    { backgroundColor: '#4CAF5015' },
                  ]}
                >
                  <Icon name="calculate" size={22} color="#4CAF50" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[s.headerTitle, { color: colors.textMain }]}
                  >
                    راهنمای قیمت‌گذاری
                  </Text>
                  <Text
                    style={[s.headerSubtitle, { color: colors.textSecondary }]}
                  >
                    هزینه خدمات‌رسانی زیبانو به ازای هر رزرو
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

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.scrollContent}
            >
              {/* کارت توضیح */}
              <View
                style={[
                  s.infoCard,
                  {
                    backgroundColor: '#2196F308',
                    borderColor: '#2196F325',
                  },
                ]}
              >
                <Icon name="info-outline" size={18} color="#2196F3" />
                <Text
                  style={[s.infoText, { color: colors.textSecondary }]}
                >
                  زیبانو برای ارائه خدماتی مانند پشتیبانی، پردازش پرداخت،
                  مدیریت نوبت‌ها و اطلاع‌رسانی خودکار، هزینه‌ای ثابت و شفاف از
                  هر رزرو دریافت می‌کند.{' '}
                  <Text style={[s.infoTextBold, { color: '#2196F3' }]}>
                   این هزینه به قیمت خدمت اضافه و توسط مشتری پرداخت میشود.  
                  </Text>
               
                </Text>
              </View>

              {/* جدول بازه‌ها */}
              <Text
                style={[s.tableTitle, { color: colors.textMain }]}
              >
                جدول هزینه خدمات‌رسانی
              </Text>

              <View
                style={[
                  s.tableCard,
                  { borderColor: colors.border, backgroundColor: colors.background },
                ]}
              >
                {/* سرستون‌ها */}
                <View
                  style={[
                    s.tableHeader,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[s.tableHeaderText, { color: colors.textSecondary }]}>
                    بازه قیمت خدمت (تومان)
                  </Text>
                  <Text style={[s.tableHeaderText, { color: colors.textSecondary }]}>
                    هزینه زیبانو
                  </Text>
                </View>

                {/* ردیف‌ها */}
                {APP_FEE_TIERS.map((tier, index) => {
                  const isCurrent = currentTier && currentTier.fee === tier.fee && 
                                    currentPrice >= tier.min && currentPrice <= tier.max;
                  const isLast = index === APP_FEE_TIERS.length - 1;
                  return (
                    <View
                      key={tier.min}
                      style={[
                        s.tableRow,
                        isCurrent && {
                          backgroundColor: '#4CAF5015',
                          borderColor: '#4CAF5040',
                          borderWidth: 1.5,
                          borderRadius: 10,
                          marginVertical: 2,
                        },
                        !isLast && !isCurrent && {
                          borderBottomWidth: 0.5,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <View style={s.tableRowLeft}>
                        {isCurrent && (
                          <Icon name="arrow-left" size={14} color="#4CAF50" />
                        )}
                        <Text
                          style={[
                            s.tableRowText,
                            {
                              color: isCurrent ? '#4CAF50' : colors.textMain,
                              fontFamily: isCurrent
                                ? 'Vazir-Bold'
                                : 'Vazir-Medium',
                            },
                          ]}
                        >
                          {formatPrice(tier.min).replace(' تومان', '')} تا{' '}
                          {formatPrice(tier.max).replace(' تومان', '')}
                        </Text>
                      </View>
                      <View
                        style={[
                          s.feeBadge,
                          {
                            backgroundColor: isCurrent
                              ? '#4CAF50'
                              : colors.primary + '15',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            s.feeText,
                            {
                              color: isCurrent ? '#fff' : colors.primary,
                            },
                          ]}
                        >
                          {formatPrice(tier.fee).replace(' تومان', '')}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {/* 🆕 ردیف "و به همین صورت..." */}
                <View
                  style={[
                    s.tableRow,
                    s.continuationRow,
                    { backgroundColor: colors.cardBackground },
                  ]}
                >
                  <View style={s.tableRowLeft}>
                    <Icon name="trending-up" size={14} color={colors.primary} />
                    <Text
                      style={[
                        s.continuationText,
                        { color: colors.textMain },
                      ]}
                    >
                      و به همین صورت به ازای عبور از هر ۵۰۰ هزار تومان، ۱۰ هزار تومان اضافه خواهد شد.
                    </Text>
                  </View>
                  <View
                    style={[
                      s.feeBadge,
                      { backgroundColor: colors.primary + '15' },
                    ]}
                  >
                    <Text style={[s.feeText, { color: colors.primary }]}>
                      +۱۰K
                    </Text>
                  </View>
                </View>
              </View>

              {/* نمایش قیمت فعلی */}
              {currentPrice > 0 && currentTier && (
                <View
                  style={[
                    s.currentPriceCard,
                    {
                      backgroundColor: '#4CAF5010',
                      borderColor: '#4CAF5040',
                    },
                  ]}
                >
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[s.currentPriceTitle, { color: colors.textMain }]}
                    >
                      هزینه زیبانو برای خدمت شما
                    </Text>
                    <Text
                      style={[s.currentPriceValue, { color: '#4CAF50' }]}
                    >
                      {formatPrice(currentTier.fee)}
                    </Text>
                  </View>
                </View>
              )}

              {/* نکات مهم */}
              <View
                style={[
                  s.tipsCard,
                  { borderColor: colors.border, backgroundColor: colors.cardBackground },
                ]}
              >
                <View style={s.tipsHeader}>
                  <Icon name="lightbulb" size={18} color="#FFC107" />
                  <Text
                    style={[s.tipsTitle, { color: colors.textMain }]}
                  >
                    نکات مهم
                  </Text>
                </View>
                <View style={s.tipsList}>
                  {[
                    'این هزینه به صورت خودکار به قیمت خدمت اضافه می‌شود',
                    'شما مبلغی که تعیین کرده‌اید را به صورت کامل دریافت می‌کنید',
                    'در صورت لغو نوبت توسط شما، کل مبلغ پرداختی به مشتری مسترد می‌شود',
                  ].map((tip, i) => (
                    <View key={i} style={s.tipItem}>
                      <View
                        style={[s.tipBullet, { backgroundColor: '#4CAF50' }]}
                      />
                      <Text
                        style={[s.tipText, { color: colors.textSecondary }]}
                      >
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* فوتر */}
            <View
              style={[s.footer, { borderTopColor: colors.border }]}
            >
              <Button
                title="متوجه شدم"
                onPress={onClose}
                variant="primary"
                size="lg"
                fullWidth
                icon={<Icon name="check" size={18} color="#fff" />}
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    borderWidth: 1,
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 21,
  },
  // 🆕 استایل بولد برای "توسط مشتری پرداخت می‌گردد"
  infoTextBold: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  tableTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginBottom: 10,
  },
  tableCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tableRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  tableRowText: {
    fontSize: 12,
    flex: 1,
  },
  feeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  feeText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  // 🆕 استایل ردیف "و به همین صورت..."
  continuationRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 14,
  },
  continuationText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    flex: 1,
    lineHeight: 18,
  },
  currentPriceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 18,
  },
  currentPriceTitle: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  currentPriceValue: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    marginTop: 4,
  },
  tipsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
});