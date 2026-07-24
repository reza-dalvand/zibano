// src/screens/auth/OtpVerifyScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;
const MOCK_OTP = '12345';

export default function OtpVerifyScreen({ navigation, route }) {
  const { colors } = useTheme();
  const login = useAuthStore((s) => s.login);
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
  });

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(p => p - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const toEnglishDigits = str =>
    str
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  const handleChange = (text, index) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      setCurrentBox(nextIndex);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    const digit = cleaned[0] || '';
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (error) setError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setCurrentBox(index + 1);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setCurrentBox(index - 1);
    }
  };

  // ✅ اصلاح شده با LTR marks
  const maskedPhone = phone 
    ? '\u202A' + phone.slice(0, 4) + '\u200C***\u200C' + phone.slice(-4) + '\u202C' 
    : '';

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError(`لطفاً کد ${OTP_LENGTH} رقمی را کامل وارد کنید`);
      return;
    }
    setLoading(true);
    setError('');
    Keyboard.dismiss();
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (code === MOCK_OTP) {
      setLoading(false);
      login(phone);
    } else {
      setError('کد وارد شده صحیح نیست');
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp(['', '', '', '', '']);
    setCurrentBox(0);
    inputRefs.current[0]?.focus();
    setToast({
      visible: true,
      message: 'کد جدید ارسال شد (کد تست: ۱۲۳۴۵)',
      type: 'info',
    });
  };

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header title="کد تایید" onBackPress={() => navigation.goBack()} />
      <View style={[styles.content, { paddingHorizontal: 24 }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + '15' },
          ]}
        >
          <Icon name="sms" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textMain }]}>
          کد تایید را وارد کنید
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          کد {OTP_LENGTH} رقمی پیامک‌شده به{' '}
          <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>
            {maskedPhone}
          </Text>{' '}
          را وارد کنید
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor:
                    error && digit === ''
                      ? '#E57373'
                      : currentBox === index
                      ? colors.primary
                      : colors.border,
                  color: colors.textMain,
                  borderWidth: currentBox === index ? 2 : 1.5,
                },
              ]}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              onFocus={() => setCurrentBox(index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              textContentType="oneTimeCode"
            />
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.resendSection}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendActive, { color: colors.primary }]}>
                ارسال مجدد کد
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.resendTimer, { color: colors.textSecondary }]}>
              ارسال مجدد تا {formatTime(timer)}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.editPhone}
          >
            <Icon name="edit" size={14} color={colors.primary} />
            <Text style={[styles.editPhoneText, { color: colors.primary }]}>
              ویرایش شماره
            </Text>
          </TouchableOpacity>
        </View>
        <Button
          title="تایید و ورود"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.join('').length < OTP_LENGTH || loading}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.verifyBtn}
        />
        <View
          style={[
            styles.hintBox,
            {
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '30',
            },
          ]}
        >
          <Icon name="info-outline" size={16} color={colors.primary} />
          <Text style={[styles.hintText, { color: colors.primary }]}>
            حالت آزمایشی: کد تایید{' '}
            <Text style={{ fontFamily: 'Vazir-Bold' }}>۱۲۳۴۵</Text> است
          </Text>
        </View>
      </View>
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
  content: { flex: 1, paddingTop: 20 },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  otpBox: {
    width: 54,
    height: 60,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Vazir-Bold',
  },
  error: {
    color: '#E57373',
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    marginBottom: 12,
  },
  resendSection: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 4,
  },
  resendActive: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  resendTimer: { fontSize: 13, fontFamily: 'Vazir' },
  editPhone: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  editPhoneText: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  verifyBtn: { marginTop: 'auto', marginBottom: 20 },
  hintBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  hintText: { fontSize: 12, fontFamily: 'Vazir' },
});