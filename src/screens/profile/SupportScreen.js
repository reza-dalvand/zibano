// src/screens/profile/SupportScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Alert, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import BottomSheet from '../../components/common/BottomSheet';

const FAQ_ITEMS = [
  {
    id: 1, q: 'چگونه نوبت رزرو کنم؟',
    a: 'ابتدا کسب‌وکار مورد نظر خود را انتخاب کنید، سپس خدمت، کارمند، تاریخ و ساعت مورد نظر را مشخص کرده و در صورت نیاز بیعانه را پرداخت کنید. نوبت شما به صورت خودکار تایید می‌شود.',
  },
  {
    id: 2, q: 'آیا امکان لغو نوبت وجود دارد؟',
    a: 'بله، شما می‌توانید تا ۲ ساعت قبل از زمان نوبت، آن را لغو کنید. در صورتی که بیعانه پرداخت کرده باشید، درصدی به عنوان جریمه لغو کسر شده و مابقی به حساب شما واریز می‌شود.',
  },
  {
    id: 3, q: 'مبلغ بیعانه چگونه محاسبه می‌شود؟',
    a: 'مبلغ بیعانه توسط هر کسب‌وکار به صورت جداگانه تعیین می‌شود و معمولاً بین ۲۰ تا ۴۰ درصد مبلغ کل خدمت است. این مبلغ در زمان رزرو از شما دریافت می‌شود.',
  },
  {
    id: 4, q: 'چگونه می‌توانم کسب‌وکار خود را ثبت کنم؟',
    a: 'از تب "ثبت سالن" در اپلیکیشن استفاده کنید. مراحل ثبت شامل اطلاعات پایه، خدمات، اعضای تیم و احراز هویت با کد ملی است. پس از تایید توسط کارشناسان، کسب‌وکار شما فعال می‌شود.',
  },
  {
    id: 5, q: 'آیا اطلاعات من امن است؟',
    a: 'بله، تمامی اطلاعات شما به صورت رمزنگاری شده ذخیره می‌شود و فقط برای ارائه خدمات بهتر استفاده خواهد شد. کد ملی شما نیز فقط برای احراز هویت به کار می‌رود.',
  },
];

const SUPPORT_PHONE = '02191001234';

export default function SupportScreen() {
  const { colors } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactSheetVisible, setContactSheetVisible] = useState(false);
  const [chatSheetVisible, setChatSheetVisible] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1, sender: 'support',
      text: 'سلام! 👋\nبه پشتیبانی زیبانو خوش آمدید.\nچطور می‌توانم کمکتان کنم؟',
      time: '۱۰:۳۰',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const toggleFaq = (id) => setExpandedFaq(expandedFaq === id ? null : id);

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() => {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    });
  };

  const handleSendContact = () => {
    if (!contactForm.subject.trim()) {
      Alert.alert('خطا', 'موضوع پیام را وارد کنید');
      return;
    }
    if (!contactForm.message.trim()) {
      Alert.alert('خطا', 'متن پیام را وارد کنید');
      return;
    }
    Alert.alert(
      'پیام شما ارسال شد',
      'پیام شما با موفقیت ثبت شد. کارشناسان ما در اسرع وقت پاسخ شما را خواهند داد.',
      [
        {
          text: 'باشه',
          onPress: () => {
            setContactForm({ subject: '', message: '' });
            setContactSheetVisible(false);
          },
        },
      ]
    );
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(), sender: 'user',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1, sender: 'support',
          text: 'پیام شما دریافت شد. یک کارشناس به زودی پاسخ خواهد داد. ⏳',
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        <View style={s.quickActions}>
          <TouchableOpacity
            style={[s.quickBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={handleCall}
          >
            <View style={[s.quickIconBox, { backgroundColor: '#43A04720' }]}>
              <Icon name="phone" size={22} color="#43A047" />
            </View>
            <Text style={[s.quickTitle, { color: colors.textMain }]}>تماس تلفنی</Text>
            <Text style={[s.quickSubtitle, { color: colors.textSecondary }]}>
              ۰۲۱-۹۱۰۰۱۲۳۴
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.quickBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => setChatSheetVisible(true)}
          >
            <View style={[s.quickIconBox, { backgroundColor: '#2196F320' }]}>
              <Icon name="chat" size={22} color="#2196F3" />
              <View style={s.onlineBadge} />
            </View>
            <Text style={[s.quickTitle, { color: colors.textMain }]}>چت آنلاین</Text>
            <Text style={[s.quickSubtitle, { color: colors.textSecondary }]}>
              پاسخ در کمتر از ۵ دقیقه
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="ارسال پیام به پشتیبانی"
          onPress={() => setContactSheetVisible(true)}
          variant="outline"
          size="lg"
          fullWidth
          icon={<Icon name="mail" size={20} color={colors.primary} />}
          iconPosition="right"
          style={s.contactBtn}
        />

        <Text style={[s.sectionTitle, { color: colors.textMain }]}>سوالات متداول</Text>
        <View style={s.faqContainer}>
          {FAQ_ITEMS.map((item) => {
            const isExpanded = expandedFaq === item.id;
            return (
              <Card
                key={item.id}
                variant="elevated"
                padding={0}
                radius={14}
                style={[s.faqCard, isExpanded && { backgroundColor: colors.primary + '08' }]}
              >
                <TouchableOpacity
                  style={s.faqQuestion}
                  onPress={() => toggleFaq(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[s.faqIconBox, { backgroundColor: colors.primary + '20' }]}>
                    <Icon name="help" size={16} color={colors.primary} />
                  </View>
                  <Text style={[s.faqQuestionText, { color: colors.textMain }]} numberOfLines={2}>
                    {item.q}
                  </Text>
                  <Icon
                    name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={[s.faqAnswerBox, { borderTopColor: colors.border }]}>
                    <Text style={[s.faqAnswerText, { color: colors.textSecondary }]}>
                      {item.a}
                    </Text>
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        <Card variant="default" padding={14} radius={14} style={s.infoCard}>
          <View style={s.infoRow}>
            <Icon name="schedule" size={18} color={colors.primary} />
            <View style={s.infoText}>
              <Text style={[s.infoTitle, { color: colors.textMain }]}>ساعات پاسخگویی</Text>
              <Text style={[s.infoValue, { color: colors.textSecondary }]}>
                شنبه تا پنج‌شنبه، ۹ صبح تا ۹ شب
              </Text>
            </View>
          </View>
          <View style={[s.infoDivider, { backgroundColor: colors.border }]} />
          <View style={s.infoRow}>
            <Icon name="email" size={18} color={colors.primary} />
            <View style={s.infoText}>
              <Text style={[s.infoTitle, { color: colors.textMain }]}>ایمیل پشتیبانی</Text>
              <Text style={[s.infoValue, { color: colors.textSecondary }]}>
                support@zibano.app
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <BottomSheet
        visible={contactSheetVisible}
        onClose={() => setContactSheetVisible(false)}
        title="ارسال پیام به پشتیبانی"
        snapPoint={0.75}
        footer={
          <Button
            title="ارسال پیام"
            onPress={handleSendContact}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Icon name="send" size={18} color="#fff" />}
            iconPosition="right"
          />
        }
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
          <Input
            label="موضوع پیام"
            placeholder="مثال: مشکل در رزرو نوبت"
            value={contactForm.subject}
            onChangeText={(t) => setContactForm({ ...contactForm, subject: t })}
            rightIcon={<Icon name="label" size={22} color={colors.textSecondary} />}
          />
          <Input
            label="متن پیام"
            placeholder="پیام خود را با جزئیات بنویسید..."
            value={contactForm.message}
            onChangeText={(t) => setContactForm({ ...contactForm, message: t })}
            multiline
            numberOfLines={5}
          />
        </ScrollView>
      </BottomSheet>

      <BottomSheet
        visible={chatSheetVisible}
        onClose={() => setChatSheetVisible(false)}
        title="چت آنلاین با پشتیبانی"
        snapPoint={0.85}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.chatContainer}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={s.chatMessages}
            contentContainerStyle={s.chatMessagesContent}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    s.chatMessage,
                    {
                      alignSelf: isUser ? 'flex-start' : 'flex-end',
                      backgroundColor: isUser ? colors.primary : colors.cardBackground,
                      borderColor: isUser ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[s.chatText, { color: isUser ? '#fff' : colors.textMain }]}>
                    {msg.text}
                  </Text>
                  <Text style={[s.chatTime, { color: isUser ? '#ffffff90' : colors.textSecondary }]}>
                    {msg.time}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={[s.chatInputRow, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              style={[
                s.chatInput,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.textMain,
                },
              ]}
              placeholder="پیام خود را بنویسید..."
              placeholderTextColor={colors.textSecondary + '80'}
              value={chatInput}
              onChangeText={setChatInput}
              multiline
              textAlign="right"
            />
            <TouchableOpacity
              style={[
                s.chatSendBtn,
                { backgroundColor: chatInput.trim() ? colors.primary : colors.border },
              ]}
              onPress={handleSendChat}
              disabled={!chatInput.trim()}
            >
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 100 },
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  quickBtn: {
    flex: 1, padding: 14, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', gap: 6,
  },
  quickIconBox: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4, position: 'relative',
  },
  onlineBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#43A047', borderWidth: 2, borderColor: '#fff',
  },
  quickTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  quickSubtitle: { fontSize: 10, fontFamily: 'Vazir', textAlign: 'center' },
  contactBtn: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'Vazir-Bold', marginBottom: 12 },
  faqContainer: { gap: 8, marginBottom: 20 },
  faqCard: { overflow: 'hidden' },
  faqQuestion: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  faqIconBox: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  faqQuestionText: { flex: 1, fontSize: 14, fontFamily: 'Vazir-Bold', lineHeight: 22 },
  faqAnswerBox: {
    paddingHorizontal: 16, paddingBottom: 14, paddingTop: 10,
    borderTopWidth: 1, marginHorizontal: 8,
  },
  faqAnswerText: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 22, textAlign: 'justify' },
  infoCard: { borderWidth: 1, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { flex: 1, gap: 2 },
  infoTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  infoValue: { fontSize: 12, fontFamily: 'Vazir' },
  infoDivider: { height: 1, marginVertical: 4 },
  chatContainer: { flex: 1 },
  chatMessages: { flex: 1 },
  chatMessagesContent: { paddingBottom: 10, gap: 8 },
  chatMessage: {
    maxWidth: '75%', padding: 10, paddingHorizontal: 14,
    borderRadius: 16, borderWidth: 1, gap: 4,
  },
  chatText: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 20 },
  chatTime: { fontSize: 10, fontFamily: 'Vazir', alignSelf: 'flex-end' },
  chatInputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingVertical: 10, borderTopWidth: 1,
  },
  chatInput: {
    flex: 1, minHeight: 42, maxHeight: 100,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1, fontSize: 13, fontFamily: 'Vazir',
  },
  chatSendBtn: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
  },
});