import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from './ThemeContext';

const TeamMemberCard = ({member, isSelected, onPress}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      {member.avatar ? (
        <Image source={{uri: member.avatar}} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarPlaceholder, {backgroundColor: colors.border}]}>
          <Icon name="person" size={28} color={colors.textSecondary} />
        </View>
      )}
      <Text
        style={[styles.name, {color: colors.textMain, fontFamily: 'Vazir-Medium'}]}
        numberOfLines={1}>
        {member.name}
      </Text>
      <Text
        style={[styles.role, {color: colors.textSecondary, fontFamily: 'Vazir'}]}
        numberOfLines={1}>
        {member.role}
      </Text>
      {isSelected && (
        <View style={[styles.checkBadge, {backgroundColor: colors.primary}]}>
          <Icon name="check" size={12} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: 100,
    marginRight: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    textAlign: 'center',
  },
  role: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TeamMemberCard;
