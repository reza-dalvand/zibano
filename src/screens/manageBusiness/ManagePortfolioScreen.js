// src/screens/manageBusiness/ManagePortfolioScreen.js
import React, { useState } from 'react';
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
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Dropdown from '../../components/common/Dropdown';
import BottomSheet from '../../components/common/BottomSheet';
import EmptyState from '../../components/common/EmptyState';

export default function ManagePortfolioScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData, addPortfolio, updatePortfolio, deletePortfolio } =
    useBusiness();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceId, setServiceId] = useState(null);
  const [images, setImages] = useState([]);

  const serviceOptions = (businessData.services || []).map((s) => ({
    id: s.id,
    label: s.name,
  }));

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setServiceId(null);
    setImages([]);
    setEditing(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (pf) => {
    setEditing(pf);
    setTitle(pf.title || '');
    setDescription(pf.description || '');
    setServiceId(pf.serviceId || null);
    setImages(pf.images || (pf.coverImage ? [pf.coverImage] : []));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5,
    });
    if (!result.didCancel && result.assets) {
      const newImages = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newImages].slice(0, 8));
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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

    const portfolioData = {
      title: title.trim(),
      description: description.trim(),
      serviceId,
      coverImage: images[0],
      images,
    };

    if (editing) {
      updatePortfolio(editing.id, portfolioData);
    } else {
      addPortfolio(portfolioData);
    }
    closeModal();
  };

  const handleDelete = (pf) => {
    Alert.alert(
      'حذف نمونه‌کار',
      `آیا از حذف "${pf.title}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => deletePortfolio(pf.id),
        },
      ]
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['top']}>
      <Header title="نمونه‌کارها" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {businessData.portfolios && businessData.portfolios.length > 0 ? (
          <View style={s.gridContainer}>
            {businessData.portfolios.map((pf) => (
              <Card
                key={pf.id}
                variant="elevated"
                padding={0}
                radius={16}
                style={s.portfolioCard}
              >
                <Image
                  source={{ uri: pf.coverImage || pf.images?.[0] }}
                  style={s.portfolioImage}
                />
                {pf.images && pf.images.length > 1 && (
                  <View style={s.imageCountBadge}>
                    <Icon name="collections" size={12} color="#fff" />
                    <Text style={s.imageCountText}>{pf.images.length}</Text>
                  </View>
                )}
                <View style={s.portfolioInfo}>
                  <Text
                    style={[s.portfolioTitle, { color: colors.textMain }]}
                    numberOfLines={1}
                  >
                    {pf.title}
                  </Text>
                  {pf.serviceId && (
                    <Text
                      style={[s.portfolioService, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {businessData.services?.find((s) => s.id === pf.serviceId)
                        ?.name || '—'}
                    </Text>
                  )}
                  <View style={s.portfolioActions}>
                    <TouchableOpacity
                      onPress={() => openEditModal(pf)}
                      style={s.actionBtn}
                    >
                      <Icon name="edit" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(pf)}
                      style={s.actionBtn}
                    >
                      <Icon name="delete-outline" size={18} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="🖼️"
            title="هنوز نمونه‌کاری ثبت نکرده‌اید"
            description="نمونه‌کارهای خود را آپلود کنید تا مشتریان کیفیت کار شما را ببینند"
            actionLabel="افزودن اولین نمونه‌کار"
            onAction={openAddModal}
          />
        )}
      </ScrollView>

      {businessData.portfolios && businessData.portfolios.length > 0 && (
        <View style={s.fabContainer}>
          <TouchableOpacity
            style={[s.fab, { backgroundColor: colors.primary }]}
            onPress={openAddModal}
            activeOpacity={0.85}
          >
            <Icon name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* BottomSheet افزودن/ویرایش */}
      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editing ? 'ویرایش نمونه‌کار' : 'افزودن نمونه‌کار جدید'}
        snapPoint={0.85}
        footer={
          <Button
            title={editing ? 'ذخیره تغییرات' : 'افزودن نمونه‌کار'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
          />
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Input
            label="عنوان نمونه‌کار"
            placeholder="مثال: فیشیال VIP عروس"
            value={title}
            onChangeText={setTitle}
            rightIcon={
              <Icon name="label" size={22} color={colors.textSecondary} />
            }
          />

          <Input
            label="توضیحات (اختیاری)"
            placeholder="توضیحاتی درباره این نمونه‌کار..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {serviceOptions.length > 0 && (
            <Dropdown
              label="خدمت مرتبط"
              placeholder="خدمت مرتبط را انتخاب کنید"
              value={serviceId}
              options={serviceOptions}
              onSelect={setServiceId}
            />
          )}

          <Text style={[s.imagesLabel, { color: colors.textMain }]}>
            تصاویر نمونه‌کار
          </Text>
          <Text style={[s.imagesHint, { color: colors.textSecondary }]}>
            اولین تصویر به عنوان کاور نمایش داده می‌شود
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.imagesRow}
          >
            {images.map((img, index) => (
              <View key={index} style={s.imageItem}>
                <Image source={{ uri: img }} style={s.imageThumb} />
                <TouchableOpacity
                  style={s.removeImageBtn}
                  onPress={() => removeImage(index)}
                >
                  <Icon name="close" size={14} color="#fff" />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={s.coverBadge}>
                    <Text style={s.coverBadgeText}>کاور</Text>
                  </View>
                )}
              </View>
            ))}
            {images.length < 8 && (
              <TouchableOpacity
                style={[
                  s.addImageBtn,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={pickImages}
              >
                <Icon name="add-a-photo" size={28} color={colors.primary} />
                <Text
                  style={[s.addImageText, { color: colors.primary }]}
                >
                  افزودن
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </ScrollView>
      </BottomSheet>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  portfolioCard: {
    width: '48%',
    marginBottom: 0,
  },
  portfolioImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  portfolioInfo: {
    padding: 10,
    gap: 6,
  },
  portfolioTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  portfolioService: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  portfolioActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  imagesLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  imagesHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    marginBottom: 10,
  },
  imagesRow: {
    gap: 10,
    paddingRight: 4,
  },
  imageItem: {
    position: 'relative',
  },
  imageThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
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
  },
  coverBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Vazir-Bold',
  },
  addImageBtn: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addImageText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});