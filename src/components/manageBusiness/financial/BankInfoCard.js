// کارت نمایش و مدیریت اطلاعات بانکی
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Card from '../../common/Card';
import { useTheme } from '../../../theme/ThemeContext';

export default function BankInfoCard({ bankInfo, onEdit, hasActiveAppointments }) {
  const { colors } = useTheme();

  const hasInfo = bankInfo.isRegistered;

  const handleCopy = (value, label) => {
    Clipboard.setString(value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    Alert.alert('کپی شد', `${label} با موفقیت کپی شد`);
  };

  const callBankSupport = () => {
    Alert.alert(
      'تماس با پشتیبانی',
      'برای تایید اطلاعات بانکی می‌توانید با پشتیبانی تماس بگیرید',
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'تماس', onPress: () => Linking.openURL('tel:02191001234') },
      ]
    );
  };

  return (
    <View style={s.wrapper}>
      {/* عنوان بخش */}
      <View style={s.sectionHeader}>
        <Icon name="account-balance" size={20} color={colors.primary} />
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>
          حساب بانکی تسویه
        </Text>
      </View>

      {/* هشدار مهم - همیشه نمایش */}
      <Card
        variant="default"
        padding={12}
        radius={12}
        style={[s.ruleCard, { borderColor: '#FF980040', backgroundColor: '#FF98000A' }]}
      >
        <View style={s.ruleRow}>
          <Icon name="priority-high" size={22} color="#FF9800" />
          <View style={s.ruleTextCol}>
            <Text style={[s.ruleTitle, { color: '#FF9800' }]}>
              قانون مهم تسویه
            </Text>
            <Text style={[s.ruleText, { color: colors.textSecondary }]}>
              تمامی بیعانه‌ها به‌صورت خودکار ظرف{' '}
              <Text style={s.bold}>۴۸ ساعت</Text> پس از انجام خدمت و تایید کسب‌وکار به این حساب واریز می‌شوند
            </Text>
          </View>
        </View>
      </Card>

      {/* کارت اصلی حساب */}
      {hasInfo ? (
        <Card
          variant="elevated"
          padding={16}
          radius={18}
          style={s.bankCard}
        >
          {/* هدر - صاحب حساب + وضعیت */}
          <View style={s.ownerRow}>
            <View style={s.ownerLeft}>
              <View style={[s.avatarBox, { backgroundColor: '#2196F318' }]}>
                <Icon name="person" size={26} color="#2196F3" />
              </View>
              <View style={s.ownerText}>
                <Text style={[s.ownerLabel, { color: colors.textSecondary }]}>
                  صاحب حساب
                </Text>
                <Text style={[s.ownerName, { color: colors.textMain }]}>
                  {bankInfo.ownerName}
                </Text>
              </View>
            </View>

            {bankInfo.isVerified ? (
              <View style={[s.statusPill, { backgroundColor: '#43A04715' }]}>
                <Icon name="verified" size={13} color="#43A047" />
                <Text style={[s.statusText, { color: '#43A047' }]}>تایید شده</Text>
              </View>
            ) : (
              <View style={[s.statusPill, { backgroundColor: '#FF980015' }]}>
                <Icon name="hourglass-empty" size={13} color="#FF9800" />
                <Text style={[s.statusText, { color: '#FF9800' }]}>در حال تایید</Text>
              </View>
            )}
          </View>

          {/* نام بانک */}
          <View style={[s.bankNameRow, { backgroundColor: colors.background }]}>
            <Icon name="store" size={18} color={colors.primary} />
            <Text style={[s.bankNameText, { color: colors.textMain }]}>
              {bankInfo.bankName}
            </Text>
          </View>

          {/* ردیف‌های اطلاعات */}
          <View style={s.infoList}>
            {/* شماره شبا */}
            <TouchableOpacity
              style={s.infoRow}
              onPress={() => handleCopy(bankInfo.sheba, 'شماره شبا')}
              activeOpacity={0.65}
            >
              <View style={s.infoLabelRow}>
                <Icon name="tag" size={15} color={colors.primary} />
                <Text style={[s.infoLabel, { color: colors.textSecondary }]}>شماره شبا</Text>
              </View>
              <View style={s.infoValueRow}>
                <Text style={[s.infoValue, { color: colors.textMain }]} numberOfLines={1}>
                  {bankInfo.sheba}
                </Text>
                <Icon name="content-copy" size={15} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <View style={[s.divider, { backgroundColor: colors.border }]} />

            {/* شماره کارت */}
            <TouchableOpacity
              style={s.infoRow}
              onPress={() => handleCopy(bankInfo.cardNumber, 'شماره کارت')}
              activeOpacity={0.65}
            >
              <View style={s.infoLabelRow}>
                <Icon name="credit-card" size={15} color={colors.primary} />
                <Text style={[s.infoLabel, { color: colors.textSecondary }]}>شماره کارت</Text>
              </View>
              <View style={s.infoValueRow}>
                <Text style={[s.infoValue, { color: colors.textMain, fontFamily: 'Vazir-Bold' }]} numberOfLines={1}>
                  {bankInfo.cardNumber}
                </Text>
                <Icon name="content-copy" size={15} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            {bankInfo.accountNumber && (
              <>
                <View style={[s.divider, { backgroundColor: colors.border }]} />
                <TouchableOpacity
                  style={s.infoRow}
                  onPress={() => handleCopy(bankInfo.accountNumber, 'شماره حساب')}
                  activeOpacity={0.65}
                >
                  <View style={s.infoLabelRow}>
                    <Icon name="badge" size={15} color={colors.primary} />
                    <Text style={[s.infoLabel, { color: colors.textSecondary }]}>شماره حساب</Text>
                  </View>
                  <View style={s.infoValueRow}>
                    <Text style={[s.infoValue, { color: colors.textMain }]} numberOfLines={1}>
                      {bankInfo.accountNumber}
                    </Text>
                    <Icon name="content-copy" size={15} color={colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* وضعیت تایید */}
          {!bankInfo.isVerified && (
            <View
              style={[
                s.verifyHint,
                {
                  backgroundColor: '#FF980010',
                  borderColor: '#FF980035',
                },
              ]}
            >
              <Icon name="info-outline" size={15} color="#FF9800" />
              <Text style={[s.verifyHintText, { color: '#FF9800' }]}>
                اطلاعات بانکی شما توسط کارشناسان در حال بررسی است. تا تایید نهایی، تسویه حساب انجام نخواهد شد.
              </Text>
            </View>
          )}

          {bankInfo.isVerified && (
            <View
              style={[
                s.verifyHint,
                {
                  backgroundColor: '#43A04710',
                  borderColor: '#43A04735',
                },
              ]}
            >
              <Icon name="check-circle" size={15} color="#43A047" />
              <Text style={[s.verifyHintText, { color: '#43A047' }]}>
                حساب تایید شده است • تسویه‌های شما از امروز انجام خواهند شد
              </Text>
            </View>
          )}

          {/* دکمه‌های اقدام */}
          <View style={s.actionRow}>
            <TouchableOpacity
              style={[s.actionBtn, { borderColor: colors.primary, flex: 1 }]}
              onPress={onEdit}
              activeOpacity={0.85}
            >
              <Icon name="edit" size={15} color={colors.primary} />
              <Text style={[s.actionBtnText, { color: colors.primary }]}>
                ویرایش اطلاعات
              </Text>
            </TouchableOpacity>
            {!bankInfo.isVerified && (
              <TouchableOpacity
                style={[s.actionBtn, { borderColor: '#2196F3', backgroundColor: '#2196F315' }]}
                onPress={callBankSupport}
                activeOpacity={0.85}
              >
                <Icon name="phone" size={15} color="#2196F3" />
                <Text style={[s.actionBtnText, { color: '#2196F3' }]}>
                  تماس پشتیبانی
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      ) : (
        /* وضعیت خالی - هنوز حساب ثبت نشده */
        <Card
          variant="default"
          padding={0}
          radius={18}
          style={[
            s.emptyCard,
            { borderColor: colors.primary + '50', borderStyle: 'dashed', borderWidth: 2 },
          ]}
        >
          <View style={s.emptyContent}>
            <View style={[s.emptyIconBox, { backgroundColor: colors.primary + '18' }]}>
              <Icon name="account-balance-wallet" size={38} color={colors.primary} />
            </View>
            <Text style={[s.emptyTitle, { color: colors.textMain }]}>
              هنوز حساب بانکی ثبت نکرده‌اید
            </Text>
            <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>
              برای دریافت تسویه‌های خودکار، ابتدا شماره شبا و کارت خود را وارد کنید. حساب حتماً باید به نام صاحب کسب‌وکار (تطبیق با احراز هویت) باشد.
            </Text>
            <TouchableOpacity
              style={[s.emptyBtn, { backgroundColor: colors.primary }]}
              onPress={onEdit}
              activeOpacity={0.9}
            >
              <Icon name="add" size={18} color="#fff" />
              <Text style={s.emptyBtnText}>ثبت حساب بانکی</Text>
              <Icon name="chevron-left" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* راهنما - چطور کار می‌کند؟ */}
      <Card variant="default" padding={14} radius={14} style={s.guideCard}>
        <View style={s.guideHeader}>
          <Icon name="help" size={18} color={colors.primary} />
          <Text style={[s.guideTitle, { color: colors.textMain }]}>
            فرآیند تسویه حساب چگونه کار می‌کند؟
          </Text>
        </View>
        <View style={s.guideList}>
          {[
            { icon: '1-circle-outline', text: 'مشتری بیعانه را هنگام رزرو پرداخت می‌کند', active: true },
            { icon: '2-circle-outline', text: 'پول نزد زیبانو تا انجام خدمت نگه‌داری می‌شود', active: true },
            { icon: '3-circle-outline', text: 'شما کد تایید مشتری را وارد می‌کنید و خدمت تایید می‌شود', active: true },
            { icon: 'schedule', text: 'پس از ۴۸ ساعت، بیعانه به حساب بانکی شما واریز می‌شود', active: false, color: '#43A047' },
          ].map((item, i) => (
            <View key={i} style={s.guideItem}>
              <Icon name={item.icon} size={18} color={item.color || colors.primary} />
              <Text style={[s.guideItemText, { color: colors.textSecondary, fontFamily: item.color ? 'Vazir-Bold' : 'Vazir' }]}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontFamily: 'Vazir-Bold',
  },
  ruleCard: {
    borderWidth: 1,
    marginBottom: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ruleTextCol: {
    flex: 1,
    gap: 3,
  },
  ruleTitle: {
    fontSize: 12.5,
    fontFamily: 'Vazir-Bold',
  },
  ruleText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
  bold: {
    fontFamily: 'Vazir-Bold',
  },
  bankCard: {
    shadowColor: '#A88B7D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ownerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerText: {
    flex: 1,
    gap: 2,
  },
  ownerLabel: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  ownerName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  bankNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  bankNameText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  infoList: {
    marginBottom: 12,
  },
  infoRow: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1.8,
    justifyContent: 'flex-end',
  },
  infoValue: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    letterSpacing: 0.5,
    textAlign: 'left',
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  verifyHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  verifyHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.2,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  emptyCard: {
    paddingVertical: 16,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 14,
    shadowColor: '#A88B7D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 220,
    justifyContent: 'center',
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 13.5,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
  guideCard: {
    borderWidth: 1,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 12.5,
    fontFamily: 'Vazir-Bold',
  },
  guideList: {
    gap: 8,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  guideItemText: {
    fontSize: 11,
    lineHeight: 18,
    flex: 1,
  },
});