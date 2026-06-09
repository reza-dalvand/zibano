// src/screens/createBusiness/CreateBusinessScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext'; // 🆕
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import StepProgress from '../../components/createbusiness/StepProgress';
import BasicInfoStep from '../../components/createbusiness/BasicInfoStep';
import ServicesManagement from '../../components/createbusiness/ServicesManagement';
import TeamManagement from '../../components/createbusiness/TeamManagement';
import SocialMediaStep from '../../components/createbusiness/SocialMediaStep';
import NationalIdVerificationStep from '../../components/createbusiness/NationalIdVerificationStep';

export default function CreateBusinessScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth(); // 🆕 گرفتن اطلاعات کاربر لاگین‌شده
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    name: '',
    categoryId: null,
    provinceId: null,
    address: '',
    logoUrl: null,
    instagram: '',
    telegram: '',
    team: [],
    services: [],
    nationalId: '',
    isNationalIdVerified: false,
    verifiedName: '',
  });

  // 🆕 شماره ثبت‌نام شده کاربر از AuthContext
  const registeredPhone = user?.phone || '';

  const updateForm = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <BasicInfoStep formData={formData} onUpdate={updateForm} />;
      case 2: return <ServicesManagement services={formData.services} onChange={(val) => updateForm('services', val)} />;
      case 3: return <TeamManagement team={formData.team} services={formData.services} onChange={(val) => updateForm('team', val)} />;
      case 4: return <SocialMediaStep formData={formData} onUpdate={updateForm} />;
      case 5: // 🆕 مرحله احراز هویت
        return (
          <NationalIdVerificationStep
            formData={formData}
            onUpdate={updateForm}
            registeredPhone={registeredPhone} // 🆕 پاس دادن شماره ثبت‌نام شده
          />
        );
      default: return null;
    }
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  const canFinalSubmit = formData.isNationalIdVerified === true;

  const handleFinalSubmit = () => {
    if (!canFinalSubmit) {
      Alert.alert(
        'احراز هویت لازم است',
        'برای ثبت نهایی کسب‌وکار، ابتدا باید کد ملی خود را با شماره ثبت‌نام شده تطبیق دهید'
      );
      return;
    }
    
    console.log('✅ Final Data Ready for API:', {
      ...formData,
      ownerPhone: registeredPhone, // 🆕 شماره مالک از AuthContext
    });
    
    Alert.alert(
      'ثبت‌نام موفق ✓',
      'اطلاعات کسب‌وکار شما با موفقیت ثبت شد. پس از بررسی توسط کارشناسان، نتیجه از طریق پیامک اعلام خواهد شد.',
      [{ text: 'متوجه شدم', onPress: () => navigation.navigate('ManageBusiness') }]
    );
  };

  return (
    <ScreenWrapper scrollable keyboardAware padding={0}>
      <Header
        title="ثبت کسب‌وکار جدید"
        onBackPress={() => {
          if (currentStep > 1) setCurrentStep(currentStep - 1);
          else navigation.goBack();
        }}
      />
      <View style={s.contentContainer}>
        <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
        <View style={s.stepContent}>{renderCurrentStep()}</View>

        <View style={s.footerControls}>
          <View style={s.footerRow}>
            {!isFirstStep && (
              <Button
                title="مرحله قبل"
                onPress={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                size="lg"
                style={s.halfButton}
                icon={<Icon name="arrow-forward" size={20} color={colors.primary} />}
                iconPosition="right"
              />
            )}
            <Button
              title={isLastStep ? 'ثبت نهایی کسب‌وکار' : 'مرحله بعد'}
              onPress={() => {
                if (isLastStep) handleFinalSubmit();
                else setCurrentStep(currentStep + 1);
              }}
              variant="primary"
              size="lg"
              style={isFirstStep ? s.fullButton : s.halfButton}
              disabled={isLastStep && !canFinalSubmit}
              icon={
                isLastStep ? (
                  <Icon name="check-circle" size={20} color="#fff" />
                ) : (
                  <Icon name="arrow-back" size={20} color="#fff" />
                )
              }
              iconPosition={isLastStep ? 'right' : 'left'}
            />
          </View>
          {isLastStep && !canFinalSubmit && (
            <View style={s.warningBox}>
              <Icon name="info" size={16} color={colors.textSecondary} />
              <View style={s.warningTextContainer}>
                <View style={s.warningText}>
                  برای فعال‌سازی دکمه ثبت نهایی، ابتدا کد ملی خود را استعلام و تایید کنید
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  contentContainer: { flex: 1, paddingHorizontal: 20 },
  stepContent: { flex: 1 },
  footerControls: { marginTop: 24, paddingBottom: 40 },
  footerRow: { flexDirection: 'row', gap: 10 },
  halfButton: { flex: 1 },
  fullButton: { flex: 1 },
  warningBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
  },
  warningTextContainer: { flex: 1 },
  warningText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
    color: '#888',
  },
});