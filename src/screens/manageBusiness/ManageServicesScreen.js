// src/screens/manageBusiness/ManageServicesScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useBusiness } from '../../context/BusinessContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import ServicesManagement from '../../components/createbusiness/ServicesManagement';

export default function ManageServicesScreen({ navigation }) {
  const { businessData, updateService, addService, deleteService } = useBusiness();

  // تبدیل توابع Context به فرمت مورد نیاز ServicesManagement
  const handleChange = (updatedServices) => {
    // ServicesManagement کل آرایه را برمی‌گرداند
    // ما تغییرات را با Context sync می‌کنیم
    const currentServices = businessData.services || [];

    // پیدا کردن خدمات جدید (add)
    const newServices = updatedServices.filter(
      (s) => !currentServices.find((cs) => cs.id === s.id)
    );
    newServices.forEach((s) => addService(s));

    // پیدا کردن خدمات حذف شده (delete)
    currentServices.forEach((cs) => {
      if (!updatedServices.find((s) => s.id === cs.id)) {
        deleteService(cs.id);
      }
    });

    // پیدا کردن خدمات ویرایش شده (update)
    updatedServices.forEach((us) => {
      const current = currentServices.find((cs) => cs.id === us.id);
      if (current && JSON.stringify(current) !== JSON.stringify(us)) {
        updateService(us.id, us);
      }
    });
  };

  return (
    <ScreenWrapper padding={0} edges={['top']}>
      <Header title="مدیریت خدمات" onBackPress={() => navigation.goBack()} />
      <View style={s.content}>
        <ServicesManagement
          services={businessData.services || []}
          onChange={handleChange}
        />
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
});