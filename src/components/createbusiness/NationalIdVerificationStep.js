// src/components/createbusiness/NationalIdVerificationStep.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import Divider from '../common/Divider';

const toEnglishDigits = (str) =>
  String(str)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const validateNationalId = (code) => {
  const cleaned = toEnglishDigits(code).replace(/[^0-9]/g, '');
  if (cleaned.length !== 10) return false;
  if (/^(\d)\1{9}$/.test(cleaned)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  const checkDigit = parseInt(cleaned[9], 10);
  
  return remainder < 2 ? checkDigit === remainder : checkDigit === 11 - remainder;
};

// 🆕 تابع استعلام از بک‌اند Django
const verifyNationalIdWithPhone = async (nationalId, phone) => {
  try {
    // 🎯 در فاز واقعی این قسمت را با fetch به API بک‌اند جایگزین کنید:
    // const response = await fetch('https://api.zibano.com/v1/verify/national-id/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authToken}`,
    //   },
    //   body: JSON.stringify({ national_id: nationalId, phone }),
    // });
    // return await response.json();

    // 🔧 شبیه‌سازی برای تست (حالت Development)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const cleanedId = toEnglishDigits(nationalId).replace(/[^0-9]/g, '');
    const cleanedPhone = toEnglishDigits(phone).replace(/[^0-9]/g, '');
    
    // برای تست: کد ۰۰۱۲۳۴۵۶۷۸ همیشه تایید می‌شود
    if (cleanedId === '0012345678') {
      return { 
        success: true, 
        name: 'کاربر آزمایشی زیبانو',
        message: 'کد ملی با شماره ثبت‌نام شده تطابق دارد'
      };
    }
    
    // شبیه‌سازی: ۷۰٪ مواقع موفقیت
    if (Math.random() > 0.3 && cleanedPhone.startsWith('09')) {
      return { 
        success: true, 
        name: 'نام و نام خانوادگی تایید شده',
        message: 'کد ملی با شماره ثبت‌نام شده تطابق دارد'
      };
    }
    
    return { 
      success: false, 
      message: 'کد ملی وارد شده با شماره موبایل ثبت‌نام شده شما تطابق ندارد' 
    };
  } catch (error) {
    return { success: false, message: 'خطا در برقراری ارتباط با سامانه استعلام' };
  }
};

// 🆕 تابع ماسک کردن شماره برای نمایش (مثلاً ۰۹۱۲***۶۷۸۹)
const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone;
  return phone.slice(0, 4) + '***' + phone.slice(-4);
};

export default function NationalIdVerificationStep({ 
  formData, 
  onUpdate, 
  registeredPhone // 🆕 شماره ثبت‌نام شده از AuthContext
}) {
  const { colors } = useTheme();
  
  const [nationalId, setNationalId] = useState(formData.nationalId || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(
    formData.isNationalIdVerified ? 'success' : null
  );
  const [verifiedName, setVerifiedName] = useState(formData.verifiedName || '');

  const handleNationalIdChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setNationalId(cleaned);
      setError('');
      if (verificationResult === 'success') {
        setVerificationResult(null);
        onUpdate('isNationalIdVerified', false);
        onUpdate('verifiedName', '');
      }
    }
  };

  const handleVerify = async () => {
    // 🆕 بررسی وجود شماره ثبت‌نام شده
    if (!registeredPhone) {
      setError('خطا: شماره ثبت‌نام شما یافت نشد. لطفاً یکبار از حساب خارج شده و مجدداً وارد شوید');
      return;
    }
    
    if (!nationalId) {
      setError('لطفاً کد ملی خود را وارد کنید');
      return;
    }
    if (!validateNationalId(nationalId)) {
      setError('فرمت کد ملی صحیح نیست (باید ۱۰ رقمی و معتبر باشد)');
      return;
    }

    setLoading(true);
    setError('');
    setVerificationResult(null);

    // 🎯 استعلام کد ملی با شماره ثبت‌نام شده کاربر
    const result = await verifyNationalIdWithPhone(nationalId, registeredPhone);
    
    if (result.success) {
      setVerificationResult('success');
      setVerifiedName(result.name);
      onUpdate('nationalId', nationalId);
      onUpdate('isNationalIdVerified', true);
      onUpdate('verifiedName', result.name);
    } else {
      setVerificationResult('failed');
      onUpdate('isNationalIdVerified', false);
    }
    
    setLoading(false);
  };

  return (
    <View style={s.container}>
      <Text style={[s.stepTitle, { color: colors.textMain }]}>
        احراز هویت مدیر کسب‌وکار
      </Text>
      <Text style={[s.stepHint, { color: colors.textSecondary }]}>
        کد ملی شما با شماره موبایل ثبت‌نام شده‌تان تطبیق داده می‌شود تا از هویت مالک کسب‌وکار اطمینان حاصل شود
      </Text>

      {/* 🆕 کارت نمایش شماره ثبت‌نام شده */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[s.phoneCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}
      >
        <View style={s.phoneRow}>
          <View style={[s.phoneIconWrapper, { backgroundColor: colors.primary + '20' }]}>
            <Icon name="smartphone" size={22} color={colors.primary} />
          </View>
          <View style={s.phoneInfo}>
            <Text style={[s.phoneLabel, { color: colors.textSecondary }]}>
              شماره ثبت‌نام شده شما
            </Text>
            <Text style={[s.phoneValue, { color: colors.primary }]}>
              {maskPhone(registeredPhone) || 'شماره‌ای یافت نشد'}
            </Text>
          </View>
          <Icon name="verified-user" size={20} color={colors.primary} />
        </View>
      </Card>

      {/* کارت توضیحات امنیتی */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[s.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      >
        <View style={s.infoRow}>
          <Icon name="shield" size={20} color={colors.textSecondary} />
          <Text style={[s.infoText, { color: colors.textMain }]}>
            اطلاعات شما محرمانه است و فقط برای احراز هویت و جلوگیری از سوءاستفاده استفاده می‌شود
          </Text>
        </View>
      </Card>

      {/* فیلد ورود کد ملی */}
      <Input
        label="کد ملی مدیر کسب‌وکار"
        placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸۹"
        value={nationalId}
        onChangeText={handleNationalIdChange}
        keyboardType="numeric"
        maxLength={10}
        error={error}
        rightIcon={<Icon name="badge" size={22} color={colors.textSecondary} />}
        hint="کد ملی ۱۰ رقمی باید متعلق به شماره ثبت‌نام شده بالا باشد"
      />

      {/* دکمه استعلام */}
      <Button
        title={loading ? 'در حال استعلام از سامانه ثبت احوال...' : 'استعلام کد ملی از سامانه ثبت احوال'}
        onPress={handleVerify}
        loading={loading}
        disabled={!nationalId || loading || !registeredPhone}
        variant="outline"
        size="lg"
        fullWidth
        icon={<Icon name="search" size={20} color={colors.primary} />}
        iconPosition="right"
        style={s.verifyBtn}
      />

      {/* نمایش نتیجه استعلام */}
      {verificationResult === 'success' && (
        <Card
          variant="default"
          padding={16}
          radius={14}
          style={[s.resultCard, { backgroundColor: '#4CAF5015', borderColor: '#4CAF50' }]}
        >
          <View style={s.resultRow}>
            <View style={[s.resultIcon, { backgroundColor: '#4CAF5022' }]}>
              <Icon name="check-circle" size={28} color="#4CAF50" />
            </View>
            <View style={s.resultInfo}>
              <Text style={[s.resultTitle, { color: '#4CAF50' }]}>
                هویت شما تایید شد ✓
              </Text>
              <Text style={[s.resultName, { color: colors.textMain }]}>
                {verifiedName}
              </Text>
              <Text style={[s.resultHint, { color: colors.textSecondary }]}>
                کد ملی با شماره ثبت‌نام شده شما مطابقت دارد و می‌توانید کسب‌وکار خود را ثبت کنید
              </Text>
            </View>
          </View>
        </Card>
      )}

      {verificationResult === 'failed' && (
        <Card
          variant="default"
          padding={16}
          radius={14}
          style={[s.resultCard, { backgroundColor: '#E5737315', borderColor: '#E57373' }]}
        >
          <View style={s.resultRow}>
            <View style={[s.resultIcon, { backgroundColor: '#E5737322' }]}>
              <Icon name="error-outline" size={28} color="#E57373" />
            </View>
            <View style={s.resultInfo}>
              <Text style={[s.resultTitle, { color: '#E57373' }]}>
                عدم تطابق اطلاعات
              </Text>
              <Text style={[s.resultHint, { color: colors.textSecondary }]}>
                کد ملی وارد شده با شماره ثبت‌نام شده شما ({maskPhone(registeredPhone)}) تطابق ندارد. 
                {'\n\n'}
                اگر کد ملی را اشتباه وارد کرده‌اید، آن را اصلاح کنید. در غیر این صورت ممکن است این سیم‌کارت به نام شما نباشد و باید با پشتیبانی تماس بگیرید.
              </Text>
            </View>
          </View>
          <Button
            title="تلاش مجدد"
            onPress={handleVerify}
            variant="outline"
            size="md"
            style={s.retryBtn}
          />
        </Card>
      )}

      <Divider spacing={20} />

      {/* راهنما برای تست */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[s.hintCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      >
        <View style={s.hintHeader}>
          <Icon name="info-outline" size={18} color={colors.primary} />
          <Text style={[s.hintTitle, { color: colors.textMain }]}>راهنمای حالت آزمایشی</Text>
        </View>
        <Text style={[s.hintText, { color: colors.textSecondary }]}>
          برای تست سریع، از کد ملی{' '}
          <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>۰۰۱۲۳۴۵۶۷۸۹</Text>{' '}
          استفاده کنید. این کد همیشه با هر شماره ثبت‌نام شده‌ای تطابق پیدا می‌کند.
        </Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  stepHint: {
    fontSize: 13,
    fontFamily: 'Vazir',
    marginBottom: 20,
    textAlign: 'right',
    lineHeight: 20,
  },
  phoneCard: { marginBottom: 16, borderWidth: 1 },
  phoneRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  phoneIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInfo: { flex: 1, alignItems: 'flex-end', gap: 2 },
  phoneLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  phoneValue: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  infoCard: { marginBottom: 20, borderWidth: 1 },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'right',
    lineHeight: 20,
  },
  verifyBtn: { marginTop: 4, marginBottom: 20 },
  resultCard: { borderWidth: 1.5, marginBottom: 16 },
  resultRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: { flex: 1, alignItems: 'flex-end', gap: 4 },
  resultTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  resultName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  resultHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 18,
    textAlign: 'right',
    marginTop: 2,
  },
  retryBtn: { marginTop: 12 },
  hintCard: { borderWidth: 1 },
  hintHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  hintTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 19,
    textAlign: 'right',
  },
});