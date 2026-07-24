// src/components/createbusiness/ServicesManagement.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import Divider from '../common/Divider';
import EmptyState from '../common/EmptyState';
import BottomSheet from '../common/BottomSheet';

const SERVICE_TYPES = [
  { id: 'facial', label: 'فیشیال و پاکسازی پوست' },
  { id: 'nail', label: 'کاشت و طراحی ناخن' },
  { id: 'hair_color', label: 'رنگ و مش مو' },
  { id: 'keratin', label: 'کراتین و احیای مو' },
  { id: 'laser', label: 'لیزر موهای زائد' },
  { id: 'makeup', label: 'میکاپ و گریم' },
  { id: 'eyelash', label: 'کاشت مژه و ابرو' },
  { id: 'waxing', label: 'اپیلاسیون' },
  { id: 'massage', label: 'ماساژ' },
  { id: 'tattoo', label: 'تتو و هاشور' },
  { id: 'skincare', label: 'مراقبت پوست' },
  { id: 'other', label: 'سایر' },
];

const MIN_FINAL_PRICE = 100000;
const MIN_DEPOSIT = 100000;

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

const formatPrice = (num) => {
  const n = typeof num === 'number' ? num : parseNumber(num);
  return toPersianDigits(n.toLocaleString('en-US'));
};

const formatPriceInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  const num = parseInt(cleaned, 10);
  return toPersianDigits(num.toLocaleString('en-US'));
};

export default function ServicesManagement({ services = [], onChange }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState(null);
  const [customTypeName, setCustomTypeName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const originalNum = parseNumber(originalPrice);
  const discountNum = Math.min(parseNumber(discountPercent), 100);
  const discountAmount = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmount);

  const resetForm = () => {
    setName('');
    setTypeId(null);
    setCustomTypeName('');
    setOriginalPrice('');
    setDiscountPercent('');
    setDepositAmount('');
    setIsActive(true);
    setDescription('');
    setErrors({});
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (service) => {
    setName(service.name);
    setTypeId(service.typeId);
    setCustomTypeName(service.customTypeName || '');
    setOriginalPrice(formatPriceInput(String(service.originalPrice || '')));
    setDiscountPercent(String(service.discountPercent || ''));
    setDepositAmount(formatPriceInput(String(service.depositAmount || '')));
    setIsActive(service.isActive !== false);
    setDescription(service.description || '');
    setErrors({});
    setEditingId(service.id);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

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
      newErrors.originalPrice = `قیمت نهایی خدمت باید حداقل ${formatPrice(MIN_FINAL_PRICE)} تومان باشد`;
    }
    const depositNum = parseNumber(depositAmount);
    if (!depositNum || depositNum < MIN_DEPOSIT) {
      newErrors.depositAmount = `حداقل مبلغ بیعانه ${formatPrice(MIN_DEPOSIT)} تومان است`;
    }
    if (depositNum > finalPrice) {
      newErrors.depositAmount = 'مبلغ بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const serviceType = SERVICE_TYPES.find((t) => t.id === typeId);
    const serviceData = {
      id: editingId || `svc_${Date.now()}`,
      name: name.trim(),
      typeId,
      typeName: typeId === 'other' ? customTypeName.trim() : serviceType.label,
      customTypeName: typeId === 'other' ? customTypeName.trim() : '',
      originalPrice: originalNum,
      discountPercent: discountNum,
      discountAmount,
      finalPrice,
      hasDeposit: true,
      depositAmount: depositNum,
      isActive,
      description: description.trim(),
    };

    const updatedServices = editingId
      ? services.map((s) => (s.id === editingId ? serviceData : s))
      : [...services, serviceData];
    onChange?.(updatedServices);
    closeModal();
  };

  const handleDelete = (service) => {
    Alert.alert('حذف خدمت', `آیا از حذف "${service.name}" مطمئن هستید؟`, [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => onChange?.(services.filter((s) => s.id !== service.id)) },
    ]);
  };

  const toggleActive = (service) => {
    onChange?.(services.map((s) => (s.id === service.id ? { ...s, isActive: !s.isActive } : s)));
  };

  return (
    <View style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.sectionHeader}>
          <View style={s.titleRow}>
            <View style={[s.iconBox, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="spa" size={20} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>خدمات سالن</Text>
          </View>
          <View style={[s.countBadge, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[s.countText, { color: colors.primary }]}>{services.length} خدمت</Text>
          </View>
        </View>
        <Text style={[s.sectionHint, { color: colors.textSecondary }]}>
          خدماتی که ارائه می‌دهید را اضافه کنید. این خدمات به کارمندان اختصاص داده می‌شوند.
        </Text>

        {services.length > 0 ? (
          <View style={s.servicesList}>
            {services.map((service) => (
              <Card
                key={service.id}
                variant="default"
                padding={14}
                radius={14}
                style={[s.serviceCard, !service.isActive && { opacity: 0.6 }]}
              >
                <View style={s.cardTopRow}>
                  <View style={s.cardInfo}>
                    <Text style={[s.serviceName, { color: colors.textMain }]} numberOfLines={1}>
                      {service.name}
                    </Text>
                    <Text style={[s.serviceType, { color: colors.textSecondary }]} numberOfLines={1}>
                      {service.typeName}
                    </Text>
                  </View>
                  <View style={s.cardActions}>
                    <Switch
                      value={service.isActive !== false}
                      onValueChange={() => toggleActive(service)}
                      thumbColor={service.isActive !== false ? colors.primary : '#ccc'}
                      trackColor={{ true: colors.primary + '55', false: '#ddd' }}
                    />
                    <Button title="" onPress={() => openEditModal(service)} variant="ghost" size="sm" icon={<Icon name="edit" size={20} color={colors.primary} />} style={s.actionBtn} />
                    <Button title="" onPress={() => handleDelete(service)} variant="ghost" size="sm" icon={<Icon name="delete-outline" size={22} color="#E57373" />} style={s.actionBtn} />
                  </View>
                </View>
                <Divider spacing={10} />
                <View style={s.priceRow}>
                  <View style={s.priceItem}>
                    <Text style={[s.priceLabel, { color: colors.textSecondary }]}>قیمت اصلی</Text>
                    <Text style={[s.priceValue, { color: colors.textMain }]}>{formatPrice(service.originalPrice)}</Text>
                  </View>
                  {service.discountPercent > 0 && (
                    <View style={s.priceItem}>
                      <Text style={[s.priceLabel, { color: colors.textSecondary }]}>با تخفیف</Text>
                      <Text style={[s.priceValue, { color: '#4CAF50' }]}>{formatPrice(service.finalPrice)}</Text>
                    </View>
                  )}
                  <View style={s.priceItem}>
                    <Text style={[s.priceLabel, { color: colors.textSecondary }]}>بیعانه رزرو</Text>
                    <Text style={[s.priceValue, { color: colors.primary }]}>{formatPrice(service.depositAmount)}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <Card variant="default" padding={0} radius={16} style={s.emptyCard}>
            <EmptyState
              icon="💆‍♀️"
              title="هنوز خدمتی ثبت نکرده‌اید"
              description="اولین خدمت خود را اضافه کنید تا مشتریان بتوانند از شما نوبت بگیرند"
              actionLabel="افزودن اولین خدمت"
              onAction={openAddModal}
            />
          </Card>
        )}
        <Button
          title="افزودن خدمت جدید"
          onPress={openAddModal}
          variant="outline"
          size="lg"
          fullWidth
          icon={<Icon name="add" size={20} color={colors.primary} />}
          iconPosition="right"
          style={s.addButton}
        />
        <View style={{ height: 140 }} />
      </ScrollView>

      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
        snapPoint={0.85}
        footer={
          <Button
            title={editingId ? 'ذخیره تغییرات' : 'افزودن خدمت'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
          />
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24, paddingHorizontal: 4 }}
        >
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
          <Divider label="قیمت‌گذاری" spacing={16} />
          <Input
            label="قیمت اصلی (تومان) *"
            placeholder="مثال: ۷۵۰,۰۰۰"
            value={originalPrice}
            onChangeText={(t) => {
              const formatted = formatPriceInput(t);
              setOriginalPrice(formatted);
              if (errors.originalPrice) setErrors({ ...errors, originalPrice: '' });
            }}
            keyboardType="numeric"
            error={errors.originalPrice}
            rightIcon={<Text style={[s.currencyIcon, { color: colors.textSecondary }]}>تومان</Text>}
            hint={
              <View style={s.hintColumn}>
                <Text style={[s.hintBaseText, { color: colors.textSecondary }]}>
                  قیمت نهایی پس از تخفیف باید حداقل {formatPrice(MIN_FINAL_PRICE)} تومان باشد
                </Text>
                {discountNum > 0 && originalNum > 0 && (
                  <Text style={[s.hintCalcText, { color: finalPrice >= MIN_FINAL_PRICE ? '#4CAF50' : '#E57373' }]}>
                    قیمت نهایی: {formatPrice(finalPrice)} تومان {finalPrice < MIN_FINAL_PRICE && '⚠️'}
                  </Text>
                )}
              </View>
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
                if (errors.discountPercent) setErrors({ ...errors, discountPercent: '' });
              }
            }}
            keyboardType="numeric"
            maxLength={3}
            error={errors.discountPercent}
            rightIcon={<Text style={[s.currencyIcon, { color: colors.textSecondary }]}>٪</Text>}
            hint={discountNum > 0 && originalNum > 0 ? `تخفیف: ${formatPrice(discountAmount)} تومان` : ''}
          />
          {originalNum > 0 && (
            <Card
              variant="default"
              padding={14}
              radius={12}
              style={[
                s.priceSummaryCard,
                {
                  backgroundColor: finalPrice >= MIN_FINAL_PRICE ? '#4CAF5010' : '#E5737315',
                  borderColor: finalPrice >= MIN_FINAL_PRICE ? '#4CAF5040' : '#E5737350',
                },
              ]}
            >
              <View style={s.priceSummaryHeader}>
                <Icon name={finalPrice >= MIN_FINAL_PRICE ? 'check-circle' : 'warning'} size={18} color={finalPrice >= MIN_FINAL_PRICE ? '#4CAF50' : '#E57373'} />
                <Text style={[s.priceSummaryTitle, { color: finalPrice >= MIN_FINAL_PRICE ? '#4CAF50' : '#E57373' }]}>
                  {finalPrice >= MIN_FINAL_PRICE ? 'قیمت معتبر ✓' : 'قیمت نهایی کمتر از حد مجاز'}
                </Text>
              </View>
              <View style={s.priceSummaryRow}>
                <Text style={[s.priceSummaryLabel, { color: colors.textSecondary }]}>قیمت اصلی</Text>
                <Text style={[s.priceSummaryValue, { color: colors.textMain }]}>{formatPrice(originalNum)} تومان</Text>
              </View>
              {discountNum > 0 && (
                <View style={s.priceSummaryRow}>
                  <Text style={[s.priceSummaryLabel, { color: colors.textSecondary }]}>تخفیف ({formatPrice(discountNum)}٪)</Text>
                  <Text style={[s.priceSummaryValue, { color: '#E57373' }]}>- {formatPrice(discountAmount)} تومان</Text>
                </View>
              )}
              <View style={[s.priceSummaryDivider, { backgroundColor: colors.border }]} />
              <View style={s.priceSummaryRow}>
                <Text style={[s.priceSummaryLabel, { color: colors.textMain, fontFamily: 'Vazir-Bold' }]}>قیمت نهایی</Text>
                <Text
                  style={[
                    s.priceSummaryValue,
                    {
                      color: finalPrice >= MIN_FINAL_PRICE ? '#4CAF50' : '#E57373',
                      fontFamily: 'Vazir-Bold',
                      fontSize: 15,
                    },
                  ]}
                >
                  {formatPrice(finalPrice)} تومان
                </Text>
              </View>
              {finalPrice < MIN_FINAL_PRICE && (
                <Text style={[s.priceSummaryWarning, { color: '#E57373' }]}>
                  ⚠️ قیمت نهایی باید حداقل {formatPrice(MIN_FINAL_PRICE)} تومان باشد. لطفاً قیمت اصلی را افزایش دهید یا تخفیف را کاهش دهید.
                </Text>
              )}
            </Card>
          )}
          <Divider label="بیعانه رزرو" spacing={16} />
          <Input
            label="مبلغ بیعانه (تومان) *"
            placeholder="مثال: ۲۰۰,۰۰۰"
            value={depositAmount}
            onChangeText={(t) => {
              const formatted = formatPriceInput(t);
              setDepositAmount(formatted);
              if (errors.depositAmount) setErrors({ ...errors, depositAmount: '' });
            }}
            keyboardType="numeric"
            error={errors.depositAmount}
            rightIcon={<Text style={[s.currencyIcon, { color: colors.textSecondary }]}>تومان</Text>}
            hint={
              <View style={s.hintColumn}>
                <Text style={[s.hintBaseText, { color: colors.textSecondary }]}>حداقل: {formatPrice(MIN_DEPOSIT)} تومان</Text>
                {finalPrice > 0 && <Text style={[s.hintCalcText, { color: colors.textSecondary }]}>حداکثر: {formatPrice(finalPrice)} تومان</Text>}
              </View>
            }
          />
          <Divider label="تنظیمات" spacing={16} />
          <View style={s.switchRow}>
            <View style={s.switchInfo}>
              <Text style={[s.switchLabel, { color: colors.textMain }]}>وضعیت فعال</Text>
              <Text style={[s.switchHint, { color: colors.textSecondary }]}>
                در صورت غیرفعال بودن، مشتریان نمی‌توانند این خدمت را رزرو کنند
              </Text>
            </View>
            <Switch value={isActive} onValueChange={setIsActive} thumbColor={isActive ? colors.primary : '#ccc'} trackColor={{ true: colors.primary + '55', false: '#ddd' }} />
          </View>
          <Input
            label="توضیحات (اختیاری)"
            placeholder="توضیحات بیشتری درباره این خدمت..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
          <View style={{ height: 20 }} />
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 17, fontFamily: 'Vazir-Bold' },
  countBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  countText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  sectionHint: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 20, marginBottom: 20 },
  servicesList: { gap: 12, marginBottom: 16 },
  serviceCard: { marginBottom: 0 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardInfo: { flex: 1, alignItems: 'flex-start', gap: 2 },
  serviceName: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  serviceType: { fontSize: 12, fontFamily: 'Vazir' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  priceItem: { alignItems: 'flex-start', gap: 2, minWidth: 60 },
  priceLabel: { fontSize: 11, fontFamily: 'Vazir' },
  priceValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  emptyCard: {
    marginBottom: 16,
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 230,
  },
  addButton: { marginTop: 4 },
  currencyIcon: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, gap: 12, marginBottom: 8 },
  switchInfo: { flex: 1, alignItems: 'flex-start', gap: 2 },
  switchLabel: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  switchHint: { fontSize: 12, fontFamily: 'Vazir' },
  hintColumn: { gap: 4, marginTop: 2, alignItems: 'flex-start' },
  hintBaseText: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18 },
  hintCalcText: { fontSize: 13, fontFamily: 'Vazir-Bold', lineHeight: 20 },
  priceSummaryCard: { borderWidth: 1.5, marginBottom: 8 },
  priceSummaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  priceSummaryTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  priceSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  priceSummaryLabel: { fontSize: 12, fontFamily: 'Vazir' },
  priceSummaryValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  priceSummaryDivider: { height: 1, marginVertical: 8 },
  priceSummaryWarning: { fontSize: 11, fontFamily: 'Vazir', lineHeight: 18, marginTop: 8 },
});