// src/screens/profile/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Toast from '../../components/common/Toast';

// ✅ تابع maskPhone با LTR marks (همان راه‌حل OtpVerifyScreen)
const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || '';
  // 🎯 کلید حل مشکل: LTR marks برای جلوگیری از برعکس شدن شماره در RTL
  return '\u202A' + phone.slice(0, 4) + '\u200C***\u200C' + phone.slice(-4) + '\u202C';
};

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [formData, setFormData] = useState({
    name: user?.name || 'مریم حسینی',
    avatarUrl: user?.avatar || 'https://i.pravatar.cc/150?img=5',
  });
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === 'name' && nameError) setNameError('');
  };

  const pickAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!result.didCancel && result.assets?.[0]) {
      updateField('avatarUrl', result.assets[0].uri);
      setToast({
        visible: true,
        message: 'عکس پروفایل با موفقیت تغییر یافت',
        type: 'success',
      });
    }
  };

  const removeAvatar = () => {
    Alert.alert(
      'حذف عکس پروفایل',
      'آیا از حذف عکس پروفایل خود مطمئن هستید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            updateField('avatarUrl', null);
            setToast({
              visible: true,
              message: 'عکس پروفایل حذف شد',
              type: 'info',
            });
          },
        },
      ],
    );
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      setNameError('نام و نام خانوادگی الزامی است');
      return;
    }
    if (formData.name.trim().length < 3) {
      setNameError('نام باید حداقل ۳ کاراکتر باشد');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({
        visible: true,
        message: 'اطلاعات پروفایل با موفقیت ذخیره شد',
        type: 'success',
      });
      setTimeout(() => navigation.goBack(), 1200);
    }, 1000);
  };

  // 🎯 هندلر حذف حساب کاربری - با logout واقعی
  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ حذف حساب کاربری',
      'آیا از حذف دائمی حساب کاربری خود مطمئن هستید؟\n\nاین عمل قابل بازگشت نیست و تمامی اطلاعات شما شامل:\n• نوبت‌های رزرو شده\n• علاقه‌مندی‌ها\n• سوابق پرداخت\n• اطلاعات پروفایل\n\nبرای همیشه حذف خواهد شد.',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف دائمی حساب',
          style: 'destructive',
          onPress: () => {
            // 🎯 شبیه‌سازی حذف از سرور
            setTimeout(() => {
              // 🎯 Toast نمایش بده
              setToast({
                visible: true,
                message: 'حساب کاربری با موفقیت حذف شد',
                type: 'success',
              });
              
              // 🎯 بعد از ۱.۵ ثانیه، logout کن → خودکار به صفحه لاگین می‌ره
              setTimeout(() => {
                logout(); // ✅ این کار isAuthenticated رو false می‌کنه
                          // RootNavigator در App.js تشخیص میده و AuthNavigator رو نشون میده
              }, 1500);
            }, 800);
          },
        },
      ],
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']} keyboardAware>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══════════════ بخش آواتار ═══════════════ */}
        <View style={s.avatarSection}>
          <View style={s.avatarWrapper}>
            <TouchableOpacity onPress={pickAvatar} activeOpacity={0.9}>
              <View
                style={[
                  s.avatarCircle,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
              >
                {formData.avatarUrl ? (
                  <Image
                    source={{ uri: formData.avatarUrl }}
                    style={s.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={s.avatarPlaceholder}>
                    <Icon name="person" size={40} color={colors.textSecondary} />
                  </View>
                )}
              </View>
              <View
                style={[
                  s.cameraBtn,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.background,
                  },
                ]}
              >
                <Icon name="photo-camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            {formData.avatarUrl && (
              <TouchableOpacity
                onPress={removeAvatar}
                style={[
                  s.removeBtn,
                  {
                    backgroundColor: '#E53935',
                    borderColor: colors.background,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Icon name="delete" size={14} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[s.avatarName, { color: colors.textMain }]} numberOfLines={1}>
            {formData.name || 'کاربر زیبانو'}
          </Text>
          <View style={s.avatarHintRow}>
            <Icon name="info-outline" size={12} color={colors.textSecondary} />
            <Text style={[s.avatarHint, { color: colors.textSecondary }]}>
              {formData.avatarUrl
                ? 'برای تغییر عکس، روی آن ضربه بزنید'
                : 'عکس پروفایلی انتخاب نشده'}
            </Text>
          </View>
        </View>

        {/* ═══════════════ کارت اطلاعات شخصی ═══════════════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIcon, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="person" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              اطلاعات شخصی
            </Text>
          </View>
          <Card variant="elevated" padding={16} radius={18}>
            <Input
              label="نام و نام خانوادگی *"
              placeholder="مثال: مریم حسینی"
              value={formData.name}
              onChangeText={(t) => updateField('name', t)}
              error={nameError}
              rightIcon={<Icon name="badge" size={20} color={colors.textSecondary} />}
            />

            <Text style={[s.phoneLabel, { color: colors.textSecondary }]}>
              شماره موبایل
            </Text>
            <View
              style={[
                s.phoneBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={s.phoneInfo}>
                <View style={[s.phoneIconCircle, { backgroundColor: '#2196F320' }]}>
                  <Icon name="smartphone" size={16} color="#2196F3" />
                </View>
                {/* 🎯 شماره با LTR marks - مشکل برعکس شدن حل شد */}
                <Text style={[s.phoneValue, { color: colors.textMain }]}>
                  {toPersianDigit(maskPhone(user?.phone))}
                </Text>
                <View style={[s.verifiedBadge, { backgroundColor: '#43A04720' }]}>
                  <Icon name="verified" size={10} color="#43A047" />
                  <Text style={[s.verifiedText, { color: '#43A047' }]}>تایید شده</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[
                s.changePhoneBtn,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + '10',
                },
              ]}
              onPress={() => navigation.navigate('ChangePhone')}
              activeOpacity={0.85}
            >
              <Icon name="swap-horiz" size={16} color={colors.primary} />
              <Text style={[s.changePhoneText, { color: colors.primary }]}>
                تغییر شماره موبایل
              </Text>
              <Icon name="arrow-back" size={16} color={colors.primary} />
            </TouchableOpacity>
            <View style={s.phoneHintRow}>
              <Icon name="info-outline" size={14} color={colors.textSecondary} />
              <Text style={[s.phoneHintText, { color: colors.textSecondary }]}>
                برای تغییر شماره، کد تایید (OTP) به شماره جدید ارسال خواهد شد
              </Text>
            </View>
          </Card>
        </View>

        {/* ═══════════════ دکمه ذخیره ═══════════════ */}
        <Button
          title="ذخیره تغییرات"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Icon name="check-circle" size={20} color="#fff" />}
          iconPosition="right"
          style={s.saveBtn}
        />

        {/* ═══════════════ 🆕 ناحیه خطرناک (حذف حساب) ═══════════════ */}
        <View style={s.dangerSection}>
          <Card
            variant="default"
            padding={0}
            radius={16}
            style={[
              s.dangerCard,
              { borderColor: '#E5393540', backgroundColor: '#E5393508' },
            ]}
          >
            <View style={s.dangerRow}>
              <View style={s.dangerInfo}>
                <View style={[s.dangerIconBox, { backgroundColor: '#E5393520' }]}>
                  <Icon name="delete-forever" size={22} color="#E53935" />
                </View>
                <View style={s.dangerText}>
                  <Text style={[s.dangerTitle, { color: '#E53935' }]}>
                    حذف حساب کاربری
                  </Text>
                  <Text style={[s.dangerSubtitle, { color: colors.textSecondary }]}>
                    حذف دائمی حساب و تمامی اطلاعات شما
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={[s.dangerBtn, { borderColor: '#E53935' }]}
              activeOpacity={0.75}
            >
              <Icon name="delete-forever" size={18} color="#E53935" />
              <Text style={[s.dangerBtnText, { color: '#E53935' }]}>
                حذف حساب کاربری
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  // ═══════════════ بخش آواتار ═══════════════
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  removeBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarName: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    marginTop: 6,
  },
  avatarHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatarHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  // ═══════════════ سکشن‌ها ═══════════════
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  // ═══════════════ شماره موبایل ═══════════════
  phoneLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    textAlign: 'left',
    marginBottom: 6,
  },
  phoneBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  phoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  changePhoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  changePhoneText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
  phoneHintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 4,
  },
  phoneHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
  // ═══════════════ دکمه ذخیره ═══════════════
  saveBtn: {
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  // ═══════════════ 🆕 ناحیه خطرناک ═══════════════
  dangerSection: {
    marginTop: 24,
  },
  dangerCard: {
    borderWidth: 1.5,
    overflow: 'hidden',
    padding: 14,
    gap: 12,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dangerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  dangerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: {
    flex: 1,
    gap: 3,
  },
  dangerTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  dangerSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 17,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#E5393510',
  },
  dangerBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
});