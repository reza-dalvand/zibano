// src/components/profile/ProfileStatsCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';

export default function ProfileStatsCard({ stats }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={0} radius={20} style={s.statsCard}>
      <View style={s.statsRow}>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.id}>
            <View style={s.statItem}>
              <View
                style={[s.statIconBox, { backgroundColor: stat.color + '20' }]}
              >
                <Icon name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={[s.statValue, { color: colors.textMain }]}>
                {stat.value}
              </Text>
              <Text style={[s.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
            {index < stats.length - 1 && (
              <View style={[s.statDivider, { backgroundColor: colors.border }]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  statsCard: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  statDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
  },
});