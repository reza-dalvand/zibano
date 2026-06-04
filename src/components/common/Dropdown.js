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
import { useTheme } from '../../theme/ThemeContext';

export default function Dropdown({
  label,
  value, // مقدار انتخاب شده
  options = [], // آرایه‌ای از آبجکت‌ها مثل [{id: 1, label: 'تهران'}]
  onSelect,
  placeholder = 'انتخاب کنید...',
}) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  const selectedItem = options.find((opt) => opt.id === value);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textMain }]}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.inputBox, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.inputText, { color: selectedItem ? colors.textMain : colors.textSecondary }]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setVisible(false)} // بستن با کلیک بیرون مدال
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textMain }]}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Icon name="close" size={24} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.border },
                    item.id === value && { backgroundColor: colors.cardBackground }
                  ]}
                  onPress={() => {
                    onSelect(item.id);
                    setVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText, 
                    { color: item.id === value ? colors.primary : colors.textMain }
                  ]}>
                    {item.label}
                  </Text>
                  {item.id === value && <Icon name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: { fontSize: 13, fontFamily: 'Vazir-Medium', marginBottom: 8 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
  },
  inputText: { fontSize: 14, fontFamily: 'Vazir' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // چسبیدن به پایین صفحه
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%', // حداکثر ارتفاع لیست
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
  },
  optionText: { fontSize: 14, fontFamily: 'Vazir-Medium' },
});