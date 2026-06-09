// src/components/manager/BasicInfoStep.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/ThemeContext';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';

export default function BasicInfoStep({ formData, onUpdate }) {
  const { colors } = useTheme();

  const pickImage = async (field) => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && result.assets) {
      onUpdate(field, result.assets[0].uri);
    }
  };

  return (
    <View style={s.container}>
      <Text style={[s.stepTitle, { color: colors.textMain }]}>
        اطلاعات پایه سالن
      </Text>
      <Text style={[s.stepHint, { color: colors.textSecondary }]}>
        اطلاعات اصلی کسب‌وکار خود را وارد کنید
      </Text>

      {/* دکمه انتخاب لوگو */}
      <TouchableOpacity
        style={[
          s.logoPicker,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
        onPress={() => pickImage('logoUrl')}
        activeOpacity={0.8}
      >
        {formData.logoUrl ? (
          <Image source={{ uri: formData.logoUrl }} style={s.logoImage} />
        ) : (
          <View style={s.logoPlaceholder}>
            <Icon name="add-a-photo" size={32} color={colors.primary} />
            <Text style={[s.logoText, { color: colors.textSecondary }]}>
              آپلود لوگو
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Input
        label="نام کسب‌وکار"
        placeholder="مثال: سالن زیبایی نیلارام"
        value={formData.name}
        onChangeText={(txt) => onUpdate('name', txt)}
        rightIcon={<Icon name="store" size={22} color={colors.textSecondary} />}
      />

      <Dropdown
        label="دسته‌بندی اصلی"
        placeholder="انتخاب نوع خدمات"
        value={formData.categoryId}
        options={[
          { id: '1', label: 'سالن زیبایی (چند منظوره)' },
          { id: '2', label: 'کلینیک پوست و مو' },
          { id: '3', label: 'مرکز لیزر' },
          { id: '4', label: 'مرکز کاشت ناخن' },
          { id: '5', label: 'مرکز کراتین و رنگ مو' },
        ]}
        onSelect={(val) => onUpdate('categoryId', val)}
      />

      <Input
        label="آدرس دقیق"
        placeholder="آدرس کامل سالن را وارد کنید"
        value={formData.address}
        onChangeText={(txt) => onUpdate('address', txt)}
        multiline
        numberOfLines={3}
        rightIcon={<Icon name="location-on" size={22} color={colors.textSecondary} />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  stepHint: {
    fontSize: 13,
    fontFamily: 'Vazir',
    marginBottom: 24,
    textAlign: 'right',
    lineHeight: 20,
  },
  logoPicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  logoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
});