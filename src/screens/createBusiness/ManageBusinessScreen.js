import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import BusinessStatsCard from '../../components/manager/BusinessStatsCard';
import AppointmentManagerCard from '../../components/manager/AppointmentManagerCard';

// دیتای موقت برای آمارهای بالای صفحه
const MOCK_STATS = {
  bookings: 14,
  rating: 4.8,
  revenue: 12500000,
};

// آیتم‌های منوی دسترسی سریع (گرید)
const MENU_ITEMS = [
  { id: 'services', label: 'خدمات', icon: 'spa', route: 'ManageServices', color: '#8D7468' },
  { id: 'team', label: 'اعضای تیم', icon: 'people', route: 'ManageTeam', color: '#43A047' },
  { id: 'schedule', label: 'زمان‌بندی', icon: 'edit-calendar', route: 'ManageSchedule', color: '#1E88E5' },
  { id: 'portfolio', label: 'نمونه‌کارها', icon: 'photo-library', route: 'ManagePortfolio', color: '#8E24AA' },
  { id: 'appointments', label: 'همه نوبت‌ها', icon: 'event-note', route: 'AllAppointments', color: '#F4511E' },
  { id: 'finance', label: 'گزارش مالی', icon: 'bar-chart', route: 'FinanceReports', color: '#00897B' },
];

// دیتای موقت برای نوبت‌های امروز
const MOCK_TODAY_APPOINTMENTS = [
  {
    id: '1',
    customerName: 'سارا احمدی',
    serviceName: 'فیشیال تخصصی پوست',
    date: 'امروز',
    time: '۱۰:۳۰',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'مریم رضایی',
    serviceName: 'لیزر فول بادی',
    date: 'امروز',
    time: '۱۲:۰۰',
    status: 'confirmed',
  },
  {
    id: '3',
    customerName: 'الناز کریمی',
    serviceName: 'کاشت ناخن',
    date: 'امروز',
    time: '۱۵:۴۵',
    status: 'done',
  },
];

export default function ManageBusinessScreen({ navigation }) {
  const { colors } = useTheme();
  const [appointments, setAppointments] = useState(MOCK_TODAY_APPOINTMENTS);

  // هندلر تغییر وضعیت نوبت
  const handleStatusChange = (id, newStatus) => {
    setAppointments(current =>
      current.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <ScreenWrapper scrollable padding={20} edges={['top']}>
      
      {/* هدر داشبورد */}
      <View style={styles.header}>
        <View>
          {/* <Text style={[styles.greeting, { color: colors.textSecondary }]}>سلام، وقت بخیر</Text> */}
          <Text style={[styles.title, { color: colors.textMain }]}>داشبورد مدیریت</Text>
        </View>
        <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Icon name="settings" size={24} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* بخش آمارها */}
      <View style={styles.section}>
        <BusinessStatsCard stats={MOCK_STATS} />
      </View>

      {/* دسترسی سریع (گرید منوها) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>دسترسی سریع</Text>
        <View style={styles.gridContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => console.log('Navigate to:', item.route)} // بعداً با navigation.navigate جایگزین می‌شود
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                <Icon name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={[styles.gridLabel, { color: colors.textMain }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* لیست نوبت‌های امروز */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textMain, marginBottom: 0 }]}>نوبت‌های امروز</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>مشاهده تقویم</Text>
          </TouchableOpacity>
        </View>

        {appointments.map((item) => (
          <AppointmentManagerCard
            key={item.id}
            appointment={item}
            onStatusChange={handleStatusChange}
          />
        ))}
        
        {appointments.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="event-available" size={48} color={colors.textSecondary + '50'} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>برای امروز نوبتی ثبت نشده است.</Text>
          </View>
        )}
      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 13,
    fontFamily: 'Vazir',
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 28,
  },
  lastSection: {
    marginBottom: 100, // فاصله از پایین برای تب‌بار شناور
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  
  /* استایل‌های گرید منو */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // استفاده از gap برای فاصله مساوی (نیاز به React Native 0.71+)
  },
  gridItem: {
    width: '31%', // سه ستون در هر ردیف
    aspectRatio: 1, // مربع شدن دکمه
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    textAlign: 'center',
  },

  /* استایل خالی بودن لیست */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Vazir',
  },
});