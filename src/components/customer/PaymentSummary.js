import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from './ThemeContext';

const PaymentSummary = ({items, discount = 0, total}) => {
  const {colors} = useTheme();

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = total ?? subtotal - discount;

  return (
    <View style={[styles.container, {backgroundColor: colors.cardBackground}]}>
      <Text
        style={[
          styles.title,
          {color: colors.textMain, fontFamily: 'Vazir-Bold'},
        ]}>
        خلاصه پرداخت
      </Text>

      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text
              style={[
                styles.itemName,
                {color: colors.textMain, fontFamily: 'Vazir'},
              ]}
              numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.itemPrice,
                {color: colors.textMain, fontFamily: 'Vazir'},
              ]}>
              {item.price.toLocaleString('fa-IR')} تومان
            </Text>
          </View>
        ))}
      </View>

      {discount > 0 && (
        <>
          <View style={[styles.divider, {backgroundColor: colors.border}]} />
          <View style={styles.row}>
            <Text
              style={[
                styles.label,
                {color: colors.textSecondary, fontFamily: 'Vazir'},
              ]}>
              تخفیف
            </Text>
            <Text
              style={[
                styles.discount,
                {color: '#4CAF50', fontFamily: 'Vazir'},
              ]}>
              {discount.toLocaleString('fa-IR')}- تومان
            </Text>
          </View>
        </>
      )}

      <View style={[styles.divider, {backgroundColor: colors.border}]} />

      <View style={styles.row}>
        <Text
          style={[
            styles.totalLabel,
            {color: colors.textMain, fontFamily: 'Vazir-Bold'},
          ]}>
          مجموع
        </Text>
        <Text
          style={[
            styles.totalPrice,
            {color: colors.primary, fontFamily: 'Vazir-Bold'},
          ]}>
          {finalTotal.toLocaleString('fa-IR')} تومان
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
  },
  discount: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 15,
  },
  totalPrice: {
    fontSize: 17,
  },
});

export default PaymentSummary;
