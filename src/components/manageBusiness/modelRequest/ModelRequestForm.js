import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Input from '../../common/Input';
import Dropdown from '../../common/Dropdown';
import Button from '../../common/Button';
import Card from '../../common/Card';

const toPersianDigit = (str) =>
  String(str || '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// 🆕 تابع تبدیل ارقام فارسی/عربی به انگلیسی
const toEnglishDigits = (str) =>
  String(str || '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const MAX_DESC_LENGTH = 300;

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
    requirements: initialData?.requirements || '',
    contactPhone: initialData?.contactPhone || defaultPhone || '',
  });

  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value || '' }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSave = () => {
    const newErrors = {};

    if (!formData.serviceId) newErrors.serviceId = 'خدمت را انتخاب کنید';
    if (!formData.title.trim()) newErrors.title = 'عنوان الزامی است';
    if (!formData.description.trim()) newErrors.description = 'توضیحات الزامی است';

    // ✅ استفاده از toEnglishDigits برای اعتبارسنجی
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

  // ✅ مقدار نمایشی شماره - تبدیل به فارسی
  const phoneDisplayValue = formData.contactPhone
    ? toPersianDigit(toEnglishDigits(formData.contactPhone))
    : '';

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
      {/* انتخاب خدمت */}
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

        {/* 🆕 شماره تماس زیر خدمت - با رفع باگ */}
        <Input
          label="شماره تماس برای مدل‌ها *"
          placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
          value={phoneDisplayValue}
          onChangeText={(t) => {
            // ✅ ابتدا ارقام فارسی/عربی را به انگلیسی تبدیل کن، سپس غیرعدد را حذف کن
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

      {/* اطلاعات پایه */}
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

        {/* <Input
          label="الزامات و شرایط"
          placeholder="مثال: سن بین ۲۰ تا ۳۵ سال، پوست سالم..."
          value={formData.requirements || ''}
          onChangeText={(t) => updateField('requirements', t)}
          multiline
          numberOfLines={3}
        /> */}
      </Card>

      {/* دکمه‌ها */}
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
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  halfBtn: {
    flex: 1,
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    fontFamily: 'Vazir',
    marginTop: 4,
    textAlign: 'right',
  },
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
});