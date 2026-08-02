// src/components/manageBusiness/lineRental/LineRentalDetailModal.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import BottomSheet from '../../common/BottomSheet';
import Button from '../../common/Button';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import CollabBadge from '../../common/CollabBadge';
import InfoRow from '../../common/InfoRow';
import { toPersianDigit } from '../../../utils/numberUtils';
import { formatJalaaliDate } from '../../../utils/dateUtils';

export default function LineRentalDetailModal({ visible, ad, onClose, onEdit, onDelete }) {
  const { colors } = useTheme();
  if (!ad) return null;

  const statusConfig = {
    active:   { label: 'فعال',     variant: 'success', color: '#4CAF50' },
    inactive: { label: 'غیرفعال',  variant: 'error',   color: '#E53935' },
  };
  const currentStatus = statusConfig[ad.status] || statusConfig.inactive;

  const handleCall = async () => {
    if (!ad.contactPhone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    try {
      const phoneUrl = `tel:${ad.contactPhone}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) await Linking.openURL(phoneUrl);
      else Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    } catch {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'حذف آگهی لاین',
      `آیا از حذف "${ad.title}" مطمئن هستید؟ این عمل قابل بازگشت نیست.`,
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => onDelete?.(ad) },
      ]
    );
  };

  // ساخت نمایش قیمت بر اساس نوع همکاری
  const getPriceInfo = () => {
    switch (ad.collabType) {
      case 'percent':
        return {
          label: 'تقسیم درآمد',
          value: `سالن ${toPersianDigit(ad.percentSalon || 0)}٪ - همکار ${toPersianDigit(ad.percentPartner || 0)}٪`,
          icon: 'pie-chart',
          color: '#9C27B0',
        };
      case 'fixed':
        return {
          label: ad.fixedDeposit > 0 ? 'اجاره ماهانه + رهن' : 'اجاره ماهانه',
          value: ad.fixedDeposit > 0
            ? `${toPersianDigit((ad.fixedAmount || 0).toLocaleString('en-US'))} + ${toPersianDigit((ad.fixedDeposit || 0).toLocaleString('en-US'))} رهن`
            : `${toPersianDigit((ad.fixedAmount || 0).toLocaleString('en-US'))} تومان`,
          icon: 'attach-money',
          color: '#2196F3',
        };
      case 'hourly':
        return {
          label: 'نرخ ساعتی',
          value: `${toPersianDigit((ad.hourlyRate || 0).toLocaleString('en-US'))} تومان / ساعت`,
          icon: 'schedule',
          color: '#FF9800',
        };
      default:
        return { label: 'قیمت', value: ad.priceDisplay || '—', icon: 'attach-money', color: '#607D8B' };
    }
  };

  const priceInfo = getPriceInfo();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="جزئیات آگهی لاین"
      snapPoint={0.9}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* تصویر لاین */}
        {ad.lineImage && (
          <View style={s.imageWrapper}>
            <Image source={{ uri: ad.lineImage }} style={s.image} />
            <View style={s.imageGradient} />
            {/* Badge وضعیت روی تصویر */}
            <View style={s.imageBadge}>
              <Badge
                label={currentStatus.label}
                variant={currentStatus.variant}
                size="md"
              />
            </View>
            {/* Badge نوع خدمت */}
            <View style={s.serviceTypeBadge}>
              <View style={[s.serviceTypeIcon, { backgroundColor: ad.serviceTypeColor || '#607D8B' }]}>
                <Icon name={ad.serviceTypeIcon || 'spa'} size={12} color="#fff" />
              </View>
              <Text style={s.serviceTypeText}>{ad.serviceTypeName || 'خدمات'}</Text>
            </View>
          </View>
        )}

        {/* عنوان و badges */}
        <View style={s.titleSection}>
          <Text style={[s.title, { color: colors.textMain }]}>{ad.title}</Text>
          <View style={s.badgesRow}>
            <CollabBadge
              type={ad.collabType}
              priceDisplay={ad.priceDisplay}
              variant="default"
            />
            {ad.businessName && (
              <View style={[s.businessChip, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="store" size={12} color={colors.primary} />
                <Text style={[s.businessChipText, { color: colors.primary }]} numberOfLines={1}>
                  {ad.businessName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* کارت قیمت و شرایط */}
        <Card variant="default" padding={14} radius={14}>
          <View style={s.sectionHeader}>
            <Icon name={priceInfo.icon} size={18} color={priceInfo.color} />
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>شرایط همکاری</Text>
          </View>
          <View style={[s.priceBox, { backgroundColor: priceInfo.color + '10', borderColor: priceInfo.color + '30' }]}>
            <Text style={[s.priceLabel, { color: colors.textSecondary }]}>{priceInfo.label}</Text>
            <Text style={[s.priceValue, { color: priceInfo.color }]}>{priceInfo.value}</Text>
          </View>
          {ad.city && (
            <InfoRow
              icon="location-on"
              iconColor="#E53935"
              label="موقعیت"
              value={ad.city}
            />
          )}
        </Card>

        {/* توضیحات */}
        {ad.description ? (
          <Card variant="default" padding={14} radius={14}>
            <View style={s.sectionHeader}>
              <Icon name="description" size={18} color={colors.primary} />
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>توضیحات</Text>
            </View>
            <Text style={[s.description, { color: colors.textSecondary }]}>
              {ad.description}
            </Text>
          </Card>
        ) : null}

        {/* تماس */}
        {ad.contactPhone && (
          <Card variant="default" padding={14} radius={14}>
            <View style={s.sectionHeader}>
              <Icon name="phone" size={18} color="#4CAF50" />
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات تماس</Text>
            </View>
            <InfoRow
              icon="phone"
              label="شماره تماس"
              value={toPersianDigit(ad.contactPhone)}
              monospace
            />
            <Button
              title="تماس مستقیم"
              onPress={handleCall}
              variant="primary"
              size="md"
              fullWidth
              icon={<Icon name="call" size={18} color="#fff" />}
              iconPosition="right"
              style={{ marginTop: 8, backgroundColor: '#4CAF50' }}
            />
          </Card>
        )}

        {/* تاریخ‌ها */}
        <Card variant="default" padding={14} radius={14}>
          <View style={s.sectionHeader}>
            <Icon name="event" size={18} color="#2196F3" />
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>زمان‌بندی</Text>
          </View>
          <InfoRow icon="event-note" label="تاریخ ایجاد" value={formatJalaaliDate(ad.createdAt)} />
          <InfoRow icon="event-busy" label="تاریخ انقضا" value={formatJalaaliDate(ad.expiresAt)} />
        </Card>

        {/* پیام غیرفعال */}
        {ad.status === 'inactive' && (
          <View style={[s.inactiveBox, { backgroundColor: '#E5393510', borderColor: '#E5393530' }]}>
            <Icon name="block" size={16} color="#E53935" />
            <Text style={[s.inactiveText, { color: '#E53935' }]}>
              این آگهی غیرفعال است و در جستجو نمایش داده نمی‌شود
            </Text>
          </View>
        )}

        {/* دکمه‌های اکشن */}
        <View style={s.actionsRow}>
          <Button
            title="ویرایش"
            onPress={() => { onClose(); setTimeout(() => onEdit?.(ad), 300); }}
            variant="outline"
            size="lg"
            style={s.halfBtn}
            icon={<Icon name="edit" size={18} color={colors.primary} />}
            iconPosition="right"
          />
          <Button
            title="حذف"
            onPress={handleDelete}
            variant="primary"
            size="lg"
            style={[s.halfBtn, { backgroundColor: '#E53935', borderColor: '#E53935' }]}
            icon={<Icon name="delete-outline" size={18} color="#fff" />}
            iconPosition="right"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 20,
    gap: 14,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  serviceTypeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  serviceTypeIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTypeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  titleSection: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    lineHeight: 26,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  businessChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  businessChipText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  priceBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  priceValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 22,
    textAlign: 'justify',
  },
  inactiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  inactiveText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  halfBtn: {
    flex: 1,
  },
});