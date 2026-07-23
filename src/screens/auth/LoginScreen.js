// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const validatePhone = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    const regex = /^09[0-9]{9}$/;
    return regex.test(cleaned);
  };

  const handleChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setPhone(cleaned);
      if (error) setError('');
    }
  };

  const handleSendOtp = async () => {
    if (!termsAccepted) {
      setToast({
        visible: true,
        message: 'لطفاً ابتدا قوانین و مقررات را بپذیرید',
        type: 'warning',
      });
      return;
    }
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);

    setToast({
      visible: true,
      message: 'کد تایید ارسال شد (کد تست: ۱۲۳۴۵)',
      type: 'success',
    });

    setTimeout(() => {
      navigation.navigate('OtpVerify', { phone });
    }, 600);
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://zibano.app/terms').catch(() => {
      setToast({ visible: true, message: 'قوانین به زودی در دسترس قرار می‌گیرد', type: 'info' });
    });
  };

  const handleOpenPrivacy = () => {
    Linking.openURL('https://zibano.app/privacy').catch(() => {
      setToast({ visible: true, message: 'حریم خصوصی به زودی در دسترس قرار می‌گیرد', type: 'info' });
    });
  };

  const canSubmit = phone.length === 11 && validatePhone(phone) && termsAccepted && !loading;

  return (
    <ScreenWrapper scrollable keyboardAware padding={0}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.container}>
          {/* ═══════ المان‌های تزئینی پس‌زمینه ═══════ */}
          <View style={[styles.decorCircle1, { backgroundColor: colors.primary + '18' }]} />
          <View style={[styles.decorCircle2, { backgroundColor: colors.primary + '12' }]} />
          <View style={[styles.decorCircle3, { backgroundColor: colors.secondary + '15' }]} />

          {/* ═══════ محتوای اصلی ═══════ */}
          <View style={styles.content}>
            {/* لوگو و برندینگ */}
            <View style={styles.brandSection}>
              <View style={[styles.logoWrapper, { backgroundColor: colors.cardBackground }]}>
                <View style={[styles.logoInner, { backgroundColor: colors.primary }]}>
                  <Icon name="spa" size={40} color="#fff" />
                </View>
              </View>
              <Text style={[styles.brandName, { color: colors.textMain }]}>زیبانو</Text>
              <Text style={[styles.brandTagline, { color: colors.textSecondary }]}>
                رزرو آنلاین خدمات زیبایی و سلامت
              </Text>
            </View>

            {/* کارت ورود */}
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="login" size={22} color={colors.primary} />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardTitle, { color: colors.textMain }]}>خوش آمدید</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    برای ادامه، شماره موبایل خود را وارد کنید
                  </Text>
                </View>
              </View>

              <Input
                label="شماره موبایل"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChangeText={handleChange}
                keyboardType="phone-pad"
                maxLength={11}
                error={error}
                rightIcon={
                  <View style={[styles.inputIconBox, { backgroundColor: colors.primary + '15' }]}>
                    <Icon name="smartphone" size={18} color={colors.primary} />
                  </View>
                }
              />

              {/* شمارنده ارقام */}
              {phone.length > 0 && phone.length < 11 && (
                <View style={[styles.digitCounter, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
                  <Icon name="edit" size={12} color={colors.primary} />
                  <Text style={[styles.digitCounterText, { color: colors.primary }]}>
                    {phone.length} از ۱۱ رقم وارد شده
                  </Text>
                </View>
              )}

              {/* چک‌باکس قوانین */}
              <TouchableOpacity
                onPress={() => setTermsAccepted(!termsAccepted)}
                activeOpacity={0.7}
                style={styles.termsRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: termsAccepted ? colors.primary : 'transparent',
                      borderColor: termsAccepted ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {termsAccepted && <Icon name="check" size={16} color="#fff" />}
                </View>
                <Text style={[styles.termsText, { color: colors.textMain }]}>
                  با{' '}
                  <Text onPress={handleOpenTerms} style={[styles.termsLink, { color: colors.primary }]}>
                    قوانین و مقررات
                  </Text>{' '}
                  و{' '}
                  <Text onPress={handleOpenPrivacy} style={[styles.termsLink, { color: colors.primary }]}>
                    حریم خصوصی
                  </Text>{' '}
                  موافقم
                </Text>
              </TouchableOpacity>

              {/* هشدار قوانین */}
              {!termsAccepted && phone.length > 0 && (
                <View style={[styles.termsHintBox, { backgroundColor: '#FF980008', borderColor: '#FF980030' }]}>
                  <Icon name="info-outline" size={14} color="#FF9800" />
                  <Text style={[styles.termsHintText, { color: colors.textSecondary }]}>
                    پذیرش قوانین برای ادامه الزامی است
                  </Text>
                </View>
              )}

              <Button
                title="دریافت کد تایید"
                onPress={handleSendOtp}
                loading={loading}
                disabled={!canSubmit}
                variant="primary"
                size="lg"
                fullWidth
                style={[styles.sendBtn, !canSubmit && { opacity: 0.5 }]}
                iconPosition="left"
              />
            </View>

            {/* فوتر */}
            <View style={styles.footer}>
              <View style={[styles.trustBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Icon name="verified-user" size={14} color={colors.primary} />
                <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                  ورود امن و رمزنگاری شده
                </Text>
              </View>
              <Text style={[styles.versionText, { color: colors.textSecondary }]}>
                زیبانو — نسخه ۱.۰.۰
              </Text>
            </View>
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
    position: 'relative',
    overflow: 'hidden',
  },
  // ═══════ المان‌های تزئینی ═══════
  decorCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  decorCircle2: {
    position: 'absolute',
    top: '30%',
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  decorCircle3: {
    position: 'absolute',
    bottom: -60,
    right: '20%',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  // ═══════ محتوا ═══════
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
  },
  // ═══════ برندینگ ═══════
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 34,
    fontFamily: 'Vazir-Bold',
    marginBottom: 6,
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  // ═══════ کارت ═══════
  card: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 22,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  inputIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: -8,
    marginBottom: 8,
  },
  digitCounterText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  // ═══════ چک‌باکس قوانین ═══════
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: 'Vazir-Bold',
    textDecorationLine: 'underline',
  },
  termsHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  termsHintText: {
    fontSize: 11.5,
    fontFamily: 'Vazir',
    flex: 1,
  },
  sendBtn: {
    marginTop: 4,
    height: 54,
    borderRadius: 14,
  },
  // ═══════ فوتر ═══════
  footer: {
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  trustText: {
    fontSize: 11.5,
    fontFamily: 'Vazir-Medium',
  },
  versionText: {
    fontSize: 10.5,
    fontFamily: 'Vazir',
  },
});