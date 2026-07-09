// src/components/createbusiness/NationalIdVerificationStep.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const toEnglishDigits = (str) =>
  String(str)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const toPersianDigits = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// 🎯 کد ملی ۱۰ رقمی برای تست
const TEST_NATIONAL_ID = '0012345679';

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

const verifyNationalIdWithPhone = async (nationalId, phone) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const cleanedId = toEnglishDigits(nationalId).replace(/[^0-9]/g, '');
    const cleanedPhone = toEnglishDigits(phone || '').replace(/[^0-9]/g, '');
    
    // 🎯 اولویت ۱: کد تست - همیشه موفق است
    if (cleanedId === TEST_NATIONAL_ID) {
      return {
        success: true,
        name: 'کاربر آزمایشی زیبانو',
        message: 'کد ملی با شماره ثبت‌نام شده تطابق دارد',
      };
    }
    
    // 🎯 اولویت ۲: اعتبارسنجی الگوریتم
    if (!validateNationalId(cleanedId)) {
      return {
        success: false,
        message: 'فرمت کد ملی صحیح نیست',
      };
    }
    
    // 🎯 اولویت ۳: شبیه‌سازی استعلام
    if (Math.random() > 0.3 && cleanedPhone.startsWith('09')) {
      return {
        success: true,
        name: 'نام و نام خانوادگی تایید شده',
        message: 'کد ملی با شماره ثبت‌نام شده تطابق دارد',
      };
    }
    
    return {
      success: false,
      message: 'کد ملی وارد شده با شماره موبایل ثبت‌نام شده شما تطابق ندارد',
    };
  } catch (error) {
    return { success: false, message: 'خطا در برقراری ارتباط با سامانه استعلام' };
  }
};

const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || '';
  return phone.slice(0, 4) + '***' + phone.slice(-4);
};

export default function NationalIdVerificationStep({
  formData,
  onUpdate,
  registeredPhone,
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
    if (!nationalId) {
      setError('لطفاً کد ملی خود را وارد کنید');
      return;
    }
    if (nationalId.length !== 10) {
      setError('کد ملی باید دقیقاً ۱۰ رقم باشد');
      return;
    }
    setLoading(true);
    setError('');
    setVerificationResult(null);
    
    const phoneToVerify = registeredPhone || '09123456789';
    const result = await verifyNationalIdWithPhone(nationalId, phoneToVerify);
    
    if (result.success) {
      setVerificationResult('success');
      setVerifiedName(result.name);
      onUpdate('nationalId', nationalId);
      onUpdate('isNationalIdVerified', true);
      onUpdate('verifiedName', result.name);
    } else {
      setVerificationResult('failed');
      setError(result.message);
      onUpdate('isNationalIdVerified', false);
    }
    setLoading(false);
  };

  const canVerify = nationalId.length === 10 && !loading;
  const isTestMode = nationalId === TEST_NATIONAL_ID;

  // 🎯 تغییر اصلی: ScrollView به View تبدیل شد
  return (
    <View style={s.scrollContent}>
      {/* هدر بخش */}
      <View style={s.sectionHeader}>
        <View style={[s.headerIconBox, { backgroundColor: '#4CAF5015' }]}>
          <Icon name="verified-user" size={24} color="#4CAF50" />
        </View>
        <View style={s.headerTextCol}>
          <Text style={[s.stepTitle, { color: colors.textMain }]}>احراز هویت مدیر</Text>
          <Text style={[s.stepHint, { color: colors.textSecondary }]}>
            کد ملی شما با شماره ثبت‌نام شده تطبیق داده می‌شود
          </Text>
        </View>
      </View>

      {/* کارت شماره ثبت‌نام */}
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
            <Text style={[s.phoneLabel, { color: colors.textSecondary }]}>شماره ثبت‌نام شده شما</Text>
            <Text style={[s.phoneValue, { color: colors.primary }]}>
              {maskPhone(registeredPhone) || '۰۹۱۲***۶۷۸۹'}
            </Text>
          </View>
          <Icon name="verified-user" size={20} color={colors.primary} />
        </View>
      </Card>

      {/* کارت امنیت */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[s.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      >
        <View style={s.infoRow}>
          <Icon name="shield" size={20} color="#2196F3" />
          <Text style={[s.infoText, { color: colors.textMain }]}>
            اطلاعات شما محرمانه است و فقط برای احراز هویت استفاده می‌شود
          </Text>
        </View>
      </Card>

      {/* فیلد کد ملی */}
      <View style={s.inputSection}>
        <Text style={[s.inputLabel, { color: colors.textMain }]}>کد ملی مدیر کسب‌وکار</Text>
        <Input
          placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸۹"
          value={toPersianDigits(nationalId)}
          onChangeText={handleNationalIdChange}
          keyboardType="numeric"
          maxLength={10}
          error={error}
          rightIcon={
            <View style={[s.inputIconBox, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="badge" size={20} color={colors.primary} />
            </View>
          }
          hint={
            <View style={s.hintColumn}>
              <Text style={[s.hintBaseText, { color: colors.textSecondary }]}>
                کد ملی ۱۰ رقمی باید متعلق به شماره ثبت‌نام شده بالا باشد
              </Text>
              {nationalId.length > 0 && nationalId.length < 10 && (
                <Text style={[s.hintCalcText, { color: '#FFA000' }]}>
                  {toPersianDigits(nationalId.length)} از ۱۰ رقم وارد شده
                </Text>
              )}
              {nationalId.length === 10 && !isTestMode && (
                <Text style={[s.hintCalcText, { color: '#4CAF50' }]}>
                  ✓ تعداد ارقام صحیح است
                </Text>
              )}
              {isTestMode && (
                <Text style={[s.hintCalcText, { color: '#2196F3' }]}>
                  🧪 کد تست شناسایی شد - استعلام ۱۰۰٪ موفق خواهد بود
                </Text>
              )}
            </View>
          }
        />
      </View>

      {/* دکمه استعلام */}
      <Button
        title={loading ? 'در حال استعلام...' : 'استعلام کد ملی'}
        onPress={handleVerify}
        loading={loading}
        disabled={!canVerify}
        variant="primary"
        size="lg"
        fullWidth
        icon={loading ? null : <Icon name="search" size={20} color="#fff" />}
        iconPosition="right"
        style={s.verifyBtn}
      />

      {/* نتیجه موفقیت */}
      {verificationResult === 'success' && (
        <Card
          variant="default"
          padding={16}
          radius={14}
          style={[s.resultCard, { backgroundColor: '#4CAF5015', borderColor: '#4CAF50' }]}
        >
          <View style={s.resultHeader}>
            <View style={[s.resultIcon, { backgroundColor: '#4CAF5022' }]}>
              <Icon name="check-circle" size={28} color="#4CAF50" />
            </View>
            <View style={s.resultInfo}>
              <Text style={[s.resultTitle, { color: '#4CAF50' }]}>هویت شما تایید شد ✓</Text>
              <Text style={[s.resultName, { color: colors.textMain }]}>{verifiedName}</Text>
            </View>
          </View>
          <View style={[s.resultDivider, { backgroundColor: '#4CAF5030' }]} />
          <Text style={[s.resultHint, { color: colors.textSecondary }]}>
            کد ملی با شماره ثبت‌نام شده شما مطابقت دارد. می‌توانید با دکمه «ثبت نهایی» ادامه دهید.
          </Text>
        </Card>
      )}

      {/* نتیجه ناموفق */}
      {verificationResult === 'failed' && (
        <Card
          variant="default"
          padding={16}
          radius={14}
          style={[s.resultCard, { backgroundColor: '#E5737315', borderColor: '#E57373' }]}
        >
          <View style={s.resultHeader}>
            <View style={[s.resultIcon, { backgroundColor: '#E5737322' }]}>
              <Icon name="error-outline" size={28} color="#E57373" />
            </View>
            <View style={s.resultInfo}>
              <Text style={[s.resultTitle, { color: '#E57373' }]}>عدم تطابق اطلاعات</Text>
              <Text style={[s.resultHint, { color: colors.textSecondary }]}>
                {error || 'کد ملی وارد شده با شماره ثبت‌نام شده تطابق ندارد'}
              </Text>
            </View>
          </View>
          <Button
            title="تلاش مجدد"
            onPress={handleVerify}
            variant="outline"
            size="md"
            style={s.retryBtn}
            icon={<Icon name="refresh" size={18} color="#E57373" />}
            iconPosition="right"
          />
        </Card>
      )}

      {/* راهنمای تست */}
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
          <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>
            {toPersianDigits(TEST_NATIONAL_ID)}
          </Text>{' '}
          استفاده کنید. این کد همیشه با هر شماره ثبت‌نام شده‌ای تطابق پیدا می‌کند.
        </Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  // 🎯 flex: 1 اضافه شد
  scrollContent: { 
    // flex: 1,
    paddingHorizontal: 20, 
    paddingTop: 8, 
    gap: 16 
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 18, fontFamily: 'Vazir-Bold' },
  stepHint: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18 },
  phoneCard: { borderWidth: 1 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  phoneIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInfo: { flex: 1, alignItems: 'flex-start', gap: 2 },
  phoneLabel: { fontSize: 12, fontFamily: 'Vazir' },
  phoneValue: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  infoCard: { borderWidth: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { flex: 1, fontSize: 12, fontFamily: 'Vazir', lineHeight: 20 },
  inputSection: { gap: 8 },
  inputLabel: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  inputIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintColumn: { gap: 4, marginTop: 2, alignItems: 'flex-start' },
  hintBaseText: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18 },
  hintCalcText: { fontSize: 13, fontFamily: 'Vazir-Bold', lineHeight: 20 },
  verifyBtn: { marginTop: 8 },
  resultCard: { borderWidth: 1.5 },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: { flex: 1, alignItems: 'flex-start', gap: 4 },
  resultTitle: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  resultName: { fontSize: 14, fontFamily: 'Vazir-Bold', marginTop: 2 },
  resultDivider: { height: 1, marginVertical: 8 },
  resultHint: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18 },
  retryBtn: { marginTop: 12 },
  hintCard: { borderWidth: 1 },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  hintTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  hintText: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 19 },
});