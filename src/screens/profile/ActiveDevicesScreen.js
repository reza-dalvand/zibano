// src/screens/profile/ActiveDevicesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const MOCK_DEVICES = [
  {
    id: 'dev_1',
    name: 'iPhone 14 Pro',
    type: 'ios',
    icon: 'phone-iphone',
    os: 'iOS 17.5.1',
    browser: 'Zibano App v1.0.0',
    ip: '192.168.1.45',
    location: 'تهران، ایران',
    lastActive: 'همین الان',
    isCurrent: true,
    trusted: true,
  },
  {
    id: 'dev_2',
    name: 'Samsung Galaxy S23',
    type: 'android',
    icon: 'phone-android',
    os: 'Android 14',
    browser: 'Zibano App v1.0.0',
    ip: '85.185.24.112',
    location: 'اصفهان، ایران',
    lastActive: '۲ ساعت پیش',
    isCurrent: false,
    trusted: true,
  },
  {
    id: 'dev_3',
    name: 'Windows 11 - Chrome',
    type: 'desktop',
    icon: 'laptop-windows',
    os: 'Windows 11 Pro',
    browser: 'Chrome 124.0.6367',
    ip: '5.22.134.89',
    location: 'مشهد، ایران',
    lastActive: 'دیروز، ۲۲:۴۵',
    isCurrent: false,
    trusted: false,
  },
];

export default function ActiveDevicesScreen({ navigation }) {
  // ═══════════ همه Hook‌ها در ابتدا ═══════════
  const { colors } = useTheme();
  const [devices, setDevices] = useState(MOCK_DEVICES);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // ═══════════ محاسبات ═══════════
  const currentDevice = devices.find((d) => d.isCurrent);
  const otherDevices = devices.filter((d) => !d.isCurrent);
  const stats = {
    total: devices.length,
    trusted: devices.filter((d) => d.trusted).length,
    suspicious: devices.filter((d) => !d.trusted && !d.isCurrent).length,
  };

  // ═══════════ Handlers ═══════════
  const handleRemoveDevice = (device) => {
    Alert.alert(
      'خروج از دستگاه',
      `آیا مطمئن هستید که می‌خواهید از "${device.name}" خارج شوید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: () => {
            setDevices((prev) => prev.filter((d) => d.id !== device.id));
            setToast({
              visible: true,
              message: `✓ نشست "${device.name}" بسته شد`,
              type: 'success',
            });
          },
        },
      ]
    );
  };

  const handleLogoutAll = () => {
    Alert.alert(
      '⚠️ خروج از همه دستگاه‌ها',
      'از تمام دستگاه‌های متصل خارج می‌شوید (به جز دستگاه فعلی)',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'خروج از همه',
          style: 'destructive',
          onPress: () => {
            setDevices((prev) => prev.filter((d) => d.isCurrent));
            setToast({
              visible: true,
              message: '✓ از همه دستگاه‌ها خارج شدید',
              type: 'success',
            });
          },
        },
      ]
    );
  };

  // ═══════════ Render ═══════════
  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* آمار */}
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="devices" size={20} color={colors.primary} />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(stats.total)}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              دستگاه فعال
            </Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#43A04720' }]}>
              <Icon name="verified-user" size={20} color="#43A047" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(stats.trusted)}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              مورد اعتماد
            </Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#FF980020' }]}>
              <Icon name="warning" size={20} color="#FF9800" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(stats.suspicious)}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              مشکوک
            </Text>
          </View>
        </View>

        {/* دستگاه فعلی */}
        {currentDevice && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Icon name="phone-iphone" size={18} color={colors.primary} />
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                دستگاه فعلی
              </Text>
            </View>
            <Card
              variant="default"
              padding={14}
              radius={16}
              style={{ borderColor: colors.primary + '60', borderWidth: 1.5 }}
            >
              <View style={s.deviceHeader}>
                <View style={[s.deviceIconBox, { backgroundColor: '#2196F318' }]}>
                  <Icon name={currentDevice.icon} size={26} color="#2196F3" />
                </View>
                <View style={s.deviceTextInfo}>
                  <Text style={[s.deviceName, { color: colors.textMain }]}>
                    {currentDevice.name}
                  </Text>
                  <Text style={[s.deviceOs, { color: colors.textSecondary }]}>
                    {currentDevice.os}
                  </Text>
                </View>
                <View style={[s.currentBadge, { backgroundColor: colors.primary + '20' }]}>
                  <View style={[s.currentDot, { backgroundColor: colors.primary }]} />
                  <Text style={[s.currentBadgeText, { color: colors.primary }]}>
                    فعلی
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* سایر دستگاه‌ها */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Icon name="devices-other" size={18} color={colors.primary} />
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              سایر دستگاه‌ها
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={[s.sectionCount, { color: colors.textSecondary }]}>
              {toPersianDigit(otherDevices.length)} دستگاه
            </Text>
          </View>

          {otherDevices.length > 0 ? (
            <View style={s.devicesList}>
              {otherDevices.map((device) => (
                <Card
                  key={device.id}
                  variant="elevated"
                  padding={14}
                  radius={16}
                >
                  <View style={s.deviceHeader}>
                    <View style={[s.deviceIconBox, { backgroundColor: '#607D8B18' }]}>
                      <Icon name={device.icon} size={26} color="#607D8B" />
                    </View>
                    <View style={s.deviceTextInfo}>
                      <Text style={[s.deviceName, { color: colors.textMain }]}>
                        {device.name}
                      </Text>
                      <Text style={[s.deviceOs, { color: colors.textSecondary }]}>
                        {device.os}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveDevice(device)}
                      style={s.removeBtn}
                    >
                      <Icon name="logout" size={18} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                  <View style={s.deviceDetails}>
                    <View style={s.detailRow}>
                      <Icon name="public" size={14} color={colors.textSecondary} />
                      <Text style={[s.detailLabel, { color: colors.textSecondary }]}>
                        آی‌پی:
                      </Text>
                      <Text style={[s.detailValue, { color: colors.textMain }]}>
                        {device.ip}
                      </Text>
                    </View>
                    <View style={s.detailRow}>
                      <Icon name="schedule" size={14} color={colors.textSecondary} />
                      <Text style={[s.detailLabel, { color: colors.textSecondary }]}>
                        آخرین فعالیت:
                      </Text>
                      <Text style={[s.detailValue, { color: colors.textMain }]}>
                        {device.lastActive}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="🎉"
              title="دستگاه دیگری متصل نیست"
              description="فقط از دستگاه فعلی به حساب خود دسترسی دارید"
            />
          )}
        </View>

        {/* دکمه خروج از همه */}
        {otherDevices.length > 0 && (
          <Button
            title="خروج از همه دستگاه‌ها"
            onPress={handleLogoutAll}
            variant="outline"
            size="lg"
            fullWidth
            icon={<Icon name="logout" size={18} color="#E53935" />}
            iconPosition="right"
            textStyle={{ color: '#E53935' }}
            style={s.logoutAllBtn}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 100 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: { fontSize: 22, fontFamily: 'Vazir-Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Vazir', textAlign: 'center' },
  statDivider: { width: 1, height: 50, alignSelf: 'center' },
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  sectionCount: { fontSize: 12, fontFamily: 'Vazir' },
  devicesList: { gap: 12 },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  deviceIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceTextInfo: { flex: 1, gap: 4 },
  deviceName: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  deviceOs: { fontSize: 12, fontFamily: 'Vazir' },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentDot: { width: 6, height: 6, borderRadius: 3 },
  currentBadgeText: { fontSize: 10, fontFamily: 'Vazir-Bold' },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5393515',
  },
  deviceDetails: { gap: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 12, fontFamily: 'Vazir', minWidth: 65 },
  detailValue: { fontSize: 12, fontFamily: 'Vazir', flex: 1 },
  logoutAllBtn: { borderWidth: 1.5, marginTop: 8 },
});