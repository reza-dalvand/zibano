// src/screens/manageBusiness/CreateModelRequestScreen.js
import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Toast from '../../components/common/Toast';
import { useTheme } from '../../stores/useThemeStore';
import { useBusinessStore } from '../../stores/useBusinessStore';
import ModelRequestForm from '../../components/manageBusiness/modelRequest/ModelRequestForm';

export default function CreateModelRequestScreen({ navigation, route }) {
  const { colors } = useTheme();
  const businessData = useBusinessStore((s) => s.businessData);
  const existingRequest = route.params?.request || null;
  const isEditMode = !!existingRequest;

  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const services = businessData?.services || [];

  const handleSave = (formData) => {
    // در آینده: ذخیره در API
    console.log('Saving model request:', formData);

    setToast({
      visible: true,
      message: isEditMode
        ? 'درخواست مدل با موفقیت ویرایش شد'
        : 'درخواست مدل با موفقیت ایجاد شد',
      type: 'success',
    });

    setTimeout(() => {
      navigation.goBack();
    }, 1200);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']} keyboardAware>
      <Header
        title={isEditMode ? 'ویرایش درخواست مدل' : 'ایجاد درخواست مدل'}
        onBackPress={() => navigation.goBack()}
      />

      <ModelRequestForm
        services={services}
        initialData={existingRequest}
        onSave={handleSave}
        onClose={handleClose}
      />

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

const s = StyleSheet.create({});