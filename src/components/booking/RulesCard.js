// src/components/booking/RulesCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RulesCard({ colors }) {
  const rules = [
    {
      icon: 'block',
      iconColor: '#FF9800',
      iconBg: '#FF980018',
      title: 'بیعانه غیرقابل استرداد',
      description:
        'پس از رزرو و پرداخت بیعانه، این مبلغ به عنوان تأیید نوبت شما نزد زیبانو نگهداری می‌شود و در صورت عدم حضور، مسترد نخواهد شد.',
    },
    {
      icon: 'undo',
      iconColor: '#43A047',
      iconBg: '#43A04718',
      title: 'لغو توسط سالن',
      description:
        'در صورتی که سالن نوبت شما را لغو کند، کل بیعانه به همراه ۱۰٪ غرامت تاخیر، ظرف ۲۴ ساعت به حساب شما واریز می‌شود.',
    },
    {
      icon: 'schedule',
      iconColor: '#2196F3',
      iconBg: '#2196F318',
      title: 'لغو توسط مشتری',
      description:
        'شما می‌توانید تا ۲ ساعت قبل از زمان نوبت، آن را لغو کنید. در این صورت ۳۰٪ از بیعانه به عنوان جریمه کسر و مابقی مسترد می‌شود.',
    },
    {
      icon: 'verified-user',
      iconColor: '#9C27B0',
      iconBg: '#9C27B018',
      title: 'کد تایید خدمت',
      description:
        'پس از رزرو، یک کد ۴ رقمی برای شما صادر می‌شود. این کد را حتماً پس از انجام خدمت به سالن‌دار ارائه دهید تا بیعانه آزاد شود.',
    },
  ];

  return (
    <View style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      {/* هدر */}
      <View style={s.header}>
        <View style={[s.iconBox, { backgroundColor: '#9C27B015' }]}>
          <Icon name="gavel" size={20} color="#9C27B0" />
        </View>
        <Text style={[s.title, { color: colors.textMain }]}>
          قوانین و مقررات رزرو
        </Text>
      </View>

      {/* لیست قوانین */}
      <View style={s.rulesList}>
        {rules.map((rule, index) => (
          <View
            key={index}
            style={[
              s.ruleItem,
              index < rules.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border },
            ]}
          >
            <View style={[s.ruleIconBox, { backgroundColor: rule.iconBg }]}>
              <Icon name={rule.icon} size={18} color={rule.iconColor} />
            </View>
            <View style={s.ruleTextCol}>
              <Text style={[s.ruleTitle, { color: colors.textMain }]}>
                {rule.title}
              </Text>
              <Text style={[s.ruleDescription, { color: colors.textSecondary }]}>
                {rule.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* نکته امنیتی */}
      <View style={[s.securityBox, { backgroundColor: '#43A04710', borderColor: '#43A04730' }]}>
        <Icon name="shield" size={16} color="#43A047" />
        <Text style={[s.securityText, { color: '#43A047' }]}>
          پرداخت شما از طریق درگاه امن بانکی و با رمزنگاری SSL انجام می‌شود
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  rulesList: {
    gap: 0,
  },
  ruleItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  ruleIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  ruleTextCol: {
    flex: 1,
    gap: 3,
  },
  ruleTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  ruleDescription: {
    fontSize: 11.5,
    fontFamily: 'Vazir',
    lineHeight: 19,
    textAlign: 'justify',
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  securityText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});