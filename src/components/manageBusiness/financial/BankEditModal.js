// مدال وارد کردن/ویرایش اطلاعات بانکی
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Card from '../../common/Card';

export default function BankEditModal({ visible, onClose, onSave, bankInfo, businessOwnerName }) {
  const { colors } = useTheme();
  const [form, setForm] = useState({
    ownerName: bankInfo.ownerName || businessOwnerName || '',
    nationalId: bankInfo.nationalId || '',
    sheba: bankInfo.sheba || '',
    cardNumber: bankInfo.cardNumber || '',
    accountNumber: bankInfo.accountNumber || '',
    bankName: bankInfo.bankName || '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const toEn = s =>
    String(s)
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  // اعتبارسنجی
  const validate = () => {
    const e = {};
    const enNational = toEn(form.nationalId).replace(/[^0-9]/g, '');
    if (enNational.length !== 10) {
      e.nationalId = 'کد ملی باید ۱۰ رقم باشد';
    }

    const enSheba = toEn(form.sheba);
    const cleanedSheba = enSheba.replace(/IR|ir/gi, '').replace(/[^0-9]/g, '');
    if (cleanedSheba.length !== 24) {
      e.sheba = 'شماره شبا باید ۲۴ رقم بعد از IR باشد';
    }
    if (!enSheba.trim().toUpperCase().startsWith('IR')) {
      e.sheba = 'شماره شبا باید با IR شروع شود';
    }

    const enCard = toEn(form.cardNumber).replace(/[^0-9]/g, '');
    if (enCard.length !== 16) {
      e.cardNumber = 'شماره کارت باید ۱۶ رقم باشد';
    }

    if (!form.ownerName.trim() || form.ownerName.trim().length < 3) {
      e.ownerName = 'نام کامل صاحب حساب الزامی است';
    }
    if (!form.bankName.trim()) {
      e.bankName = 'نام بانک الزامی است';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    Alert.alert(
      '⚠️ تایید صحت اطلاعات',
      `توجه بسیار مهم:\n\n• صاحب حساب: ${form.ownerName}\n\nاین نام باید دقیقاً با نام صاحب کسب‌وکار که در احراز هویت ثبت شده مطابقت داشته باشد. در صورت عدم تطابق، حساب تایید نخواهد شد.\n\nپس از ثبت، حساب وارد مرحله تایید کارشناسان می‌شود (۲۴ تا ۴۸ ساعت).`,
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'ثبت نهایی', onPress: () => onSave(form) },
      ],
    );
  };

  const closeAndReset = () => {
    setForm({
      ownerName: bankInfo.ownerName || businessOwnerName || '',
      nationalId: bankInfo.nationalId || '',
      sheba: bankInfo.sheba || '',
      cardNumber: bankInfo.cardNumber || '',
      accountNumber: bankInfo.accountNumber || '',
      bankName: bankInfo.bankName || '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeAndReset}
      statusBarTranslucent
    >
      <View style={modalS.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={modalS.avoider}
        >
          <View
            style={[
              modalS.modal,
              {
                backgroundColor: colors.cardBackground,
                borderTopColor: colors.border,
              },
            ]}
          >
            {/* Handle bar */}
            <View style={modalS.handleArea}>
              <View style={[modalS.handle, { backgroundColor: colors.border }]} />
            </View>

            {/* هدر */}
            <View style={modalS.header}>
              <View style={modalS.headerInfo}>
                <View style={[modalS.iconBox, { backgroundColor: colors.primary + '18' }]}>
                  <Icon name="account-balance" size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[modalS.title, { color: colors.textMain }]}>
                    ثبت حساب بانکی تسویه
                  </Text>
                  <Text style={[modalS.subtitle, { color: colors.textSecondary }]}>
                    حساب باید حتماً به نام شما (صاحب کسب‌وکار) باشد
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[modalS.closeBtn, { backgroundColor: colors.background }]}
                onPress={closeAndReset}
              >
                <Icon name="close" size={22} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={modalS.body}
              keyboardShouldPersistTaps="handled"
            >
              {/* هشدار مهم */}
              <Card
                variant="default"
                padding={12}
                radius={12}
                style={[
                  modalS.warningBox,
                  {
                    backgroundColor: '#E5393510',
                    borderColor: '#E5393530',
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Icon name="priority-high" size={22} color="#E53935" />
                <Text style={[modalS.warningText, { color: '#E53935' }]}>
                  صاحب حساب باید حتماً همان شخصی باشد که کد ملی‌اش در مرحله ثبت کسب‌وکار تایید شده است.
                </Text>
              </Card>

              {/* کارت راهنمای سریع */}
              <Card
                variant="default"
                padding={12}
                radius={12}
                style={[
                  modalS.hintBox,
                  {
                    backgroundColor: '#FFC1070A',
                    borderColor: '#FFC10735',
                    borderWidth: 1,
                  },
                ]}
              >
                <Icon name="lightbulb" size={20} color="#FFC107" />
                <Text style={[modalS.hintTitle, { color: colors.textMain }]}>
                  برای سریع‌تر تایید شدن حساب
                </Text>
                <Text style={[modalS.hintText, { color: colors.textSecondary }]}>
                  شماره شبایی وارد کنید که صاحب حساب همان صاحب کسب‌وکار (تایید شده با کد ملی) است
                </Text>
              </Card>

              {/* صاحب حساب */}
              <Text style={[modalS.fieldSection, { color: colors.primary }]}>
                صاحب حساب
              </Text>
              <Input
                label="نام و نام خانوادگی کامل"
                placeholder="نام صاحب حساب"
                value={form.ownerName}
                onChangeText={v => updateField('ownerName', v)}
                error={errors.ownerName}
                hint={businessOwnerName ? `نام تایید شده احراز هویت: ${businessOwnerName}` : undefined}
                rightIcon={<Icon name="person" size={20} color={colors.textSecondary} />}
              />
              <Input
                label="کد ملی صاحب حساب *"
                placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸۹"
                value={form.nationalId}
                onChangeText={v => updateField('nationalId', v)}
                keyboardType="numeric"
                maxLength={10}
                error={errors.nationalId}
                hint="باید با کد ملی ثبت شده در احراز هویت یکسان باشد"
                rightIcon={<Icon name="badge" size={20} color={colors.textSecondary} />}
              />

              {/* اطلاعات بانکی */}
              <Text style={[modalS.fieldSection, { color: colors.primary, marginTop: 8 }]}>
                اطلاعات بانکی
              </Text>

              <Input
                label="نام بانک *"
                placeholder="مثال: بانک ملی ایران"
                value={form.bankName}
                onChangeText={v => updateField('bankName', v)}
                error={errors.bankName}
                rightIcon={<Icon name="store" size={20} color={colors.textSecondary} />}
              />
              <Input
                label="شماره شبا *"
                placeholder="IR010550000000101550500550555555555"
                value={form.sheba}
                onChangeText={v => updateField('sheba', v)}
                error={errors.sheba}
                autoCapitalize="characters"
                hint="تسویه حساب‌های اصلی از طریق شماره شبا انجام می‌شود"
                rightIcon={<Icon name="tag" size={20} color={colors.textSecondary} />}
              />
              <Input
                label="شماره کارت *"
                placeholder="مثال: ۶۰۳۷ ۹۹۱۸ ۱۲۳۴ ۵۶۷۸"
                value={form.cardNumber}
                onChangeText={v => updateField('cardNumber', v)}
                keyboardType="numeric"
                maxLength={16}
                error={errors.cardNumber}
                hint="برای تشخیص حساب در گزارشات استفاده می‌شود"
                rightIcon={<Icon name="credit-card" size={20} color={colors.textSecondary} />}
              />
              <Input
                label="شماره حساب (اختیاری)"
                placeholder="در صورت داشتن وارد کنید"
                value={form.accountNumber}
                onChangeText={v => updateField('accountNumber', v)}
                keyboardType="numeric"
                rightIcon={<Icon name="account-circle" size={20} color={colors.textSecondary} />}
              />

              {/* نکات */}
              <View style={modalS.notesCard}>
                <Text style={[modalS.notesTitle, { color: colors.textMain }]}>
                  نکات مهم:
                </Text>
                {[
                  'تایید اطلاعات توسط کارشناسان حدود ۲۴ تا ۴۸ ساعت زمان می‌برد',
                  'پس از تایید، تمامی بیعانه‌ها ظرف ۴۸ ساعت بعد از انجام خدمت واریز می‌شوند',
                  'تغییر حساب بعداً هم ممکن است اما مجدداً وارد چرخه تایید خواهد شد',
                  'تعداد دفعات تغییر اطلاعات بانکی محدود است',
                ].map((note, i) => (
                  <View key={i} style={modalS.noteRow}>
                    <Icon name="info-outline" size={13} color={colors.textSecondary} />
                    <Text style={[modalS.noteText, { color: colors.textSecondary }]}>
                      {note}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ height: 24 }} />
            </ScrollView>

            {/* فوتر - دکمه‌ها */}
            <View style={[modalS.footer, { borderTopColor: colors.border, backgroundColor: colors.cardBackground }]}>
              <View style={modalS.btnRow}>
                <Button
                  title="انصراف"
                  onPress={closeAndReset}
                  variant="outline"
                  size="lg"
                  style={modalS.btnHalf}
                />
                <Button
                  title="ثبت اطلاعات حساب"
                  onPress={handleSubmit}
                  variant="primary"
                  size="lg"
                  icon={<Icon name="save" size={18} color="#fff" />}
                  iconPosition="right"
                  style={modalS.btnHalf}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const modalS = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  avoider: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '92%',
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    fontSize: 10.5,
    fontFamily: 'Vazir',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 4,
    gap: 4,
  },
  warningBox: {
    marginBottom: 6,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 18,
    marginLeft: 6,
  },
  hintBox: {
    marginBottom: 6,
  },
  hintTitle: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    marginBottom: 3,
    flex: 1,
    marginLeft: 6,
  },
  hintText: {
    fontSize: 10,
    fontFamily: 'Vazir',
    lineHeight: 17,
    flex: 1,
    marginLeft: 6,
  },
  fieldSection: {
    fontSize: 12.5,
    fontFamily: 'Vazir-Bold',
    marginTop: 4,
    marginBottom: 4,
  },
  notesCard: {
    marginTop: 12,
    paddingVertical: 4,
    gap: 8,
  },
  notesTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginBottom: 6,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  noteText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnHalf: {
    flex: 1,
  },
});