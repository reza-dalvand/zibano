// src/screens/profile/AppointmentsScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import BottomSheet from '../../components/common/BottomSheet';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۵',
    time: '۱۰:۳۰',
    status: 'confirmed',
    price: 675000,
    depositPaid: 200000,
    hasDeposit: true,
    cancellationFeePercent: 20,
    isUpcoming: true,
  },
  {
    id: 'apt_2',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=25',
    serviceName: 'لیزر فول بادی',
    employeeName: 'دکتر رضایی',
    date: '۱۴۰۳/۰۴/۲۰',
    time: '۱۶:۰۰',
    status: 'pending',
    price: 2500000,
    depositPaid: 500000,
    hasDeposit: true,
    cancellationFeePercent: 30,
    isUpcoming: true,
  },
  {
    id: 'apt_3',
    businessName: 'ناخن گالری پریا',
    businessLogo: 'https://picsum.photos/100/100?random=26',
    serviceName: 'کاشت ناخن ژلیش',
    employeeName: 'مریم',
    date: '۱۴۰۳/۰۳/۱۰',
    time: '۱۴:۰۰',
    status: 'completed',
    price: 450000,
    depositPaid: 0,
    hasDeposit: false,
    cancellationFeePercent: 0,
    isUpcoming: false,
  },
  {
    id: 'apt_4',
    businessName: 'سالن زیبایی افرا',
    businessLogo: 'https://picsum.photos/100/100?random=24',
    serviceName: 'رنگ و لایت مو',
    employeeName: 'الناز',
    date: '۱۴۰۳/۰۳/۰۵',
    time: '۱۱:۰۰',
    status: 'cancelled',
    price: 1200000,
    depositPaid: 300000,
    hasDeposit: true,
    cancellationFeePercent: 25,
    isUpcoming: false,
    cancellationReason: 'لغو توسط کاربر',
    refundAmount: 225000,
  },
];

const STATUS_META = {
  pending:   { label: 'در انتظار تایید', color: '#FFA000', icon: 'schedule' },
  confirmed: { label: 'تایید شده',       color: '#43A047', icon: 'check-circle' },
  cancelled: { label: 'لغو شده',         color: '#E53935', icon: 'cancel' },
  completed: { label: 'انجام شده',       color: '#1E88E5', icon: 'task-alt' },
};

export default function AppointmentsScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [cancelSheetVisible, setCancelSheetVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const filteredAppointments = useMemo(() => {
    if (activeTab === 'upcoming') {
      return appointments.filter((a) => a.isUpcoming);
    }
    return appointments.filter((a) => !a.isUpcoming);
  }, [appointments, activeTab]);

  const stats = useMemo(
    () => ({
      upcoming: appointments.filter((a) => a.isUpcoming).length,
      past: appointments.filter((a) => !a.isUpcoming).length,
    }),
    [appointments]
  );

  const openCancelSheet = (apt) => {
    setSelectedAppointment(apt);
    setCancelSheetVisible(true);
  };

  const confirmCancel = () => {
    if (!selectedAppointment) return;
    const fee = Math.round(
      (selectedAppointment.depositPaid * selectedAppointment.cancellationFeePercent) / 100
    );
    const refund = selectedAppointment.depositPaid - fee;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === selectedAppointment.id
          ? {
              ...a,
              status: 'cancelled',
              isUpcoming: false,
              cancellationReason: 'لغو توسط کاربر',
              refundAmount: refund,
            }
          : a
      )
    );

    setCancelSheetVisible(false);
    Alert.alert(
      'نوبت لغو شد',
      `مبلغ ${formatPrice(refund)} طی ۲۴ ساعت آینده به حساب شما واریز خواهد شد.\nجریمه لغو: ${formatPrice(fee)}`
    );
  };

  const renderAppointment = (apt) => {
    const meta = STATUS_META[apt.status] || STATUS_META.pending;
    const canCancel =
      apt.isUpcoming &&
      (apt.status === 'pending' || apt.status === 'confirmed') &&
      apt.hasDeposit;

    return (
      <Card key={apt.id} variant="elevated" padding={16} radius={18} style={s.aptCard}>
        <View style={s.aptHeader}>
          <View style={s.aptBusiness}>
            <Avatar uri={apt.businessLogo} name={apt.businessName} size="md" />
            <View style={s.aptBusinessInfo}>
              <Text style={[s.aptBusinessName, { color: colors.textMain }]} numberOfLines={1}>
                {apt.businessName}
              </Text>
              <Text style={[s.aptServiceName, { color: colors.textSecondary }]} numberOfLines={1}>
                {apt.serviceName}
              </Text>
            </View>
          </View>
          <View style={[s.statusBadge, { backgroundColor: meta.color + '20' }]}>
            <Icon name={meta.icon} size={11} color={meta.color} />
            <Text style={[s.statusBadgeText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>

        <View style={[s.divider, { backgroundColor: colors.border }]} />

        <View style={s.aptDetails}>
          <View style={s.detailItem}>
            <Icon name="person" size={14} color={colors.textSecondary} />
            <Text style={[s.detailText, { color: colors.textMain }]}>{apt.employeeName}</Text>
          </View>
          <View style={s.detailItem}>
            <Icon name="event" size={14} color={colors.textSecondary} />
            <Text style={[s.detailText, { color: colors.textMain }]}>{apt.date}</Text>
          </View>
          <View style={s.detailItem}>
            <Icon name="schedule" size={14} color={colors.textSecondary} />
            <Text style={[s.detailText, { color: colors.textMain }]}>{apt.time}</Text>
          </View>
        </View>

        <View style={[s.priceBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={s.priceRow}>
            <Text style={[s.priceLabel, { color: colors.textSecondary }]}>مبلغ کل</Text>
            <Text style={[s.priceValue, { color: colors.textMain }]}>{formatPrice(apt.price)}</Text>
          </View>
          {apt.hasDeposit && (
            <View style={s.priceRow}>
              <Text style={[s.priceLabel, { color: colors.textSecondary }]}>بیعانه پرداختی</Text>
              <Text style={[s.priceValue, { color: colors.primary }]}>{formatPrice(apt.depositPaid)}</Text>
            </View>
          )}
          {apt.status === 'cancelled' && apt.refundAmount !== undefined && (
            <View style={[s.priceRow, { marginTop: 4 }]}>
              <Text style={[s.priceLabel, { color: colors.textSecondary }]}>مبلغ مسترد شده</Text>
              <Text style={[s.priceValue, { color: '#43A047' }]}>{formatPrice(apt.refundAmount)}</Text>
            </View>
          )}
        </View>

        {canCancel && (
          <TouchableOpacity
            style={[s.cancelBtn, { borderColor: '#E5393560', backgroundColor: '#E5393510' }]}
            onPress={() => openCancelSheet(apt)}
          >
            <Icon name="cancel" size={16} color="#E53935" />
            <Text style={[s.cancelBtnText, { color: '#E53935' }]}>لغو نوبت</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  const renderTabButton = (tabId, label, iconName) => {
    const isActive = activeTab === tabId;
    const count = tabId === 'upcoming' ? stats.upcoming : stats.past;
    return (
      <TouchableOpacity
        style={[s.tabButton, isActive && { backgroundColor: colors.primary }]}
        onPress={() => setActiveTab(tabId)}
      >
        <Icon
          name={iconName}
          size={16}
          color={isActive ? '#fff' : colors.textSecondary}
        />
        <Text style={[s.tabText, { color: isActive ? '#fff' : colors.textMain }]}>
          {label}
        </Text>
        <View
          style={[
            s.tabBadge,
            { backgroundColor: isActive ? '#fff' : colors.primary + '20' },
          ]}
        >
          <Text
            style={[
              s.tabBadgeText,
              { color: isActive ? colors.primary : colors.primary },
            ]}
          >
            {toPersianDigit(count)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      <View style={[s.tabsWrapper, { backgroundColor: colors.background }]}>
        <View style={[s.tabsContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {renderTabButton('upcoming', 'آینده', 'event-available')}
          {renderTabButton('past', 'گذشته', 'history')}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContainer}
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(renderAppointment)
        ) : (
          <EmptyState
            icon={activeTab === 'upcoming' ? '📅' : '📜'}
            title={activeTab === 'upcoming' ? 'نوبت آینده‌ای ندارید' : 'سابقه‌ای ثبت نشده'}
            description={
              activeTab === 'upcoming'
                ? 'با رزرو نوبت از کسب‌وکارهای زیبانو، نوبت‌های آینده شما اینجا نمایش داده می‌شود'
                : 'پس از انجام اولین نوبت، سوابق شما اینجا نمایش داده خواهد شد'
            }
            actionLabel={activeTab === 'upcoming' ? 'رزرو نوبت جدید' : 'بازگشت به خانه'}
            onAction={() => navigation.navigate('Home')}
          />
        )}
      </ScrollView>

      <BottomSheet
        visible={cancelSheetVisible}
        onClose={() => setCancelSheetVisible(false)}
        title="لغو نوبت"
        snapPoint={0.6}
        footer={
          <View style={s.cancelFooterRow}>
            <Button
              title="انصراف"
              onPress={() => setCancelSheetVisible(false)}
              variant="outline"
              size="lg"
              style={s.halfBtn}
            />
            <Button
              title="تایید لغو"
              onPress={confirmCancel}
              variant="primary"
              size="lg"
              style={[s.halfBtn, { backgroundColor: '#E53935' }]}
              icon={<Icon name="check" size={18} color="#fff" />}
              iconPosition="right"
            />
          </View>
        }
      >
        {selectedAppointment && (
          <View style={s.cancelContent}>
            <View style={[s.cancelWarningBox, { backgroundColor: '#FFA00015', borderColor: '#FFA00050' }]}>
              <Icon name="warning" size={28} color="#FFA000" />
              <Text style={[s.cancelWarningTitle, { color: '#FFA000' }]}>
                توجه: جریمه لغو اعمال می‌شود
              </Text>
            </View>

            <View style={s.cancelInfoCard}>
              <Text style={[s.cancelInfoLabel, { color: colors.textSecondary }]}>
                نوبت شما
              </Text>
              <Text style={[s.cancelInfoValue, { color: colors.textMain }]}>
                {selectedAppointment.serviceName}
              </Text>
              <Text style={[s.cancelInfoSub, { color: colors.textSecondary }]}>
                {selectedAppointment.businessName} · {selectedAppointment.date} · ساعت {selectedAppointment.time}
              </Text>
            </View>

            <View style={[s.cancelFeeCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={s.cancelFeeRow}>
                <Text style={[s.cancelFeeLabel, { color: colors.textSecondary }]}>
                  بیعانه پرداختی شما
                </Text>
                <Text style={[s.cancelFeeValue, { color: colors.textMain }]}>
                  {formatPrice(selectedAppointment.depositPaid)}
                </Text>
              </View>
              <View style={s.cancelFeeRow}>
                <Text style={[s.cancelFeeLabel, { color: '#E53935' }]}>
                  جریمه لغو ({toPersianDigit(selectedAppointment.cancellationFeePercent)}٪)
                </Text>
                <Text style={[s.cancelFeeValue, { color: '#E53935' }]}>
                  - {formatPrice(
                    Math.round(
                      (selectedAppointment.depositPaid * selectedAppointment.cancellationFeePercent) / 100
                    )
                  )}
                </Text>
              </View>
              <View style={[s.cancelFeeDivider, { backgroundColor: colors.border }]} />
              <View style={s.cancelFeeRow}>
                <Text style={[s.cancelFeeLabel, { color: colors.textMain, fontFamily: 'Vazir-Bold' }]}>
                  مبلغ مسترد شده
                </Text>
                <Text style={[s.cancelFeeValue, { color: '#43A047', fontFamily: 'Vazir-Bold' }]}>
                  {formatPrice(
                    selectedAppointment.depositPaid -
                      Math.round(
                        (selectedAppointment.depositPaid * selectedAppointment.cancellationFeePercent) / 100
                      )
                  )}
                </Text>
              </View>
            </View>

            <View style={s.cancelHintRow}>
              <Icon name="info-outline" size={14} color={colors.textSecondary} />
              <Text style={[s.cancelHintText, { color: colors.textSecondary }]}>
                مبلغ مسترد شده طی ۲۴ ساعت به حساب شما واریز می‌شود
              </Text>
            </View>
          </View>
        )}
      </BottomSheet>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  tabsWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  tabsContainer: {
    flexDirection: 'row', padding: 4, borderRadius: 14, borderWidth: 1, gap: 4,
  },
  tabButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10,
  },
  tabText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  tabBadge: {
    minWidth: 22, height: 20, paddingHorizontal: 6, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  tabBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  listContainer: { padding: 16, paddingBottom: 100, gap: 12 },
  aptCard: { marginBottom: 0 },
  aptHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  aptBusiness: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  aptBusinessInfo: { flex: 1, gap: 2 },
  aptBusinessName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  aptServiceName: { fontSize: 12, fontFamily: 'Vazir' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  statusBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  divider: { height: 1, marginVertical: 10 },
  aptDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, fontFamily: 'Vazir' },
  priceBox: { padding: 10, borderRadius: 12, borderWidth: 1, gap: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 12, fontFamily: 'Vazir' },
  priceValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginTop: 12,
  },
  cancelBtnText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  cancelContent: { gap: 14 },
  cancelWarningBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 12, borderWidth: 1,
  },
  cancelWarningTitle: { fontSize: 14, fontFamily: 'Vazir-Bold', flex: 1 },
  cancelInfoCard: { gap: 4 },
  cancelInfoLabel: { fontSize: 12, fontFamily: 'Vazir' },
  cancelInfoValue: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  cancelInfoSub: { fontSize: 12, fontFamily: 'Vazir' },
  cancelFeeCard: { padding: 14, borderRadius: 14, borderWidth: 1, gap: 8 },
  cancelFeeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancelFeeLabel: { fontSize: 13, fontFamily: 'Vazir' },
  cancelFeeValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  cancelFeeDivider: { height: 1, marginVertical: 4 },
  cancelHintRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cancelHintText: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  cancelFooterRow: { flexDirection: 'row', gap: 10 },
  halfBtn: { flex: 1 },
});