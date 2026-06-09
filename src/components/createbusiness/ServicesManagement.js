// src/components/createbusiness/ServicesManagement.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import Divider from '../common/Divider';
import EmptyState from '../common/EmptyState';
import BottomSheet from '../common/BottomSheet'; // ✅ اضافه کردن

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

const toEnglishDigits = (str) =>
  String(str).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const parseNumber = (str) => {
  const cleaned = toEnglishDigits(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

const formatPrice = (num) => {
  const n = typeof num === 'number' ? num : parseNumber(num);
  return n.toLocaleString('fa-IR');
};

export default function ServicesManagement({ services = [], onChange }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState(null);
  const [customTypeName, setCustomTypeName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [duration, setDuration] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [hasDeposit, setHasDeposit] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const originalNum = parseNumber(originalPrice);
  const discountNum = Math.min(parseNumber(discountPercent), 100);
  const discountAmount = Math.round((originalNum * discountNum) / 100);
  const finalPrice = Math.max(0, originalNum - discountAmount);

  const resetForm = () => {
    setName(''); setTypeId(null); setCustomTypeName('');
    setOriginalPrice(''); setDiscountPercent(''); setDuration('');
    setDepositAmount(''); setHasDeposit(false); setIsActive(true);
    setDescription(''); setErrors({}); setEditingId(null);
  };

  const openAddModal = () => { resetForm(); setModalVisible(true); };
  
  const openEditModal = (service) => {
    setName(service.name);
    setTypeId(service.typeId);
    setCustomTypeName(service.customTypeName || '');
    setOriginalPrice(String(service.originalPrice || ''));
    setDiscountPercent(String(service.discountPercent || ''));
    setDuration(String(service.duration || ''));
    setDepositAmount(String(service.depositAmount || ''));
    setHasDeposit(!!service.hasDeposit);
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
    if (typeId === 'other' && !customTypeName.trim()) newErrors.customTypeName = 'نام نوع خدمت را وارد کنید';
    if (originalNum <= 0) newErrors.originalPrice = 'قیمت اصلی باید بیشتر از صفر باشد';
    if (discountNum > 100) newErrors.discountPercent = 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد';
    if (!parseNumber(duration)) newErrors.duration = 'مدت زمان خدمت الزامی است';
    if (hasDeposit && parseNumber(depositAmount) <= 0) newErrors.depositAmount = 'مبلغ بیعانه باید بیشتر از صفر باشد';
    if (hasDeposit && parseNumber(depositAmount) > finalPrice) newErrors.depositAmount = 'مبلغ بیعانه نمی‌تواند بیشتر از قیمت نهایی باشد';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const serviceType = SERVICE_TYPES.find((t) => t.id === typeId);
    const serviceData = {
      id: editingId || `svc_${Date.now()}`,
      name: name.trim(), typeId,
      typeName: typeId === 'other' ? customTypeName.trim() : serviceType.label,
      customTypeName: typeId === 'other' ? customTypeName.trim() : '',
      originalPrice: originalNum, discountPercent: discountNum, discountAmount, finalPrice,
      duration: parseNumber(duration), hasDeposit,
      depositAmount: hasDeposit ? parseNumber(depositAmount) : 0,
      isActive, description: description.trim(),
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
    onChange?.(services.map((s) => s.id === service.id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <View style={s.container}>
      <View style={s.sectionHeader}>
        <View style={s.titleRow}>
          <Icon name="spa" size={22} color={colors.primary} />
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>خدمات سالن</Text>
        </View>
        <Text style={[s.countText, { color: colors.textSecondary }]}>{services.length} خدمت</Text>
      </View>

      <Text style={[s.sectionHint, { color: colors.textSecondary }]}>
        خدماتی که ارائه می‌دهید را اضافه کنید. این خدمات به کارمندان اختصاص داده می‌شوند.
      </Text>

      {services.length > 0 ? (
        <View style={s.servicesList}>
          {services.map((service) => (
            <Card key={service.id} variant="default" padding={14} radius={14}
              style={[s.serviceCard, !service.isActive && { opacity: 0.6 }]}>
              <View style={s.cardTopRow}>
                <View style={s.cardInfo}>
                  <Text style={[s.serviceName, { color: colors.textMain }]} numberOfLines={1}>{service.name}</Text>
                  <Text style={[s.serviceType, { color: colors.textSecondary }]} numberOfLines={1}>{service.typeName}</Text>
                </View>
                <View style={s.cardActions}>
                  <Switch value={service.isActive !== false} onValueChange={() => toggleActive(service)}
                    thumbColor={service.isActive !== false ? colors.primary : '#ccc'}
                    trackColor={{ true: colors.primary + '55', false: '#ddd' }} />
                  <Button title="" onPress={() => openEditModal(service)} variant="ghost" size="sm"
                    icon={<Icon name="edit" size={20} color={colors.primary} />} style={s.actionBtn} />
                  <Button title="" onPress={() => handleDelete(service)} variant="ghost" size="sm"
                    icon={<Icon name="delete-outline" size={22} color="#E57373" />} style={s.actionBtn} />
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
                  <Text style={[s.priceLabel, { color: colors.textSecondary }]}>مدت زمان</Text>
                  <Text style={[s.priceValue, { color: colors.textMain }]}>{service.duration} د</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Card variant="default" padding={0} radius={16} style={s.emptyCard}>
          <EmptyState icon="💆‍♀️" title="هنوز خدمتی ثبت نکرده‌اید"
            description="اولین خدمت خود را اضافه کنید تا مشتریان بتوانند از شما نوبت بگیرند"
            actionLabel="افزودن اولین خدمت" onAction={openAddModal} />
        </Card>
      )}

      <Button title="افزودن خدمت جدید" onPress={openAddModal} variant="outline" size="lg" fullWidth
        icon={<Icon name="add" size={20} color={colors.primary} />} iconPosition="right" style={s.addButton} />

      {/* ✅ استفاده از BottomSheet به جای Modal */}
      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
        snapPoint={0.8} // 🎯 ۸۰٪ صفحه را می‌گیرد (هدر دیده می‌شود)
        footer={
          <Button title={editingId ? 'ذخیره تغییرات' : 'افزودن خدمت'} onPress={handleSave}
            variant="primary" size="lg" fullWidth
            icon={<Icon name="check" size={20} color="#fff" />} iconPosition="right" />
        }
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input label="نام خدمت" placeholder="مثال: فیشیال VIP پوست صورت" value={name}
            onChangeText={(t) => { setName(t); if (errors.name) setErrors({ ...errors, name: '' }); }}
            error={errors.name} rightIcon={<Icon name="label" size={22} color={colors.textSecondary} />} />

          <Dropdown label="نوع خدمت" placeholder="نوع خدمت را انتخاب کنید" value={typeId}
            options={SERVICE_TYPES}
            onSelect={(val) => { setTypeId(val); if (errors.typeId) setErrors({ ...errors, typeId: '' }); }} />

          {typeId === 'other' && (
            <Input label="نام نوع خدمت" placeholder="نام نوع خدمت خود را وارد کنید" value={customTypeName}
              onChangeText={(t) => { setCustomTypeName(t); if (errors.customTypeName) setErrors({ ...errors, customTypeName: '' }); }}
              error={errors.customTypeName} />
          )}

          <Divider label="قیمت‌گذاری" spacing={16} />

          <Input label="قیمت اصلی (تومان)" placeholder="مثال: ۷۵۰۰۰۰" value={originalPrice}
            onChangeText={(t) => { setOriginalPrice(toEnglishDigits(t).replace(/[^0-9]/g, '')); if (errors.originalPrice) setErrors({ ...errors, originalPrice: '' }); }}
            keyboardType="numeric" error={errors.originalPrice}
            rightIcon={<Text style={[s.currencyIcon, { color: colors.textSecondary }]}>تومان</Text>} />

          <Input label="درصد تخفیف (اختیاری)" placeholder="مثال: ۲۰" value={discountPercent}
            onChangeText={(t) => {
              const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '');
              if (parseNumber(cleaned) <= 100 || cleaned === '') {
                setDiscountPercent(cleaned);
                if (errors.discountPercent) setErrors({ ...errors, discountPercent: '' });
              }
            }}
            keyboardType="numeric" maxLength={3} error={errors.discountPercent}
            rightIcon={<Text style={[s.currencyIcon, { color: colors.textSecondary }]}>٪</Text>}
            hint={discountNum > 0 && originalNum > 0 ? `قیمت نهایی: ${formatPrice(finalPrice)} تومان` : ''} />

          <Input label="مدت زمان (دقیقه)" placeholder="مثال: ۶۰" value={duration}
            onChangeText={(t) => { setDuration(toEnglishDigits(t).replace(/[^0-9]/g, '')); if (errors.duration) setErrors({ ...errors, duration: '' }); }}
            keyboardType="numeric" error={errors.duration}
            rightIcon={<Icon name="schedule" size={22} color={colors.textSecondary} />} />

          <Divider label="بیعانه رزرو" spacing={16} />

          <View style={s.switchRow}>
            <View style={s.switchInfo}>
              <Text style={[s.switchLabel, { color: colors.textMain }]}>دریافت بیعانه هنگام رزرو</Text>
              <Text style={[s.switchHint, { color: colors.textSecondary }]}>بخشی از مبلغ هنگام رزرو دریافت می‌شود</Text>
            </View>
            <Switch value={hasDeposit} onValueChange={setHasDeposit}
              thumbColor={hasDeposit ? colors.primary : '#ccc'}
              trackColor={{ true: colors.primary + '55', false: '#ddd' }} />
          </View>

          {hasDeposit && (
            <Input label="مبلغ بیعانه (تومان)" placeholder="مثال: ۲۰۰۰۰۰" value={depositAmount}
              onChangeText={(t) => { setDepositAmount(toEnglishDigits(t).replace(/[^0-9]/g, '')); if (errors.depositAmount) setErrors({ ...errors, depositAmount: '' }); }}
              keyboardType="numeric" error={errors.depositAmount}
              rightIcon={<Text style={[s.currencyIcon, { color: colors.textSecondary }]}>تومان</Text>}
              hint={finalPrice > 0 ? `حداکثر: ${formatPrice(finalPrice)} تومان` : ''} />
          )}

          <Divider label="تنظیمات" spacing={16} />

          <View style={s.switchRow}>
            <View style={s.switchInfo}>
              <Text style={[s.switchLabel, { color: colors.textMain }]}>وضعیت فعال</Text>
              <Text style={[s.switchHint, { color: colors.textSecondary }]}>در صورت غیرفعال بودن، مشتریان نمی‌توانند این خدمت را رزرو کنند</Text>
            </View>
            <Switch value={isActive} onValueChange={setIsActive}
              thumbColor={isActive ? colors.primary : '#ccc'}
              trackColor={{ true: colors.primary + '55', false: '#ddd' }} />
          </View>

          <Input label="توضیحات (اختیاری)" placeholder="توضیحات بیشتری درباره این خدمت..."
            value={description} onChangeText={setDescription} multiline numberOfLines={3} />
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  countText: { fontSize: 13, fontFamily: 'Vazir' },
  sectionHint: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 20, textAlign: 'right', marginBottom: 20 },
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
  emptyCard: { marginBottom: 16 },
  addButton: { marginTop: 4 },
  currencyIcon: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, gap: 12, marginBottom: 8 },
  switchInfo: { flex: 1, alignItems: 'flex-start', gap: 2 },
  switchLabel: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  switchHint: { fontSize: 12, fontFamily: 'Vazir' },
});