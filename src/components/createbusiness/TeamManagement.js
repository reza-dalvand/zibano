// src/components/createbusiness/TeamManagement.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Input from '../common/Input';
import Button from '../common/Button';
import Chip from '../common/Chip';
import EmptyState from '../common/EmptyState';
import Divider from '../common/Divider';
import BottomSheet from '../common/BottomSheet'; // ✅ استفاده از BottomSheet

const validatePhone = (v) => /^09[0-9]{9}$/.test(v.replace(/[^0-9]/g, ''));
const toEnglishDigits = (str) =>
  String(str).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

export default function TeamManagement({ team = [], services = [], onChange }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setName(''); setPhone(''); setSelectedServices([]);
    setErrors({}); setEditingId(null); setModalStep(1);
  };

  const openAddModal = () => { resetForm(); setModalVisible(true); };
  
  const openEditModal = (member) => {
    setName(member.name); setPhone(member.phone);
    setSelectedServices(member.services || []);
    setEditingId(member.id); setModalStep(1); setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const goToNextStep = () => {
    const newErrors = {};
    if (!name.trim() || name.trim().length < 3) newErrors.name = 'نام باید حداقل ۳ کاراکتر باشد';
    const engPhone = toEnglishDigits(phone);
    if (!validatePhone(engPhone)) newErrors.phone = 'شماره موبایل معتبر نیست';
    if (team.some(m => m.phone === engPhone && m.id !== editingId)) newErrors.phone = 'این شماره قبلاً ثبت شده';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setModalStep(2);
  };

  const toggleService = (id) => setSelectedServices(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const saveMember = () => {
    const memberData = { id: editingId || `team_${Date.now()}`, name: name.trim(), phone: toEnglishDigits(phone), services: selectedServices };
    onChange?.(editingId ? team.map(m => m.id === editingId ? memberData : m) : [...team, memberData]);
    closeModal();
  };

  const handleDelete = (member) => {
    Alert.alert('حذف کارمند', `آیا از حذف "${member.name}" مطمئن هستید؟`, [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => onChange?.(team.filter(m => m.id !== member.id)) },
    ]);
  };

  // 🎨 رندر لیست اعضای تیم
  const renderTeamList = () => {
    if (team.length === 0) {
      return (
        <Card variant="default" padding={0} radius={16} style={s.emptyCard}>
          <EmptyState icon="👥" title="هنوز کارمندی اضافه نکرده‌اید" description="با افزودن اعضای تیم، می‌توانید خدمات را به هر کارمند اختصاص دهید" actionLabel="افزودن اولین کارمند" onAction={openAddModal} />
        </Card>
      );
    }

    return (
      <View style={s.teamList}>
        {team.map(member => (
          <Card key={member.id} variant="default" padding={16} radius={16}>
            <View style={s.memberRow}>
              <Avatar name={member.name} size="md" showBorder />
              <View style={s.memberInfo}>
                <Text style={[s.memberName, { color: colors.textMain }]} numberOfLines={1}>{member.name}</Text>
                <View style={s.phoneRow}>
                  <Icon name="phone" size={14} color={colors.textSecondary} />
                  <Text style={[s.memberPhone, { color: colors.textSecondary }]}>{member.phone}</Text>
                </View>
              </View>
              <View style={s.memberActions}>
                <Button title="" onPress={() => openEditModal(member)} variant="ghost" size="sm" icon={<Icon name="edit" size={20} color={colors.primary} />} />
                <Button title="" onPress={() => handleDelete(member)} variant="ghost" size="sm" icon={<Icon name="delete-outline" size={22} color="#E57373" />} />
              </View>
            </View>
            <Divider spacing={12} />
            <View style={s.servicesRow}>
              <View style={s.servicesLabelRow}>
                <Icon name="spa" size={14} color={colors.textSecondary} />
                <Text style={[s.servicesLabel, { color: colors.textSecondary }]}>خدمات ارائه‌شده:</Text>
              </View>
              {member.services?.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsContainer}>
                  {member.services.map(sId => (
                    <Chip key={sId} label={services.find(sv => sv.id === sId)?.name || 'خدمت'} selected />
                  ))}
                </ScrollView>
              ) : (
                <Text style={[s.noServiceText, { color: colors.textSecondary }]}>هنوز خدمتی اختصاص داده نشده</Text>
              )}
            </View>
          </Card>
        ))}
      </View>
    );
  };

  // 🎨 رندر محتوای مدال (مراحل)
  const renderModalContent = () => (
    <ScrollView style={s.modalContent} contentContainerStyle={s.modalContentInner} showsVerticalScrollIndicator={false}>
      {/* Step Indicator ساده‌شده */}
      <View style={s.stepIndicator}>
        {['اطلاعات', 'خدمات'].map((label, i) => (
          <React.Fragment key={i}>
            <View style={s.stepLabel}>
              <View style={[s.stepDot, { backgroundColor: modalStep >= i + 1 ? colors.primary : colors.border }]} />
              <Text style={[s.stepLabelText, { color: modalStep >= i + 1 ? colors.primary : colors.textSecondary }]}>{label}</Text>
            </View>
            {i < 1 && <View style={[s.stepLine, { backgroundColor: modalStep >= i + 2 ? colors.primary : colors.border }]} />}
          </React.Fragment>
        ))}
      </View>

      {modalStep === 1 ? (
        <>
          <Text style={[s.stepTitle, { color: colors.textMain }]}>اطلاعات کارمند</Text>
          <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>نام و شماره تماس کارمند جدید را وارد کنید</Text>
          <Input label="نام و نام خانوادگی" placeholder="مثال: سارا احمدی" value={name} onChangeText={setName} error={errors.name} rightIcon={<Icon name="person" size={22} color={colors.textSecondary} />} />
          <Input label="شماره موبایل" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={phone} onChangeText={t => setPhone(toEnglishDigits(t).replace(/[^0-9]/g, '').slice(0, 11))} keyboardType="phone-pad" maxLength={11} error={errors.phone} rightIcon={<Icon name="smartphone" size={22} color={colors.textSecondary} />} />
        </>
      ) : (
        <>
          <Text style={[s.stepTitle, { color: colors.textMain }]}>خدمات ارائه‌شده</Text>
          <Text style={[s.stepSubtitle, { color: colors.textSecondary }]}>مشخص کنید این کارمند چه خدماتی را انجام می‌دهد</Text>
          {services.filter(sv => sv.isActive !== false).length > 0 ? (
            <View style={s.servicesList}>
              {services.filter(sv => sv.isActive !== false).map(service => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <Card key={service.id} variant="default" padding={14} radius={14} onPress={() => toggleService(service.id)} style={[s.serviceOption, { borderColor: isSelected ? colors.primary : colors.border, backgroundColor: isSelected ? colors.primary + '10' : colors.cardBackground }]}>
                    <View style={s.serviceOptionMain}>
                      <Icon name={isSelected ? 'check-circle' : 'radio-button-unchecked'} size={24} color={isSelected ? colors.primary : colors.textSecondary} />
                      <View style={s.serviceOptionInfo}>
                        <Text style={[s.serviceOptionName, { color: colors.textMain }]}>{service.name}</Text>
                        <Text style={[s.serviceOptionMeta, { color: colors.textSecondary }]}>{service.finalPrice?.toLocaleString('fa-IR')} تومان · {service.duration} دقیقه</Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          ) : (
            <Card variant="default" padding={0} radius={16}>
              <EmptyState icon="⚠️" title="ابتدا خدمات را ثبت کنید" description="برای اختصاص خدمات به کارمندان، ابتدا باید خدمات سالن را در مرحله قبل تعریف کنید" />
            </Card>
          )}
        </>
      )}
    </ScrollView>
  );

  // 🎨 رندر فوتر مدال (دکمه‌های فیکس در پایین)
  const renderModalFooter = () => (
    modalStep === 1 ? (
      <Button title="مرحله بعد" onPress={goToNextStep} variant="primary" size="lg" fullWidth disabled={!name || !phone} icon={<Icon name="arrow-back" size={20} color="#fff" />} iconPosition="left" />
    ) : (
      <View style={s.footerRow}>
        <Button title="قبلی" onPress={() => setModalStep(1)} variant="outline" size="lg" style={s.halfButton} />
        <Button title={editingId ? 'ذخیره تغییرات' : 'افزودن کارمند'} onPress={saveMember} variant="primary" size="lg" style={s.halfButton} icon={<Icon name="check" size={20} color="#fff" />} iconPosition="right" />
      </View>
    )
  );

  return (
    <View style={s.container}>
      <View style={s.sectionHeader}>
        <View style={s.titleRow}>
          <Icon name="people" size={22} color={colors.primary} />
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>اعضای تیم</Text>
        </View>
        <Text style={[s.countText, { color: colors.textSecondary }]}>{team.length} کارمند</Text>
      </View>

      {renderTeamList()}

      <Button title="افزودن کارمند جدید" onPress={openAddModal} variant="outline" size="lg" fullWidth icon={<Icon name="person-add" size={20} color={colors.primary} />} iconPosition="right" style={s.addButton} />

      {/* ✅ استفاده از BottomSheet به جای Modal */}
      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'ویرایش کارمند' : 'افزودن کارمند جدید'}
        snapPoint={0.8} // 🎯 مدال ۸۰٪ صفحه را می‌پوشاند
        footer={renderModalFooter()} // 🎯 دکمه‌ها فیکس در پایین
      >
        {renderModalContent()}
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  countText: { fontSize: 13, fontFamily: 'Vazir' },
  teamList: { gap: 12, marginBottom: 16 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  memberInfo: { flex: 1, alignItems: 'flex-start', gap: 4 },
  memberName: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memberPhone: { fontSize: 13, fontFamily: 'Vazir' },
  memberActions: { flexDirection: 'row', gap: 4 },
  servicesRow: { gap: 8 },
  servicesLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  servicesLabel: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  chipsContainer: { flexDirection: 'row', gap: 6 },
  noServiceText: { fontSize: 12, fontFamily: 'Vazir' },
  emptyCard: { marginBottom: 16 },
  addButton: { marginTop: 4 },
  modalContent: { flex: '1' },
  modalContentInner: { paddingBottom: 20 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 40, gap: 8 },
  stepLabel: { alignItems: 'center', gap: 4 },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { flex: 1, height: 2 },
  stepLabelText: { fontSize: 11, fontFamily: 'Vazir-Medium' },
  stepTitle: { fontSize: 18, fontFamily: 'Vazir-Bold', marginBottom: 6, textAlign: 'right' },
  stepSubtitle: { fontSize: 13, fontFamily: 'Vazir', marginBottom: 24, textAlign: 'right', lineHeight: 20 },
  servicesList: { gap: 10 },
  serviceOption: { borderWidth: 1.5 },
  serviceOptionMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceOptionInfo: { flex: 1, alignItems: 'flex-start', gap: 2 },
  serviceOptionName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  serviceOptionMeta: { fontSize: 12, fontFamily: 'Vazir' },
  footerRow: { flexDirection: 'row', gap: 10 },
  halfButton: { flex: 1 },
});