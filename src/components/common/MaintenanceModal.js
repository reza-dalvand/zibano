// src/components/common/MaintenanceModal.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useMaintenance } from '../../context/MaintenanceContext';

export default function MaintenanceModal() {
  const { colors } = useTheme();
  const { maintenanceInfo } = useMaintenance();

  if (!maintenanceInfo) return null;

  const handleCallSupport = async () => {
    try {
      const phone = maintenanceInfo.supportPhone?.replace(/[^0-9+]/g, '');
      if (!phone) {
        Alert.alert('خطا', 'شماره پشتیبانی ثبت نشده است');
        return;
      }
      const phoneUrl = `tel:${phone}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          'تماس با پشتیبانی',
          `شماره پشتیبانی:\n${maintenanceInfo.supportPhone}`,
          [{ text: 'باشه' }]
        );
      }
    } catch (error) {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    }
  };

  return (
    <Modal
      visible={!!maintenanceInfo}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={[s.backdrop, { backgroundColor: 'rgba(0,0,0,0.75)' }]}>
        <View
          style={[
            s.modal,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          {/* ═══════ آیکون چرخ‌دنده ═══════ */}
          <View style={s.iconWrapper}>
            <View
              style={[
                s.iconCircle,
                {
                  backgroundColor: '#FF980015',
                  borderColor: '#FF980040',
                },
              ]}
            >
              <Icon name="build" size={56} color="#FF9800" />
            </View>

            {/* چرخ‌دنده کوچک تزئینی */}
            <View
              style={[
                s.smallGear,
                {
                  backgroundColor: '#FF980020',
                  borderColor: '#fff',
                },
              ]}
            >
              <Icon name="settings" size={20} color="#FF9800" />
            </View>

            {/* Badge وضعیت */}
            <View style={[s.statusBadge, { backgroundColor: '#FF9800' }]}>
              <Icon name="wifi-off" size={10} color="#fff" />
              <Text style={s.statusBadgeText}>آفلاین</Text>
            </View>
          </View>

          {/* ═══════ عنوان ═══════ */}
          <Text style={[s.title, { color: colors.textMain }]}>
            {maintenanceInfo.title}
          </Text>

          {/* ═══════ پیام ═══════ */}
          <Text style={[s.message, { color: colors.textSecondary }]}>
            {maintenanceInfo.message}
          </Text>

          {/* ═══════ کارت دلیل تعمیرات ═══════ */}
          <View
            style={[
              s.reasonCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[s.reasonIconBox, { backgroundColor: '#2196F320' }]}>
              <Icon name="info" size={16} color="#2196F3" />
            </View>
            <View style={s.reasonTextCol}>
              <Text style={[s.reasonLabel, { color: colors.textSecondary }]}>
                دلیل تعمیرات
              </Text>
              <Text style={[s.reasonValue, { color: colors.textMain }]}>
                {maintenanceInfo.reason}
              </Text>
            </View>
          </View>

          {/* ═══════ زمان تقریبی پایان ═══════ */}
          {maintenanceInfo.estimatedEnd && (
            <View
              style={[
                s.timeCard,
                {
                  backgroundColor: '#43A04708',
                  borderColor: '#43A04740',
                },
              ]}
            >
              <Icon name="schedule" size={18} color="#43A047" />
              <View style={s.timeTextCol}>
                <Text style={[s.timeLabel, { color: colors.textSecondary }]}>
                  زمان تقریبی پایان تعمیرات
                </Text>
                <Text style={[s.timeValue, { color: '#43A047' }]}>
                  {maintenanceInfo.estimatedEnd}
                </Text>
              </View>
            </View>
          )}

          {/* ═══════ دکمه تماس با پشتیبانی ═══════ */}
          <TouchableOpacity
            onPress={handleCallSupport}
            style={[
              s.supportBtn,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            activeOpacity={0.75}
          >
            <Icon name="headset-mic" size={16} color={colors.primary} />
            <Text style={[s.supportBtnText, { color: colors.textMain }]}>
              نیاز به کمک دارید؟ تماس با پشتیبانی
            </Text>
            <Icon name="call" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  modal: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },

  // ═══════ آیکون ═══════
  iconWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  smallGear: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    zIndex: 2,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 3,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════ متن‌ها ═══════
  title: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  // ═══════ کارت دلیل ═══════
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    width: '100%',
    marginTop: 4,
  },
  reasonIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonTextCol: {
    flex: 1,
    gap: 2,
  },
  reasonLabel: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  reasonValue: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════ کارت زمان ═══════
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    width: '100%',
  },
  timeTextCol: {
    flex: 1,
    gap: 2,
  },
  timeLabel: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  timeValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════ دکمه پشتیبانی ═══════
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    marginTop: 4,
  },
  supportBtnText: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },

  // ═══════ هشدار اجباری ═══════
  forceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
    marginTop: 4,
  },
  forceWarningText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
});