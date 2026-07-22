// src/screens/createBusiness/CreateBusinessScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import StepProgress from '../../components/createbusiness/StepProgress';
import BasicInfoStep from '../../components/createbusiness/BasicInfoStep';
import NationalIdVerificationStep from '../../components/createbusiness/NationalIdVerificationStep';
import TermsAndConditionsStep from '../../components/createbusiness/TermsAndConditionsStep';
import SuccessModal from '../../components/common/SuccessModal';

const NAVBAR_HEIGHT = 90;

export default function CreateBusinessScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    provinceId: null,
    cityId: null,
    address: '',
    location: null,
    mapAddress: '',
    coverUrl: null,
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
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            onUpdate={updateForm}
            onValidationChange={(valid) => setIsStepValid(valid)}
          />
        );
      case 2:
        return (
          <NationalIdVerificationStep
            formData={formData}
            onUpdate={updateForm}
            registeredPhone={registeredPhone}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  const canFinalSubmit = formData.isNationalIdVerified === true;

  const canGoNext = () => {
    if (currentStep === 1) return isStepValid;
    if (currentStep === 2) return canFinalSubmit;
    return true;
  };

  const handleNextStep = () => {
    if (!canGoNext()) {
      const messages = {
        1: 'لطفاً تمام فیلدهای الزامی را تکمیل کنید',
        2: 'ابتدا کد ملی خود را استعلام و تایید کنید',
      };
      Alert.alert(
        'تکمیل اطلاعات',
        messages[currentStep] || 'لطفاً اطلاعات لازم را تکمیل کنید',
      );
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
        'برای ثبت نهایی کسب‌وکار، ابتدا باید کد ملی خود را با شماره ثبت‌نام شده تطبیق دهید',
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
      national_id: formData.nationalId,
      verified_name: formData.verifiedName,
      owner_phone: registeredPhone,
    };

    console.log('✅ Final Data Ready for API:', submitData);
    setSuccessModalVisible(true);
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('ManageBusiness');
  };

  const handleBackFromWizard = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setTermsAccepted(false);
    }
  };

  if (!termsAccepted) {
    return (
      <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
        <Header
          title="ثبت کسب‌وکار جدید"
          onBackPress={() => navigation.goBack()}
        />
        <TermsAndConditionsStep
          navbarHeight={NAVBAR_HEIGHT}
          onAccept={() => {
            setTermsAccepted(true);
            setCurrentStep(1);
          }}
          onDecline={() => navigation.goBack()}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      {/* هدر */}
      <View
        style={[
          s.luxuryHeader,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <View style={s.headerTop}>
          <TouchableOpacity
            onPress={handleBackFromWizard}
            style={s.headerBackBtn}
            activeOpacity={0.7}
          >
            <Icon name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>ثبت کسب‌وکار جدید</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView
        key={currentStep}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
        {renderCurrentStep()}
        <View style={{ height: 32 }} />

        {/* ═══════ فوتر دکمه‌ها ═══════ */}
        <View
          style={[
            s.footerControls,
            {
              backgroundColor: colors.cardBackground,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View style={s.footerRow}>
            {/* دکمه اصلی — در RTL force شده سمت راست قرار می‌گیره */}
            <Button
              title={isLastStep ? 'ثبت نهایی' : 'مرحله بعد'}
              onPress={handleNextStep}
              variant="primary"
              size="lg"
              style={isFirstStep ? s.fullButton : s.nextButton}
              disabled={!canGoNext()}
              icon={
                isLastStep ? (
                  <Icon name="check-circle" size={18} color="#fff" />
                ) : (
                  <Icon name="arrow-back" size={18} color="#fff" />
                )
              }
              iconPosition="right"
            />

            {/* دکمه مرحله قبل — سمت چپ */}
            {!isFirstStep && (
              <Button
                title="مرحله قبل"
                onPress={handleBackFromWizard}
                variant="outline"
                size="lg"
                style={s.backButton}
                icon={
                  <Icon name="arrow-forward" size={18} color={colors.primary} />
                }
                iconPosition="left"
              />
            )}
          </View>

          {!canGoNext() && (
            <View
              style={[
                s.warningBox,
                {
                  backgroundColor: '#FFA00010',
                  borderColor: '#FFA00030',
                },
              ]}
            >
              <Icon name="info-outline" size={14} color="#FFA000" />
              <Text style={[s.warningText, { color: colors.textSecondary }]}>
                {currentStep === 1 &&
                  'برای فعال‌سازی دکمه «مرحله بعد»، تمام فیلدهای الزامی را تکمیل کنید'}
                {currentStep === 2 &&
                  'برای فعال‌سازی دکمه ثبت نهایی، ابتدا کد ملی خود را استعلام و تایید کنید'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: NAVBAR_HEIGHT + insets.bottom + 20 }} />
      </ScrollView>

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
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },

  // ═══════ فوتر دکمه‌ها ═══════
  footerControls: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  footerRow: {
    flexDirection: 'row-reverse',  // در RTL force شده، row از راست شروع می‌کنه
    gap: 10,
    alignItems: 'stretch',
  },
  nextButton: {
    flex: 1.6,   // دکمه اصلی پهن‌تر
    height: 54,
    borderRadius: 16,
  },
  backButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
  },
  fullButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'left',
    flex: 1,
    lineHeight: 18,
  },
});