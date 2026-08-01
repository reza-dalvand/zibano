// src/components/manageBusiness/modelRequest/ModelRequestDetailModal.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import BottomSheet from '../../common/BottomSheet';
import Button from '../../common/Button';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import CostTypeBadge from '../../common/CostTypeBadge';
import InfoRow from '../../common/InfoRow';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function ModelRequestDetailModal({ visible, request, onClose, onEdit, onDelete }) {
  const { colors } = useTheme();
  if (!request) return null;

  const statusConfig = {
    active:   { label: 'فعال',     variant: 'success', color: '#4CAF50' },
    inactive: { label: 'غیرفعال',  variant: 'error',   color: '#E53935' },
  };
  const currentStatus = statusConfig[request.status] || statusConfig.inactive;

  const handleCall = async () => {
    if (!request.contactPhone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    try {
      const phoneUrl = `tel:${request.contactPhone}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) await Linking.openURL(phoneUrl);
      else Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    } catch {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'حذف درخواست مدل',
      `آیا از حذف "${request.title}" مطمئن هستید؟ این عمل قابل بازگشت نیست.`,
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => onDelete?.(request) },
      ]
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="جزئیات درخواست مدل"
      snapPoint={0.9}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* تصویر خدمت */}
        {request.serviceImage && (
          <View style={s.imageWrapper}>
            <Image source={{ uri: request.serviceImage }} style={s.image} />
            <View style={s.imageGradient} />
            {/* Badge وضعیت روی تصویر */}
            <View style={s.imageBadge}>
              <Badge
                label={currentStatus.label}
                variant={currentStatus.variant}
                size="md"
              />
            </View>
          </View>
        )}

        {/* عنوان و badges */}
        <View style={s.titleSection}>
          <Text style={[s.title, { color: colors.textMain }]}>{request.title}</Text>
          <View style={s.badgesRow}>
            <CostTypeBadge type={request.costType} variant="default" />
            {request.serviceName && (
              <View style={[s.serviceChip, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="spa" size={12} color={colors.primary} />
                <Text style={[s.serviceChipText, { color: colors.primary }]} numberOfLines={1}>
                  {request.serviceName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* توضیحات */}
        {request.description ? (
          <Card variant="default" padding={14} radius={14}>
            <View style={s.sectionHeader}>
              <Icon name="description" size={18} color={colors.primary} />
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>توضیحات</Text>
            </View>
            <Text style={[s.description, { color: colors.textSecondary }]}>
              {request.description}
            </Text>
          </Card>
        ) : null}

        {/* تماس */}
        {request.contactPhone && (
          <Card variant="default" padding={14} radius={14}>
            <View style={s.sectionHeader}>
              <Icon name="phone" size={18} color="#4CAF50" />
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>اطلاعات تماس</Text>
            </View>
            <InfoRow
              icon="phone"
              label="شماره تماس مدل‌ها"
              value={toPersianDigit(request.contactPhone)}
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
          <InfoRow icon="event-note" label="تاریخ ایجاد" value={request.createdAt || '—'} />
          <InfoRow icon="event-busy" label="تاریخ انقضا" value={request.expiresAt || '—'} />
        </Card>

        {/* دکمه‌های اکشن */}
        <View style={s.actionsRow}>
          <Button
            title="ویرایش"
            onPress={() => { onClose(); setTimeout(() => onEdit?.(request), 300); }}
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
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  serviceChipText: {
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
  description: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 22,
    textAlign: 'justify',
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