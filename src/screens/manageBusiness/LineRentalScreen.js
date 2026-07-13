// src/screens/manageBusiness/LineRentalScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Toast from '../../components/common/Toast';
import {
  LineRentalAdCard,
  CreateLineRentalAdSheet,
  LineRentalStats,
  LineRentalEmptyState,
} from '../../components/manageBusiness/lineRental';

// ═══════════ داده‌های موقت با نوع خدمت ═══════════
// src/screens/manageBusiness/LineRentalScreen.js

const MOCK_MY_ADS = [
  {
    id: 'lr_1',
    title: 'لاین ناخن با تجهیزات کامل VIP',
    serviceTypeId: 'nail',
    serviceTypeName: 'کاشت و طراحی ناخن',
    serviceTypeIcon: 'brush',
    serviceTypeColor: '#7B1FA2',
    collabType: 'percent',
    collabLabel: 'درصدی',
    percentSalon: 40,
    percentPartner: 60,
    priceDisplay: '۴۰-۶۰',
    description: 'لاین ناخن کامل با میز حرفه‌ای، دستگاه UV/LED، و مجموعه کامل لاک ژل. مناسب ناخن‌کار حرفه‌ای با سابقه کار حداقل ۲ سال.',
    lineImage: 'https://picsum.photos/400/400?random=70',
    status: 'active',
    createdAt: '۳ روز پیش',
    isOwner: true,
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
  {
    id: 'lr_2',
    title: 'لاین رنگ و مش با مواد اورجینال',
    serviceTypeId: 'hair_color',
    serviceTypeName: 'رنگ و مش مو',
    serviceTypeIcon: 'auto-awesome',
    serviceTypeColor: '#0277BD',
    collabType: 'combined',
    collabLabel: 'ترکیبی',
    combinedFixed: 3000000,
    combinedPercent: 30,
    priceDisplay: '۳,۰۰۰,۰۰۰ + ۳۰٪',
    description: 'لاین تخصصی رنگ و لایت با مواد ایتالیایی اورجینال. سرشور حرفه‌ای و نور طبیعی. محیط آرام و لوکس.',
    lineImage: 'https://picsum.photos/400/400?random=71',
    status: 'active',
    createdAt: '۱ هفته پیش',
    isOwner: true,
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
  {
    id: 'lr_3',
    title: 'لاین فیشیال و پاکسازی پوست',
    serviceTypeId: 'facial',
    serviceTypeName: 'فیشیال و پاکسازی پوست',
    serviceTypeIcon: 'face-retouching-natural',
    serviceTypeColor: '#C2185B',
    collabType: 'fixed',
    collabLabel: 'اجاره ثابت',
    fixedAmount: 5000000,
    priceDisplay: '۵,۰۰۰,۰۰۰ تومان',
    description: 'لاین فیشیال VIP با تخت حرفه‌ای، دستگاه هیدروفیشیال، بخار ازن‌دار و مجموعه کامل محصولات پوستی کره‌ای.',
    lineImage: 'https://picsum.photos/400/400?random=72',
    status: 'active',
    createdAt: '۲ هفته پیش',
    isOwner: true,
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
];

export default function LineRentalScreen({ navigation }) {
  const { colors } = useTheme();
  const [myAds, setMyAds] = useState(MOCK_MY_ADS);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const handleCreate = () => {
    setEditingAd(null);
    setCreateSheetVisible(true);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setCreateSheetVisible(true);
  };

  const handleDelete = (ad) => {
    Alert.alert(
      'حذف آگهی لاین',
      `آیا از حذف "${ad.title}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            setMyAds((prev) => prev.filter((a) => a.id !== ad.id));
            setToast({
              visible: true,
              message: 'آگهی لاین با موفقیت حذف شد',
              type: 'success',
            });
          },
        },
      ]
    );
  };

  const handleSave = (adData) => {
    if (editingAd) {
      setMyAds((prev) =>
        prev.map((a) => (a.id === editingAd.id ? { ...a, ...adData } : a))
      );
      setToast({
        visible: true,
        message: 'آگهی لاین با موفقیت ویرایش شد',
        type: 'success',
      });
    } else {
      setMyAds((prev) => [{ ...adData, isOwner: true }, ...prev]);
      setToast({
        visible: true,
        message: 'آگهی لاین با موفقیت ثبت شد',
        type: 'success',
      });
    }
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header title="اجاره لاین" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ═══════ Hero Section ═══════ */}
        <View style={s.heroSection}>
          <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="storefront" size={32} color={colors.primary} />
          </View>
          <Text style={[s.heroTitle, { color: colors.textMain }]}>اجاره لاین سالن</Text>
          <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
            لاین‌های خالی سالن خود را به متخصصان اجاره دهید و درآمد خود را افزایش دهید
          </Text>
        </View>

        {/* ═══════ Stats ═══════ */}
        {myAds.length > 0 && <LineRentalStats ads={myAds} />}

        {/* ═══════ دکمه ثبت آگهی ═══════ */}
        {myAds.length > 0 && (
          <TouchableOpacity
            onPress={handleCreate}
            activeOpacity={0.85}
            style={s.createBtn}
          >
            <View style={s.createBtnIconBox}>
              <Icon name="add" size={22} color="#fff" />
            </View>
            <View style={s.createBtnTextCol}>
              <Text style={s.createBtnTitle}>ثبت آگهی لاین جدید</Text>
              <Text style={s.createBtnSubtitle}>
                لاین خالی سالن خود را به متخصصان اجاره دهید
              </Text>
            </View>
            <Icon name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* ═══════ لیست آگهی‌ها ═══════ */}
        <View style={s.listContainer}>
          {myAds.length > 0 ? (
            myAds.map((ad) => (
              <LineRentalAdCard
                key={ad.id}
                ad={ad}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <LineRentalEmptyState onCreate={handleCreate} tabType="myAds" />
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ═══════ FAB ═══════ */}
      {myAds.length === 0 && (
        <TouchableOpacity
          style={[s.fab, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
          activeOpacity={0.85}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* ═══════ مدال ثبت/ویرایش ═══════ */}
      <CreateLineRentalAdSheet
        visible={createSheetVisible}
        onClose={() => {
          setCreateSheetVisible(false);
          setEditingAd(null);
        }}
        onSave={handleSave}
        editingAd={editingAd}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  heroIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 19,
    fontFamily: 'Vazir-Bold',
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#43A047',
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createBtnIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnTextCol: {
    flex: 1,
    gap: 2,
  },
  createBtnTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  createBtnSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 20,
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
});