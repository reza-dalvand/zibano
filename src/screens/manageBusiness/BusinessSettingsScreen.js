// src/screens/manageBusiness/BusinessSettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/ThemeContext';
import { useBusiness } from '../../context/BusinessContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MapPicker from '../../components/common/MapPicker';
import { PROVINCES, CITIES } from '../../constants/exploreFilters';

const CATEGORIES = [
  { id: '1', label: 'سالن زیبایی (چند منظوره)' },
  { id: '2', label: 'کلینیک پوست و مو' },
  { id: '3', label: 'مرکز لیزر' },
  { id: '4', label: 'مرکز کاشت ناخن' },
  { id: '5', label: 'مرکز کراتین و رنگ مو' },
];

export default function BusinessSettingsScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData, updateBusinessInfo } = useBusiness();
  const [formData, setFormData] = useState({
    name: '',
    categoryId: null,
    provinceId: null,
    cityId: null,
    address: '',
    phone: '',
    coverUrl: null,
    workingHours: '',
    location: null,
  });

  // مقداردهی اولیه از Context
  useEffect(() => {
    setFormData({
      name: businessData.name || '',
      categoryId: businessData.categoryId || null,
      provinceId: businessData.provinceId || null,
      cityId: businessData.cityId || null,
      address: businessData.address || '',
      phone: businessData.phone || '',
      coverUrl: businessData.coverUrl || businessData.logo || null,
      workingHours: businessData.workingHours || '',
      location: businessData.location || null,
    });
  }, [businessData]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // 🎯 هندلر تغییر استان - ریست کردن شهر
  const handleProvinceChange = (provinceId) => {
    updateField('provinceId', provinceId);
    updateField('cityId', null);
  };

  // 🎯 هندلر تغییر شهر
  const handleCityChange = (cityId) => {
    updateField('cityId', cityId);
  };

  const pickCover = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets) {
      updateField('coverUrl', result.assets[0].uri);
    }
  };

  const handleLocationSelect = (location, mapAddress) => {
    setFormData((prev) => ({
      ...prev,
      location,
      address: mapAddress || prev.address,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('خطا', 'نام کسب‌وکار را وارد کنید');
      return;
    }
    if (!formData.categoryId) {
      Alert.alert('خطا', 'دسته‌بندی را انتخاب کنید');
      return;
    }
    if (!formData.provinceId) {
      Alert.alert('خطا', 'استان را انتخاب کنید');
      return;
    }
    if (!formData.cityId) {
      Alert.alert('خطا', 'شهر را انتخاب کنید');
      return;
    }
    updateBusinessInfo({
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      category:
        CATEGORIES.find((c) => c.id === formData.categoryId)?.label || '',
      provinceId: formData.provinceId,
      cityId: formData.cityId,
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      coverUrl: formData.coverUrl,
      logo: formData.coverUrl,
      workingHours: formData.workingHours.trim(),
      location: formData.location,
    });
    Alert.alert('موفقیت', 'اطلاعات کسب‌وکار با موفقیت بروزرسانی شد', [
      { text: 'باشه', onPress: () => navigation.goBack() },
    ]);
  };

  // 🎯 پیدا کردن label استان و شهر برای نمایش
  const getProvinceLabel = () => {
    const province = PROVINCES.find((p) => p.id === formData.provinceId);
    return province ? province.label : null;
  };

  const getCityLabel = () => {
    if (!formData.provinceId) return null;
    const cities = CITIES[formData.provinceId] || [];
    const city = cities.find((c) => c.id === formData.cityId);
    return city ? city.label : null;
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']} keyboardAware>
      <Header title="تنظیمات کسب‌وکار" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══════════════ کاور کسب‌وکار ═══════════════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#E91E6318' }]}>
              <Icon name="panorama" size={18} color="#E91E63" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              تصویر کاور
            </Text>
          </View>
          <Card variant="default" padding={14} radius={16}>
            <Text style={[s.coverHint, { color: colors.textSecondary }]}>
              تصویر کاور در بالای صفحه پروفایل نمایش داده می‌شود
            </Text>
            <TouchableOpacity
              style={[
                s.coverPicker,
                {
                  borderColor: formData.coverUrl
                    ? colors.primary
                    : colors.border,
                  borderStyle: formData.coverUrl ? 'solid' : 'dashed',
                },
              ]}
              onPress={pickCover}
              activeOpacity={0.85}
            >
              {formData.coverUrl ? (
                <View style={s.coverImageWrap}>
                  <Image
                    source={{ uri: formData.coverUrl }}
                    style={s.coverImage}
                  />
                  <View
                    style={[
                      s.coverEditBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Icon name="edit" size={12} color="#fff" />
                    <Text style={s.coverEditText}>تغییر کاور</Text>
                  </View>
                </View>
              ) : (
                <View style={s.coverPlaceholder}>
                  <View
                    style={[
                      s.coverPlaceholderIcon,
                      { backgroundColor: colors.primary + '20' },
                    ]}
                  >
                    <Icon name="add-a-photo" size={36} color={colors.primary} />
                  </View>
                  <Text
                    style={[s.coverPlaceholderTitle, { color: colors.textMain }]}
                    numberOfLines={1}
                  >
                    آپلود کاور کسب‌وکار
                  </Text>
                  <Text
                    style={[
                      s.coverPlaceholderHint,
                      { color: colors.textSecondary },
                    ]}
                  >
                    ابعاد پیشنهادی: ۱۲۰۰×۴۰۰ پیکسل
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Card>
        </View>

        {/* ═══════════════ اطلاعات پایه ═══════════════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: colors.primary + '18' }]}>
              <Icon name="info" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              اطلاعات پایه
            </Text>
          </View>
          <Card variant="default" padding={16} radius={16}>
            <Input
              label="نام کسب‌وکار *"
              placeholder="مثال: سالن زیبایی نیلارام"
              value={formData.name}
              onChangeText={(t) => updateField('name', t)}
              rightIcon={<Icon name="store" size={22} color={colors.textSecondary} />}
            />
            <Dropdown
              label="دسته‌بندی اصلی *"
              placeholder="انتخاب نوع خدمات"
              value={formData.categoryId}
              options={CATEGORIES}
              onSelect={(v) => updateField('categoryId', v)}
            />
            <Input
              label="شماره تماس"
              placeholder="مثال: ۰۲۱-۲۲۳۳۴۴۵۵"
              value={formData.phone}
              onChangeText={(t) => updateField('phone', t)}
              keyboardType="phone-pad"
              rightIcon={<Icon name="phone" size={22} color={colors.textSecondary} />}
            />
            <Input
              label="ساعات کاری"
              placeholder="مثال: شنبه تا پنج‌شنبه ۱۰ الی ۲۰"
              value={formData.workingHours}
              onChangeText={(t) => updateField('workingHours', t)}
              rightIcon={
                <Icon name="schedule" size={22} color={colors.textSecondary} />
              }
            />
          </Card>
        </View>

        {/* ═══════════════ موقعیت مکانی (جدید!) ═══════════════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#2196F318' }]}>
              <Icon name="location-city" size={18} color="#2196F3" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              موقعیت مکانی
            </Text>
          </View>
          <Card variant="default" padding={16} radius={16}>
            <Dropdown
              label="استان *"
              placeholder="انتخاب استان"
              value={formData.provinceId}
              options={PROVINCES}
              onSelect={handleProvinceChange}
            />
            <Dropdown
              label="شهر *"
              placeholder={
                formData.provinceId
                  ? 'انتخاب شهر'
                  : 'ابتدا استان را انتخاب کنید'
              }
              value={formData.cityId}
              options={
                formData.provinceId ? CITIES[formData.provinceId] || [] : []
              }
              onSelect={handleCityChange}
            />
            {/* نمایش انتخاب‌ها */}
            {(getProvinceLabel() || getCityLabel()) && (
              <View
                style={[
                  s.locationSummaryBox,
                  {
                    backgroundColor: colors.primary + '10',
                    borderColor: colors.primary + '30',
                  },
                ]}
              >
                <Icon name="location-on" size={14} color={colors.primary} />
                <Text style={[s.locationSummaryText, { color: colors.primary }]}>
                  {getProvinceLabel()}
                  {getCityLabel() && ` > ${getCityLabel()}`}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* ═══════════════ آدرس و موقعیت ═══════════════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#E5393518' }]}>
              <Icon name="location-on" size={18} color="#E53935" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              آدرس و موقعیت مکانی
            </Text>
          </View>
          <Card variant="default" padding={16} radius={16}>
            <Input
              label="آدرس دقیق"
              placeholder="آدرس کسب‌وکار خود را وارد کنید"
              value={formData.address}
              onChangeText={(t) => updateField('address', t)}
              multiline
              numberOfLines={2}
              rightIcon={
                <Icon name="location-on" size={22} color="#E53935" />
              }
            />
            {/* راهنمای نقشه */}
            <View
              style={[
                s.mapHintBox,
                {
                  backgroundColor: colors.primary + '08',
                  borderColor: colors.primary + '25',
                },
              ]}
            >
              <Icon name="info-outline" size={14} color={colors.primary} />
              <Text
                style={[s.mapHintText, { color: colors.textSecondary }]}
              >
                با تپ روی نقشه یا جابه‌جا کردن پین، موقعیت دقیق کسب‌وکار
                خود را مشخص کنید
              </Text>
            </View>
            {/* MapPicker */}
            <View
              style={[
                s.mapWrapper,
                { borderColor: colors.border },
              ]}
            >
              <MapPicker
                initialLocation={formData.location}
                onLocationSelect={handleLocationSelect}
                height={260}
              />
            </View>
            {/* نمایش مختصات */}
            {formData.location && (
              <View
                style={[
                  s.coordsBox,
                  {
                    backgroundColor: colors.primary + '10',
                    borderColor: colors.primary + '30',
                  },
                ]}
              >
                <Icon name="my-location" size={14} color={colors.primary} />
                <Text style={[s.coordsText, { color: colors.primary }]}>
                  مختصات: {formData.location.latitude.toFixed(5)},{' '}
                  {formData.location.longitude.toFixed(5)}
                </Text>
                <View style={{ flex: 1 }} />
                <Icon name="check-circle" size={16} color="#4CAF50" />
              </View>
            )}
          </Card>
        </View>

        {/* ═══════════════ دکمه ذخیره ═══════════════ */}
        <View style={s.saveContainer}>
          <Button
            title="ذخیره تغییرات"
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
          />
          <Text style={[s.saveHint, { color: colors.textSecondary }]}>
            تغییرات پس از ذخیره در پروفایل عمومی کسب‌وکار نمایش داده می‌شود
          </Text>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingTop: 12,
  },
  // ═══════════════ بخش‌ها ═══════════════
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 2,
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
  // ═══════════════ کاور ═══════════════
  coverHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
    marginBottom: 10,
    lineHeight: 18,
  },
  coverPicker: {
    width: '100%',
    aspectRatio: 2,
    minHeight: 170,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  coverImageWrap: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverEditBadge: {
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
  coverEditText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  coverPlaceholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  coverPlaceholderTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    width: '100%',
  },
  coverPlaceholderHint: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  // ═══════════════ 🎯 موقعیت مکانی (جدید) ═══════════════
  locationSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  locationSummaryText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  // ═══════════════ نقشه ═══════════════
  mapHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  mapHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 17,
  },
  mapWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  coordsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  coordsText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  // ═══════════════ دکمه ذخیره ═══════════════
  saveContainer: {
    marginTop: 8,
    gap: 10,
    alignItems: 'center',
  },
  saveHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});