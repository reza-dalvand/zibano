// src/screens/profile/EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || '';
  return phone.slice(0, 4) + '***' + phone.slice(-4);
};

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'مریم حسینی',
    avatarUrl: user?.avatar || 'https://i.pravatar.cc/150?img=5',
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickAvatar = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && result.assets) {
      updateField('avatarUrl', result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('خطا', 'نام نمی‌تواند خالی باشد');
      return;
    }
    Alert.alert('موفقیت', 'اطلاعات پروفایل با موفقیت بروزرسانی شد', [
      { text: 'باشه', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']} keyboardAware>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.avatarSection}>
          <TouchableOpacity onPress={pickAvatar} style={s.avatarWrapper}>
            <Avatar uri={formData.avatarUrl} name={formData.name} size="xl" showBorder />
            <View style={[s.editAvatarBadge, { backgroundColor: colors.primary }]}>
              <Icon name="camera-alt" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[s.avatarHint, { color: colors.textSecondary }]}>
            برای تغییر عکس پروفایل، روی آن تپ کنید
          </Text>
        </View>

        <Card variant="elevated" padding={16} radius={16} style={s.formCard}>
          <Input
            label="نام و نام خانوادگی"
            placeholder="مثال: مریم حسینی"
            value={formData.name}
            onChangeText={(t) => updateField('name', t)}
            rightIcon={<Icon name="person" size={22} color={colors.textSecondary} />}
          />

          <View style={s.phoneSection}>
            <Text style={[s.phoneLabel, { color: colors.textSecondary }]}>شماره موبایل</Text>
            <View
              style={[
                s.phoneBox,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <View style={s.phoneInfo}>
                <Icon name="smartphone" size={18} color={colors.primary} />
                <Text style={[s.phoneValue, { color: colors.textMain }]}>
                  {toPersianDigit(maskPhone(user?.phone))}
                </Text>
                <View style={[s.verifiedBadge, { backgroundColor: '#43A04720' }]}>
                  <Icon name="verified" size={10} color="#43A047" />
                  <Text style={[s.verifiedText, { color: '#43A047' }]}>تایید شده</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[s.changePhoneBtn, { borderColor: colors.primary }]}
                onPress={() => navigation.navigate('ChangePhone')}
              >
                <Text style={[s.changePhoneText, { color: colors.primary }]}>تغییر</Text>
              </TouchableOpacity>
            </View>
            <Text style={[s.phoneHint, { color: colors.textSecondary }]}>
              برای تغییر شماره، کد تایید مجدد (OTP) ارسال خواهد شد
            </Text>
          </View>
        </Card>

        <Button
          title="ذخیره تغییرات"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Icon name="check" size={20} color="#fff" />}
          iconPosition="right"
          style={s.saveBtn}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: 24, gap: 8 },
  avatarWrapper: { position: 'relative' },
  editAvatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  avatarHint: { fontSize: 12, fontFamily: 'Vazir' },
  formCard: { marginBottom: 20 },
  phoneSection: { marginBottom: 16, gap: 6 },
  phoneLabel: { fontSize: 13, fontFamily: 'Vazir-Medium', textAlign: 'right' },
  phoneBox: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 12, borderRadius: 12, borderWidth: 1,
  },
  phoneInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  phoneValue: { fontSize: 15, fontFamily: 'Vazir-Bold', flex: 1 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  verifiedText: { fontSize: 10, fontFamily: 'Vazir-Bold' },
  changePhoneBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  changePhoneText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  phoneHint: { fontSize: 11, fontFamily: 'Vazir', textAlign: 'right' },
  saveBtn: { marginTop: 8 },
});