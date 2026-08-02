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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../stores/useThemeStore';
import BottomSheet from '../../common/BottomSheet';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Card from '../../common/Card';
import CharCounter from '../../common/CharCounter';
import { toPersianDigit } from '../../../utils/numberUtils';

const MAX_DESCRIPTION_LENGTH = 300;
const MAX_IMAGES = 5;

export default function PortfolioFormSheet({
  visible,
  onClose,
  onSave,
  editingPortfolio,
  services,
}) {
  const { colors } = useTheme();
  const isEditMode = !!editingPortfolio;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceId, setServiceId] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  // 🎯 Reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (editingPortfolio) {
        setTitle(editingPortfolio.title || '');
        setDescription(
          (editingPortfolio.description || '').slice(0, MAX_DESCRIPTION_LENGTH)
        );
        setServiceId(editingPortfolio.serviceId || null);
        setImages(
          editingPortfolio.images ||
            (editingPortfolio.coverImage ? [editingPortfolio.coverImage] : [])
        );
      } else {
        setTitle('');
        setDescription('');
        setServiceId(null);
        setImages([]);
      }
      setErrors({});
      setIsSaving(false);
    }
  }, [visible, editingPortfolio]);

  const serviceOptions = (services || []).map((s) => ({
    id: s.id,
    label: s.name,
  }));

  // 🎯 انتخاب تصاویر
  const pickImages = async () => {
    setIsPicking(true);
    try {
      const remainingSlots = MAX_IMAGES - images.length;
      if (remainingSlots <= 0) {
        Alert.alert(
          'حداکثر تعداد',
          `حداکثر ${MAX_IMAGES} تصویر می‌توانید اضافه کنید`
        );
        setIsPicking(false);
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (result.didCancel) {
        setIsPicking(false);
        return;
      }

      if (result.errorCode) {
        Alert.alert('خطا', result.errorMessage || 'خطا در انتخاب تصویر');
        setIsPicking(false);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((a) => a.uri);
        setImages((prev) => [...prev, ...newImages].slice(0, MAX_IMAGES));
        if (errors.images) setErrors((prev) => ({ ...prev, images: '' }));
      }
    } catch (error) {
      Alert.alert('خطا', 'مشکلی در انتخاب تصویر پیش آمد');
    }
    setIsPicking(false);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsCover = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      const [cover] = newImages.splice(index, 1);
      return [cover, ...newImages];
    });
  };

  // 🎯 Validation و Save
  const handleSave = async () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'عنوان نمونه‌کار الزامی است';
    } else if (title.trim().length < 3) {
      newErrors.title = 'عنوان باید حداقل ۳ کاراکتر باشد';
    }

    if (images.length === 0) {
      newErrors.images = 'حداقل یک تصویر انتخاب کنید';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    // شبیه‌سازی تاخیر شبکه
    await new Promise((r) => setTimeout(r, 500));

    const portfolioData = {
      title: title.trim(),
      description: description.trim(),
      serviceId,
      coverImage: images[0],
      images,
    };

    onSave(portfolioData, editingPortfolio?.id);
    setIsSaving(false);
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const descLength = description.length;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={isEditMode ? 'ویرایش نمونه‌کار' : 'افزودن نمونه‌کار جدید'}
      snapPoint={0.92}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══════════ عنوان ═══════════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="label" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              اطلاعات اصلی
            </Text>
          </View>

          <Input
            label="عنوان نمونه‌کار *"
            placeholder="مثال: فیشیال VIP عروس"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            rightIcon={<Icon name="title" size={20} color={colors.textSecondary} />}
          />

          <View style={s.descriptionWrapper}>
            <Input
              label="توضیحات (اختیاری)"
              placeholder="توضیحاتی درباره این نمونه‌کار..."
              value={description}
              onChangeText={(t) => {
                if (t.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescription(t);
                }
              }}
              multiline
              numberOfLines={3}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rightIcon={<Icon name="notes" size={20} color={colors.textSecondary} />}
            />
            <CharCounter current={descLength} max={MAX_DESCRIPTION_LENGTH} />
          </View>

          {serviceOptions.length > 0 && (
            <Dropdown
              label="خدمت مرتبط (اختیاری)"
              placeholder="خدمت مرتبط را انتخاب کنید"
              value={serviceId}
              options={serviceOptions}
              onSelect={setServiceId}
            />
          )}
        </View>

        {/* ═══════════ تصاویر ═══════════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#FF980018' }]}>
              <Icon name="photo-camera" size={18} color="#FF9800" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              تصاویر نمونه‌کار
            </Text>
            <View style={{ flex: 1 }} />
            <View style={[s.imagesCountBadge, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[s.imagesCountText, { color: colors.primary }]}>
                {toPersianDigit(images.length)} از {toPersianDigit(MAX_IMAGES)}
              </Text>
            </View>
          </View>

          {errors.images && (
            <View style={[s.errorBox, { backgroundColor: '#E5393510', borderColor: '#E5393540' }]}>
              <Icon name="error-outline" size={14} color="#E53935" />
              <Text style={[s.errorText, { color: '#E53935' }]}>{errors.images}</Text>
            </View>
          )}

          {/* راهنما */}
          <Card
            variant="default"
            padding={10}
            radius={12}
            style={[s.hintCard, { borderColor: colors.primary + '25', backgroundColor: colors.primary + '08' }]}
          >
            <Icon name="info-outline" size={14} color={colors.primary} />
            <Text style={[s.hintText, { color: colors.textSecondary }]}>
              اولین تصویر به عنوان کاور نمایش داده می‌شود. برای تغییر کاور، روی
              تصویر ضربه بزنید.
            </Text>
          </Card>

          {/* Grid تصاویر */}
          <View style={s.imagesGrid}>
            {images.map((img, index) => (
              <View key={index} style={s.imageItem}>
                <TouchableOpacity
                  onPress={() => setAsCover(index)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: img }} style={s.imageThumb} />
                  {index === 0 && (
                    <View style={[s.coverBadge, { backgroundColor: '#FFC107' }]}>
                      <Icon name="star" size={9} color="#fff" />
                      <Text style={s.coverBadgeText}>کاور</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.removeImageBtn, { backgroundColor: '#E53935' }]}
                  onPress={() => removeImage(index)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Icon name="close" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {/* دکمه افزودن */}
            {images.length < MAX_IMAGES && (
              <TouchableOpacity
                style={[
                  s.addImageBtn,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: isPicking ? colors.textSecondary : colors.primary,
                    borderStyle: 'dashed',
                  },
                ]}
                onPress={pickImages}
                disabled={isPicking}
                activeOpacity={0.7}
              >
                {isPicking ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <Icon name="add-a-photo" size={24} color={colors.primary} />
                    <Text style={[s.addImageText, { color: colors.primary }]}>
                      افزودن
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ═══════════ فاصله برای footer ═══════════ */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ═══════════ Footer ثابت ═══════════ */}
      <View
        style={[
          s.footer,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={s.footerRow}>
          <Button
            title="انصراف"
            onPress={handleClose}
            variant="outline"
            size="lg"
            style={s.halfBtn}
            disabled={isSaving}
          />
          <Button
            title={
              isSaving
                ? 'در حال ذخیره...'
                : isEditMode
                ? 'ذخیره تغییرات'
                : 'افزودن نمونه‌کار'
            }
            onPress={handleSave}
            variant="primary"
            size="lg"
            style={s.halfBtn}
            loading={isSaving}
            disabled={isSaving}
            icon={
              !isSaving ? (
                <Icon name="check" size={18} color="#fff" />
              ) : null
            }
            iconPosition="right"
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  // ═══════════ Section ═══════════
  section: {
    marginBottom: 20,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
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
    width: '100%',
  },
  descriptionWrapper: {
    gap: 4,
  },
  // ═══════════ Error ═══════════
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  // ═══════════ Hint ═══════════
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  hintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 17,
  },
  // ═══════════ Images ═══════════
  imagesCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  imagesCountText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageItem: {
    position: 'relative',
    width: '31%',
    aspectRatio: 1,
  },
  imageThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
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
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  coverBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Vazir-Bold',
  },
  addImageBtn: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 6,
  },
  addImageText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  // ═══════════ Footer ═══════════
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfBtn: {
    flex: 1,
  },
});