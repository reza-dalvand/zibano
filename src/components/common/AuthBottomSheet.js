// src/components/common/AuthBottomSheet.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Linking,
  Modal, // 🎯 اضافه شد
  TouchableWithoutFeedback, // 🎯 اضافه شد
  Animated, // 🎯 اضافه شد
  useWindowDimensions, // 🎯 اضافه شد
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import Input from './Input';
import Button from './Button';
import Toast from './Toast';
import { validatePhone } from '../../utils/phoneUtils';
import { toPersianDigit } from '../../utils/numberUtils';
import { useModalBackHandler } from '../../hooks/useModalBackHandler';

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;
const MOCK_OTP = '12345';

export default function AuthBottomSheet({ visible, onClose }) {
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const login = useAuthStore((s) => s.login);

  // 🎯 انیمیشن‌های BottomSheet
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // 🎯 مراحل مدال
  const [stage, setStage] = useState('info');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [currentBox, setCurrentBox] = useState(0);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const { onRequestClose } = useModalBackHandler(visible, onClose);

  const inputRefs = useRef([]);

  // 🎯 انیمیشن باز/بسته شدن
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
          speed: 16,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: windowHeight,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, windowHeight, translateY, backdropOpacity]);

  // 🎯 تایمر ارسال مجدد
  useEffect(() => {
    let interval = null;
    if (stage === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [stage, timer]);

  // 🎯 ریست کردن وقتی مدال باز می‌شود
  useEffect(() => {
    if (visible) {
      setStage('info');
      setFirstName('');
      setLastName('');
      setPhone('');
      setTermsAccepted(false);
      setOtp(['', '', '', '', '']);
      setCurrentBox(0);
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setError('');
      setLoading(false);
    }
  }, [visible]);

  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setPhone(cleaned);
      if (error) setError('');
    }
  };

  const handleSendOtp = async () => {
    if (!termsAccepted) {
      setToast({ visible: true, message: 'لطفاً ابتدا قوانین و مقررات را بپذیرید', type: 'warning' });
      return;
    }
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (fullName.length < 3) {
      setError('لطفاً نام و نام خانوادگی را کامل وارد کنید');
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setStage('otp');
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setToast({ visible: true, message: 'کد تایید ارسال شد (کد تست: ۱۲۳۴۵)', type: 'success' });
    setTimeout(() => inputRefs.current[0]?.focus(), 400);
  };

  const handleChangeOtp = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, '');
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

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError(`لطفاً کد ${OTP_LENGTH} رقمی را کامل وارد کنید`);
      return;
    }
    setLoading(true);
    setError('');
    Keyboard.dismiss();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (code === MOCK_OTP) {
      setLoading(false);
      setStage('success');
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      login(phone, fullName);
      setTimeout(() => {
        onClose?.();
      }, 2000);
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
    setToast({ visible: true, message: 'کد جدید ارسال شد (کد تست: ۱۲۳۴۵)', type: 'info' });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://zibano.app/terms').catch(() => {
      setToast({ visible: true, message: 'قوانین به زودی در دسترس قرار می‌گیرد', type: 'info' });
    });
  };

  const canSubmitInfo =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    phone.length === 11 &&
    validatePhone(phone) &&
    termsAccepted &&
    !loading;

  const renderInfoStage = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.stageIconContainer}>
        <View style={[s.stageIconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="person-add" size={32} color={colors.primary} />
        </View>
        <Text style={[s.stageTitle, { color: colors.textMain }]}>ثبت‌نام / ورود به زیبانو</Text>
        <Text style={[s.stageSubtitle, { color: colors.textSecondary }]}>
          برای ادامه، لطفاً اطلاعات خود را وارد کنید
        </Text>
      </View>
      <Input
        label="نام"
        placeholder="مثال: مریم"
        value={firstName}
        onChangeText={(t) => { setFirstName(t); if (error) setError(''); }}
        rightIcon={<Icon name="person" size={20} color={colors.textSecondary} />}
      />
      <Input
        label="نام خانوادگی"
        placeholder="مثال: حسینی"
        value={lastName}
        onChangeText={(t) => { setLastName(t); if (error) setError(''); }}
        rightIcon={<Icon name="badge" size={20} color={colors.textSecondary} />}
      />
      <Input
        label="شماره موبایل"
        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        maxLength={11}
        error={error}
        rightIcon={<Icon name="smartphone" size={20} color={colors.textSecondary} />}
      />
      {phone.length > 0 && phone.length < 11 && (
        <View style={[s.digitCounter, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
          <Icon name="edit" size={12} color={colors.primary} />
          <Text style={[s.digitCounterText, { color: colors.primary }]}>
            {toPersianDigit(phone.length)} از ۱۱ رقم وارد شده
          </Text>
        </View>
      )}
      <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} activeOpacity={0.7} style={s.termsRow}>
        <View style={[s.checkbox, { backgroundColor: termsAccepted ? colors.primary : 'transparent', borderColor: termsAccepted ? colors.primary : colors.border }]}>
          {termsAccepted && <Icon name="check" size={16} color="#fff" />}
        </View>
        <Text style={[s.termsText, { color: colors.textMain }]}>
          با{' '}
          <Text onPress={handleOpenTerms} style={[s.termsLink, { color: colors.primary }]}>قوانین و مقررات</Text>
          {' '}و{' '}
          <Text onPress={handleOpenTerms} style={[s.termsLink, { color: colors.primary }]}>حریم خصوصی</Text>
          {' '}موافقم
        </Text>
      </TouchableOpacity>
      <Button
        title="دریافت کد تایید"
        onPress={handleSendOtp}
        loading={loading}
        disabled={!canSubmitInfo}
        variant="primary"
        size="lg"
        fullWidth
        style={[s.mainBtn, !canSubmitInfo && { opacity: 0.5 }]}
        icon={<Icon name="send" size={18} color="#fff" />}
        iconPosition="left"
      />
      <View style={s.trustBox}>
        <Icon name="verified-user" size={14} color={colors.primary} />
        <Text style={[s.trustText, { color: colors.textSecondary }]}>ورود امن و رمزنگاری شده</Text>
      </View>
    </ScrollView>
  );

  const renderOtpStage = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.stageIconContainer}>
        <View style={[s.stageIconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="sms" size={32} color={colors.primary} />
        </View>
        <Text style={[s.stageTitle, { color: colors.textMain }]}>کد تایید را وارد کنید</Text>
        <Text style={[s.stageSubtitle, { color: colors.textSecondary }]}>
          کد {OTP_LENGTH} رقمی پیامک‌شده به{' '}
          <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>
            {toPersianDigit(phone.slice(-4) + '***' + phone.slice(0, 4))}</Text>
          {' '}را وارد کنید
        </Text>
      </View>
      <View style={s.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[s.otpBox, {
              backgroundColor: colors.cardBackground,
              borderColor: error && digit === '' ? '#E57373' : currentBox === index ? colors.primary : colors.border,
              color: colors.textMain,
              borderWidth: currentBox === index ? 2 : 1.5,
            }]}
            value={toPersianDigit(digit)}
            onChangeText={(text) => handleChangeOtp(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setCurrentBox(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}
      <View style={s.resendSection}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={[s.resendActive, { color: colors.primary }]}>ارسال مجدد کد</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[s.resendTimer, { color: colors.textSecondary }]}>ارسال مجدد تا {formatTime(timer)}</Text>
        )}
        <TouchableOpacity onPress={() => setStage('info')} style={s.editPhone}>
          <Icon name="edit" size={14} color={colors.primary} />
          <Text style={[s.editPhoneText, { color: colors.primary }]}>ویرایش اطلاعات</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="تایید و ورود"
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
      <View style={[s.hintBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
        <Icon name="info-outline" size={16} color={colors.primary} />
        <Text style={[s.hintText, { color: colors.primary }]}>
          حالت آزمایشی: کد تایید{' '}
          <Text style={{ fontFamily: 'Vazir-Bold' }}>۱۲۳۴۵</Text> است
        </Text>
      </View>
    </ScrollView>
  );

  const renderSuccessStage = () => (
    <View style={s.successContainer}>
      <View style={s.successIconWrapper}>
        <View style={s.successCircle}>
          <Icon name="check" size={56} color="#fff" />
        </View>
      </View>
      <Text style={[s.successTitle, { color: colors.textMain }]}>خوش آمدید! 🎉</Text>
      <Text style={[s.successSubtitle, { color: colors.textSecondary }]}>
        {firstName} {lastName} عزیز، ورود شما با موفقیت انجام شد
      </Text>
      <View style={[s.successSummary, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
        <Icon name="verified-user" size={18} color={colors.primary} />
        <Text style={[s.successSummaryText, { color: colors.textMain }]}>در حال ادامه فرآیند قبلی شما...</Text>
      </View>
    </View>
  );

  const getTitle = () => {
    if (stage === 'info') return 'ورود به زیبانو';
    if (stage === 'otp') return 'کد تایید';
    return 'ورود موفق';
  };

  return (
    <>
      {/* 🎯 استفاده از Modal React Native برای قرار گرفتن روی همه چیز */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onRequestClose}
        statusBarTranslucent
      >
        <View style={StyleSheet.absoluteFillObject}>
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View style={[s.backdrop, { opacity: backdropOpacity }]} />
          </TouchableWithoutFeedback>

          {/* BottomSheet */}
          <Animated.View
            style={[s.sheet, {
              top: windowHeight * 0.15,
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              transform: [{ translateY }],
            }]}
          >
            {/* Handle Bar */}
            <View style={s.handleArea}>
              <View style={[s.handle, { backgroundColor: colors.border }]} />
            </View>

            {/* Title */}
            <Text style={[s.title, { color: colors.textMain, borderBottomColor: colors.border }]}>
              {getTitle()}
            </Text>

            {/* Content */}
            <View style={s.content}>
              {stage === 'info' && renderInfoStage()}
              {stage === 'otp' && renderOtpStage()}
              {stage === 'success' && renderSuccessStage()}
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Vazir-Bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 20,
  },
  stageIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  stageIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stageTitle: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  stageSubtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
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
  mainBtn: {
    marginTop: 4,
    height: 54,
    borderRadius: 14,
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  trustText: {
    fontSize: 11.5,
    fontFamily: 'Vazir-Medium',
  },
  otpContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  otpBox: {
    width: 52,
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
  successContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    gap: 12,
  },
  successIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#43A047',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
  },
  successSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  successSummaryText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },
});