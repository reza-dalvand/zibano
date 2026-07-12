// src/screens/manageBusiness/EditServiceScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch, Alert, TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useBusiness } from '../../context/BusinessContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 🆕 اضافه شد
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Divider from '../../components/common/Divider';
import ServiceTypeIcon from '../../components/manageBusiness/services/ServiceTypeIcon';

const SERVICE_TYPES = [
  { id: 'facial',     label: 'فیشیال و پاکسازی پوست' },
  { id: 'nail',       label: 'کاشت و طراحی ناخن' },
  { id: 'hair_color', label: 'رنگ و مش مو' },
  { id: 'keratin',    label: 'کراتین و احیای مو' },
  { id: 'laser',      label: 'لیزر موهای زائد' },
  { id: 'makeup',     label: 'میکاپ و گریم' },
  { id: 'eyelash',    label: 'کاشت مژه و ابرو' },
  { id: 'waxing',     label: 'اپیلاسیون' },
  { id: 'massage',    label: 'ماساژ' },
  { id: 'tattoo',     label: 'تتو و هاشور' },
  { id: 'skincare',   label: 'مراقبت پوست' },
  { id: 'other',      label: 'سایر' },
];

const MIN_FINAL_PRICE = 100000;
const MIN_DEPOSIT = 100000;
const MAX_REMINDER_DAYS = 480;

// 🎯 ارتفاع تقریبی Tab Bar شناور (از AppNavigator)
const NAVBAR_HEIGHT = 80;

const toEnglishDigits = (str) =>
  String(str)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const toPersianDigits = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const parseNumber = (str) => {
  const cleaned = toEnglishDigits(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

const formatPrice = (num) =>
  toPersianDigits((typeof num === 'number' ? num : parseNumber(num)).toLocaleString('en-US'));

const formatPriceInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return toPersianDigits(parseInt(cleaned, 10).toLocaleString('en-US'));
};

export default function EditServiceScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { addService, updateService } = useBusiness();
  const insets = useSafeAreaInsets(); // 🆕 برای محاسبه bottom دقیق
  const existingService = route.params?.service || null;
  const isEditMode = !!existingService;

  const [name, setName] = useState(existingService?.name || '');
  const [typeId, setTypeId] = useState(existingService?.typeId || null);
  const [customTypeName, setCustomTypeName] = useState(existingService?.customTypeName || '');
  const [originalPrice, setOriginalPrice] = useState(
    existingService?.originalPrice ? formatPriceInput(String(existingService.originalPrice)) : ''
  );
  const [discountPercent, setDiscountPercent] = useState(
    existingService?.discountPercent ? String(existingService.discountPercent) : ''
  );
  const [depositAmount, setDepositAmount] = useState(
    existingService?.depositAmount ? formatPriceInput(String(existingService.depositAmount)) : ''
  );
  const [isActive, setIsActive] = useState(existingService?.isActive !== false);
  const [description, setDescription] = useState(existingService?.description || '');
  const [duration, setDuration] = useState(
    existingService?.duration ? String(existingService.duration) : '60'
  );
  const [reminderDays, setReminderDays] = useState(
    existingService?.reminderDays !== undefined
      ? String(existingService.reminderDays)
      : '2'
  );
  const [errors, setErrors] = useState({});

  const originalNum = parseNumber(originalPrice);
  const discountNum = Math.min(parseNumber(discountPercent), 100);
  const discountAmount = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmount);
  const reminderDaysNum = Math.max(0, Math.min(MAX_REMINDER_DAYS, parseNumber(reminderDays)));

  const handleSave = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'نام خدمت الزامی است';
    if (!typeId) newErrors.typeId = 'نوع خدمت را انتخاب کنید';
    if (typeId === 'other' && !customTypeName.trim())
      newErrors.customTypeName = 'نام نوع خدمت را وارد کنید';
    if (originalNum <= 0) newErrors.originalPrice = 'قیمت اصلی باید بیشتر از صفر باشد';
    if (discountNum > 100) newErrors.discountPercent = 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد';
    if (finalPrice > 0 && finalPrice < MIN_FINAL_PRICE) {
      newErrors.originalPrice = `قیمت نهایی خدمت باید حداقل ${formatPrice(MIN_FINAL_PRICE)} تومان باشد`;
    }

    const depositNum = parseNumber(depositAmount);
    if (depositNum > 0 && depositNum < MIN_DEPOSIT) {
      newErrors.depositAmount = `حداقل مبلغ بیعانه ${formatPrice(MIN_DEPOSIT)} تومان است`;
    }
    if (depositNum > finalPrice) {
      newErrors.depositAmount = 'مبلغ بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    }

    if (reminderDaysNum > MAX_REMINDER_DAYS) {
      newErrors.reminderDays = `زمان یادآوری نمی‌تواند بیشتر از ${toPersianDigits(MAX_REMINDER_DAYS)} روز باشد`;
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
      duration: parseNumber(duration) || 60,
      reminderDays: reminderDaysNum,
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

  // 🎯 محاسبه bottom دقیق برای دکمه ذخیره
  // = insets.bottom + ارتفاع Tab Bar شناور + فاصله اضافی
  const stickyBottomOffset = Math.max(insets.bottom, 12) + NAVBAR_HEIGHT + 10;

  return (
    // ✅ حذف edges - ScreenWrapper به صورت پیش‌فرض bottom را مدیریت می‌کند
    // و Header خودش insets.top را اضافه می‌کند
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
            <View style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}>
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
              onChangeText={(t) => { setName(t); if (errors.name) setErrors({ ...errors, name: '' }); }}
              error={errors.name}
              rightIcon={<Icon name="label" size={22} color={colors.textSecondary} />}
            />

            <Dropdown
              label="نوع خدمت *"
              placeholder="نوع خدمت را انتخاب کنید"
              value={typeId}
              options={SERVICE_TYPES}
              onSelect={(val) => { setTypeId(val); if (errors.typeId) setErrors({ ...errors, typeId: '' }); }}
            />

            {typeId === 'other' && (
              <Input
                label="نام نوع خدمت *"
                placeholder="نام نوع خدمت خود را وارد کنید"
                value={customTypeName}
                onChangeText={(t) => { setCustomTypeName(t); if (errors.customTypeName) setErrors({ ...errors, customTypeName: '' }); }}
                error={errors.customTypeName}
              />
            )}

            <Input
              label="مدت زمان (دقیقه)"
              placeholder="مثال: ۶۰"
              value={toPersianDigits(duration)}
              onChangeText={(t) => setDuration(toEnglishDigits(t).replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              rightIcon={<Text style={[s.currencyText, { color: colors.textSecondary }]}>دقیقه</Text>}
            />
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

          <Card variant="elevated" padding={16} radius={18}>
            <Input
              label="قیمت اصلی (تومان) *"
              placeholder="مثال: ۷۵۰,۰۰۰"
              value={originalPrice}
              onChangeText={(t) => {
                setOriginalPrice(formatPriceInput(t));
                if (errors.originalPrice) setErrors({ ...errors, originalPrice: '' });
              }}
              keyboardType="numeric"
              error={errors.originalPrice}
              rightIcon={<Text style={[s.currencyText, { color: colors.textSecondary }]}>تومان</Text>}
            />

            <Input
              label="درصد تخفیف (اختیاری)"
              placeholder="مثال: ۲۰"
              value={discountPercent}
              onChangeText={(t) => {
                const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
                if (parseNumber(cleaned) <= 100 || cleaned === '') {
                  setDiscountPercent(cleaned);
                  if (errors.discountPercent) setErrors({ ...errors, discountPercent: '' });
                }
              }}
              keyboardType="numeric"
              maxLength={3}
              error={errors.discountPercent}
              rightIcon={<Text style={[s.currencyText, { color: colors.textSecondary }]}>٪</Text>}
            />

            {originalNum > 0 && (
              <Card
                variant="default"
                padding={14}
                radius={14}
                style={[
                  s.priceSummaryCard,
                  {
                    backgroundColor: finalPrice >= MIN_FINAL_PRICE ? '#43A04710' : '#E5393515',
                    borderColor: finalPrice >= MIN_FINAL_PRICE ? '#43A04740' : '#E5393550',
                  },
                ]}
              >
                <View style={s.summaryRow}>
                  <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>قیمت اصلی</Text>
                  <Text style={[s.summaryValue, { color: colors.textMain }]}>
                    {formatPrice(originalNum)}
                  </Text>
                </View>
                {discountNum > 0 && (
                  <View style={s.summaryRow}>
                    <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
                      تخفیف ({toPersianDigits(discountNum)}٪)
                    </Text>
                    <Text style={[s.summaryValue, { color: '#E53935' }]}>
                      - {formatPrice(discountAmount)}
                    </Text>
                  </View>
                )}
                <View style={[s.summaryDivider, { backgroundColor: colors.border }]} />
                <View style={s.summaryRow}>
                  <Text style={[s.summaryLabel, { color: colors.textMain, fontFamily: 'Vazir-Bold' }]}>
                    قیمت نهایی
                  </Text>
                  <Text
                    style={[
                      s.summaryValue,
                      {
                        color: finalPrice >= MIN_FINAL_PRICE ? '#43A047' : '#E53935',
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
                if (errors.depositAmount) setErrors({ ...errors, depositAmount: '' });
              }}
              keyboardType="numeric"
              error={errors.depositAmount}
              rightIcon={<Text style={[s.currencyText, { color: colors.textSecondary }]}>تومان</Text>}
              hint={`حداقل: ${formatPrice(MIN_DEPOSIT)} تومان`}
            />
          </Card>
        </View>

        {/* بخش یادآوری خودکار */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#9C27B015' }]}>
              <Icon name="notifications-active" size={18} color="#9C27B0" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              یادآوری خودکار
            </Text>
          </View>

          <Card variant="elevated" padding={16} radius={18}>
            <Text style={[s.reminderLabel, { color: colors.textMain }]}>
              زمان ارسال یادآوری
            </Text>

            <Divider spacing={12} />
            <Text style={[s.reminderCustomLabel, { color: colors.textSecondary }]}>
             چند روز بعد:
            </Text>
            <View style={s.reminderCustomRow}>
              <TouchableOpacity
                onPress={() => {
                  if (reminderDaysNum > 0) setReminderDays(String(reminderDaysNum - 1));
                }}
                style={[s.reminderStepperBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}
              >
                <Icon name="remove" size={20} color={colors.primary} />
              </TouchableOpacity>
              <View style={[s.reminderValueBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Icon name="notifications-active" size={18} color="#9C27B0" />
                <TextInput
                  value={toPersianDigits(reminderDays)}
                  onChangeText={(t) => {
                    const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
                    const num = Math.min(MAX_REMINDER_DAYS, parseInt(cleaned, 10) || 0);
                    setReminderDays(String(num));
                    if (errors.reminderDays) setErrors({ ...errors, reminderDays: '' });
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                  style={[s.reminderValueInput, { color: colors.textMain }]}
                />
                <Text style={[s.reminderValueUnit, { color: colors.textSecondary }]}>روز</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (reminderDaysNum < MAX_REMINDER_DAYS) setReminderDays(String(reminderDaysNum + 1));
                }}
                style={[s.reminderStepperBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}
              >
                <Icon name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {errors.reminderDays && (
              <View style={s.reminderErrorRow}>
                <Icon name="error-outline" size={14} color="#E53935" />
                <Text style={[s.reminderErrorText, { color: '#E53935' }]}>{errors.reminderDays}</Text>
              </View>
            )}

            <View
              style={[
                s.reminderPreview,
                {
                  backgroundColor: reminderDaysNum > 0 ? '#43A04710' : colors.border + '40',
                  borderColor: reminderDaysNum > 0 ? '#43A04740' : colors.border,
                },
              ]}
            >
              <Icon
                name={reminderDaysNum > 0 ? 'sms' : 'notifications-off'}
                size={16}
                color={reminderDaysNum > 0 ? '#43A047' : colors.textSecondary}
              />
              <Text
                style={[
                  s.reminderPreviewText,
                  {
                    color: reminderDaysNum > 0 ? '#43A047' : colors.textSecondary,
                  },
                ]}
              >
                {reminderDaysNum === 0
                  ? '🔕 یادآوری خودکار غیرفعال است - هیچ پیامکی برای مشتری ارسال نمی‌شود'
                  : reminderDaysNum === 1
                    ? '📱 پیامک یادآوری ۱ روز قبل از نوبت برای مشتری ارسال می‌شود'
                    : `📱 پیامک یادآوری ${toPersianDigits(reminderDaysNum - 3)} روز قبل از نوبت برای مشتری ارسال می‌شود`}
              </Text>
            </View>
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
                <Text style={[s.switchLabel, { color: colors.textMain }]}>وضعیت فعال</Text>
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

            <Input
              label="توضیحات (اختیاری)"
              placeholder="توضیحات بیشتری درباره این خدمت..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </Card>
        </View>

        {/* 🆕 فضای خالی در انتهای اسکرول برای جلوگیری از overlap با دکمه شناور */}
        <View style={{ height: stickyBottomOffset + 80 }} />
      </ScrollView>

      {/* 🎯 دکمه ذخیره به صورت Sticky در پایین صفحه */}
      <View
        style={[
          s.stickyFooter,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            bottom: stickyBottomOffset,
          },
        ]}
      >
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
    </ScreenWrapper>
  );
}

const { TouchableOpacity } = require('react-native');

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

  // ═══════════ 🎯 Sticky Footer ═══════════
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },

  // ═══════════ استایل‌های یادآوری خودکار ═══════════
  reminderInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  reminderInfoText: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: 'Vazir',
    lineHeight: 20,
    textAlign: 'right',
  },
  reminderLabel: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    marginBottom: 4,
  },
  reminderHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
    marginBottom: 12,
  },
  reminderChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  reminderChipText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  reminderCustomLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    marginBottom: 8,
  },
  reminderCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  reminderStepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  reminderValueBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  reminderValueInput: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    minWidth: 30,
    paddingVertical: 0,
  },
  reminderValueUnit: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  reminderErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  reminderErrorText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  reminderPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  reminderPreviewText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    lineHeight: 19,
  },
  reminderTipsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,193,7,0.08)',
  },
  reminderTipsContent: {
    flex: 1,
    gap: 4,
  },
  reminderTipsTitle: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    marginBottom: 4,
  },
  reminderTipsText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },
});