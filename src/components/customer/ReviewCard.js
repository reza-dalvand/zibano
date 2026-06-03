import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from './ThemeContext';

const ReviewCard = ({review}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: colors.cardBackground}]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.userAvatar ? (
            <Image source={{uri: review.userAvatar}} style={styles.avatar} />
          ) : (
            <View
              style={[styles.avatarPlaceholder, {backgroundColor: colors.border}]}>
              <Icon name="person" size={24} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.userText}>
            <Text
              style={[
                styles.userName,
                {color: colors.textMain, fontFamily: 'Vazir-Bold'},
              ]}>
              {review.userName}
            </Text>
            <Text
              style={[
                styles.date,
                {color: colors.textSecondary, fontFamily: 'Vazir'},
              ]}>
              {review.date}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFC107" />
          <Text
            style={[
              styles.rating,
              {color: colors.textMain, fontFamily: 'Vazir-Medium'},
            ]}>
            {review.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      {review.comment && (
        <Text
          style={[
            styles.comment,
            {color: colors.textMain, fontFamily: 'Vazir'},
          ]}>
          {review.comment}
        </Text>
      )}

      {review.serviceName && (
        <Text
          style={[
            styles.service,
            {color: colors.textSecondary, fontFamily: 'Vazir'},
          ]}>
          خدمت: {review.serviceName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',},
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
  },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  service: {
    fontSize: 12,
  },
});

export default ReviewCard;
