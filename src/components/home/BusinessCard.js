import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../theme/ThemeContext';
import Button from '../common/Button';

const BusinessCard = ({business, onPress}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.cardBackground},
      ]}>
      <View
        style={styles.cardContent}>
        <Image
          source={{uri: business.logo}}
          style={styles.logo}
        />

        <View style={styles.content}>
          <Text
            style={[
              styles.name,
              {color: colors.textMain},
            ]}
            numberOfLines={1}>
            {business.name}
          </Text>

          <View style={styles.infoRow}>
            <Icon
              name="location-on"
              size={14}
              color={colors.textSecondary}
            />

            <Text
              style={[
                styles.city,
                {color: colors.textSecondary},
              ]}>
              {business.city}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.rating}>
              <Icon
                name="star"
                size={16}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.ratingText,
                  {color: colors.textMain},
                ]}>
                {business.rating.toFixed(1)}
              </Text>
            </View>

            <Text
              style={[
                styles.servicesText,
                {color: colors.textSecondary},
              ]}>
              {business.servicesCount} خدمت
            </Text>
          </View>
        </View>
      </View>

      <Button
        title="مشاهده پروفایل"
        onPress={onPress}
        size="sm"
        fullWidth
        style={styles.profileButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardContent: {
    flexDirection: 'row',
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },

  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },

  city: {
    fontSize: 13,
  },

  servicesText: {
    fontSize: 13,
    fontWeight: '500',
  },

  profileButton: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileButtonText: {
    fontSize: 14,
    fontFamily: 'Vazir-Medium',
  },
});

export default BusinessCard;