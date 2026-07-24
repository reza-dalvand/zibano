// src/components/manageBusiness/modelRequest/ModelRequestForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../stores/useThemeStore';
import Input from '../../common/Input';
import Dropdown from '../../common/Dropdown';
import Button from '../../common/Button';
import Card from '../../common/Card';

const toPersianDigit = (str) =>
  String(str || '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const toEnglishDigits = (str) =>
  String(str || '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const MAX_DESC_LENGTH = 300;

// 🎯 ۳ گزینه هزینه
const COST_TYPE_OPTIONS = [
  {
    id: 'paid',
    label: 'با هزینه',
    icon: 'attach-money',
    color: '#2196F3',
    subtitle: 'مدل بخشی از هزینه خدمت را پرداخت می‌کند',
  },
  {
    id: 'material_cost',
    label: 'با هزینه مواد',
    icon: 'science',
    color: '#FF9800',
    subtitle: 'فقط هزینه مواد مصرفی دریافت می‌شود',
  },
  {
    id: 'free',
    label: 'کاملاً رایگان',
    icon: 'redeem',
    color: '#4CAF50',
    subtitle: 'هیچ هزینه‌ای از مدل دریافت نمی‌شود',
  },
];

export default function ModelRequestForm({
  services,
  initialData,
  defaultPhone,
  onSave,
  onClose,
}) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    serviceId: initialData?.serviceId || null,
    title: initialData?.title || '',
    description: initialData?.description || '',
    contactPhone: initialData?.contactPhone || defaultPhone || '',
    serviceImage: initialData?.serviceImage || null,
    costType: initialData?.costType || 'material_cost', // پیش‌فرض: با هزینه مواد
  });
  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value || '' }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!result.didCancel && result.assets?.[0]) {
      updateField('serviceImage', result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.serviceId) newErrors.serviceId = 'خدمت را انتخاب کنید';
    if (!formData.title.trim()) newErrors.title = 'عنوان الزامی است';
    if (!formData.description.trim()) newErrors.description = 'توضیحات الزامی است';
    if (!formData.serviceImage) newErrors.serviceImage = 'تصویر خدمت الزامی است';

    const cleanedPhone = toEnglishDigits(formData.contactPhone).replace(/[^0-9]/g, '');
    if (!cleanedPhone) {
      newErrors.contactPhone = 'شماره تماس الزامی است';
    } else if (cleanedPhone.length < 10) {
      newErrors.contactPhone = 'شماره تماس معتبر نیست';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        contactPhone: cleanedPhone,
      });
    }
  };

  const serviceOptions = (services || []).map((s) => ({
    id: s.id,
    label: s.name,
  }));

  const descLength = (formData.description || '').length;
  const remainingChars = MAX_DESC_LENGTH - descLength;
  const isNearLimit = remainingChars <= 50 && remainingChars > 0;
  const isAtLimit = remainingChars === 0;

  const phoneDisplayValue = formData.contactPhone
    ? toPersianDigit(toEnglishDigits(formData.contactPhone))
    : '';

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
      {/* ═══════ بخش ۱: تصویر خدمت ═══════ */}
      <Card variant="elevated" padding={16} radius={16}>
        <View style={s.sectionHeader}>
          <View style={[s.sectionIconBox, { backgroundColor: '#FF980018' }]}>
            <Icon name="photo-camera" size={18} color="#FF9800" />
          </View>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>تصویر خدمت</Text>
        </View>

        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.85}
          style={[
            s.imagePicker,
            {
              borderColor: errors.serviceImage ? '#E53935' : formData.serviceImage ? colors.primary : colors.border,
              borderStyle: formData.serviceImage ? 'solid' : 'dashed',
            },
          ]}
        >
          {formData.serviceImage ? (
            <View style={s.pickedImageWrap}>
              <Image source={{ uri: formData.serviceImage }} style={s.pickedImage} />
              <View style={[s.editBadge, { backgroundColor: colors.primary }]}>
                <Icon name="edit" size={12} color="#fff" />
                <Text style={s.editBadgeText}>تغییر تصویر</Text>
              </View>
            </View>
          ) : (
            <View style={s.imagePlaceholder}>
              <View style={[s.placeholderIconBox, { backgroundColor: colors.primary + '20' }]}>
                <Icon name="add-a-photo" size={36} color={colors.primary} />
              </View>
              <Text style={[s.placeholderTitle, { color: colors.textMain }]}>
                آپلود تصویر خدمت
              </Text>
              <Text style={[s.placeholderHint, { color: colors.textSecondary }]}>
                تصویری با کیفیت از نمونه کار آپلود کنید
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {errors.serviceImage && (
          <View style={s.errorRow}>
            <Icon name="error-outline" size={14} color="#E53935" />
            <Text style={[s.errorText, { color: '#E53935' }]}>{errors.serviceImage}</Text>
          </View>
        )}
      </Card>

      {/* ═══════ بخش ۲: انتخاب خدمت و شماره تماس ═══════ */}
      <Card variant="elevated" padding={16} radius={16}>
        <Dropdown
          label="خدمت موردنظر *"
          placeholder="خدمت را انتخاب کنید"
          value={formData.serviceId}
          options={serviceOptions}
          onSelect={(val) => updateField('serviceId', val)}
        />
        {errors.serviceId && (
          <Text style={s.errorText}>{errors.serviceId}</Text>
        )}

        <Input
          label="شماره تماس برای مدل‌ها *"
          placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
          value={phoneDisplayValue}
          onChangeText={(t) => {
            const cleaned = toEnglishDigits(t).replace(/[^0-9]/g, '').slice(0, 11);
            updateField('contactPhone', cleaned);
          }}
          error={errors.contactPhone}
          keyboardType="phone-pad"
          maxLength={13}
          rightIcon={<Icon name="phone" size={20} color={colors.textSecondary} />}
        />
        <View style={[s.phoneHint, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
          <Icon name="info-outline" size={14} color={colors.primary} />
          <Text style={[s.phoneHintText, { color: colors.textSecondary }]}>
            این شماره در کارت آگهی نمایش داده می‌شود و مدل‌ها می‌توانند مستقیماً تماس بگیرند.
          </Text>
        </View>
      </Card>

      {/* ═══════ بخش ۳: اطلاعات درخواست ═══════ */}
      <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات درخواست</Text>
      <Card variant="elevated" padding={16} radius={16}>
        <Input
          label="عنوان درخواست *"
          placeholder="مثال: مدل برای فیشیال تخصصی"
          value={formData.title || ''}
          onChangeText={(t) => updateField('title', t)}
          error={errors.title}
          rightIcon={<Icon name="label" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="توضیحات *"
          placeholder="توضیحات کامل درباره نیاز به مدل..."
          value={formData.description || ''}
          onChangeText={(t) => {
            if ((t || '').length <= MAX_DESC_LENGTH) {
              updateField('description', t);
            }
          }}
          error={errors.description}
          multiline
          numberOfLines={4}
          maxLength={MAX_DESC_LENGTH}
        />

        {/* شمارنده کاراکتر */}
        <View style={s.charCounterRow}>
          <Icon
            name="text-fields"
            size={12}
            color={isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.textSecondary}
          />
          <Text
            style={[
              s.charCounterText,
              {
                color: isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.textSecondary,
              },
            ]}
          >
            {toPersianDigit(descLength)} از {toPersianDigit(MAX_DESC_LENGTH)} کاراکتر
          </Text>
          <View style={{ flex: 1 }} />
          <View style={[s.charProgressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                s.charProgressFill,
                {
                  width: `${(descLength / MAX_DESC_LENGTH) * 100}%`,
                  backgroundColor: isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {isNearLimit && !isAtLimit && (
          <View style={[s.charWarning, { backgroundColor: '#FF980010', borderColor: '#FF980030' }]}>
            <Icon name="warning" size={12} color="#FF9800" />
            <Text style={s.charWarningText}>
              فقط {toPersianDigit(remainingChars)} کاراکتر باقی مانده است
            </Text>
          </View>
        )}
      </Card>

      {/* ═══════ بخش ۴: وضعیت هزینه (۳ گزینه) ═══════ */}
      <Text style={[s.sectionTitle, { color: colors.textMain }]}>وضعیت هزینه</Text>
      <Card variant="elevated" padding={16} radius={16}>
        <View style={s.costOptionsContainer}>
          {COST_TYPE_OPTIONS.map((option) => {
            const isSelected = formData.costType === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => updateField('costType', option.id)}
                activeOpacity={0.8}
                style={[
                  s.costOption,
                  {
                    backgroundColor: isSelected ? option.color + '15' : colors.cardBackground,
                    borderColor: isSelected ? option.color : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <View style={[s.costIconBox, { backgroundColor: option.color + '25' }]}>
                  <Icon name={option.icon} size={24} color={option.color} />
                </View>
                <View style={s.costTextCol}>
                  <Text style={[s.costTitle, { color: colors.textMain }]}>
                    {option.label}
                  </Text>
                  <Text style={[s.costSubtitle, { color: colors.textSecondary }]}>
                    {option.subtitle}
                  </Text>
                </View>
                {isSelected && (
                  <View style={[s.checkBadge, { backgroundColor: option.color }]}>
                    <Icon name="check" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* راهنما بر اساس انتخاب */}
        <View style={[s.costHintBox, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
          <Icon name="lightbulb" size={14} color={colors.primary} />
          <Text style={[s.costHintText, { color: colors.textSecondary }]}>
            {formData.costType === 'paid' &&
              'گزینه «با هزینه» برای مدل‌هایی مناسب است که حاضرند بخشی از هزینه خدمت را پرداخت کنند (مثلاً ۵۰٪ قیمت اصلی).'}
            {formData.costType === 'material_cost' &&
              'گزینه «با هزینه مواد» برای مدل‌ها جذاب‌تر است. آن‌ها فقط هزینه مواد مصرفی را پرداخت می‌کنند که معمولاً بسیار کمتر از قیمت کامل خدمت است.'}
            {formData.costType === 'free' &&
              'گزینه «رایگان» برای جذب مدل‌های حرفه‌ای مناسب‌تر است، اما هزینه‌های شما را افزایش می‌دهد.'}
          </Text>
        </View>
      </Card>

      {/* ═══════ دکمه‌ها ═══════ */}
      <View style={s.footer}>
        <Button
          title="انصراف"
          onPress={onClose}
          variant="outline"
          size="lg"
          style={s.halfBtn}
        />
        <Button
          title={initialData ? 'ذخیره تغییرات' : 'ایجاد درخواست'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          style={s.halfBtn}
          icon={<Icon name="check" size={18} color="#fff" />}
          iconPosition="right"
        />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 8,
    marginBottom: 8,
  },
  // ═══════ تصویر ═══════
  imagePicker: {
    width: '100%',
    minHeight: 180,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  pickedImageWrap: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 30,
  },
  placeholderIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  placeholderTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  placeholderHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    fontFamily: 'Vazir',
    marginTop: 4,
    textAlign: 'right',
  },
  // ═══════ شمارنده ═══════
  charCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  charCounterText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  charProgressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  charProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  charWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: -2,
    marginBottom: 4,
  },
  charWarningText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    color: '#FF9800',
  },
  phoneHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: -4,
  },
  phoneHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 17,
  },
  // ═══════ ۳ گزینه هزینه ═══════
  costOptionsContainer: {
    gap: 10,
  },
  costOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    position: 'relative',
  },
  costIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  costTextCol: {
    flex: 1,
    gap: 3,
  },
  costTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  costSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 17,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  costHintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  costHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  halfBtn: {
    flex: 1,
  },
});