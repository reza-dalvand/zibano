// src/components/common/Dropdown.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

export default function Dropdown({
  label,
  value,
  options = [],
  onSelect,
  placeholder = 'انتخاب کنید...',
  disabled = false,
}) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const selectedItem = options.find((opt) => opt.id === value);

  // 🎯 هندلر کلیک روی inputBox
  const handleInputPress = () => {
    if (disabled) return;
    // اگر باز هست → ببند / اگر بسته هست → باز کن
    setVisible((prev) => !prev);
  };

  // 🎯 هندلر انتخاب آیتم
  const handleSelect = (item) => {
    onSelect(item.id);
    setVisible(false);
  };

  // 🎯 هندلر بستن مدال
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textMain }]}>{label}</Text>
      )}

      {/* ═══════ دکمه باز/بسته کردن ═══════ */}
      <TouchableOpacity
        style={[
          styles.inputBox,
          {
            backgroundColor: colors.cardBackground,
            borderColor: disabled
              ? colors.border + '60'
              : visible
              ? colors.primary
              : colors.border,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        activeOpacity={0.8}
        onPress={handleInputPress}
        disabled={disabled}
      >
        <Text
          style={[
            styles.inputText,
            {
              color: selectedItem ? colors.textMain : colors.textSecondary,
            },
          ]}
          numberOfLines={1}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        {/* 🎯 فلش بر اساس وضعیت visible تغییر می‌کنه */}
        <Icon
          name={visible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={disabled ? colors.textSecondary + '60' : visible ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      {/* ═══════ مدال ═══════ */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        {/* 🎯 Container اصلی - تمام صفحه رو می‌گیره */}
        <View style={styles.overlayContainer}>
          {/* 🎯 Backdrop تیره - با کلیک روش مدال بسته میشه */}
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* 🎯 محتوای مدال - از پایین بالا میاد */}
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.cardBackground,
                borderTopColor: colors.border,
                zIndex: 2,           // ✅ اصلاح شده - بالاتر از backdrop
                position: 'relative', // ✅ اصلاح شده - اطمینان از relative بودن
              },
            ]}
          >
            {/* Handle Bar */}
            <View style={styles.handleArea}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
            </View>

            {/* هدر */}
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>
                {label || placeholder}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.closeBtn, { backgroundColor: colors.background }]}
              >
                <Icon name="close" size={20} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            {/* لیست گزینه‌ها */}
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.id === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      { borderBottomColor: colors.border + '40' },
                      isSelected && {
                        backgroundColor: colors.primary + '12',
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected
                            ? colors.primary
                            : colors.textMain,
                          fontFamily: isSelected ? 'Vazir-Bold' : 'Vazir',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Icon
                        name="check"
                        size={20}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    گزینه‌ای موجود نیست
                  </Text>
                </View>
              }
            />

            {/* فضای امن پایین */}
            <View style={{ height: 20 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 8,
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    flex: 1,
  },

  // ═══════ 🎯 استایل‌های مدال ═══════

  // Container اصلی که تمام صفحه رو می‌گیره
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end', // مدال رو به پایین می‌چسبونه
  },

  // Backdrop تیره پشت مدال
  backdrop: {
    ...StyleSheet.absoluteFillObject, // کل صفحه رو پر می‌کنه
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 1,  // ✅ اصلاح شده - پایین‌تر از modalContent
  },

  // محتوای مدال
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%', // حداکثر ۷۰٪ ارتفاع صفحه
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },

  // Handle bar بالای مدال
  handleArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },

  // هدر مدال
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // آیتم‌های لیست
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    flex: 1,
  },

  // حالت خالی
  emptyBox: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
});