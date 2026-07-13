// src/components/manageBusiness/modelRequest/ModelRequestForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Input from '../../common/Input';
import Dropdown from '../../common/Dropdown';
import Button from '../../common/Button';
import Card from '../../common/Card';
import Divider from '../../common/Divider';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function ModelRequestForm({ services, initialData, onSave, onClose }) {
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    serviceId: initialData?.serviceId || null,
    title: initialData?.title || '',
    description: initialData?.description || '',
    duration: initialData?.duration ? String(initialData.duration) : '60',
    discount: initialData?.discount ? String(initialData.discount) : '50',
    maxApplicants: initialData?.maxApplicants ? String(initialData.maxApplicants) : '5',
    requirements: initialData?.requirements || '',
    isActive: initialData?.isActive !== false,
  });

  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSave = () => {
    const newErrors = {};

    if (!formData.serviceId) newErrors.serviceId = 'خدمت را انتخاب کنید';
    if (!formData.title.trim()) newErrors.title = 'عنوان الزامی است';
    if (!formData.description.trim()) newErrors.description = 'توضیحات الزامی است';

    const duration = parseInt(formData.duration);
    if (!duration || duration < 15) {
      newErrors.duration = 'مدت زمان باید حداقل ۱۵ دقیقه باشد';
    }

    const discount = parseInt(formData.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      newErrors.discount = 'تخفیف باید بین ۰ تا ۱۰۰ باشد';
    }

    const maxApplicants = parseInt(formData.maxApplicants);
    if (!maxApplicants || maxApplicants < 1) {
      newErrors.maxApplicants = 'حداقل ۱ متقاضی';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        duration: parseInt(formData.duration),
        discount: parseInt(formData.discount),
        maxApplicants: parseInt(formData.maxApplicants),
      });
    }
  };

  const serviceOptions = (services || []).map((s) => ({
    id: s.id,
    label: s.name,
  }));

  const selectedService = (services || []).find((s) => s.id === formData.serviceId);
  const discountNum = parseInt(formData.discount) || 0;
  const finalPrice = selectedService
    ? selectedService.finalPrice * (1 - discountNum / 100)
    : 0;

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

        {selectedService && (
          <View style={[s.pricePreview, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <Icon name="attach-money" size={16} color={colors.primary} />
            <View style={s.priceInfo}>
              <Text style={[s.priceLabel, { color: colors.textSecondary }]}>قیمت اصلی:</Text>
              <Text style={[s.priceValue, { color: colors.textMain }]}>
                {toPersianDigit(selectedService.finalPrice.toLocaleString())} تومان
              </Text>
            </View>
          </View>
        )}
      </Card>

      {/* اطلاعات پایه */}
      <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات درخواست</Text>
      <Card variant="elevated" padding={16} radius={16}>
        <Input
          label="عنوان درخواست *"
          placeholder="مثال: مدل برای فیشیال تخصصی"
          value={formData.title}
          onChangeText={(t) => updateField('title', t)}
          error={errors.title}
          rightIcon={<Icon name="label" size={20} color={colors.textSecondary} />}
        />

        <Input
          label="توضیحات *"
          placeholder="توضیحات کامل درباره نیاز به مدل..."
          value={formData.description}
          onChangeText={(t) => updateField('description', t)}
          error={errors.description}
          multiline
          numberOfLines={4}
        />

        <Input
          label="الزامات و شرایط"
          placeholder="مثال: سن بین ۲۰ تا ۳۵ سال، پوست سالم..."
          value={formData.requirements}
          onChangeText={(t) => updateField('requirements', t)}
          multiline
          numberOfLines={3}
        />
      </Card>

      {/* تنظیمات */}
      <Text style={[s.sectionTitle, { color: colors.textMain }]}>تنظیمات</Text>
      <Card variant="elevated" padding={16} radius={16}>
        <Input
          label="مدت زمان (دقیقه) *"
          placeholder="مثال: ۶۰"
          value={toPersianDigit(formData.duration)}
          onChangeText={(t) => {
            const cleaned = t.replace(/[^0-9]/g, '');
            updateField('duration', cleaned);
          }}
          keyboardType="numeric"
          error={errors.duration}
          rightIcon={<Text style={s.unitText}>دقیقه</Text>}
        />

        <Input
          label="درصد تخفیف ویژه مدل *"
          placeholder="مثال: ۵۰"
          value={toPersianDigit(formData.discount)}
          onChangeText={(t) => {
            const cleaned = t.replace(/[^0-9]/g, '');
            const num = Math.min(100, parseInt(cleaned) || 0);
            updateField('discount', String(num));
          }}
          keyboardType="numeric"
          maxLength={3}
          error={errors.discount}
          rightIcon={<Text style={s.unitText}>٪</Text>}
        />

        {selectedService && finalPrice > 0 && (
          <View style={[s.finalPriceBox, { backgroundColor: '#4CAF5010', borderColor: '#4CAF5040' }]}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={[s.finalPriceText, { color: '#4CAF50' }]}>
              قیمت نهایی برای مدل: {toPersianDigit(Math.round(finalPrice).toLocaleString())} تومان
            </Text>
          </View>
        )}

        <Input
          label="حداکثر تعداد متقاضی *"
          placeholder="مثال: ۵"
          value={toPersianDigit(formData.maxApplicants)}
          onChangeText={(t) => {
            const cleaned = t.replace(/[^0-9]/g, '');
            updateField('maxApplicants', cleaned);
          }}
          keyboardType="numeric"
          error={errors.maxApplicants}
          rightIcon={<Text style={s.unitText}>نفر</Text>}
        />

        <Divider spacing={12} />

        <View style={s.switchRow}>
          <View style={s.switchInfo}>
            <Text style={[s.switchLabel, { color: colors.textMain }]}>وضعیت فعال</Text>
            <Text style={[s.switchHint, { color: colors.textSecondary }]}>
              در صورت غیرفعال بودن، متقاضیان جدید نمی‌توانند ثبت‌نام کنند
            </Text>
          </View>
          <Switch
            value={formData.isActive}
            onValueChange={(val) => updateField('isActive', val)}
            thumbColor={formData.isActive ? colors.primary : '#ccc'}
            trackColor={{ true: colors.primary + '55', false: '#ddd' }}
          />
        </View>
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
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  pricePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  priceInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  priceValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  unitText: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    color: '#999',
  },
  finalPriceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  finalPriceText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
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
  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
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
});