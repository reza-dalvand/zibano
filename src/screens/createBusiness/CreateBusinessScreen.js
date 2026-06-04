import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Dropdown from '../../components/common/Dropdown';

export default function CreateBusinessScreen({ navigation }) {
  const { colors } = useTheme();
  
  // مدیریت مراحل فرم
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // 1:اطلاعات پایه، 2:شبکه‌ها، 3:تیم، 4:خدمات و نمونه‌کار

  // استیت جامع برای جمع‌آوری تمام اطلاعات کسب‌وکار
  const [formData, setFormData] = useState({
    name: '',
    categoryId: null,
    provinceId: null,
    address: '',
    logoUrl: null,
    instagram: '',
    telegram: '',
    // تیم و خدمات در مراحل بعدی پر می‌شوند
    team: [],
    services: [],
  });

  // تابع تغییر دیتای فرم
  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // تابع انتخاب عکس با Image Picker
  const pickImage = async (field) => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && result.assets) {
      updateForm(field, result.assets[0].uri);
    }
  };

  // --- رندر مرحله ۱: اطلاعات پایه ---
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.textMain }]}>اطلاعات پایه سالن</Text>
      
      {/* دکمه انتخاب لوگو */}
      <TouchableOpacity 
        style={[styles.logoPicker, { backgroundColor: colors.cardBackground, borderColor: colors.border }]} 
        onPress={() => pickImage('logoUrl')}
      >
        {formData.logoUrl ? (
          <Image source={{ uri: formData.logoUrl }} style={styles.logoImage} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Icon name="add-a-photo" size={30} color={colors.textSecondary} />
            <Text style={[styles.logoText, { color: colors.textSecondary }]}>آپلود لوگو</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ورودی‌ها (بهتر است اینجا از کامپوننت Input خودت استفاده کنی) */}
      <TextInput
        style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.textMain, borderColor: colors.border }]}
        placeholder="نام کسب‌وکار"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(txt) => updateForm('name', txt)}
      />

      <Dropdown
        label="دسته‌بندی اصلی"
        placeholder="انتخاب نوع خدمات"
        value={formData.categoryId}
        options={[
          { id: '1', label: 'سالن زیبایی (چند منظوره)' },
          { id: '2', label: 'کلینیک پوست و مو' },
          { id: '3', label: 'مرکز لیزر' },
        ]}
        onSelect={(val) => updateForm('categoryId', val)}
      />

      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: colors.cardBackground, color: colors.textMain, borderColor: colors.border }]}
        placeholder="آدرس دقیق"
        placeholderTextColor={colors.textSecondary}
        multiline
        value={formData.address}
        onChangeText={(txt) => updateForm('address', txt)}
      />
    </View>
  );

  // --- رندر مرحله ۲: شبکه‌های اجتماعی ---
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.textMain }]}>شبکه‌های اجتماعی و ارتباطات</Text>
      
      <View style={styles.socialInputRow}>
        <Icon name="camera-alt" size={24} color="#E1306C" style={styles.socialIcon} />
        <TextInput
          style={[styles.input, { flex: 1, backgroundColor: colors.cardBackground, color: colors.textMain, borderColor: colors.border }]}
          placeholder="آیدی اینستاگرام (بدون @)"
          placeholderTextColor={colors.textSecondary}
          value={formData.instagram}
          onChangeText={(txt) => updateForm('instagram', txt)}
        />
      </View>

      <View style={styles.socialInputRow}>
        <Icon name="telegram" size={24} color="#0088cc" style={styles.socialIcon} />
        <TextInput
          style={[styles.input, { flex: 1, backgroundColor: colors.cardBackground, color: colors.textMain, borderColor: colors.border }]}
          placeholder="آیدی یا لینک تلگرام"
          placeholderTextColor={colors.textSecondary}
          value={formData.telegram}
          onChangeText={(txt) => updateForm('telegram', txt)}
        />
      </View>
    </View>
  );

  return (
    <ScreenWrapper scrollable keyboardAware padding={20} edges={['top']}>
      {/* هدر */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigation.goBack()}>
          <Icon name="arrow-forward" size={28} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.textMain }]}>ثبت کسب‌وکار جدید</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* نوار پیشرفت (Progress Bar) */}
      <View style={styles.progressContainer}>
        {[...Array(totalSteps)].map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot, 
              { backgroundColor: index + 1 <= currentStep ? colors.primary : colors.border },
              index + 1 === currentStep && styles.activeDot
            ]} 
          />
        ))}
      </View>

      {/* محتوای متغیر بر اساس مرحله فعلی */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && <Text style={{color: colors.textMain, marginTop: 20}}>بخش افزودن اعضای تیم (در حال توسعه...)</Text>}
      {currentStep === 4 && <Text style={{color: colors.textMain, marginTop: 20}}>بخش خدمات و نمونه‌کارها (در حال توسعه...)</Text>}

      {/* دکمه‌های کنترل پایین فرم */}
      <View style={styles.footerControls}>
        <TouchableOpacity 
          style={[styles.mainButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
            else console.log('Final Data to send to Django API:', formData); // ارسال نهایی
          }}
        >
          <Text style={styles.mainButtonText}>
            {currentStep === totalSteps ? 'ثبت نهایی کسب‌وکار' : 'مرحله بعد'}
          </Text>
        </TouchableOpacity>
      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 18, fontFamily: 'Vazir-Bold' },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 30 },
  progressDot: { width: 12, height: 12, borderRadius: 6 },
  activeDot: { width: 24 }, // کشیده شدن دات فعال
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 16, fontFamily: 'Vazir-Bold', marginBottom: 20 },
  
  // استایل‌های موقت برای ورودی‌ها (تا زمان دریافت Input.js شما)
  input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontFamily: 'Vazir', marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 14 },
  
  logoPicker: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderStyle: 'dashed', alignSelf: 'center', marginBottom: 20, overflow: 'hidden' },
  logoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoImage: { width: '100%', height: '100%' },
  logoText: { fontSize: 11, fontFamily: 'Vazir', marginTop: 4 },
  
  socialInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  socialIcon: { marginBottom: 16 },
  
  footerControls: { marginTop: 40, paddingBottom: 100 },
  mainButton: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mainButtonText: { color: '#FFF', fontSize: 16, fontFamily: 'Vazir-Bold' },
});