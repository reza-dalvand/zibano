// src/components/common/UpdateModal.js
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useAppVersionStore } from '../../stores/useAppVersionStore';
import { useShallow } from 'zustand/react/shallow';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// 🎯 آیکون مناسب برای هر نوع تغییر
const CHANGE_ICON_MAP = {
  'auto-awesome': { color: '#FFC107' },
  bolt: { color: '#FF9800' },
  shield: { color: '#4CAF50' },
  'bug-report': { color: '#2196F3' },
  palette: { color: '#9C27B0' },
  'new-releases': { color: '#E91E63' },
  default: { color: '#607D8B' },
};

const SUPPORT_PHONE = '02191001234';

export default function UpdateModal() {
  const { colors } = useTheme();
  const { updateInfo, dismissOptionalUpdate, openStore } = useAppVersionStore(
    useShallow((s) => ({
      updateInfo: s.updateInfo,
      dismissOptionalUpdate: s.dismissOptionalUpdate,
      openStore: s.openStore,
    }))
  );
  if (!updateInfo) return null;

  const isForce = updateInfo.isForceUpdate;
  const changelog = updateInfo.changelog || [];

  // 🎯 فقط ۳ تغییر اول نمایش داده شود (جمع‌وجور)
  const visibleChanges = changelog.slice(0, 3);
  const hiddenCount = changelog.length - visibleChanges.length;

  // ═══════════ هندلرها ═══════════
  const handleUpdate = async () => {
    await openStore();
  };

  const handleLater = () => {
    dismissOptionalUpdate();
  };

  const handleCallSupport = async () => {
    try {
      const phoneUrl = `tel:${SUPPORT_PHONE}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          'تماس با پشتیبانی',
          `شماره پشتیبانی:\n${toPersianDigit(SUPPORT_PHONE)}`,
          [{ text: 'باشه' }],
        );
      }
    } catch (error) {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    }
  };

  return (
    <Modal
      visible={!!updateInfo}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        if (!isForce) handleLater();
      }}
    >
      <View style={s.backdrop}>
        <View
          style={[
            s.modal,
            {
              backgroundColor: colors.cardBackground,
            },
          ]}
        >
          {/* ═══════ آیکون بالایی ═══════ */}
          <View style={s.iconWrapper}>
            <View
              style={[
                s.iconCircle,
                {
                  backgroundColor: isForce ? '#E5393515' : colors.primary + '15',
                },
              ]}
            >
              <Icon
                name={isForce ? 'system-update' : 'upgrade'}
                size={40}
                color={isForce ? '#E53935' : colors.primary}
              />
            </View>
          </View>

          {/* ═══════ عنوان ═══════ */}
          <Text style={[s.title, { color: colors.textMain }]}>
            {isForce ? 'به‌روزرسانی اجباری' : 'نسخه جدید در دسترس است'}
          </Text>

          {/* ═══════ توضیح ═══════ */}
          <Text style={[s.description, { color: colors.textSecondary }]}>
            {isForce
              ? 'برای ادامه استفاده از اپلیکیشن، لطفاً به آخرین نسخه به‌روزرسانی کنید.'
              : 'نسخه جدیدی از زیبانو با قابلیت‌های بهتر منتشر شده است.'}
          </Text>

          {/* ═══════ نسخه‌ها ═══════ */}
          <View
            style={[
              s.versionBox,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={s.versionItem}>
              <Text style={[s.versionLabel, { color: colors.textSecondary }]}>
                فعلی
              </Text>
              <Text style={[s.versionValue, { color: colors.textMain }]}>
                {toPersianDigit(updateInfo.currentVersion)}
              </Text>
            </View>

            <Icon name="arrow-back" size={20} color={colors.textSecondary} />

            <View style={s.versionItem}>
              <Text style={[s.versionLabel, { color: colors.textSecondary }]}>
                جدید
              </Text>
              <Text
                style={[
                  s.versionValue,
                  { color: isForce ? '#E53935' : colors.primary },
                ]}
              >
                {toPersianDigit(updateInfo.latestVersion)}
              </Text>
            </View>
          </View>

          {/* ═══════ 🆕 لیست تغییرات (جمع‌وجور) ═══════ */}
          {visibleChanges.length > 0 && (
            <View
              style={[
                s.changelogBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* هدر بخش تغییرات */}
              <View style={s.changelogHeader}>
                <Icon name="new-releases" size={16} color={colors.primary} />
                <Text style={[s.changelogTitle, { color: colors.textMain }]}>
                  تغییرات این نسخه
                </Text>
              </View>

              {/* لیست تغییرات */}
              <View style={s.changelogList}>
                {visibleChanges.map((item, index) => {
                  const iconConfig =
                    CHANGE_ICON_MAP[item.icon] || CHANGE_ICON_MAP.default;
                  return (
                    <View key={index} style={s.changelogItem}>
                      <View
                        style={[
                          s.changelogIconBox,
                          { backgroundColor: iconConfig.color + '18' },
                        ]}
                      >
                        <Icon
                          name={item.icon || 'check-circle'}
                          size={14}
                          color={iconConfig.color}
                        />
                      </View>
                      <Text
                        style={[s.changelogText, { color: colors.textMain }]}
                        numberOfLines={1}
                      >
                        {item.text}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* نمایش تعداد موارد پنهان */}
              {hiddenCount > 0 && (
                <View style={s.changelogMoreRow}>
                  <Icon
                    name="more-horiz"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[s.changelogMoreText, { color: colors.textSecondary }]}
                  >
                    و {toPersianDigit(hiddenCount)} مورد دیگر...
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ═══════ دکمه اصلی (آپدیت) ═══════ */}
          <TouchableOpacity
            onPress={handleUpdate}
            activeOpacity={0.85}
            style={[
              s.updateBtn,
              {
                backgroundColor: isForce ? '#E53935' : colors.primary,
              },
            ]}
          >
            <Icon name="system-update-alt" size={18} color="#fff" />
            <Text style={s.updateBtnText}>
              {isForce ? 'به‌روزرسانی اجباری' : 'به‌روزرسانی'}
            </Text>
          </TouchableOpacity>

          {/* ═══════ دکمه بعداً (فقط برای اختیاری) ═══════ */}
          {!isForce && (
            <TouchableOpacity
              onPress={handleLater}
              activeOpacity={0.7}
              style={s.laterBtn}
            >
              <Text style={[s.laterBtnText, { color: colors.textSecondary }]}>
                بعداً یادآوری کن
              </Text>
            </TouchableOpacity>
          )}

          {/* ═══════ 🆕 تماس با پشتیبانی ═══════ */}
          <TouchableOpacity
            onPress={handleCallSupport}
            activeOpacity={0.75}
            style={[
              s.supportBtn,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Icon name="headset-mic" size={16} color={colors.primary} />
            <Text style={[s.supportBtnText, { color: colors.textMain }]}>
              مشکل در به‌روزرسانی؟ تماس با پشتیبانی
            </Text>
            <Icon name="call" size={14} color={colors.primary} />
          </TouchableOpacity>

          {/* ═══════ نام استور ═══════ */}
          <View style={s.storeRow}>
            <Icon name="store" size={12} color={colors.textSecondary} />
            <Text style={[s.storeText, { color: colors.textSecondary }]}>
              از طریق {updateInfo.storeName}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modal: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    maxHeight: '88%',
  },
  // ═══════ آیکون ═══════
  iconWrapper: {
    marginBottom: 4,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ═══════ متن‌ها ═══════
  title: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
  },
  // ═══════ نسخه‌ها ═══════
  versionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  versionItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  versionLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  versionValue: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  // ═══════ 🆕 لیست تغییرات ═══════
  changelogBox: {
    width: '100%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  changelogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  changelogTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  changelogList: {
    gap: 6,
  },
  changelogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changelogIconBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changelogText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  changelogMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginTop: 2,
  },
  changelogMoreText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  // ═══════ دکمه آپدیت ═══════
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  updateBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  // ═══════ دکمه بعداً ═══════
  laterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  laterBtnText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  // ═══════ 🆕 تماس با پشتیبانی ═══════
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  supportBtnText: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },
  // ═══════ نام استور ═══════
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  storeText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
});