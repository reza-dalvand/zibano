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
import Divider from '../../components/common/Divider';

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
    address: '',
    phone: '',
    logoUrl: null,
    instagram: '',
    telegram: '',
    workingHours: '',
  });

  // مقداردهی اولیه
  useEffect(() => {
    setFormData({
      name: businessData.name || '',
      categoryId: businessData.categoryId || null,
      address: businessData.address || '',
      phone: businessData.phone || '',
      logoUrl: businessData.logo || null,
      instagram: businessData.socialMedia?.instagram || '',
      telegram: businessData.socialMedia?.telegram || '',
      workingHours: businessData.workingHours || '',
    });
  }, [businessData]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickLogo = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets) {
      updateField('logoUrl', result.assets[0].uri);
    }
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

    updateBusinessInfo({
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      category: CATEGORIES.find((c) => c.id === formData.categoryId)?.label || '',
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      logo: formData.logoUrl,
      workingHours: formData.workingHours.trim(),
      socialMedia: {
        instagram: formData.instagram.trim(),
        telegram: formData.telegram.trim(),
      },
    });

    Alert.alert('موفقیت', 'اطلاعات کسب‌وکار با موفقیت بروزرسانی شد', [
      { text: 'باشه', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScreenWrapper padding={0} edges={['top']} keyboardAware>
      <Header title="تنظیمات سالن" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* لوگو */}
        <View style={s.logoSection}>
          <TouchableOpacity
            style={[
              s.logoPicker,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
            onPress={pickLogo}
            activeOpacity={0.8}
          >
            {formData.logoUrl ? (
              <Image source={{ uri: formData.logoUrl }} style={s.logoImage} />
            ) : (
              <View style={s.logoPlaceholder}>
                <Icon name="add-a-photo" size={32} color={colors.primary} />
                <Text
                  style={[s.logoPlaceholderText, { color: colors.textSecondary }]}
                >
                  آپلود لوگو
                </Text>
              </View>
            )}
            {formData.logoUrl && (
              <View style={s.changeLogoBadge}>
                <Icon name="edit" size={12} color="#fff" />
                <Text style={s.changeLogoText}>تغییر</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* اطلاعات پایه */}
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>
          اطلاعات پایه
        </Text>
        <Card variant="elevated" padding={16} radius={16}>
          <Input
            label="نام کسب‌وکار"
            placeholder="مثال: سالن زیبایی نیلارام"
            value={formData.name}
            onChangeText={(t) => updateField('name', t)}
            rightIcon={
              <Icon name="store" size={22} color={colors.textSecondary} />
            }
          />

          <Dropdown
            label="دسته‌بندی اصلی"
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
            rightIcon={
              <Icon name="phone" size={22} color={colors.textSecondary} />
            }
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

          <Input
            label="آدرس کامل"
            placeholder="آدرس دقیق سالن"
            value={formData.address}
            onChangeText={(t) => updateField('address', t)}
            multiline
            numberOfLines={3}
            rightIcon={
              <Icon name="location-on" size={22} color={colors.textSecondary} />
            }
          />
        </Card>

        <Divider spacing={20} />

        {/* شبکه‌های اجتماعی */}
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>
          شبکه‌های اجتماعی
        </Text>
        <Card variant="elevated" padding={16} radius={16}>
          <Input
            label="اینستاگرام"
            placeholder="آیدی اینستاگرام (بدون @)"
            value={formData.instagram}
            onChangeText={(t) => updateField('instagram', t)}
            rightIcon={<Icon name="photo-camera" size={22} color="#E1306C" />}
          />

          <Input
            label="تلگرام"
            placeholder="آیدی یا لینک تلگرام"
            value={formData.telegram}
            onChangeText={(t) => updateField('telegram', t)}
            rightIcon={<Icon name="send" size={22} color="#0088cc" />}
          />
        </Card>

        {/* دکمه ذخیره */}
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
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  logoPicker: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  logoPlaceholderText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  changeLogoBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  changeLogoText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginBottom: 10,
  },
  saveContainer: {
    marginTop: 24,
  },
});