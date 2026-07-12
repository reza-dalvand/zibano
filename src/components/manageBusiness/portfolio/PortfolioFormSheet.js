// src/components/manageBusiness/portfolio/PortfolioFormSheet.js
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
import { useTheme } from '../../../theme/ThemeContext';
import BottomSheet from '../../common/BottomSheet';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';

const MAX_DESCRIPTION_LENGTH = 300;

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function PortfolioFormSheet({ visible, onClose, onSave, editingPortfolio, services }) {
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceId, setServiceId] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (visible) {
      if (editingPortfolio) {
        setTitle(editingPortfolio.title || '');
        setDescription((editingPortfolio.description || '').slice(0, MAX_DESCRIPTION_LENGTH));
        setServiceId(editingPortfolio.serviceId || null);
        setImages(editingPortfolio.images || (editingPortfolio.coverImage ? [editingPortfolio.coverImage] : []));
      } else {
        setTitle('');
        setDescription('');
        setServiceId(null);
        setImages([]);
      }
    }
  }, [visible, editingPortfolio]);

  const serviceOptions = (services || []).map(s => ({ id: s.id, label: s.name }));

  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5 - images.length,
    });
    if (!result.didCancel && result.assets) {
      const newImages = result.assets.map(a => a.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 🎯 هندلر تغییر توضیحات با محدودیت ۳۰۰ کاراکتر
  const handleDescriptionChange = (text) => {
    if (text.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(text);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('خطا', 'عنوان نمونه‌کار را وارد کنید');
      return;
    }
    if (images.length === 0) {
      Alert.alert('خطا', 'حداقل یک تصویر انتخاب کنید');
      return;
    }
    onSave(
      { title: title.trim(), description: description.trim(), serviceId, coverImage: images[0], images },
      editingPortfolio?.id
    );
    onClose();
  };

  // 🎯 محاسبه تعداد کاراکترهای باقی‌مانده
  const remainingChars = MAX_DESCRIPTION_LENGTH - description.length;
  const isNearLimit = remainingChars <= 50;
  const isAtLimit = remainingChars === 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={editingPortfolio ? 'ویرایش نمونه‌کار' : 'افزودن نمونه‌کار جدید'}
      snapPoint={0.9}
      footer={
        <Button
          title={editingPortfolio ? 'ذخیره تغییرات' : 'افزودن نمونه‌کار'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Icon name="check" size={20} color="#fff" />}
          iconPosition="right"
        />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <Input
          label="عنوان نمونه‌کار *"
          placeholder="مثال: فیشیال VIP عروس"
          value={title}
          onChangeText={setTitle}
          rightIcon={<Icon name="label" size={22} color={colors.textSecondary} />}
        />

        {/* 🎯 فیلد توضیحات با محدودیت ۳۰۰ کاراکتر */}
        <View style={s.descriptionWrapper}>
          <Input
            label="توضیحات (اختیاری)"
            placeholder="توضیحاتی درباره این نمونه‌کار... (حداکثر ۳۰۰ کاراکتر)"
            value={description}
            onChangeText={handleDescriptionChange}
            multiline
            numberOfLines={4}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rightIcon={<Icon name="notes" size={22} color={colors.textSecondary} />}
          />
          
          {/* 🎯 شمارنده کاراکترها */}
          <View style={s.charCounterRow}>
            <View style={s.charCounterLeft}>
              <Icon name="text-fields" size={12} color={isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.textSecondary} />
              <Text style={[s.charCounterText, { 
                color: isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.textSecondary 
              }]}>
                {toPersianDigit(description.length)} از {toPersianDigit(MAX_DESCRIPTION_LENGTH)} کاراکتر
              </Text>
            </View>
            
            {/* نوار پیشرفت */}
            <View style={[s.charProgressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  s.charProgressFill,
                  {
                    width: `${(description.length / MAX_DESCRIPTION_LENGTH) * 100}%`,
                    backgroundColor: isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.primary,
                  },
                ]}
              />
            </View>
          </View>

          {/* 🎯 هشدار نزدیک به محدودیت */}
          {isNearLimit && !isAtLimit && (
            <View style={[s.charWarning, { backgroundColor: '#FF980010', borderColor: '#FF980030' }]}>
              <Icon name="warning" size={12} color="#FF9800" />
              <Text style={s.charWarningText}>
                فقط {toPersianDigit(remainingChars)} کاراکتر باقی مانده است
              </Text>
            </View>
          )}

          {/* 🎯 پیام محدودیت کامل */}
          {isAtLimit && (
            <View style={[s.charWarning, { backgroundColor: '#E5393510', borderColor: '#E5393530' }]}>
              <Icon name="error-outline" size={12} color="#E53935" />
              <Text style={[s.charWarningText, { color: '#E53935' }]}>
                به حداکثر تعداد کاراکتر رسیدید
              </Text>
            </View>
          )}
        </View>

        {serviceOptions.length > 0 && (
          <Dropdown
            label="خدمت مرتبط"
            placeholder="خدمت مرتبط را انتخاب کنید"
            value={serviceId}
            options={serviceOptions}
            onSelect={setServiceId}
          />
        )}

        {/* بخش تصاویر */}
        <View style={s.imagesSection}>
          <View style={s.imagesHeader}>
            <Text style={[s.imagesLabel, { color: colors.textMain }]}>
              تصاویر نمونه‌کار *
            </Text>
            <View style={[s.imagesCount, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[s.imagesCountText, { color: colors.primary }]}>
                {toPersianDigit(images.length)} از ۵
              </Text>
            </View>
          </View>
          <Text style={[s.imagesHint, { color: colors.textSecondary }]}>
            اولین تصویر به عنوان کاور نمایش داده می‌شود (حداکثر ۵ تصویر)
          </Text>

          <View style={s.imagesGrid}>
            {images.map((img, index) => (
              <View key={index} style={s.imageItem}>
                <Image source={{ uri: img }} style={s.imageThumb} />
                <TouchableOpacity style={s.removeImageBtn} onPress={() => removeImage(index)}>
                  <Icon name="close" size={14} color="#fff" />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={s.coverBadge}>
                    <Icon name="star" size={10} color="#fff" />
                    <Text style={s.coverBadgeText}>کاور</Text>
                  </View>
                )}
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity
                style={[s.addImageBtn, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}
                onPress={pickImages}
              >
                <Icon name="add-a-photo" size={28} color={colors.primary} />
                <Text style={[s.addImageText, { color: colors.primary }]}>افزودن</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  
  // 🎯 استایل‌های شمارنده کاراکتر
  descriptionWrapper: {
    marginBottom: 8,
  },
  charCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -10,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  charCounterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  charCounterText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  charProgressBar: {
    flex: 1,
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
  
  imagesSection: { marginTop: 8 },
  imagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  imagesLabel: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  imagesCount: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  imagesCountText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  imagesHint: { fontSize: 11, fontFamily: 'Vazir', marginBottom: 12 },
  imagesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageItem: { position: 'relative', width: '31%', aspectRatio: 1 },
  imageThumb: { width: '100%', height: '100%', borderRadius: 12 },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  coverBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  coverBadgeText: { color: '#fff', fontSize: 9, fontFamily: 'Vazir-Bold' },
  addImageBtn: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addImageText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
});