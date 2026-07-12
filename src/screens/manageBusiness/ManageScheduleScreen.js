// src/screens/manageBusiness/ManageScheduleScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useBusiness } from '../../context/BusinessContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import ServiceTypeIcon from '../../components/manageBusiness/services/ServiceTypeIcon';
import ScheduleModal from '../../components/manageBusiness/schedule/ScheduleModal';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// ═══════════ تبدیل ساعت به متن خوانا ═══════════
const formatTime = (time) => toPersianDigit(time || '—');

// ═══════════ تبدیل مدت (دقیقه) به متن فارسی ═══════════
const formatDuration = (minutes) => {
  if (!minutes) return '—';
  if (minutes < 60) return `${toPersianDigit(minutes)} دقیقه`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${toPersianDigit(h)} ساعت`;
  return `${toPersianDigit(h)} ساعت و ${toPersianDigit(m)} دقیقه`;
};

export default function ManageScheduleScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData, updateSchedule } = useBusiness();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // ═══════════ خدمات فعال ═══════════
  const services = useMemo(
    () => (businessData.services || []).filter((s) => s.isActive !== false),
    [businessData.services]
  );

  // ═══════════ شناسه مالک (چون تیم نداریم) ═══════════
  const ownerId = businessData.team?.[0]?.id || 'owner';

  // ═══════════ محاسبه آمار هر خدمت ═══════════
  const getServiceStats = (serviceId) => {
    const schedule = businessData.schedules?.[ownerId]?.[serviceId] || {};
    const allDays = Object.values(schedule);
    
    // روزهای تنظیم‌شده (فعال)
    const activeDays = allDays.filter((d) => d.active);
    
    // مجموع slot های قابل رزرو
    const totalSlots = activeDays.reduce((sum, d) => {
      return sum + (d.slotCount || 0);
    }, 0);
    
    // مجموع استراحت‌ها
    const totalBreaks = activeDays.reduce((sum, d) => {
      return sum + (d.breaks?.length || 0);
    }, 0);
    
    // آخرین تاریخ تنظیم‌شده
    const lastDate = activeDays.length > 0 
      ? activeDays[activeDays.length - 1]?.dateKey 
      : null;

    return { 
      daysCount: activeDays.length, 
      totalSlots,
      totalBreaks,
      lastDate,
    };
  };

  // ═══════════ باز کردن مدال ═══════════
  const openModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setModalVisible(true);
  };

  // ═══════════ ذخیره تنظیمات (ساختار جدید) ═══════════
  const handleSave = ({ serviceId, date, workStart, workEnd, slotDuration, breaks, slotCount }) => {
    const dateKey = `${date.jy}/${String(date.jm).padStart(2, '0')}/${String(date.jd).padStart(2, '0')}`;
    
    const scheduleData = {
      active: true,
      workStart,
      workEnd,
      slotDuration,
      breaks: breaks || [],
      slotCount: slotCount || 0,
      dateKey,
      updatedAt: new Date().toISOString(),
    };
    
    updateSchedule(ownerId, serviceId, `d_${date.jy}_${date.jm}_${date.jd}`, scheduleData);

    setToast({
      visible: true,
      message: `✓ ${toPersianDigit(slotCount)} نوبت کاری با موفقیت تنظیم شد`,
      type: 'success',
    });
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ═══════════ هدر صفحه ═══════════ */}
        <View style={s.heroSection}>
          <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="schedule" size={32} color={colors.primary} />
          </View>
          <Text style={[s.heroTitle, { color: colors.textMain }]}>
            مدیریت ساعات کاری
          </Text>
          <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
            بازه کاری، مدت هر نوبت و زمان‌های استراحت را مشخص کنید
          </Text>
        </View>

        {/* ═══════════ کارت راهنما ═══════════ */}
        <Card
          variant="default"
          padding={12}
          radius={14}
          style={[s.hintCard, { borderColor: colors.primary + '30', backgroundColor: colors.primary + '08' }]}
        >
          <Icon name="lightbulb" size={18} color={colors.primary} />
          <Text style={[s.hintText, { color: colors.textSecondary }]}>
            روی آیکون تقویم هر خدمت ضربه بزنید تا ساعات کاری آن را برای یک روز مشخص تنظیم کنید
          </Text>
        </Card>

        {/* ═══════════ لیست خدمات ═══════════ */}
        {services.length > 0 ? (
          <View style={s.servicesList}>
            {services.map((service) => {
              const stats = getServiceStats(service.id);
              return (
                <Card
                  key={service.id}
                  variant="elevated"
                  padding={0}
                  radius={18}
                  style={s.serviceCard}
                >
                  {/* محتوای اصلی خدمت */}
                  <View style={s.serviceContent}>
                    <ServiceTypeIcon typeId={service.typeId} size={56} />
                    <View style={s.serviceInfo}>
                      <Text style={[s.serviceName, { color: colors.textMain }]}>
                        {service.name}
                      </Text>
                      <Text style={[s.serviceType, { color: colors.textSecondary }]}>
                        {service.typeName}
                      </Text>
                      <View style={s.serviceMeta}>
                        <Icon name="schedule" size={12} color={colors.textSecondary} />
                        <Text style={[s.metaText, { color: colors.textSecondary }]}>
                          {toPersianDigit(service.duration || 60)} دقیقه هر نوبت
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => openModal(service.id)}
                      style={[s.scheduleBtn, { backgroundColor: colors.primary }]}
                    >
                      <Icon name="edit-calendar" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {/* ═══════════ آمار تنظیمات ═══════════ */}
                  <View style={[s.statsRow, { borderTopColor: colors.border }]}>
                    {/* روزهای تنظیم‌شده */}
                    <View style={s.statItem}>
                      <View style={[s.statIconCircle, { backgroundColor: '#43A04718' }]}>
                        <Icon name="event-available" size={12} color="#43A047" />
                      </View>
                      <Text style={[s.statText, { color: colors.textSecondary }]}>
                        {toPersianDigit(stats.daysCount)} روز
                      </Text>
                    </View>

                    <View style={[s.statDivider, { backgroundColor: colors.border }]} />

                    {/* نوبت‌های فعال */}
                    <View style={s.statItem}>
                      <View style={[s.statIconCircle, { backgroundColor: '#2196F318' }]}>
                        <Icon name="access-time" size={12} color="#2196F3" />
                      </View>
                      <Text style={[s.statText, { color: colors.textSecondary }]}>
                        {toPersianDigit(stats.totalSlots)} نوبت
                      </Text>
                    </View>

                    <View style={[s.statDivider, { backgroundColor: colors.border }]} />

                    {/* استراحت‌ها */}
                    <View style={s.statItem}>
                      <View style={[s.statIconCircle, { backgroundColor: '#9C27B018' }]}>
                        <Icon name="coffee" size={12} color="#9C27B0" />
                      </View>
                      <Text style={[s.statText, { color: colors.textSecondary }]}>
                        {toPersianDigit(stats.totalBreaks)} استراحت
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <EmptyState
            icon="📅"
            title="خدمتی برای تنظیم وجود ندارد"
            description="ابتدا خدمات سالن خود را اضافه کنید، سپس زمان‌بندی آن‌ها را مشخص کنید"
            actionLabel="مدیریت خدمات"
            onAction={() => navigation.navigate('ManageServices')}
          />
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ═══════════ مدال زمان‌بندی (۳ مرحله‌ای) ═══════════ */}
      <ScheduleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        services={services}
        initialServiceId={selectedServiceId}
        existingSchedule={businessData.schedules?.[ownerId] || {}}
        onSave={handleSave}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  // ═══════════ Hero Section ═══════════
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
  // ═══════════ Hint Card ═══════════
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  // ═══════════ Services List ═══════════
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    overflow: 'hidden',
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  serviceInfo: {
    flex: 1,
    gap: 3,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  serviceType: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  scheduleBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  // ═══════════ Stats Row ═══════════
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
});