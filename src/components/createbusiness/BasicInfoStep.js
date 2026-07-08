// src/components/createbusiness/BasicInfoStep.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/ThemeContext';
import Input from '../common/Input';
import Card from '../common/Card';
import Dropdown from '../common/Dropdown';
import MapPicker from '../common/MapPicker';
import { PROVINCES, CITIES } from '../../constants/exploreFilters';

export default function BasicInfoStep({ formData, onUpdate, onValidationChange }) {
  const { colors } = useTheme();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'name':
        if (!value || !value.trim()) return 'نام کسب‌وکار الزامی است';
        if (value.trim().length < 3) return 'نام باید حداقل ۳ کاراکتر باشد';
        if (value.trim().length > 50) return 'نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد';
        return '';
      case 'coverUrl':
        if (!value) return 'آپلود تصویر کاور الزامی است';
        return '';
      case 'provinceId':
        if (!value) return 'انتخاب استان الزامی است';
        return '';
      case 'cityId':
        if (!value) return 'انتخاب شهر الزامی است';
        return '';
      case 'address':
        if (!value || !value.trim()) return 'آدرس دقیق الزامی است';
        if (value.trim().length < 10) return 'آدرس باید حداقل ۱۰ کاراکتر باشد';
        return '';
      case 'location':
        if (!value || !value.latitude) return 'تعیین موقعیت روی نقشه الزامی است';
        return '';
      default:
        return '';
    }
  }, []);

  const validateAll = useCallback(() => {
    const fields = ['name', 'coverUrl', 'provinceId', 'cityId', 'address', 'location'];
    const newErrors = {};
    let hasError = false;
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasError = true;
      }
    });
    return { newErrors, isValid: !hasError };
  }, [formData, validateField]);

  // 🎯 اصلاح: به‌روزرسانی همزمان errors و isValid
  useEffect(() => {
    const { newErrors, isValid: currentValid } = validateAll();
    setIsValid(currentValid);
    
    // 🎯 فقط خطاهای فیلدهایی که لمس شده‌اند را نگه دار
    // فیلدهایی که هنوز لمس نشده‌اند نباید خطا نشان دهند
    const filteredErrors = {};
    Object.keys(newErrors).forEach((field) => {
      if (touched[field]) {
        filteredErrors[field] = newErrors[field];
      }
    });
    
    setErrors(filteredErrors);
    
    if (onValidationChange) {
      onValidationChange(currentValid);
    }
  }, [
    formData.name,
    formData.coverUrl,
    formData.provinceId,
    formData.cityId,
    formData.address,
    formData.location,
    touched,
    validateAll,
    onValidationChange,
  ]);

  const handleFieldChange = (field, value) => {
    onUpdate(field, value);
    // 🎯 خطا را فوراً پاک کن اگر فیلد مقدار معتبر دارد
    const error = validateField(field, value);
    if (!error) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const showError = (field) => touched[field] && errors[field];

  const pickCoverImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && result.assets) {
      handleFieldChange('coverUrl', result.assets[0].uri);
      markTouched('coverUrl');
    }
  };

  const handleProvinceChange = (provinceId) => {
    handleFieldChange('provinceId', provinceId);
    onUpdate('cityId', null);
    onUpdate('location', null);
    onUpdate('mapAddress', '');
    markTouched('provinceId');
  };

  const handleCityChange = (cityId) => {
    handleFieldChange('cityId', cityId);
    markTouched('cityId');
  };

  const handleLocationSelect = (location, mapAddress) => {
    handleFieldChange('location', location);
    onUpdate('mapAddress', mapAddress);
    markTouched('location');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
      {/* هدر بخش */}
      <View style={s.sectionHeader}>
        <View style={[s.headerIconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="store" size={24} color={colors.primary} />
        </View>
        <View style={s.headerTextCol}>
          <Text style={[s.stepTitle, { color: colors.textMain }]}>اطلاعات پایه کسب‌وکار</Text>
          <Text style={[s.stepHint, { color: colors.textSecondary }]}>
            مشخصات اصلی و موقعیت مکانی سالن خود را وارد کنید
          </Text>
        </View>
      </View>

      {/* کارت تصویر کاور */}
      <Card variant="default" padding={16} radius={20} style={[s.coverCard, { borderColor: colors.border }]}>
        <View style={s.coverLabelRow}>
          <Text style={[s.coverLabel, { color: colors.textMain }]}>
            تصویر کاور سالن<Text style={{ color: '#E53935' }}> *</Text>
          </Text>
          <Text style={[s.coverHint, { color: colors.textSecondary }]}>۱۲۰۰×۴۰۰ پیکسل</Text>
        </View>
        <TouchableOpacity
          style={[
            s.coverPicker,
            {
              backgroundColor: formData.coverUrl ? 'transparent' : colors.cardBackground,
              borderColor: showError('coverUrl') ? '#E53935' : formData.coverUrl ? colors.primary : colors.border,
            },
          ]}
          onPress={pickCoverImage}
          activeOpacity={0.85}
        >
          {formData.coverUrl ? (
            <>
              <Image source={{ uri: formData.coverUrl }} style={s.coverImage} />
              <View style={[s.editBadge, { backgroundColor: colors.primary }]}>
                <Icon name="edit" size={14} color="#fff" />
                <Text style={s.editBadgeText}>تغییر تصویر</Text>
              </View>
            </>
          ) : (
            <View style={s.coverPlaceholder}>
              <View style={[s.coverPlaceholderIcon, { backgroundColor: colors.primary + '20' }]}>
                <Icon name="panorama" size={40} color={colors.primary} />
              </View>
              <Text style={[s.coverText, { color: colors.textMain }]}>آپلود تصویر کاور</Text>
              <Text style={[s.coverHintText, { color: colors.textSecondary }]}>
                تصویر با کیفیت از محیط سالن آپلود کنید
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {showError('coverUrl') && (
          <View style={s.errorRow}>
            <Icon name="error-outline" size={14} color="#E53935" />
            <Text style={[s.errorText, { color: '#E53935' }]}>{errors.coverUrl}</Text>
          </View>
        )}
      </Card>

      {/* بخش مشخصات */}
      <View style={s.inputSection}>
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>مشخصات</Text>
        <Input
          label="نام کسب‌وکار *"
          placeholder="مثال: سالن زیبایی نیلارام"
          value={formData.name}
          onChangeText={(txt) => handleFieldChange('name', txt)}
          onBlur={() => markTouched('name')}
          error={showError('name') ? errors.name : ''}
          rightIcon={
            <View style={[s.inputIconBox, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="store" size={18} color={colors.primary} />
            </View>
          }
        />
      </View>

      {/* بخش موقعیت مکانی */}
      <View style={s.inputSection}>
        <View style={s.sectionTitleRow}>
          <View style={[s.sectionIconBox, { backgroundColor: '#E5393515' }]}>
            <Icon name="location-on" size={18} color="#E53935" />
          </View>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>موقعیت مکانی</Text>
        </View>
        <Text style={[s.sectionHint, { color: colors.textSecondary }]}>
          استان و شهر را انتخاب کنید و موقعیت دقیق سالن را روی نقشه مشخص کنید
        </Text>
        
        <Dropdown
          label="استان *"
          placeholder="انتخاب استان"
          value={formData.provinceId}
          options={PROVINCES}
          onSelect={handleProvinceChange}
        />
        {showError('provinceId') && (
          <View style={[s.errorRow, { marginTop: -8, marginBottom: 8 }]}>
            <Icon name="error-outline" size={14} color="#E53935" />
            <Text style={[s.errorText, { color: '#E53935' }]}>{errors.provinceId}</Text>
          </View>
        )}
        
        <Dropdown
          label="شهر *"
          placeholder={formData.provinceId ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
          value={formData.cityId}
          options={formData.provinceId ? CITIES[formData.provinceId] || [] : []}
          onSelect={handleCityChange}
          disabled={!formData.provinceId}
        />
        {showError('cityId') && (
          <View style={[s.errorRow, { marginTop: -8, marginBottom: 8 }]}>
            <Icon name="error-outline" size={14} color="#E53935" />
            <Text style={[s.errorText, { color: '#E53935' }]}>{errors.cityId}</Text>
          </View>
        )}
        
        <Input
          label="آدرس دقیق سالن *"
          placeholder="خیابان، کوچه، پلاک، واحد..."
          value={formData.address}
          onChangeText={(txt) => handleFieldChange('address', txt)}
          onBlur={() => markTouched('address')}
          error={showError('address') ? errors.address : ''}
          multiline
          numberOfLines={3}
          rightIcon={
            <View style={[s.inputIconBox, { backgroundColor: '#E5393515' }]}>
              <Icon name="location-on" size={18} color="#E53935" />
            </View>
          }
        />
        
        <Card
          variant="default"
          padding={0}
          radius={16}
          style={[s.mapCard, { borderColor: showError('location') ? '#E53935' : colors.border }]}
        >
          <View style={[s.mapHeader, { borderBottomColor: colors.border }]}>
            <View style={[s.mapIconBox, { backgroundColor: colors.primary + '20' }]}>
              <Icon name="map" size={20} color={colors.primary} />
            </View>
            <View style={s.mapInfo}>
              <Text style={[s.mapTitle, { color: colors.textMain }]}>
                موقعیت روی نقشه <Text style={{ color: '#E53935' }}>*</Text>
              </Text>
              <Text style={[s.mapSubtitle, { color: colors.textSecondary }]}>
                با تپ روی نقشه، مکان دقیق را مشخص کنید
              </Text>
            </View>
            {formData.location && (
              <TouchableOpacity
                onPress={() => {
                  handleFieldChange('location', null);
                  onUpdate('mapAddress', '');
                }}
                style={[s.clearMapBtn, { backgroundColor: '#E5393515' }]}
              >
                <Icon name="close" size={14} color="#E53935" />
              </TouchableOpacity>
            )}
          </View>
          <MapPicker
            initialLocation={formData.location}
            onLocationSelect={handleLocationSelect}
            height={280}
          />
        </Card>
        {showError('location') && (
          <View style={[s.errorRow, { marginTop: 8 }]}>
            <Icon name="error-outline" size={14} color="#E53935" />
            <Text style={[s.errorText, { color: '#E53935' }]}>{errors.location}</Text>
          </View>
        )}
        {formData.location && !showError('location') && (
          <View style={[s.coordsBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <Icon name="my-location" size={14} color={colors.primary} />
            <Text style={[s.coordsText, { color: colors.primary }]}>
              مختصات: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
            </Text>
            <View style={{ flex: 1 }} />
            <Icon name="check-circle" size={16} color="#4CAF50" />
          </View>
        )}
      </View>

      {/* راهنمای تکمیل */}
      <Card variant="default" padding={14} radius={14} style={[s.hintCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={s.hintHeader}>
          <Icon name="info-outline" size={18} color={colors.primary} />
          <Text style={[s.hintTitle, { color: colors.textMain }]}>راهنمای تکمیل</Text>
        </View>
        <Text style={[s.hintText, { color: colors.textSecondary }]}>
          فیلدهای ستاره‌دار (<Text style={{ color: '#E53935' }}>*</Text>) الزامی هستند.
          پس از تکمیل همه فیلدها، دکمه «مرحله بعد» فعال می‌شود.
        </Text>
      </Card>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 20 },
  sectionHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  headerIconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerTextCol: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 18, fontFamily: 'Vazir-Bold' },
  stepHint: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18 },
  coverCard: { borderWidth: 1 },
  coverLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  coverLabel: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  coverHint: { fontSize: 11, fontFamily: 'Vazir' },
  coverPicker: { width: '100%', borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', overflow: 'hidden', minHeight: 200 },
  coverImage: { width: '100%', height: 200, resizeMode: 'cover' },
  editBadge: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  editBadgeText: { color: '#fff', fontSize: 12, fontFamily: 'Vazir-Bold' },
  coverPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 40 },
  coverPlaceholderIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  coverText: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  coverHintText: { fontSize: 12, fontFamily: 'Vazir', textAlign: 'center' },
  inputSection: { gap: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  sectionHint: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18, marginBottom: 4 },
  inputIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  mapCard: { borderWidth: 1, overflow: 'hidden' },
  mapHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1 },
  mapIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mapInfo: { flex: 1, gap: 2 },
  mapTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  mapSubtitle: { fontSize: 11, fontFamily: 'Vazir' },
  clearMapBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  coordsBox: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  coordsText: { fontSize: 11, fontFamily: 'Vazir-Medium' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, paddingHorizontal: 4 },
  errorText: { fontSize: 12, fontFamily: 'Vazir', flex: 1 },
  hintCard: { borderWidth: 1 },
  hintHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  hintTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  hintText: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 19 },
});