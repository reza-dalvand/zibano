// src/screens/manageBusiness/ManagePortfolioScreen.js
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useBusinessStore } from '../../stores/useBusinessStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import EmptyStateVariants from '../../components/common/EmptyStateVariants';
import Toast from '../../components/common/Toast';
import StatsCard from '../../components/common/StatsCard';
import {
  PortfolioGrid,
  PortfolioDetailModal,
  PortfolioFormSheet,
} from '../../components/manageBusiness/portfolio';
import { toPersianDigit } from '../../utils/numberUtils';

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

  const portfolios = businessData?.portfolios || [];
  const services = businessData?.services || [];

  // 🎯 محاسبه آمار
  const stats = useMemo(() => {
    const totalImages = portfolios.reduce(
      (sum, p) => sum + (p.images?.length || (p.coverImage ? 1 : 0)),
      0
    );
    const withService = portfolios.filter((p) => p.serviceId).length;
    return {
      total: portfolios.length,
      totalImages,
      withService,
    };
  }, [portfolios]);

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
    try {
      if (editingId) {
        updatePortfolio(editingId, portfolioData);
        setToast({
          visible: true,
          message: '✓ نمونه‌کار با موفقیت ویرایش شد',
          type: 'success',
        });
      } else {
        addPortfolio(portfolioData);
        setToast({
          visible: true,
          message: '✓ نمونه‌کار جدید اضافه شد',
          type: 'success',
        });
      }
      setFormVisible(false);
      setEditingPortfolio(null);
    } catch (error) {
      setToast({
        visible: true,
        message: 'خطا در ذخیره نمونه‌کار',
        type: 'error',
      });
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
            setDetailVisible(false);
            setActivePortfolio(null);
            setToast({
              visible: true,
              message: '✓ نمونه‌کار حذف شد',
              type: 'info',
            });
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header title="نمونه‌کارها" onBackPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ═══════════ Hero Section ═══════════ */}
        <View style={s.heroSection}>
          <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="photo-library" size={32} color={colors.primary} />
          </View>
          <Text style={[s.heroTitle, { color: colors.textMain }]}>
            گالری نمونه‌کارها
          </Text>
          <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
            بهترین کارهای خود را به مشتریان نمایش دهید
          </Text>
        </View>

        {/* ═══════════ Stats Cards ═══════════ */}
        {portfolios.length > 0 && (
          <Card variant="elevated" padding={14} radius={18} style={s.statsCard}>
            <View style={s.statsRow}>
              <StatsCard
                icon="photo-library"
                label="نمونه‌کار"
                value={toPersianDigit(stats.total)}
                color="#9C27B0"
                variant="compact"
              />
              <View style={[s.statDivider, { backgroundColor: colors.border }]} />
              <StatsCard
                icon="collections"
                label="تصویر"
                value={toPersianDigit(stats.totalImages)}
                color="#2196F3"
                variant="compact"
              />
              <View style={[s.statDivider, { backgroundColor: colors.border }]} />
              <StatsCard
                icon="spa"
                label="با خدمت"
                value={toPersianDigit(stats.withService)}
                color="#4CAF50"
                variant="compact"
              />
            </View>
          </Card>
        )}

        {/* ═══════════ Content ═══════════ */}
        {portfolios.length > 0 ? (
          <>
            {/* دکمه سبز افزودن - بالای لیست */}
            <TouchableOpacity
              onPress={openAddForm}
              activeOpacity={0.85}
              style={s.addPortfolioBtn}
            >
              <View style={s.addBtnIconBox}>
                <Icon name="add" size={22} color="#fff" />
              </View>
              <View style={s.addBtnTextCol}>
                <Text style={s.addBtnTitle}>افزودن نمونه‌کار جدید</Text>
                <Text style={s.addBtnSubtitle}>
                  کارهای جدید خود را به گالری اضافه کنید
                </Text>
              </View>
              <Icon name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>

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
          <EmptyStateVariants
            variant="portfolio"
            onAction={openAddForm}
          />
        )}
      </ScrollView>

      {/* ❌ FAB حذف شد - فقط دکمه سبز بالا کافی است */}

      {/* ═══════════ Modals ═══════════ */}
      <PortfolioDetailModal
        visible={detailVisible}
        portfolio={activePortfolio}
        services={services}
        onClose={() => {
          setDetailVisible(false);
          setActivePortfolio(null);
        }}
        onEdit={(p) => {
          setDetailVisible(false);
          setTimeout(() => openEditForm(p), 300);
        }}
      />

      <PortfolioFormSheet
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingPortfolio(null);
        }}
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
  // ═══════════ Hero ═══════════
  heroSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
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
  // ═══════════ Stats ═══════════
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  // ═══════════ Add Button ═══════════
  addPortfolioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  addBtnIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnTextCol: {
    flex: 1,
    gap: 2,
  },
  addBtnTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  addBtnSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  // ❌ استایل FAB حذف شد
});