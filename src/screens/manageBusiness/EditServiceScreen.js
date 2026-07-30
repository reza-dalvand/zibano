// src/screens/manageBusiness/EditServiceScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useBusinessStore } from '../../stores/useBusinessStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import ServiceTypeIcon from '../../components/manageBusiness/services/ServiceTypeIcon';
import PriceGuideModal from '../../components/common/PriceGuideModal';
import {
  toPersianDigit,
  formatPrice,
  toEnglishDigits,
  parseNumber,
  formatPriceInput,
} from '../../utils/numberUtils';
import { SERVICE_TYPES } from '../../constants';
import CharCounter from '../../components/common/CharCounter';

const MIN_FINAL_PRICE = 100000;
const MIN_DEPOSIT = 100000;
const MAX_DESCRIPTION_LENGTH = 300;

export default function EditServiceScreen({ navigation, route }) {
  const { colors } = useTheme();
  const addService = useBusinessStore((s) => s.addService);
  const updateService = useBusinessStore((s) => s.updateService);
  const existingService = route.params?.service || null;
  const isEditMode = !!existingService;
  const [priceGuideVisible, setPriceGuideVisible] = useState(false);

  const [name, setName] = useState(existingService?.name || '');
  const [typeId, setTypeId] = useState(existingService?.typeId || null);
  const [customTypeName, setCustomTypeName] = useState(
    existingService?.customTypeName || '',
  );
  const [originalPrice, setOriginalPrice] = useState(
    existingService?.originalPrice
      ? formatPriceInput(String(existingService.originalPrice))
      : '',
  );
  const [discountPercent, setDiscountPercent] = useState(
    existingService?.discountPercent
      ? String(existingService.discountPercent)
      : '',
  );
  const [depositAmount, setDepositAmount] = useState(
    existingService?.depositAmount
      ? formatPriceInput(String(existingService.depositAmount))
      : '',
  );
  const [isActive, setIsActive] = useState(existingService?.isActive !== false);
  const [description, setDescription] = useState(
    existingService?.description || '',
  );
  const [errors, setErrors] = useState({});

  const originalNum = parseNumber(originalPrice);
  const discountNum = Math.min(parseNumber(discountPercent), 100);
  const discountAmount = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmount);

  const handleSave = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'نام خدمت الزامی است';
    if (!typeId) newErrors.typeId = 'نوع خدمت را انتخاب کنید';
    if (typeId === 'other' && !customTypeName.trim())
      newErrors.customTypeName = 'نام نوع خدمت را وارد کنید';
    if (originalNum <= 0)
      newErrors.originalPrice = 'قیمت اصلی باید بیشتر از صفر باشد';
    if (discountNum > 100)
      newErrors.discountPercent = 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد';
    if (finalPrice > 0 && finalPrice < MIN_FINAL_PRICE) {
      newErrors.originalPrice = `قیمت نهایی خدمت باید حداقل ${formatPrice(
        MIN_FINAL_PRICE,
      )} تومان باشد`;
    }
    const depositNum = parseNumber(depositAmount);
    if (depositNum > 0 && depositNum < MIN_DEPOSIT) {
      newErrors.depositAmount = `حداقل مبلغ بیعانه ${formatPrice(
        MIN_DEPOSIT,
      )} تومان است`;
    }
    if (depositNum > finalPrice) {
      newErrors.depositAmount =
        'مبلغ بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const serviceType = SERVICE_TYPES.find((t) => t.id === typeId);
    const serviceData = {
      name: name.trim(),
      typeId,
      typeName: typeId === 'other' ? customTypeName.trim() : serviceType.label,
      customTypeName: typeId === 'other' ? customTypeName.trim() : '',
      originalPrice: originalNum,
      discountPercent: discountNum,
      discountAmount,
      finalPrice,
      hasDeposit: depositNum > 0,
      depositAmount: depositNum,
      isActive,
      description: description.trim(),
      duration: 60,
    };

    if (isEditMode) {
      updateService(existingService.id, serviceData);
      Alert.alert('موفقیت', 'خدمت با موفقیت ویرایش شد', [
        { text: 'باشه', onPress: () => navigation.goBack() },
      ]);
    } else {
      addService(serviceData);
      Alert.alert('موفقیت', 'خدمت جدید با موفقیت اضافه شد', [
        { text: 'باشه', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const descLength = (description || '').length;

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']} keyboardAware>
      <Header
        title={isEditMode ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* هدر با آیکون نوع خدمت */}
        <View style={s.heroSection}>
          <ServiceTypeIcon typeId={typeId || 'other'} size={80} />
          <Text style={[s.heroTitle, { color: colors.textMain }]}>
            {isEditMode ? 'ویرایش اطلاعات خدمت' : 'تعریف خدمت جدید'}
          </Text>
          <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
            {isEditMode
              ? 'تغییرات موردنظر خود را اعمال کنید'
              : 'اطلاعات خدمت را به دقت وارد نمایید'}
          </Text>
        </View>

        {/* بخش اطلاعات پایه */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View
              style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}
            >
              <Icon name="info-outline" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              اطلاعات پایه
            </Text>
          </View>
          <Card variant="elevated" padding={16} radius={18}>
            <Input
              label="نام خدمت *"
              placeholder="مثال: فیشیال VIP پوست صورت"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              error={errors.name}
              rightIcon={<Icon name="label" size={22} color={colors.textSecondary} />}
            />
            <Dropdown
              label="نوع خدمت *"
              placeholder="نوع خدمت را انتخاب کنید"
              value={typeId}
              options={SERVICE_TYPES}
              onSelect={(val) => {
                setTypeId(val);
                if (errors.typeId) setErrors({ ...errors, typeId: '' });
              }}
            />
            {typeId === 'other' && (
              <Input
                label="نام نوع خدمت *"
                placeholder="نام نوع خدمت خود را وارد کنید"
                value={customTypeName}
                onChangeText={(t) => {
                  setCustomTypeName(t);
                  if (errors.customTypeName)
                    setErrors({ ...errors, customTypeName: '' });
                }}
                error={errors.customTypeName}
              />
            )}
          </Card>
        </View>

        {/* بخش قیمت‌گذاری */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#43A04715' }]}>
              <Icon name="attach-money" size={18} color="#43A047" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              قیمت‌گذاری
            </Text>
          </View>

          {/* ✅ دکمه راهنمای قیمت‌گذاری - باقی می‌ماند */}
          <TouchableOpacity
            onPress={() => setPriceGuideVisible(true)}
            activeOpacity={0.8}
            style={[
              s.priceGuideBtn,
              {
                backgroundColor: '#4CAF5010',
                borderColor: '#4CAF5040',
              },
            ]}
          >
            <Icon name="calculate" size={18} color="#4CAF50" />
            <View style={{ flex: 1 }}>
              <Text style={[s.priceGuideBtnTitle, { color: '#4CAF50' }]}>
                راهنمای قیمت‌گذاری
              </Text>
              <Text style={[s.priceGuideBtnSubtitle, { color: colors.textSecondary }]}>
                مشاهده هزینه خدمات‌رسانی زیبانو
              </Text>
            </View>
            <Icon name="chevron-left" size={20} color="#4CAF50" />
          </TouchableOpacity>

          <Card variant="elevated" padding={16} radius={18}>
            <Input
              label="قیمت اصلی (تومان) *"
              placeholder="مثال: ۷۵۰,۰۰۰"
              value={originalPrice}
              onChangeText={(t) => {
                setOriginalPrice(formatPriceInput(t));
                if (errors.originalPrice)
                  setErrors({ ...errors, originalPrice: '' });
              }}
              keyboardType="numeric"
              error={errors.originalPrice}
              rightIcon={
                <Text style={[s.currencyText, { color: colors.textSecondary }]}>
                  تومان
                </Text>
              }
            />
            <Input
              label="درصد تخفیف (اختیاری)"
              placeholder="مثال: ۲۰"
              value={discountPercent}
              onChangeText={(t) => {
                const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
                if (parseNumber(cleaned) <= 100 || cleaned === '') {
                  setDiscountPercent(cleaned);
                  if (errors.discountPercent)
                    setErrors({ ...errors, discountPercent: '' });
                }
              }}
              keyboardType="numeric"
              maxLength={3}
              error={errors.discountPercent}
              rightIcon={
                <Text style={[s.currencyText, { color: colors.textSecondary }]}>
                  ٪
                </Text>
              }
            />
            {originalNum > 0 && (
              <Card
                variant="default"
                padding={14}
                radius={14}
                style={[
                  s.priceSummaryCard,
                  {
                    backgroundColor:
                      finalPrice >= MIN_FINAL_PRICE ? '#43A04710' : '#E5393515',
                    borderColor:
                      finalPrice >= MIN_FINAL_PRICE ? '#43A04740' : '#E5393550',
                  },
                ]}
              >
                <View style={s.summaryRow}>
                  <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
                    قیمت اصلی
                  </Text>
                  <Text style={[s.summaryValue, { color: colors.textMain }]}>
                    {formatPrice(originalNum)}
                  </Text>
                </View>
                {discountNum > 0 && (
                  <View style={s.summaryRow}>
                    <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
                      تخفیف ({toPersianDigit(discountNum)}٪)
                    </Text>
                    <Text style={[s.summaryValue, { color: '#E53935' }]}>
                      - {formatPrice(discountAmount)}
                    </Text>
                  </View>
                )}
                <View
                  style={[s.summaryDivider, { backgroundColor: colors.border }]}
                />
                <View style={s.summaryRow}>
                  <Text
                    style={[
                      s.summaryLabel,
                      { color: colors.textMain, fontFamily: 'Vazir-Bold' },
                    ]}
                  >
                    قیمت نهایی
                  </Text>
                  <Text
                    style={[
                      s.summaryValue,
                      {
                        color:
                          finalPrice >= MIN_FINAL_PRICE ? '#43A047' : '#E53935',
                        fontFamily: 'Vazir-Bold',
                        fontSize: 15,
                      },
                    ]}
                  >
                    {formatPrice(finalPrice)}
                  </Text>
                </View>
              </Card>
            )}
          </Card>

          {/* ❌ کارت کارمزد زیبانو حذف شد */}
        </View>

        {/* بخش بیعانه */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#FF980015' }]}>
              <Icon name="account-balance-wallet" size={18} color="#FF9800" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              بیعانه رزرو
            </Text>
          </View>
          <Card variant="elevated" padding={16} radius={18}>
            <Input
              label="مبلغ بیعانه (تومان)"
              placeholder="مثال: ۲۰۰,۰۰۰"
              value={depositAmount}
              onChangeText={(t) => {
                setDepositAmount(formatPriceInput(t));
                if (errors.depositAmount)
                  setErrors({ ...errors, depositAmount: '' });
              }}
              keyboardType="numeric"
              error={errors.depositAmount}
              rightIcon={
                <Text style={[s.currencyText, { color: colors.textSecondary }]}>
                  تومان
                </Text>
              }
              hint={`حداقل: ${formatPrice(MIN_DEPOSIT)}`}
            />
          </Card>
        </View>

        {/* بخش تنظیمات */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#2196F315' }]}>
              <Icon name="settings" size={18} color="#2196F3" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              تنظیمات
            </Text>
          </View>
          <Card variant="elevated" padding={16} radius={18}>
            <View style={s.switchRow}>
              <View style={s.switchInfo}>
                <Text style={[s.switchLabel, { color: colors.textMain }]}>
                  وضعیت فعال
                </Text>
                <Text style={[s.switchHint, { color: colors.textSecondary }]}>
                  در صورت غیرفعال بودن، مشتریان نمی‌توانند این خدمت را رزرو کنند
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                thumbColor={isActive ? colors.primary : '#ccc'}
                trackColor={{ true: colors.primary + '55', false: '#ddd' }}
              />
            </View>
            <Divider spacing={12} />
            <View style={s.descriptionWrapper}>
              <Input
                label="توضیحات (اختیاری)"
                placeholder="توضیحاتی درباره این خدمت... (حداکثر ۳۰۰ کاراکتر)"
                value={description}
                onChangeText={(t) => {
                  if (t.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(t);
                  }
                }}
                multiline
                numberOfLines={3}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <CharCounter current={descLength} max={MAX_DESCRIPTION_LENGTH} />
            </View>
          </Card>
        </View>

        <View style={s.saveContainer}>
          <Button
            title={isEditMode ? 'ذخیره تغییرات' : 'افزودن خدمت'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ✅ مدال راهنمای قیمت‌گذاری - باقی می‌ماند */}
      <PriceGuideModal
        visible={priceGuideVisible}
        onClose={() => setPriceGuideVisible(false)}
        currentPrice={finalPrice}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  heroTitle: {
    fontSize: 19,
    fontFamily: 'Vazir-Bold',
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    width: '100%',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  currencyText: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  priceSummaryCard: {
    borderWidth: 1.5,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 6,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  switchInfo: {
    flex: 1,
    gap: 2,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  switchHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 17,
  },
  descriptionWrapper: {
    marginBottom: 4,
  },
  saveContainer: {
    marginTop: 24,
  },
  // ✅ استایل‌های دکمه راهنمای قیمت‌گذاری - باقی می‌ماند
  priceGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  priceGuideBtnTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  priceGuideBtnSubtitle: { fontSize: 11, fontFamily: 'Vazir', marginTop: 2 },
});