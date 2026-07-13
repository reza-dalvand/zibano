// src/components/manageBusiness/modelRequest/ModelRequestCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Card from '../../common/Card';
import Badge from '../../common/Badge';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function ModelRequestCard({ request, onPress, onEdit, onDelete }) {
  const { colors } = useTheme();

  const statusColors = {
    active: '#4CAF50',
    completed: '#2196F3',
    closed: '#757575',
  };

  const statusLabels = {
    active: 'فعال',
    completed: 'تکمیل شده',
    closed: 'بسته شده',
  };

  return (
    <Card variant="elevated" padding={0} radius={18}>
      <TouchableOpacity onPress={() => onPress?.(request)} activeOpacity={0.85}>
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
            label={statusLabels[request.status]}
            variant={request.status === 'active' ? 'success' : 'neutral'}
            size="md"
          />
        </View>

        {/* جزئیات */}
        <View style={s.details}>
          <View style={s.detailRow}>
            <Icon name="schedule" size={14} color={colors.textSecondary} />
            <Text style={[s.detailText, { color: colors.textSecondary }]}>
              مدت زمان: {toPersianDigit(request.duration)} دقیقه
            </Text>
          </View>

          {request.discount > 0 && (
            <View style={s.detailRow}>
              <Icon name="local-offer" size={14} color="#4CAF50" />
              <Text style={[s.detailText, { color: '#4CAF50' }]}>
                تخفیف ویژه: {toPersianDigit(request.discount)}٪
              </Text>
            </View>
          )}

          <View style={s.detailRow}>
            <Icon name="people" size={14} color={colors.primary} />
            <Text style={[s.detailText, { color: colors.textSecondary }]}>
              {toPersianDigit(request.applicants || 0)} متقاضی
            </Text>
          </View>
        </View>

        {/* دکمه‌های اکشن */}
        <View style={[s.actions, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: colors.primary + '15' }]}
            onPress={(e) => {
              e.stopPropagation();
              onEdit?.(request);
            }}
          >
            <Icon name="edit" size={18} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: '#E5393515' }]}
            onPress={(e) => {
              e.stopPropagation();
              onDelete?.(request);
            }}
          >
            <Icon name="delete-outline" size={18} color="#E53935" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.viewBtn, { backgroundColor: colors.primary }]}
            onPress={() => onPress?.(request)}
          >
            <Text style={[s.viewBtnText, { color: '#fff' }]}>مشاهده متقاضیان</Text>
            <Icon name="chevron-left" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  details: {
    padding: 14,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewBtnText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
});