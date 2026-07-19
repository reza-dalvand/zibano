// src/screens/manageBusiness/ModelRequestsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Toast from '../../components/common/Toast';
import { useBusiness } from '../../context/BusinessContext';
import ModelRequestCard from '../../components/manageBusiness/modelRequest/ModelRequestCard';
import ModelRequestEmptyState from '../../components/manageBusiness/modelRequest/ModelRequestEmptyState';
import ModelRequestStats from '../../components/manageBusiness/modelRequest/ModelRequestStats';

const toPersianDigit = (str) =>
  String(str || '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// 🎯 داده‌های موقت با ۳ نوع costType
const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    serviceId: 'svc_1',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/200/200?random=50',
    title: 'مدل برای فیشیال VIP عروس',
    description: 'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است.',
    costType: 'paid',  // 🎯 با هزینه
    status: 'active',
    contactPhone: '09121234567',
    createdAt: '1405/01/22',
    expiresAt: '1405/02/21',
  },
  {
    id: 'mr_2',
    serviceId: 'svc_2',
    serviceName: 'کاشت ناخن ژله‌ای',
    serviceImage: 'https://picsum.photos/200/200?random=51',
    title: 'مدل برای طراحی ناخن جدید',
    description: 'طراحی‌های جدید و خاص برای نمونه‌کار با تکنیک‌های روز دنیا. مناسب ناخن‌های طبیعی و سالم.',
    costType: 'material_cost',  // 🎯 با هزینه مواد
    status: 'active',
    contactPhone: '09129876543',
    createdAt: '1405/01/20',
    expiresAt: '1405/02/19',
  },
  {
    id: 'mr_3',
    serviceId: 'svc_3',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/200/200?random=52',
    title: 'مدل برای تکنیک جدید بالیاژ',
    description: 'تست تکنیک جدید بالیاژ فرانسوی با مواد اورجینال ایتالیایی. مناسب موهای بلند و سالم.',
    costType: 'free',  // 🎯 رایگان
    status: 'inactive',
    contactPhone: '09121112233',
    createdAt: '1404/12/15',
    expiresAt: '1405/01/14',
  },
];

export default function ModelRequestsScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData } = useBusiness();
  const [requests, setRequests] = useState(MOCK_MODEL_REQUESTS);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const handleCreate = () => {
    navigation.navigate('CreateModelRequest');
  };

  const handleEdit = (request) => {
    navigation.navigate('CreateModelRequest', { request });
  };

  const handleDelete = (request) => {
    Alert.alert(
      'حذف درخواست مدل',
      `آیا از حذف "${request.title}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            setRequests((prev) => prev.filter((r) => r.id !== request.id));
            setToast({
              visible: true,
              message: 'درخواست مدل با موفقیت حذف شد',
              type: 'success',
            });
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header title="درخواست‌های مدل" onBackPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {requests.length > 0 ? (
          <>
            {/* هدر توضیحی */}
            <View style={s.heroSection}>
              <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="face-retouching-natural" size={32} color={colors.primary} />
              </View>
              <Text style={[s.heroTitle, { color: colors.textMain }]}>درخواست‌های مدل</Text>
              <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
                مدل‌هایی که برای خدمات خود جذب کرده‌اید
              </Text>
            </View>

            <ModelRequestStats requests={requests} />

            {/* دکمه سبز ثبت درخواست */}
            <TouchableOpacity
              onPress={handleCreate}
              activeOpacity={0.85}
              style={s.createBtn}
            >
              <View style={s.createBtnIconBox}>
                <Icon name="add" size={22} color="#fff" />
              </View>
              <View style={s.createBtnTextCol}>
                <Text style={s.createBtnTitle}>ثبت درخواست مدل جدید</Text>
                <Text style={s.createBtnSubtitle}>
                  مدل جدیدی برای خدمات خود جذب کنید
                </Text>
              </View>
              <Icon name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={s.listContainer}>
              {requests.map((request) => (
                <ModelRequestCard
                  key={request.id}
                  request={request}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          </>
        ) : (
          <ModelRequestEmptyState onCreate={handleCreate} />
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {requests.length > 0 && (
        <TouchableOpacity
          style={[s.fab, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
          activeOpacity={0.85}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

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
    gap: 12,
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