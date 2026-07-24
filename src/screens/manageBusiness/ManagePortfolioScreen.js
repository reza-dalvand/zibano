// src/screens/manageBusiness/ManagePortfolioScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useBusinessStore } from '../../stores/useBusinessStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import {
  PortfolioGrid,
  PortfolioDetailModal,
  PortfolioFormSheet,
} from '../../components/manageBusiness/portfolio';

export default function ManagePortfolioScreen({ navigation }) {
  const { colors } = useTheme();
  const businessData = useBusinessStore((s) => s.businessData);
  const addPortfolio = useBusinessStore((s) => s.addPortfolio);
  const updatePortfolio = useBusinessStore((s) => s.updatePortfolio);
  const deletePortfolio = useBusinessStore((s) => s.deletePortfolio);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const openAddForm = () => {
    setEditingPortfolio(null);
    setFormVisible(true);
  };

  const openEditForm = (portfolio) => {
    setEditingPortfolio(portfolio);
    setFormVisible(true);
  };

  const openDetail = (portfolio) => {
    setActivePortfolio(portfolio);
    setDetailVisible(true);
  };

  const handleSave = (portfolioData, editingId) => {
    if (editingId) {
      updatePortfolio(editingId, portfolioData);
      setToast({ visible: true, message: '✓ نمونه‌کار با موفقیت ویرایش شد', type: 'success' });
    } else {
      addPortfolio(portfolioData);
      setToast({ visible: true, message: '✓ نمونه‌کار جدید اضافه شد', type: 'success' });
    }
  };

  const handleDelete = (portfolio) => {
    Alert.alert(
      'حذف نمونه‌کار',
      `آیا از حذف "${portfolio.title}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            deletePortfolio(portfolio.id);
            setToast({ visible: true, message: 'نمونه‌کار حذف شد', type: 'info' });
          },
        },
      ]
    );
  };

  const portfolios = businessData.portfolios || [];
  const services = businessData.services || [];

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header title="نمونه‌کارها" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {portfolios.length > 0 ? (
          <>
            <PortfolioGrid
              portfolios={portfolios}
              services={services}
              onPortfolioPress={openDetail}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
            <View style={{ height: 100 }} />
          </>
        ) : (
          <EmptyState
            icon="🖼️"
            title="هنوز نمونه‌کاری ثبت نکرده‌اید"
            description="نمونه‌کارهای خود را آپلود کنید تا مشتریان کیفیت کار شما را ببینند"
            actionLabel="افزودن اولین نمونه‌کار"
            onAction={openAddForm}
          />
        )}
      </ScrollView>

      {/* FAB */}
      {portfolios.length > 0 && (
        <TouchableOpacity
          style={[s.fab, { backgroundColor: colors.primary }]}
          onPress={openAddForm}
          activeOpacity={0.85}
        >
          <Icon name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* 🎯 مدال گالری - services پاس داده میشه */}
      <PortfolioDetailModal
        visible={detailVisible}
        portfolio={activePortfolio}
        services={services}
        onClose={() => { setDetailVisible(false); setActivePortfolio(null); }}
        onEdit={openEditForm}
      />

      {/* فرم افزودن/ویرایش */}
      <PortfolioFormSheet
        visible={formVisible}
        onClose={() => { setFormVisible(false); setEditingPortfolio(null); }}
        onSave={handleSave}
        editingPortfolio={editingPortfolio}
        services={services}
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
    padding: 16,
    paddingBottom: 100,
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