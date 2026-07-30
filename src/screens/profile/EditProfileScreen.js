// src/screens/profile/EditProfileScreen.js
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
import { useTheme } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Toast from '../../components/common/Toast';
import { toPersianDigit } from '../../utils/numberUtils';
import { maskPhone } from '../../utils/phoneUtils';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);

  // 🎯 جدا کردن نام و نام خانوادگی از user.name
  const parseName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
  };

  const parsedUser = parseName(user?.name || 'مریم حسینی');

  const [formData, setFormData] = useState({
    firstName: parsedUser.firstName,
    lastName: parsedUser.lastName,
  });
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === 'firstName' && firstNameError) setFirstNameError('');
    if (key === 'lastName' && lastNameError) setLastNameError('');
  };

  const handleSave = () => {
    let hasError = false;

    if (!formData.firstName.trim()) {
      setFirstNameError('نام الزامی است');
      hasError = true;
    } else if (formData.firstName.trim().length < 2) {
      setFirstNameError('نام باید حداقل ۲ کاراکتر باشد');
      hasError = true;
    }

    if (!formData.lastName.trim()) {
      setLastNameError('نام خانوادگی الزامی است');
      hasError = true;
    } else if (formData.lastName.trim().length < 2) {
      setLastNameError('نام خانوادگی باید حداقل ۲ کاراکتر باشد');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    setTimeout(() => {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      updateUser({ name: fullName });

      setLoading(false);
      setToast({
        visible: true,
        message: 'اطلاعات پروفایل با موفقیت ذخیره شد',
        type: 'success',
      });
      setTimeout(() => navigation.goBack(), 1200);
    }, 1000);
  };

  // 🎯 هندلر حذف حساب کاربری
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
            setTimeout(() => {
              setToast({
                visible: true,
                message: 'حساب کاربری با موفقیت حذف شد',
                type: 'success',
              });
              setTimeout(() => {
                logout();
              }, 1500);
            }, 800);
          },
        },
      ],
    );
  };

  // 🎯 نام کامل برای نمایش زیر لوگو
  const displayName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'کاربر زیبانو';

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']} keyboardAware>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══════════════ 🌸 لوگوی زیبانو ═══════════════ */}
        <View style={s.logoSection}>
          <View style={[s.logoCircle, { borderColor: colors.primary }]}>
            <View style={[s.logoInner, { backgroundColor: colors.primary + '20' }]}>
              <Icon name="spa" size={44} color={colors.primary} />
            </View>
          </View>
          <Text style={[s.logoName, { color: colors.textMain }]} numberOfLines={1}>
            {displayName}
          </Text>
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
            {/* 🎯 فیلد نام */}
            <Input
              label="نام *"
              placeholder="مثال: مریم"
              value={formData.firstName}
              onChangeText={(t) => updateField('firstName', t)}
              error={firstNameError}
              rightIcon={<Icon name="person" size={20} color={colors.textSecondary} />}
            />

            {/* 🎯 فیلد نام خانوادگی */}
            <Input
              label="نام خانوادگی *"
              placeholder="مثال: حسینی"
              value={formData.lastName}
              onChangeText={(t) => updateField('lastName', t)}
              error={lastNameError}
              rightIcon={<Icon name="badge" size={20} color={colors.textSecondary} />}
            />

            {/* شماره موبایل - فقط نمایشی */}
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
                <Text style={[s.phoneValue, { color: colors.textMain }]}>
                  {toPersianDigit(maskPhone(user?.phone))}
                </Text>
                <View style={[s.verifiedBadge, { backgroundColor: '#43A04720' }]}>
                  <Icon name="verified" size={10} color="#43A047" />
                  <Text style={[s.verifiedText, { color: '#43A047' }]}>تایید شده</Text>
                </View>
              </View>
            </View>

            {/* دکمه تغییر شماره */}
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

        {/* ═══════════════ ناحیه خطرناک (حذف حساب) ═══════════════ */}
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
  // ═══════════════ 🌸 لوگوی زیبانو ═══════════════
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoName: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    marginTop: 6,
  },
  logoHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoHint: {
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
  // ═══════════════ ناحیه خطرناک ═══════════════
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