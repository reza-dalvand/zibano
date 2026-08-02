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
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Toast from '../../components/common/Toast';
import {
  LineRentalAdCard,
  CreateLineRentalAdSheet,
  LineRentalStats,
  LineRentalEmptyState,
} from '../../components/manageBusiness/lineRental';
import LineRentalDetailModal from '../../components/manageBusiness/lineRental/LineRentalDetailModal';
import { toJalaali } from '../../utils/dateUtils';

// ═══════════ داده‌های موقت با تاریخ‌های شمسی کامل ═══════════
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
    createdAt: '1405/04/11',
    expiresAt: '1405/05/11',
    isOwner: true,
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
  {
    id: 'lr_2',
    title: 'لاین میکاپ و گریم حرفه‌ای',
    serviceTypeId: 'makeup',
    serviceTypeName: 'میکاپ و گریم',
    serviceTypeIcon: 'palette',
    serviceTypeColor: '#AD1457',
    collabType: 'hourly',
    collabLabel: 'ساعتی',
    hourlyRate: 150000,
    priceDisplay: '۱۵۰,۰۰۰ / ساعت',
    description: 'لاین میکاپ با نور طبیعی، آینه LED حرفه‌ای و میز گریم کامل. مناسب میکاپ‌آرتیست‌های حرفه‌ای که برای پروژه‌های کوتاه‌مدت نیاز به فضا دارند.',
    lineImage: 'https://picsum.photos/400/400?random=71',
    status: 'active',
    createdAt: '1405/04/04',
    expiresAt: '1405/05/04',
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
    fixedDeposit: 20000000,
    priceDisplay: '۵,۰۰۰,۰۰۰ + ۲۰,۰۰۰,۰۰۰ رهن',
    description: 'لاین فیشیال VIP با تخت حرفه‌ای، دستگاه هیدروفیشیال، بخار ازن‌دار و مجموعه کامل محصولات پوستی کره‌ای.',
    lineImage: 'https://picsum.photos/400/400?random=72',
    status: 'active',
    createdAt: '1405/03/27',
    expiresAt: '1405/04/27',
    isOwner: true,
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    contactPhone: '09121234567',
  },
  {
    id: 'lr_4',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeId: 'laser',
    serviceTypeName: 'لیزر موهای زائد',
    serviceTypeIcon: 'flash-on',
    serviceTypeColor: '#00838F',
    collabType: 'fixed',
    collabLabel: 'اجاره ثابت',
    fixedAmount: 8000000,
    fixedDeposit: 0,
    priceDisplay: '۸,۰۰۰,۰۰۰ تومان',
    description: 'لاین لیزر با دستگاه الکساندرایت ۲۰۲۴، اتاق اختصاصی با تهویه مناسب و تجهیزات استریل. مناسب پزشکان و متخصصان پوست.',
    lineImage: 'https://picsum.photos/400/400?random=73',
    status: 'inactive',
    createdAt: '1405/03/11',
    expiresAt: '1405/04/11',
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
  
  // 🆕 state برای مدال جزئیات
  const [selectedAd, setSelectedAd] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleCreate = () => {
    setEditingAd(null);
    setCreateSheetVisible(true);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setCreateSheetVisible(true);
  };

  const handleDelete = (ad) => {
    setMyAds((prev) => prev.filter((a) => a.id !== ad.id));
    setDetailVisible(false);
    setSelectedAd(null);
    setToast({
      visible: true,
      message: 'آگهی لاین با موفقیت حذف شد',
      type: 'success',
    });
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
      const now = new Date();
      const jalaali = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const createdAt = `${jalaali.jy}/${String(jalaali.jm).padStart(2, '0')}/${String(jalaali.jd).padStart(2, '0')}`;
      const expireDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expireJalaali = toJalaali(expireDate.getFullYear(), expireDate.getMonth() + 1, expireDate.getDate());
      const expiresAt = `${expireJalaali.jy}/${String(expireJalaali.jm).padStart(2, '0')}/${String(expireJalaali.jd).padStart(2, '0')}`;
      setMyAds((prev) => [{
        ...adData,
        isOwner: true,
        createdAt,
        expiresAt,
      }, ...prev]);
      setToast({
        visible: true,
        message: 'آگهی لاین با موفقیت ثبت شد',
        type: 'success',
      });
    }
  };

  // 🆕 handlers مدال
  const openDetail = (ad) => {
    setSelectedAd(ad);
    setDetailVisible(true);
  };

  const closeDetail = () => {
    setDetailVisible(false);
    setTimeout(() => setSelectedAd(null), 300);
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header title="اجاره لاین" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* Hero Section */}
        <View style={s.heroSection}>
          <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="storefront" size={32} color={colors.primary} />
          </View>
          <Text style={[s.heroTitle, { color: colors.textMain }]}>اجاره لاین سالن</Text>
          <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
            برای مشاهده جزئیات، روی هر آگهی ضربه بزنید
          </Text>
        </View>
        
        <View style={s.lineState}>
          {myAds.length > 0 && <LineRentalStats ads={myAds} />}
        </View>
        
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
        
        <View style={s.listContainer}>
          {myAds.length > 0 ? (
            myAds.map((ad) => (
              <LineRentalAdCard
                key={ad.id}
                ad={ad}
                onPress={openDetail}
              />
            ))
          ) : (
            <LineRentalEmptyState onCreate={handleCreate} tabType="myAds" />
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
      
      {myAds.length === 0 && (
        <TouchableOpacity
          style={[s.fab, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
          activeOpacity={0.85}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
      
      <CreateLineRentalAdSheet
        visible={createSheetVisible}
        onClose={() => {
          setCreateSheetVisible(false);
          setEditingAd(null);
        }}
        onSave={handleSave}
        editingAd={editingAd}
      />
      
      {/* 🆕 مدال جزئیات */}
      <LineRentalDetailModal
        visible={detailVisible}
        ad={selectedAd}
        onClose={closeDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
    marginTop: 16,
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
  lineState: {
    borderRadius: 14,
    paddingHorizontal: 16,
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
    gap: 4,
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