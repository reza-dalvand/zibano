// src/screens/manageBusiness/ManageServicesScreen.js
import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useBusiness } from '../../context/BusinessContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import ServiceHeader from '../../components/manageBusiness/services/ServiceHeader';
import ServiceStats from '../../components/manageBusiness/services/ServiceStats';
import ServiceCard from '../../components/manageBusiness/services/ServiceCard';
import ServiceEmptyState from '../../components/manageBusiness/services/ServiceEmptyState';

export default function ManageServicesScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData, updateService, deleteService } = useBusiness();
  const [searchQuery, setSearchQuery] = useState('');

  const services = businessData.services || [];

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.trim().toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.typeName?.toLowerCase().includes(q)
    );
  }, [services, searchQuery]);

  const handleEdit = (service) => {
    navigation.navigate('EditService', { service });
  };

  const handleAdd = () => {
    navigation.navigate('EditService', { service: null });
  };

  const handleToggle = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      updateService(serviceId, { isActive: !service.isActive });
    }
  };

  const handleDelete = (serviceId) => {
    deleteService(serviceId);
  };

  return (
    // ✅ edges حذف شد - ScreenWrapper با hasHeader=true (پیش‌فرض) خودش مدیریت می‌کنه
    <ScreenWrapper padding={0}>
      <Header
        title="مدیریت خدمات"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        <ServiceHeader servicesCount={services.length} />

        {services.length > 0 && (
          <ServiceStats services={services} />
        )}

        {services.length > 0 && (
          <View style={s.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="جستجو در خدمات..."
            />
          </View>
        )}

        {/* ✅ دکمه سبز افزودن خدمت جدید - بالای لیست (غیر absolute) */}
        {services.length > 0 && (
          <TouchableOpacity
            onPress={handleAdd}
            activeOpacity={0.85}
            style={s.addServiceBtn}
          >
            <View style={s.addServiceBtnIconBox}>
              <Icon name="add" size={22} color="#fff" />
            </View>
            <View style={s.addServiceBtnTextCol}>
              <Text style={s.addServiceBtnTitle}>افزودن خدمت جدید</Text>
              <Text style={s.addServiceBtnSubtitle}>
                خدمت جدیدی به سالن خود اضافه کنید
              </Text>
            </View>
            <Icon name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={s.listContainer}>
          {services.length === 0 ? (
            <ServiceEmptyState onAdd={handleAdd} />
          ) : filteredServices.length === 0 ? (
            <View style={s.noResult}>
              <Icon name="search-off" size={48} color={colors.textSecondary + '60'} />
              <Text style={[s.noResultTitle, { color: colors.textMain }]}>
                نتیجه‌ای یافت نشد
              </Text>
            </View>
          ) : (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>

        {/* فضای خالی برای Tab Bar شناور */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  addServiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#43A047',
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addServiceBtnIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addServiceBtnTextCol: {
    flex: 1,
    gap: 2,
  },
  addServiceBtnTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  addServiceBtnSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  noResult: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  noResultTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
});