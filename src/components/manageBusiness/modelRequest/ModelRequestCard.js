// src/components/manageBusiness/modelRequest/ModelRequestCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Card from '../../common/Card';
import Badge from '../../common/Badge';

const toPersianDigit = (str) =>
  String(str || '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const MAX_DESC_LENGTH = 300;

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return toPersianDigit(dateStr);
};

const truncateDescription = (text) => {
  if (!text) return '';
  if (text.length <= MAX_DESC_LENGTH) return text;
  return text.slice(0, MAX_DESC_LENGTH).trim() + '...';
};

// 🎯 متادیتای ۳ نوع هزینه
const COST_TYPE_META = {
  paid: {
    label: 'با هزینه',
    icon: 'attach-money',
    color: '#2196F3',
    bg: '#2196F318',
    border: '#2196F340',
  },
  material_cost: {
    label: 'با هزینه مواد',
    icon: 'science',
    color: '#FF9800',
    bg: '#FF980018',
    border: '#FF980040',
  },
  free: {
    label: 'کاملاً رایگان',
    icon: 'redeem',
    color: '#4CAF50',
    bg: '#4CAF5018',
    border: '#4CAF5040',
  },
};

export default function ModelRequestCard({ request, onEdit, onDelete }) {
  const { colors } = useTheme();
  
  const statusConfig = {
    active: { label: 'فعال', variant: 'success', color: '#4CAF50' },
    inactive: { label: 'غیرفعال', variant: 'error', color: '#E53935' },
  };

  const currentStatus = statusConfig[request.status] || statusConfig.inactive;
  const costMeta = COST_TYPE_META[request.costType] || COST_TYPE_META.material_cost;

  const handleDelete = () => {
    Alert.alert(
      'حذف درخواست مدل',
      `آیا از حذف "${request.title}" مطمئن هستید؟\nاین عمل قابل بازگشت نیست.`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => onDelete?.(request),
        },
      ]
    );
  };

  const handleCall = async () => {
    if (!request.contactPhone) return;
    try {
      const phoneUrl = `tel:${request.contactPhone}`;
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

  const truncatedDesc = truncateDescription(request.description);
  const isTruncated = request.description && request.description.length > MAX_DESC_LENGTH;

  return (
    <Card variant="elevated" padding={0} radius={18}>
      {/* هدر */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <View style={s.headerLeft}>
          {request.serviceImage && (
            <Image source={{ uri: request.serviceImage }} style={s.serviceImage} />
          )}
          <View style={s.headerInfo}>
            <Text style={[s.serviceName, { color: colors.textMain }]} numberOfLines={1}>
              {request.serviceName}
            </Text>
            <Text style={[s.requestTitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {request.title}
            </Text>
          </View>
        </View>
        <Badge
          label={currentStatus.label}
          variant={currentStatus.variant}
          size="md"
        />
      </View>

      {/* 🎯 Badge نوع هزینه */}
      <View style={s.costTypeRow}>
        <View
          style={[
            s.costTypeBadge,
            {
              backgroundColor: costMeta.bg,
              borderColor: costMeta.border,
            },
          ]}
        >
          <Icon name={costMeta.icon} size={14} color={costMeta.color} />
          <Text style={[s.costTypeText, { color: costMeta.color }]}>
            {costMeta.label}
          </Text>
        </View>
      </View>

      {/* شماره تماس */}
      {request.contactPhone && (
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
              {toPersianDigit(request.contactPhone)}
            </Text>
          </View>
          <View style={[s.callBtn, { backgroundColor: '#4CAF50' }]}>
            <Icon name="call" size={14} color="#fff" />
            <Text style={s.callBtnText}>تماس</Text>
          </View>
        </TouchableOpacity>
      )}

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
          {isTruncated && (
            <Text style={[s.truncatedHint, { color: colors.primary }]}>
              • توضیحات کامل در هنگام ویرایش قابل مشاهده است
            </Text>
          )}
        </View>
      ) : null}

      {/* تاریخ‌ها */}
      <View style={[s.datesBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={s.dateRow}>
          <Icon name="event-note" size={14} color={colors.textSecondary} />
          <Text style={[s.dateLabel, { color: colors.textSecondary }]}>تاریخ ایجاد:</Text>
          <Text style={[s.dateValue, { color: colors.textMain }]}>
            {formatDate(request.createdAt)}
          </Text>
        </View>
        <View style={s.dateRow}>
          <Icon name="event-busy" size={14} color={colors.textSecondary} />
          <Text style={[s.dateLabel, { color: colors.textSecondary }]}>تاریخ انقضا:</Text>
          <Text style={[s.dateValue, { color: colors.textMain }]}>
            {formatDate(request.expiresAt)}
          </Text>
        </View>
      </View>

      {/* پیام غیرفعال */}
      {request.status === 'inactive' && (
        <View style={[s.inactiveBox, { backgroundColor: '#E5393510', borderColor: '#E5393530' }]}>
          <Icon name="block" size={16} color="#E53935" />
          <Text style={[s.inactiveText, { color: '#E53935' }]}>
            این آگهی غیرفعال است و در جستجو نمایش داده نمی‌شود
          </Text>
        </View>
      )}

      {/* دکمه‌ها */}
      <View style={[s.actions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[s.actionBtn, { backgroundColor: colors.primary + '15' }]}
          onPress={() => onEdit?.(request)}
        >
          <Icon name="edit" size={20} color={colors.primary} />
          <Text style={[s.actionBtnText, { color: colors.primary }]}>ویرایش</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.actionBtn, { backgroundColor: '#E5393515' }]}
          onPress={handleDelete}
        >
          <Icon name="delete-outline" size={20} color="#E53935" />
          <Text style={[s.actionBtnText, { color: '#E53935' }]}>حذف</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  serviceImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  requestTitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  // 🎯 Badge نوع هزینه
  costTypeRow: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  costTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  costTypeText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 14,
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextCol: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    letterSpacing: 0.5,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  callBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  descBox: {
    marginHorizontal: 14,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  descHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  descTitle: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  descText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },
  truncatedHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    marginTop: 2,
  },
  datesBox: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  dateValue: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  inactiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 14,
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
});