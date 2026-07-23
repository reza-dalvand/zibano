// src/components/customer/ReviewModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useReview } from '../../context/ReviewContext';

const MAX_COMMENT_LENGTH = 300;

const REVIEW_TAGS = [
  { id: 'clean', label: 'مکان تمیز بود' },
  { id: 'punctual', label: 'سر وقت انجام شد' },
  { id: 'quality', label: 'کیفیت عالی بود' },
  { id: 'polite', label: 'رفتار محترمانه' },
  { id: 'fair_price', label: 'قیمت مناسب بود' },
  { id: 'recommend', label: 'پیشنهاد می‌کنم' },
];

export default function ReviewModal({ visible, appointment, onClose }) {
  const { colors } = useTheme();
  const { submitReview } = useReview();

  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (visible && !showSuccess) {
      setSelectedTags([]);
      setComment('');
      setIsSubmitting(false);
    }
  }, [visible]);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSubmit = () => {
    if (selectedTags.length === 0 && !comment.trim()) return;

    Keyboard.dismiss();
    setIsSubmitting(true);

    setTimeout(() => {
      submitReview(appointment.id, {
        tags: selectedTags,
        comment: comment.trim(),
        businessName: appointment.businessName,
        serviceName: appointment.serviceName,
      });
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 800);
  };

  // 🎯 هندلر دکمه بستن در مدال موفقیت
  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const canSubmit =
    (selectedTags.length > 0 || comment.trim().length > 0) && !isSubmitting;

  if (!appointment) return null;

  // ═══════════ مدال موفقیت (ساده - بدون انیمیشن) ═══════════
  if (showSuccess) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
        statusBarTranslucent
      >
        <View style={s.successBackdrop}>
          <View style={[s.successCard, { backgroundColor: colors.cardBackground }]}>
            {/* دایره سبز با تیک */}
            <View style={s.successIconWrapper}>
              <View style={s.successCircle}>
                <Icon name="check" size={56} color="#fff" />
              </View>
            </View>

            {/* متن‌ها */}
            <Text style={[s.successTitle, { color: colors.textMain }]}>
              نظر شما ثبت شد!
            </Text>
            <Text style={[s.successSubtitle, { color: colors.textSecondary }]}>
              ممنون که تجربه‌تان را با دیگران به اشتراک گذاشتید
            </Text>

            {/* Badge تعداد تگ‌ها */}
            {selectedTags.length > 0 && (
              <View
                style={[
                  s.successBadge,
                  { backgroundColor: '#43A04715', borderColor: '#43A04740' },
                ]}
              >
                <Icon name="star" size={16} color="#43A047" />
                <Text style={[s.successBadgeText, { color: '#43A047' }]}>
                  {selectedTags.length} مورد ثبت شد
                </Text>
              </View>
            )}

            {/* 🎯 دکمه بستن */}
            <TouchableOpacity
              onPress={handleSuccessClose}
              style={[s.successCloseBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.85}
            >
              <Text style={s.successCloseBtnText}>باشه</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // ═══════════ مدال اصلی (Bottom Sheet) ═══════════
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
      >
        <TouchableOpacity
          style={s.backdrop}
          activeOpacity={1}
          onPress={Keyboard.dismiss}
        >
          <TouchableOpacity activeOpacity={1} style={s.modalTouch}>
            <View style={[s.modal, { backgroundColor: colors.cardBackground }]}>
              {/* هدر */}
              <View style={[s.header, { borderBottomColor: colors.border }]}>
                <Avatar
                  uri={appointment.businessLogo}
                  name={appointment.businessName}
                  size="sm"
                />
                <View style={s.headerInfo}>
                  <Text
                    style={[s.headerName, { color: colors.textMain }]}
                    numberOfLines={1}
                  >
                    {appointment.businessName}
                  </Text>
                  <Text
                    style={[s.headerService, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {appointment.serviceName}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={s.closeBtn}>
                  <Icon name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* سوال */}
              <View style={s.questionRow}>
                <Icon
                  name="chat-bubble-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={[s.questionText, { color: colors.textMain }]}>
                  تجربه‌تان چطور بود؟
                </Text>
              </View>

              {/* محتوا */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {/* تگ‌ها */}
                <View style={s.tagsContainer}>
                  {REVIEW_TAGS.map((tag) => {
                    const isActive = selectedTags.includes(tag.id);
                    return (
                      <TouchableOpacity
                        key={tag.id}
                        onPress={() => toggleTag(tag.id)}
                        activeOpacity={0.7}
                        style={[
                          s.tag,
                          {
                            backgroundColor: isActive
                              ? colors.primary
                              : colors.background,
                            borderColor: isActive
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        {isActive && (
                          <Icon name="check" size={14} color="#fff" />
                        )}
                        <Text
                          style={[
                            s.tagText,
                            {
                              color: isActive ? '#fff' : colors.textMain,
                            },
                          ]}
                        >
                          {tag.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* اینپوت نظر */}
                <View style={s.commentSection}>
                  <Text
                    style={[s.commentLabel, { color: colors.textSecondary }]}
                  >
                    نظر شما (اختیاری)
                  </Text>
                  <View
                    style={[
                      s.commentBox,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <TextInput
                      style={[s.commentInput, { color: colors.textMain }]}
                      placeholder="اگه توضیح بیشتری دارید بنویسید..."
                      placeholderTextColor={colors.textSecondary + '80'}
                      value={comment}
                      onChangeText={(t) => {
                        if (t.length <= MAX_COMMENT_LENGTH) setComment(t);
                      }}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      maxLength={MAX_COMMENT_LENGTH}
                    />
                  </View>
                  <Text
                    style={[s.charCount, { color: colors.textSecondary }]}
                  >
                    {comment.length}/{MAX_COMMENT_LENGTH}
                  </Text>
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>

              {/* فوتر */}
              <View style={[s.footer, { borderTopColor: colors.border }]}>
                <Button
                  title={isSubmitting ? 'در حال ثبت...' : 'ثبت نظر'}
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  loading={isSubmitting}
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={[s.submitBtn, !canSubmit && { opacity: 0.4 }]}
                />
                <TouchableOpacity onPress={onClose} style={s.skipBtn}>
                  <Text
                    style={[s.skipText, { color: colors.textSecondary }]}
                  >
                    بعداً
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalTouch: {
    width: '100%',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  headerService: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  questionText: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  tagText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  commentSection: {
    marginBottom: 10,
  },
  commentLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    marginBottom: 8,
  },
  commentBox: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  commentInput: {
    padding: 14,
    minHeight: 80,
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 22,
  },
  charCount: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'left',
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
  },
  skipBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Vazir-Medium',
  },

  // ═══════════ مدال موفقیت (ساده) ═══════════
  successBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successCard: {
    width: '100%',
    paddingVertical: 35,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 20,
  },
  successIconWrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#43A047',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  successBadgeText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  // 🎯 دکمه بستن
  successCloseBtn: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  successCloseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
});