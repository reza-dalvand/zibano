// src/screens/createBusiness/CreateBusinessScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import StepProgress from '../../components/createbusiness/StepProgress';
import BasicInfoStep from '../../components/createbusiness/BasicInfoStep';
import ServicesManagement from '../../components/createbusiness/ServicesManagement';
import TeamManagement from '../../components/createbusiness/TeamManagement';
import SocialMediaStep from '../../components/createbusiness/SocialMediaStep';
import NationalIdVerificationStep from '../../components/createbusiness/NationalIdVerificationStep';
import TermsAndConditionsStep from '../../components/createbusiness/TermsAndConditionsStep';
import SuccessModal from '../../components/common/SuccessModal';

export default function CreateBusinessScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets(); // 🎯 برای هدر لاکچری

  // 🆕 state قوانین
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const totalSteps = 6;
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // 🆕 state اعتبارسنجی هر مرحله
  const [isStepValid, setIsStepValid] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: null,
    provinceId: null,
    cityId: null,
    address: '',
    location: null,
    mapAddress: '',
    coverUrl: null,
    instagram: '',
    telegram: '',
    whatsapp: '',
    bale: '',
    eitaa: '',
    team: [],
    services: [],
    nationalId: '',
    isNationalIdVerified: false,
    verifiedName: '',
  });

  const registeredPhone = user?.phone || '09123456789';

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <BasicInfoStep
            formData={formData}
            onUpdate={updateForm}
            onValidationChange={(valid) => setIsStepValid(valid)}
          />
        );
      case 3:
        return (
          <ServicesManagement
            services={formData.services}
            onChange={(val) => updateForm('services', val)}
          />
        );
      case 4:
        return (
          <View style={s.stepContainer}>
            <TeamManagement
              team={formData.team}
              services={formData.services}
              onChange={(val) => updateForm('team', val)}
            />
          </View>
        );
      case 5:
        return <SocialMediaStep formData={formData} onUpdate={updateForm} />;
      case 6:
        return (
          <View style={s.stepContainer}>
            <NationalIdVerificationStep
              formData={formData}
              onUpdate={updateForm}
              registeredPhone={registeredPhone}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 2;
  const canFinalSubmit = formData.isNationalIdVerified === true;

  const canGoNext = () => {
    if (currentStep === 2) return isStepValid;
    if (currentStep === 3) return formData.services.length > 0;
    if (currentStep === 4) return true;
    if (currentStep === 5) return true;
    if (currentStep === 6) return canFinalSubmit;
    return true;
  };

  const handleNextStep = () => {
    if (!canGoNext()) {
      const messages = {
        2: 'لطفاً تمام فیلدهای الزامی را تکمیل کنید',
        3: 'حداقل یک خدمت به لیست اضافه کنید',
        6: 'ابتدا کد ملی خود را استعلام و تایید کنید',
      };
      Alert.alert('تکمیل اطلاعات', messages[currentStep] || 'لطفاً اطلاعات لازم را تکمیل کنید');
      return;
    }

    if (isLastStep) {
      handleFinalSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinalSubmit = () => {
    if (!canFinalSubmit) {
      Alert.alert(
        'احراز هویت لازم است',
        'برای ثبت نهایی کسب‌وکار، ابتدا باید کد ملی خود را با شماره ثبت‌نام شده تطبیق دهید'
      );
      return;
    }

    const submitData = {
      name: formData.name,
      province: formData.provinceId,
      city: formData.cityId,
      address: formData.address,
      latitude: formData.location?.latitude,
      longitude: formData.location?.longitude,
      map_address: formData.mapAddress,
      cover_image: formData.coverUrl,
      instagram: formData.instagram,
      telegram: formData.telegram,
      whatsapp: formData.whatsapp,
      bale: formData.bale,
      eitaa: formData.eitaa,
      services: formData.services,
      team: formData.team,
      national_id: formData.nationalId,
      verified_name: formData.verifiedName,
      owner_phone: registeredPhone,
    };
    console.log('✅ Final Data Ready for API:', submitData);

    // 🎉 نمایش مدال موفقیت زیبا
    setSuccessModalVisible(true);
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('ManageBusiness');
  };

  const handleBackFromWizard = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
    } else {
      setTermsAccepted(false);
    }
  };

  // 🎯 صفحه قوانین (قبل از wizard)
  if (!termsAccepted) {
    return (
      <ScreenWrapper padding={0} edges={['bottom']}>
        <Header
          title="ثبت کسب‌وکار جدید"
          onBackPress={() => navigation.goBack()}
        />
        <TermsAndConditionsStep
          onAccept={() => {
            setTermsAccepted(true);
            setCurrentStep(2);
          }}
          onDecline={() => navigation.goBack()}
        />
      </ScreenWrapper>
    );
  }

  // 🎯 Wizard (بعد از پذیرش قوانین)
  return (
    <ScreenWrapper padding={0} keyboardAware>
      {/* هدر لاکچری - 🎯 با insets.top برای جلوگیری از Notch */}
      <View
        style={[
          s.luxuryHeader,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top + 10,
          },
        ]}
      >
        <View style={s.headerInner}>
          <View style={s.headerTop}>
            <Button
              title=""
              onPress={handleBackFromWizard}
              variant="ghost"
              size="sm"
              icon={<Icon name="arrow-forward" size={22} color="#fff" />}
              style={s.headerBackBtn}
            />
            <Text style={s.headerTitle}>ثبت کسب‌وکار جدید</Text>
            <View style={{ width: 44 }} />
          </View>
        </View>
      </View>

      {/* Step Progress */}
      <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* محتوای مرحله */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.stepContentWrapper}
      >
        {renderCurrentStep()}
      </KeyboardAvoidingView>

      {/* فوتر با دکمه‌های ناوبری */}
      <View
        style={[
          s.footerControls,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <View style={s.footerRow}>
          {!isFirstStep && (
            <Button
              title="مرحله قبل"
              onPress={handleBackFromWizard}
              variant="outline"
              size="md"
              style={s.halfButton}
              icon={<Icon name="arrow-forward" size={18} color={colors.primary} />}
              iconPosition="right"
            />
          )}
          <Button
            title={isLastStep ? 'ثبت نهایی' : 'مرحله بعد'}
            onPress={handleNextStep}
            variant="primary"
            size="md"
            style={isFirstStep ? s.fullButton : s.halfButton}
            disabled={!canGoNext()}
            icon={
              isLastStep ? (
                <Icon name="check-circle" size={18} color="#fff" />
              ) : (
                <Icon name="arrow-back" size={18} color="#fff" />
              )
            }
            iconPosition={isLastStep ? 'right' : 'left'}
          />
        </View>

        {/* 🆕 پیام‌های راهنما برای دکمه غیرفعال */}
        {!canGoNext() && (
          <View style={s.warningBox}>
            <Icon name="info-outline" size={14} color="#FFA000" />
            <Text style={[s.warningText, { color: colors.textSecondary }]}>
              {currentStep === 2 && 'برای فعال‌سازی دکمه «مرحله بعد»، تمام فیلدهای الزامی را تکمیل کنید'}
              {currentStep === 3 && 'حداقل یک خدمت به لیست اضافه کنید'}
              {currentStep === 6 && 'برای فعال‌سازی دکمه ثبت نهایی، ابتدا کد ملی خود را استعلام و تایید کنید'}
            </Text>
          </View>
        )}
      </View>

      {/* 🎉 مدال موفقیت زیبا */}
      <SuccessModal
        visible={successModalVisible}
        onClose={handleSuccessClose}
        title="ثبت‌نام با موفقیت انجام شد"
        message="اطلاعات کسب‌وکار شما با موفقیت ثبت شد. پس از بررسی توسط کارشناسان زیبانو، نتیجه از طریق پیامک به شماره ثبت‌نام‌شده ارسال خواهد شد."
        confirmText="متوجه شدم"
        emoji="🎉"
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  luxuryHeader: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerInner: {
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  stepContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  stepContentWrapper: {
    flex: 1,
  },
  footerControls: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
  fullButton: {
    flex: 1,
  },
  warningBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
  },
  warningText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
    flex: 1,
  },
});