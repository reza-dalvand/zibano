// src/screens/manageBusiness/AllAppointmentsScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useBusiness } from '../../context/BusinessContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import BottomSheet from '../../components/common/BottomSheet';

const STATUS_FILTERS = [
  { id: 'all', label: 'همه', color: '#607D8B' },
  { id: 'pending', label: 'در انتظار', color: '#FFA000' },
  { id: 'confirmed', label: 'تایید شده', color: '#43A047' },
  { id: 'cancelled', label: 'لغو شده', color: '#E53935' },
  { id: 'done', label: 'انجام شده', color: '#1E88E5' },
];

const STATUS_META = {
  pending: { label: 'در انتظار', color: '#FFA000', icon: 'schedule' },
  confirmed: { label: 'تایید شده', color: '#43A047', icon: 'check-circle' },
  cancelled: { label: 'لغو شده', color: '#E53935', icon: 'cancel' },
  done: { label: 'انجام شده', color: '#1E88E5', icon: 'task-alt' },
};

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const formatPrice = (num) => `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

export default function AllAppointmentsScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData, updateAppointmentStatus, deleteAppointment } = useBusiness();

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedApt, setSelectedApt] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const filteredAppointments = useMemo(() => {
    if (activeFilter === 'all') return businessData.appointments || [];
    return (businessData.appointments || []).filter(
      (apt) => apt.status === activeFilter
    );
  }, [businessData.appointments, activeFilter]);

  const stats = useMemo(() => {
    const all = businessData.appointments || [];
    return {
      all: all.length,
      pending: all.filter((a) => a.status === 'pending').length,
      confirmed: all.filter((a) => a.status === 'confirmed').length,
      cancelled: all.filter((a) => a.status === 'cancelled').length,
      done: all.filter((a) => a.status === 'done').length,
    };
  }, [businessData.appointments]);

  const openDetail = (apt) => {
    setSelectedApt(apt);
    setDetailVisible(true);
  };

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    setDetailVisible(false);
  };

  const handleDelete = (apt) => {
    Alert.alert(
      'حذف نوبت',
      `آیا از حذف نوبت "${apt.customerName}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            deleteAppointment(apt.id);
            setDetailVisible(false);
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['top']}>
      <Header title="همه نوبت‌ها" onBackPress={() => navigation.goBack()} />

      {/* Chips فیلتر وضعیت */}
      <View style={s.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {STATUS_FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            const count = stats[f.id] || 0;
            return (
              <TouchableOpacity
                key={f.id}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f.id)}
                style={[
                  s.filterChip,
                  {
                    backgroundColor: isActive ? f.color + '20' : colors.cardBackground,
                    borderColor: isActive ? f.color : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    s.filterChipText,
                    { color: isActive ? f.color : colors.textMain },
                  ]}
                >
                  {f.label}
                </Text>
                <View
                  style={[
                    s.filterChipBadge,
                    {
                      backgroundColor: isActive ? f.color : colors.border,
                    },
                  ]}
                >
                  <Text style={s.filterChipBadgeText}>{toPersianDigit(count)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* لیست نوبت‌ها */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContainer}
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const meta = STATUS_META[apt.status] || STATUS_META.pending;
            return (
              <TouchableOpacity
                key={apt.id}
                activeOpacity={0.85}
                onPress={() => openDetail(apt)}
              >
                <Card variant="elevated" padding={16} radius={18} style={s.aptCard}>
                  <View style={s.aptHeader}>
                    <View style={s.aptUser}>
                      <Avatar name={apt.customerName} size="md" />
                      <View style={s.aptUserInfo}>
                        <Text style={[s.aptCustomerName, { color: colors.textMain }]}>
                          {apt.customerName}
                        </Text>
                        <Text style={[s.aptCustomerPhone, { color: colors.textSecondary }]}>
                          {toPersianDigit(apt.customerPhone || '—')}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        s.statusBadge,
                        { backgroundColor: meta.color + '20' },
                      ]}
                    >
                      <Icon name={meta.icon} size={12} color={meta.color} />
                      <Text style={[s.statusBadgeText, { color: meta.color }]}>
                        {meta.label}
                      </Text>
                    </View>
                  </View>

                  <View style={s.aptDivider}>
                    <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
                  </View>

                  <View style={s.aptDetails}>
                    <View style={s.aptDetailItem}>
                      <Icon name="spa" size={14} color={colors.textSecondary} />
                      <Text style={[s.aptDetailText, { color: colors.textMain }]}>
                        {apt.serviceName}
                      </Text>
                    </View>
                    <View style={s.aptDetailItem}>
                      <Icon name="person" size={14} color={colors.textSecondary} />
                      <Text style={[s.aptDetailText, { color: colors.textMain }]}>
                        {apt.employeeName}
                      </Text>
                    </View>
                  </View>

                  <View style={s.aptFooter}>
                    <View style={s.aptTimeBox}>
                      <Icon name="event" size={14} color={colors.primary} />
                      <Text style={[s.aptTimeText, { color: colors.primary }]}>
                        {apt.date
                          ? `${toPersianDigit(apt.date.jy)}/${toPersianDigit(
                              apt.date.jm
                            )}/${toPersianDigit(apt.date.jd)}`
                          : '—'}
                      </Text>
                      <View style={[s.dot, { backgroundColor: colors.border }]} />
                      <Icon name="schedule" size={14} color={colors.primary} />
                      <Text style={[s.aptTimeText, { color: colors.primary }]}>
                        {apt.time}
                      </Text>
                    </View>
                    <Text style={[s.aptPrice, { color: colors.textMain }]}>
                      {formatPrice(apt.price)}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        ) : (
          <EmptyState
            icon="📅"
            title="نوبتی یافت نشد"
            description={
              activeFilter === 'all'
                ? 'هنوز هیچ نوبتی برای شما ثبت نشده است'
                : `نوبتی با وضعیت "${STATUS_META[activeFilter]?.label}" وجود ندارد`
            }
          />
        )}
      </ScrollView>

      {/* BottomSheet جزئیات */}
      <BottomSheet
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        title="جزئیات نوبت"
        snapPoint={0.7}
      >
        {selectedApt && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={s.detailCustomer}>
              <Avatar name={selectedApt.customerName} size="xl" />
              <Text style={[s.detailName, { color: colors.textMain }]}>
                {selectedApt.customerName}
              </Text>
              <Text style={[s.detailPhone, { color: colors.textSecondary }]}>
                {toPersianDigit(selectedApt.customerPhone || '—')}
              </Text>
            </View>

            <Card
              variant="default"
              padding={14}
              radius={14}
              style={s.detailCard}
            >
              <View style={s.detailRow}>
                <Text style={[s.detailLabel, { color: colors.textSecondary }]}>
                  خدمت
                </Text>
                <Text style={[s.detailValue, { color: colors.textMain }]}>
                  {selectedApt.serviceName}
                </Text>
              </View>
              <View style={s.detailRow}>
                <Text style={[s.detailLabel, { color: colors.textSecondary }]}>
                  کارمند
                </Text>
                <Text style={[s.detailValue, { color: colors.textMain }]}>
                  {selectedApt.employeeName}
                </Text>
              </View>
              <View style={s.detailRow}>
                <Text style={[s.detailLabel, { color: colors.textSecondary }]}>
                  تاریخ و ساعت
                </Text>
                <Text style={[s.detailValue, { color: colors.textMain }]}>
                  {selectedApt.time}
                </Text>
              </View>
              <View style={s.detailRow}>
                <Text style={[s.detailLabel, { color: colors.textSecondary }]}>
                  مبلغ کل
                </Text>
                <Text style={[s.detailValue, { color: colors.primary }]}>
                  {formatPrice(selectedApt.price)}
                </Text>
              </View>
              {selectedApt.depositPaid > 0 && (
                <View style={s.detailRow}>
                  <Text style={[s.detailLabel, { color: colors.textSecondary }]}>
                    بیعانه پرداخت شده
                  </Text>
                  <Text style={[s.detailValue, { color: '#43A047' }]}>
                    {formatPrice(selectedApt.depositPaid)}
                  </Text>
                </View>
              )}
            </Card>

            <View style={s.detailActions}>
              {selectedApt.status === 'pending' && (
                <>
                  <Button
                    title="تایید نوبت"
                    onPress={() => handleStatusChange(selectedApt.id, 'confirmed')}
                    variant="primary"
                    size="lg"
                    fullWidth
                    style={[s.actionBtn, { backgroundColor: '#43A047' }]}
                    icon={<Icon name="check" size={20} color="#fff" />}
                    iconPosition="right"
                  />
                  <Button
                    title="لغو نوبت"
                    onPress={() => handleStatusChange(selectedApt.id, 'cancelled')}
                    variant="outline"
                    size="lg"
                    fullWidth
                    style={[s.actionBtn, { borderColor: '#E53935' }]}
                    textStyle={{ color: '#E53935' }}
                    icon={<Icon name="close" size={20} color="#E53935" />}
                    iconPosition="right"
                  />
                </>
              )}
              {selectedApt.status === 'confirmed' && (
                <Button
                  title="ثبت به عنوان انجام شده"
                  onPress={() => handleStatusChange(selectedApt.id, 'done')}
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={[s.actionBtn, { backgroundColor: '#1E88E5' }]}
                  icon={<Icon name="check-circle" size={20} color="#fff" />}
                  iconPosition="right"
                />
              )}
              <Button
                title="حذف نوبت"
                onPress={() => handleDelete(selectedApt)}
                variant="ghost"
                size="md"
                fullWidth
                textStyle={{ color: '#E53935' }}
                icon={<Icon name="delete-outline" size={18} color="#E53935" />}
                iconPosition="right"
              />
            </View>
          </ScrollView>
        )}
      </BottomSheet>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  filterChipBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterChipBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  aptCard: {
    marginBottom: 0,
  },
  aptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aptUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  aptUserInfo: {
    flex: 1,
    gap: 2,
  },
  aptCustomerName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  aptCustomerPhone: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  aptDivider: {
    paddingVertical: 4,
  },
  dividerLine: {
    height: 1,
  },
  aptDetails: {
    gap: 6,
    marginBottom: 10,
  },
  aptDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aptDetailText: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  aptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aptTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aptTimeText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 2,
  },
  aptPrice: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  detailCustomer: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  detailName: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  detailPhone: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  detailCard: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  detailValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  detailActions: {
    gap: 10,
  },
  actionBtn: {},
});