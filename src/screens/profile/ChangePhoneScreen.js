// src/screens/profile/ChangePhoneScreen.js
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
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Toast from '../../components/common/Toast';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;
const MOCK_OTP = '12345';

const toEnglishDigits = str =>
  String(str)
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const toPersianDigit = str =>
  String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

const validatePhone = v => /^09[0-9]{9}$/.test(v.replace(/[^0-9]/g, ''));

export default function ChangePhoneScreen({ navigation }) {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(p => p - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async () => {
    const cleaned = toEnglishDigits(newPhone).replace(/[^0-9]/g, '');
    if (!validatePhone(cleaned)) {
      setPhoneError('شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }
    setLoading(true);
    setPhoneError('');
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep(2);
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setToast({
      visible: true,
      message: `کد تایید به شماره ${toPersianDigit(cleaned)} ارسال شد`,
      type: 'success',
    });
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  };

  const handleChangeOtp = (text, index) => {
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
    if (otpError) setOtpError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setCurrentBox(index + 1);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setOtpError(`کد ${OTP_LENGTH} رقمی را کامل وارد کنید`);
      return;
    }
    setLoading(true);
    setOtpError('');
    Keyboard.dismiss();
    await new Promise(r => setTimeout(r, 1000));
    if (code === MOCK_OTP) {
      setLoading(false);
      setToast({
        visible: true,
        message: 'شماره موبایل با موفقیت تغییر یافت',
        type: 'success',
      });
      setTimeout(() => navigation.goBack(), 1200);
    } else {
      setOtpError('کد وارد شده صحیح نیست');
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp(['', '', '', '', '']);
    setCurrentBox(0);
    inputRefs.current[0]?.focus();
    setToast({ visible: true, message: 'کد جدید ارسال شد', type: 'info' });
  };

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const maskedPhone = newPhone
    ? newPhone.slice(0, 4) + '***' + newPhone.slice(-4)
    : '';

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <View style={[s.content, { paddingHorizontal: 20 }]}>
        {step === 1 ? (
          <>
            <View
              style={[s.iconBox, { backgroundColor: colors.primary + '15' }]}
            >
              <Icon name="smartphone" size={44} color={colors.primary} />
            </View>
            <Text style={[s.title, { color: colors.textMain }]}>
              تغییر شماره موبایل
            </Text>
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>
              برای امنیت بیشتر، شماره جدید شما باید با کد تایید (OTP) احراز هویت
              شود
            </Text>

            <Card
              variant="default"
              padding={14}
              radius={14}
              style={s.warningCard}
            >
              <View style={s.warningRow}>
                <Icon name="info" size={20} color="#FFA000" />
                <Text style={[s.warningText, { color: colors.textMain }]}>
                  پس از تغییر شماره، برای ورود به حساب از شماره جدید استفاده
                  خواهید کرد
                </Text>
              </View>
            </Card>

            <Input
              label="شماره موبایل جدید"
              placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
              value={newPhone}
              onChangeText={t => {
                const cleaned = toEnglishDigits(t)
                  .replace(/[^0-9]/g, '')
                  .slice(0, 11);
                setNewPhone(cleaned);
                if (phoneError) setPhoneError('');
              }}
              keyboardType="phone-pad"
              maxLength={11}
              error={phoneError}
              rightIcon={
                <Icon
                  name="smartphone"
                  size={22}
                  color={colors.textSecondary}
                />
              }
            />

            <Button
              title="ارسال کد تایید"
              onPress={handleSendOtp}
              loading={loading}
              disabled={!newPhone || loading}
              variant="primary"
              size="lg"
              fullWidth
              style={s.mainBtn}
              icon={<Icon name="send" size={18} color="#fff" />}
              iconPosition="right"
            />
          </>
        ) : (
          <>
            <View
              style={[s.iconBox, { backgroundColor: colors.primary + '15' }]}
            >
              <Icon name="sms" size={44} color={colors.primary} />
            </View>
            <Text style={[s.title, { color: colors.textMain }]}>
              کد تایید را وارد کنید
            </Text>
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>
              کد {OTP_LENGTH} رقمی پیامک‌شده به{' '}
              <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>
                {toPersianDigit(maskedPhone)}
              </Text>{' '}
              را وارد کنید
            </Text>

            <View style={s.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[
                    s.otpBox,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor:
                        otpError && digit === ''
                          ? '#E53935'
                          : currentBox === index
                          ? colors.primary
                          : colors.border,
                      color: colors.textMain,
                      borderWidth: currentBox === index ? 2 : 1.5,
                    },
                  ]}
                  value={digit}
                  onChangeText={text => handleChangeOtp(text, index)}
                  onFocus={() => setCurrentBox(index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {otpError ? <Text style={s.error}>{otpError}</Text> : null}

            <View style={s.resendSection}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={[s.resendActive, { color: colors.primary }]}>
                    ارسال مجدد کد
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[s.resendTimer, { color: colors.textSecondary }]}>
                  ارسال مجدد تا {toPersianDigit(formatTime(timer))}
                </Text>
              )}
              <TouchableOpacity onPress={() => setStep(1)} style={s.editPhone}>
                <Icon name="edit" size={14} color={colors.primary} />
                <Text style={[s.editPhoneText, { color: colors.primary }]}>
                  ویرایش شماره
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="تایید و تغییر شماره"
              onPress={handleVerifyOtp}
              loading={loading}
              disabled={otp.join('').length < OTP_LENGTH || loading}
              variant="primary"
              size="lg"
              fullWidth
              style={s.mainBtn}
              icon={<Icon name="check" size={18} color="#fff" />}
              iconPosition="right"
            />

            <View
              style={[
                s.hintBox,
                {
                  backgroundColor: colors.primary + '10',
                  borderColor: colors.primary + '30',
                },
              ]}
            >
              <Icon name="info-outline" size={16} color={colors.primary} />
              <Text style={[s.hintText, { color: colors.primary }]}>
                حالت آزمایشی: کد تایید{' '}
                <Text style={{ fontFamily: 'Vazir-Bold' }}>۱۲۳۴۵</Text> است
              </Text>
            </View>
          </>
        )}
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

const s = StyleSheet.create({
  content: { flex: 1, paddingTop: 24 },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  warningCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFA00050',
    backgroundColor: '#FFA00015',
  },
  warningRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  warningText: { flex: 1, fontSize: 12, fontFamily: 'Vazir', lineHeight: 20 },
  mainBtn: { marginTop: 8 },
  otpContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  otpBox: {
    width: 52,
    height: 58,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
  },
  error: {
    color: '#E53935',
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    marginBottom: 12,
  },
  resendSection: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 4,
  },
  resendActive: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  resendTimer: { fontSize: 13, fontFamily: 'Vazir' },
  editPhone: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  editPhoneText: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  hintBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  hintText: { fontSize: 12, fontFamily: 'Vazir' },
});
