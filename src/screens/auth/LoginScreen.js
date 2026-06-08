// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // اعتبارسنجی شماره موبایل ایران
  const validatePhone = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    // فرمت: 09xxxxxxxxx (۱۱ رقم)
    const regex = /^09[0-9]{9}$/;
    return regex.test(cleaned);
  };

  // فرمت کردن شماره هنگام تایپ (اختیاری)
  const handleChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setPhone(cleaned);
      if (error) setError('');
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError('لطفاً شماره موبایل خود را وارد کنید');
      return;
    }
    if (!validatePhone(phone)) {
      setError('شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    setLoading(true);
    setError('');

    // شبیه‌سازی ارسال پیامک به بک‌اند
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    setToast({
      visible: true,
      message: 'کد تایید ارسال شد (کد تست: ۱۲۳۴۵)',
      type: 'success',
    });

    // هدایت به صفحه OTP
    setTimeout(() => {
      navigation.navigate('OtpVerify', { phone });
    }, 600);
  };

  return (
    <ScreenWrapper scrollable keyboardAware padding={0}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={[styles.container, { paddingHorizontal: 24 }]}>
          {/* بخش بالایی - لوگو و برندینگ */}
          <View style={styles.topSection}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' },
              ]}
            >
              <Icon name="spa" size={56} color={colors.primary} />
            </View>
            <Text style={[styles.appName, { color: colors.primary }]}>زیبانو</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              همراه شما در مسیر زیبایی و سلامت
            </Text>
          </View>

          {/* بخش ورودی */}
          <View style={styles.formSection}>
            <Text style={[styles.title, { color: colors.textMain }]}>
              ورود / ثبت‌نام
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              برای ادامه، شماره موبایل خود را وارد کنید
            </Text>

            <Input
              label="شماره موبایل"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phone}
              onChangeText={handleChange}
              keyboardType="phone-pad"
              maxLength={11}
              error={error}
              hint="کد تایید به این شماره پیامک می‌شود"
              rightIcon={
                <Icon name="smartphone" size={22} color={colors.textSecondary} />
              }
            />

            <Button
              title="ارسال کد تایید"
              onPress={handleSendOtp}
              loading={loading}
              disabled={!phone || loading}
              variant="primary"
              size="lg"
              fullWidth
              style={styles.sendBtn}
            />
          </View>

          {/* بخش پایین - قوانین */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              ورود شما به معنای پذیرش{' '}
              <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>
                قوانین و مقررات
              </Text>{' '}
              زیبانو است
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Vazir-Bold',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Vazir',
    marginBottom: 28,
    textAlign: 'right',
    lineHeight: 22,
  },
  sendBtn: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 20,
  },
});