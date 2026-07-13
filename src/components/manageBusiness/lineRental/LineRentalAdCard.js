// src/components/manageBusiness/lineRental/LineRentalAdCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Card from '../../common/Card';

const MAX_DESC_LENGTH = 300;

const COLLAB_TYPE_META = {
  percent: { label: 'درصدی', color: '#9C27B0', bg: '#9C27B018', icon: 'pie-chart' },
  fixed: { label: 'اجاره ثابت', color: '#2196F3', bg: '#2196F318', icon: 'attach-money' },
  combined: { label: 'ترکیبی', color: '#FF9800', bg: '#FF980018', icon: 'balance' },
};

const toPersianDigit = (str) =>
  String(str || '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const truncateDesc = (text) => {
  if (!text) return '';
  if (text.length <= MAX_DESC_LENGTH) return text;
  return text.slice(0, MAX_DESC_LENGTH).trim() + '...';
};

export default function LineRentalAdCard({ ad, onEdit, onDelete }) {
  const { colors } = useTheme();
  const collabMeta = COLLAB_TYPE_META[ad.collabType] || COLLAB_TYPE_META.percent;

  const handleCall = async () => {
    if (!ad.contactPhone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    try {
      const phoneUrl = `tel:${ad.contactPhone}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
      }
    } catch (error) {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    }
  };

  const getStatusConfig = () => {
    if (ad.status === 'active') {
      return { label: 'فعال', color: '#4CAF50', bg: '#4CAF5020', icon: 'check-circle' };
    }
    return { label: 'غیرفعال', color: '#E53935', bg: '#E5393520', icon: 'block' };
  };

  const statusConfig = getStatusConfig();
  const truncatedDesc = truncateDesc(ad.description);
  const isTruncated = !!(ad.description && ad.description.length > MAX_DESC_LENGTH);
  const hasPriceDisplay = !!(ad.priceDisplay && ad.priceDisplay.length > 0);

  return (
    <Card variant="elevated" padding={0} radius={18} style={s.card}>
      {/* هدر کارت */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image
            source={{ uri: ad.lineImage || 'https://picsum.photos/200/200?random=70' }}
            style={s.lineImage}
          />
          <View style={s.headerInfo}>
            <Text style={[s.title, { color: colors.textMain }]} numberOfLines={1}>
              {ad.title}
            </Text>
            <View style={s.serviceTypeRow}>
              <View style={[s.serviceTypeIconBox, { backgroundColor: (ad.serviceTypeColor || '#607D8B') + '20' }]}>
                <Icon name={ad.serviceTypeIcon || 'spa'} size={11} color={ad.serviceTypeColor || '#607D8B'} />
              </View>
              <Text style={[s.serviceTypeName, { color: ad.serviceTypeColor || '#607D8B' }]} numberOfLines={1}>
                {ad.serviceTypeName || 'خدمات زیبایی'}
              </Text>
            </View>
            <View style={s.subtitleRow}>
              <Icon name="store" size={12} color={colors.textSecondary} />
              <Text style={[s.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {ad.businessName || 'سالن زیبایی'}
              </Text>
            </View>
            <View style={s.metaRow}>
              <Icon name="location-on" size={11} color={colors.textSecondary} />
              <Text style={[s.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                {ad.city || 'تهران'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[s.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Icon name={statusConfig.icon} size={10} color={statusConfig.color} />
          <Text style={[s.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* تگ نوع همکاری */}
      <View style={[s.collabTag, { backgroundColor: collabMeta.bg, borderColor: collabMeta.color + '40' }]}>
        <Icon name={collabMeta.icon} size={14} color={collabMeta.color} />
        <Text style={[s.collabLabel, { color: collabMeta.color }]}>
          همکاری {collabMeta.label}
        </Text>
        {hasPriceDisplay ? (
          <View style={s.priceSection}>
            <View style={[s.tagDot, { backgroundColor: collabMeta.color + '60' }]} />
            <Text style={[s.priceText, { color: collabMeta.color }]}>
              {ad.priceDisplay}
            </Text>
          </View>
        ) : null}
      </View>

      {/* شماره تماس */}
      {ad.contactPhone ? (
        <TouchableOpacity
          onPress={handleCall}
          activeOpacity={0.7}
          style={[s.infoBox, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <View style={[s.infoIconBox, { backgroundColor: '#4CAF5020' }]}>
            <Icon name="phone" size={16} color="#4CAF50" />
          </View>
          <View style={s.infoTextCol}>
            <Text style={[s.infoLabel, { color: colors.textSecondary }]}>شماره تماس:</Text>
            <Text style={[s.infoValue, { color: colors.textMain }]}>
              {toPersianDigit(ad.contactPhone)}
            </Text>
          </View>
          <View style={[s.callBtn, { backgroundColor: '#4CAF50' }]}>
            <Icon name="call" size={14} color="#fff" />
            <Text style={s.callBtnText}>تماس</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {/* توضیحات */}
      {truncatedDesc ? (
        <View style={[s.descBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={s.descHeader}>
            <Icon name="description" size={14} color={colors.primary} />
            <Text style={[s.descTitle, { color: colors.textMain }]}>توضیحات آگهی</Text>
          </View>
          <Text style={[s.descText, { color: colors.textSecondary }]}>
            {truncatedDesc}
          </Text>
          {isTruncated ? (
            <Text style={[s.truncatedHint, { color: colors.primary }]}>
              • توضیحات کامل در هنگام ویرایش قابل مشاهده است
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* پیام غیرفعال */}
      {ad.status === 'inactive' ? (
        <View style={[s.inactiveBox, { backgroundColor: '#E5393510', borderColor: '#E5393530' }]}>
          <Icon name="block" size={16} color="#E53935" />
          <Text style={[s.inactiveText, { color: '#E53935' }]}>
            این آگهی غیرفعال است و در جستجو نمایش داده نمی‌شود
          </Text>
        </View>
      ) : null}

      {/* دکمه‌های ویرایش و حذف */}
      <View style={[s.ownerActionsRow, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => onEdit?.(ad)}
          style={[s.ownerBtn, { backgroundColor: colors.primary + '10' }]}
        >
          <Icon name="edit" size={15} color={colors.primary} />
          <Text style={[s.ownerBtnText, { color: colors.primary }]}>ویرایش</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete?.(ad)}
          style={[s.ownerBtn, { backgroundColor: '#E5393510' }]}
        >
          <Icon name="delete-outline" size={15} color="#E53935" />
          <Text style={[s.ownerBtnText, { color: '#E53935' }]}>حذف</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: { overflow: 'hidden', marginBottom: 0 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 14, gap: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  lineImage: { width: 64, height: 64, borderRadius: 14, backgroundColor: '#eee' },
  headerInfo: { flex: 1, gap: 3 },
  title: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  serviceTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  serviceTypeIconBox: { width: 18, height: 18, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  serviceTypeName: { fontSize: 12, fontFamily: 'Vazir-Bold', flex: 1 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  subtitle: { fontSize: 12, fontFamily: 'Vazir-Medium', flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  metaText: { fontSize: 11, fontFamily: 'Vazir' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 10, fontFamily: 'Vazir-Bold' },
  collabTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 14, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  collabLabel: { fontSize: 13, fontFamily: 'Vazir-Bold', flex: 1 },
  priceSection: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagDot: { width: 4, height: 4, borderRadius: 2 },
  priceText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 14, marginTop: 12, padding: 10, borderRadius: 12, borderWidth: 1 },
  infoIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoTextCol: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 11, fontFamily: 'Vazir' },
  infoValue: { fontSize: 14, fontFamily: 'Vazir-Bold', letterSpacing: 0.5 },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  callBtnText: { color: '#fff', fontSize: 12, fontFamily: 'Vazir-Bold' },
  descBox: { marginHorizontal: 14, marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, gap: 8 },
  descHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  descTitle: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  descText: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 20 },
  truncatedHint: { fontSize: 11, fontFamily: 'Vazir', marginTop: 2 },
  inactiveBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 14, marginTop: 10, marginBottom: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  inactiveText: { flex: 1, fontSize: 12, fontFamily: 'Vazir-Medium', lineHeight: 18 },
  ownerActionsRow: { flexDirection: 'row', gap: 8, padding: 10, marginTop: 12, borderTopWidth: 1 },
  ownerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10 },
  ownerBtnText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
});