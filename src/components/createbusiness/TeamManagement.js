// src/components/createbusiness/TeamManagement.js
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Avatar from '../common/Avatar';
import Input from '../common/Input';
import Button from '../common/Button';
import Chip from '../common/Chip';
import EmptyState from '../common/EmptyState';
import Divider from '../common/Divider';
import BottomSheet from '../common/BottomSheet';

const validatePhone = (v) => /^09[0-9]{9}$/.test(v.replace(/[^0-9]/g, ''));
const toEnglishDigits = (str) =>
  String(str)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

export default function TeamManagement({ team = [], services = [], onChange }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});

  // 🎯 Debug: لاگ کردن services وقتی تغییر می‌کند
  useEffect(() => {
    console.log('🔍 TeamManagement - Services received:', services.length);
    console.log('🔍 TeamManagement - Services:', services.map(s => ({ id: s.id, name: s.name, isActive: s.isActive })));
  }, [services]);

  // 🎯 Debug: لاگ کردن modalStep
  useEffect(() => {
    console.log('🔍 TeamManagement - Modal Step:', modalStep);
    console.log('🔍 TeamManagement - Modal Visible:', modalVisible);
  }, [modalStep, modalVisible]);

  // 🎯 محاسبه خدمات فعال با useMemo
  const availableServices = useMemo(() => {
    console.log('🔍 Computing availableServices from:', services.length, 'services');
    const filtered = (services || []).filter(sv => sv && sv.id && sv.isActive !== false);
    console.log('🔍 Available services:', filtered.length);
    return filtered;
  }, [services]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setSelectedServices([]);
    setErrors({});
    setEditingId(null);
    setModalStep(1);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (member) => {
    setName(member.name);
    setPhone(member.phone);
    setSelectedServices(member.services || []);
    setEditingId(member.id);
    setModalStep(1);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const goToNextStep = () => {
    const newErrors = {};
    if (!name.trim() || name.trim().length < 3)
      newErrors.name = 'نام باید حداقل ۳ کاراکتر باشد';
    const engPhone = toEnglishDigits(phone);
    if (!validatePhone(engPhone)) newErrors.phone = 'شماره موبایل معتبر نیست';
    if (team.some((m) => m.phone === engPhone && m.id !== editingId))
      newErrors.phone = 'این شماره قبلاً ثبت شده';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('🔍 Going to step 2, available services:', availableServices.length);
      setModalStep(2);
    }
  };

  const toggleService = (id) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const saveMember = () => {
    const memberData = {
      id: editingId || `team_${Date.now()}`,
      name: name.trim(),
      phone: toEnglishDigits(phone),
      services: selectedServices,
    };
    onChange?.(
      editingId
        ? team.map((m) => (m.id === editingId ? memberData : m))
        : [...team, memberData]
    );
    closeModal();
  };

  const handleDelete = (member) => {
    Alert.alert(
      'حذف کارمند',
      `آیا از حذف "${member.name}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => onChange?.(team.filter((m) => m.id !== member.id)),
        },
      ]
    );
  };

  const renderTeamList = () => {
    if (team.length === 0) {
      return (
        <View
          style={[
            s.emptyCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <EmptyState
            icon="👥"
            title="هنوز کارمندی اضافه نکرده‌اید"
            description="با افزودن اعضای تیم، می‌توانید خدمات را به هر کارمند اختصاص دهید"
            actionLabel="افزودن اولین کارمند"
            onAction={openAddModal}
          />
        </View>
      );
    }

    return (
      <View style={s.teamList}>
        {team.map((member) => (
          <View
            key={member.id}
            style={[
              s.memberCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={s.memberRow}>
              <View style={s.avatarWrapper}>
                <Avatar name={member.name} size="lg" showBorder />
              </View>

              <View style={s.memberInfo}>
                <Text
                  style={[s.memberName, { color: colors.textMain }]}
                  numberOfLines={1}
                >
                  {member.name}
                </Text>
                <View style={s.phoneRow}>
                  <Icon name="phone" size={14} color={colors.textSecondary} />
                  <Text style={[s.memberPhone, { color: colors.textSecondary }]}>
                    {member.phone}
                  </Text>
                </View>
              </View>

              <View style={s.memberActions}>
                <Button
                  title=""
                  onPress={() => openEditModal(member)}
                  variant="ghost"
                  size="sm"
                  icon={<Icon name="edit" size={20} color={colors.primary} />}
                  style={s.actionBtn}
                />
                <Button
                  title=""
                  onPress={() => handleDelete(member)}
                  variant="ghost"
                  size="sm"
                  icon={<Icon name="delete-outline" size={22} color="#E57373" />}
                  style={s.actionBtn}
                />
              </View>
            </View>

            <Divider spacing={12} />

            <View style={s.servicesRow}>
              <View style={s.servicesLabelRow}>
                <Icon name="spa" size={14} color={colors.textSecondary} />
                <Text style={[s.servicesLabel, { color: colors.textSecondary }]}>
                  خدمات ارائه‌شده:
                </Text>
              </View>
              {member.services?.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.chipsContainer}
                >
                  {member.services.map((sId) => (
                    <Chip
                      key={sId}
                      label={
                        services.find((sv) => sv.id === sId)?.name || 'خدمت'
                      }
                      selected
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text
                  style={[s.noServiceText, { color: colors.textSecondary }]}
                >
                  هنوز خدمتی اختصاص داده نشده
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  // 🎯 رندر محتوای مدال - با key برای force re-render
  const renderModalContent = () => {
    console.log('🔍 renderModalContent called, step:', modalStep, 'services:', availableServices.length);

    return (
      <ScrollView
        key={`modal-content-${modalStep}-${availableServices.length}`}
        style={s.modalContent}
        contentContainerStyle={s.modalContentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <View style={s.stepIndicator}>
          {['اطلاعات', 'خدمات'].map((label, i) => (
            <React.Fragment key={i}>
              <View style={s.stepLabel}>
                <View
                  style={[
                    s.stepDot,
                    {
                      backgroundColor:
                        modalStep >= i + 1 ? colors.primary : colors.border,
                    },
                  ]}
                />
                <Text
                  style={[
                    s.stepLabelText,
                    {
                      color:
                        modalStep >= i + 1
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {label}
                </Text>
              </View>
              {i < 1 && (
                <View
                  style={[
                    s.stepLine,
                    {
                      backgroundColor:
                        modalStep >= i + 2 ? colors.primary : colors.border,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {modalStep === 1 ? (
          <>
            <Text style={[s.stepTitle, { color: colors.textMain }]}>
              اطلاعات کارمند
            </Text>
            <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>
              نام و شماره تماس کارمند جدید را وارد کنید
            </Text>
            <Input
              label="نام و نام خانوادگی"
              placeholder="مثال: سارا احمدی"
              value={name}
              onChangeText={setName}
              error={errors.name}
              rightIcon={
                <Icon name="person" size={22} color={colors.textSecondary} />
              }
            />
            <Input
              label="شماره موبایل"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phone}
              onChangeText={(t) =>
                setPhone(
                  toEnglishDigits(t).replace(/[^0-9]/g, '').slice(0, 11)
                )
              }
              keyboardType="phone-pad"
              maxLength={11}
              error={errors.phone}
              rightIcon={
                <Icon name="smartphone" size={22} color={colors.textSecondary} />
              }
            />
          </>
        ) : (
          <>
            <Text style={[s.stepTitle, { color: colors.textMain }]}>
              خدمات ارائه‌شده
            </Text>
            <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>
              مشخص کنید این کارمند چه خدماتی را انجام می‌دهد
            </Text>

            {/* 🎯 نمایش آمار خدمات */}
            <View
              style={[
                s.servicesStats,
                { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' },
              ]}
            >
              <Icon name="spa" size={16} color={colors.primary} />
              <Text style={[s.servicesStatsText, { color: colors.primary }]}>
                {availableServices.length} خدمت فعال موجود است
              </Text>
            </View>

            {services.length === 0 ? (
              /* 🎯 حالت ۱: هیچ خدمتی ثبت نشده */
              <View
                style={[
                  s.emptyServicesBox,
                  { backgroundColor: colors.cardBackground, borderColor: colors.border },
                ]}
              >
                <View style={s.emptyServicesIcon}>
                  <Icon name="warning" size={48} color="#FFA000" />
                </View>
                <Text style={[s.emptyServicesTitle, { color: colors.textMain }]}>
                  هنوز خدمتی ثبت نکرده‌اید
                </Text>
                <Text style={[s.emptyServicesText, { color: colors.textSecondary }]}>
                  برای اختصاص خدمات به کارمندان، ابتدا باید در مرحله قبل (خدمات سالن)، حداقل یک خدمت اضافه کنید.
                </Text>
              </View>
            ) : availableServices.length === 0 ? (
              /* 🎯 حالت ۲: خدمات وجود دارند اما همه غیرفعال هستند */
              <View
                style={[
                  s.emptyServicesBox,
                  { backgroundColor: colors.cardBackground, borderColor: colors.border },
                ]}
              >
                <View style={s.emptyServicesIcon}>
                  <Icon name="visibility-off" size={48} color="#FFA000" />
                </View>
                <Text style={[s.emptyServicesTitle, { color: colors.textMain }]}>
                  همه خدمات غیرفعال هستند
                </Text>
                <Text style={[s.emptyServicesText, { color: colors.textSecondary }]}>
                  {services.length} خدمت ثبت شده است اما همه آنها غیرفعال هستند. لطفاً ابتدا خدمات را فعال کنید.
                </Text>
              </View>
            ) : (
              /* 🎯 حالت ۳: نمایش لیست خدمات فعال */
              <View style={s.servicesList}>
                {availableServices.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <TouchableOpacity
                      key={service.id}
                      activeOpacity={0.7}
                      onPress={() => toggleService(service.id)}
                      style={[
                        s.serviceOption,
                        {
                          borderColor: isSelected ? colors.primary : colors.border,
                          backgroundColor: isSelected
                            ? colors.primary + '10'
                            : colors.cardBackground,
                        },
                      ]}
                    >
                      <View style={s.serviceOptionMain}>
                        <View
                          style={[
                            s.serviceOptionCheck,
                            {
                              backgroundColor: isSelected ? colors.primary + '20' : colors.border + '50',
                            },
                          ]}
                        >
                          <Icon
                            name={isSelected ? 'check-circle' : 'radio-button-unchecked'}
                            size={22}
                            color={isSelected ? colors.primary : colors.textSecondary}
                          />
                        </View>
                        <View style={s.serviceOptionInfo}>
                          <Text
                            style={[
                              s.serviceOptionName,
                              { color: colors.textMain },
                            ]}
                            numberOfLines={1}
                          >
                            {service.name}
                          </Text>
                          <View style={s.serviceOptionMetaRow}>
                            <Icon name="category" size={12} color={colors.textSecondary} />
                            <Text
                              style={[
                                s.serviceOptionMeta,
                                { color: colors.textSecondary },
                              ]}
                              numberOfLines={1}
                            >
                              {service.typeName || 'خدمت'}
                            </Text>
                          </View>
                          <View style={s.serviceOptionMetaRow}>
                            <Icon name="attach-money" size={12} color="#4CAF50" />
                            <Text
                              style={[
                                s.serviceOptionPrice,
                                { color: '#4CAF50' },
                              ]}
                            >
                              {(service.finalPrice || 0).toLocaleString('fa-IR')} تومان
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {/* شمارنده انتخاب‌ها */}
                {selectedServices.length > 0 && (
                  <View
                    style={[
                      s.selectedCountBox,
                      { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' },
                    ]}
                  >
                    <Icon name="check-circle" size={16} color={colors.primary} />
                    <Text style={[s.selectedCountText, { color: colors.primary }]}>
                      {selectedServices.length} خدمت انتخاب شده
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  const renderModalFooter = () =>
    modalStep === 1 ? (
      <Button
        title="مرحله بعد"
        onPress={goToNextStep}
        variant="primary"
        size="lg"
        fullWidth
        disabled={!name || !phone}
        icon={<Icon name="arrow-back" size={20} color="#fff" />}
        iconPosition="left"
      />
    ) : (
      <View style={s.footerRow}>
        <Button
          title="قبلی"
          onPress={() => setModalStep(1)}
          variant="outline"
          size="lg"
          style={s.halfButton}
        />
        <Button
          title={editingId ? 'ذخیره تغییرات' : 'افزودن کارمند'}
          onPress={saveMember}
          variant="primary"
          size="lg"
          style={s.halfButton}
          icon={<Icon name="check" size={20} color="#fff" />}
          iconPosition="right"
        />
      </View>
    );

  return (
    <View style={s.container}>
      <View style={s.sectionHeader}>
        <View style={s.titleRow}>
          <Icon name="people" size={22} color={colors.primary} />
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            اعضای تیم
          </Text>
        </View>
        <Text style={[s.countText, { color: colors.textSecondary }]}>
          {team.length} کارمند
        </Text>
      </View>

      {renderTeamList()}

      <Button
        title="افزودن کارمند جدید"
        onPress={openAddModal}
        variant="outline"
        size="lg"
        fullWidth
        icon={<Icon name="person-add" size={20} color={colors.primary} />}
        iconPosition="right"
        style={s.addButton}
      />

      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'ویرایش کارمند' : 'افزودن کارمند جدید'}
        snapPoint={0.8}
        footer={renderModalFooter()}
      >
        {renderModalContent()}
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  countText: { fontSize: 13, fontFamily: 'Vazir' },
  teamList: { gap: 14, marginBottom: 16, paddingTop: 8 },
  memberCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    zIndex: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: { zIndex: 20, elevation: 5 },
  memberInfo: { flex: 1, alignItems: 'flex-start', gap: 6 },
  memberName: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memberPhone: { fontSize: 13, fontFamily: 'Vazir' },
  memberActions: { flexDirection: 'row', gap: 4 },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  servicesRow: { gap: 8 },
  servicesLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  servicesLabel: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  chipsContainer: { flexDirection: 'row', gap: 6 },
  noServiceText: { fontSize: 12, fontFamily: 'Vazir' },
  emptyCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  addButton: { marginTop: 4 },
  modalContent: { flex: 1 },
  modalContentInner: { paddingBottom: 20 },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    gap: 8,
  },
  stepLabel: { alignItems: 'center', gap: 4 },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { flex: 1, height: 2 },
  stepLabelText: { fontSize: 11, fontFamily: 'Vazir-Medium' },
  stepTitle: { fontSize: 18, fontFamily: 'Vazir-Bold', marginBottom: 6 },
  stepSubtitle: { fontSize: 13, fontFamily: 'Vazir', marginBottom: 24, lineHeight: 20 },
  
  // 🆕 استایل‌های جدید برای بخش انتخاب خدمات
  servicesStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  servicesStatsText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },
  emptyServicesBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    minHeight: 220,
    justifyContent: 'center',
  },
  emptyServicesIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFA00015',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyServicesTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  emptyServicesText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
  },
  servicesList: { gap: 10 },
  serviceOption: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
  },
  serviceOptionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceOptionCheck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceOptionInfo: { flex: 1, gap: 4 },
  serviceOptionName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  serviceOptionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceOptionMeta: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  serviceOptionPrice: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  selectedCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  selectedCountText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  
  footerRow: { flexDirection: 'row', gap: 10 },
  halfButton: { flex: 1 },
});