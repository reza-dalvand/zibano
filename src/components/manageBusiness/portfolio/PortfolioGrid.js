// src/components/manageBusiness/portfolio/PortfolioGrid.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../stores/useThemeStore';
import PortfolioCard from './PortfolioCard';

export default function PortfolioGrid({ portfolios, services, onPortfolioPress, onEdit, onDelete }) {
  const { colors } = useTheme();

  if (!portfolios || portfolios.length === 0) return null;

  const getServiceName = (serviceId) => {
    if (!serviceId || !services) return null;
    const service = services.find(s => s.id === serviceId);
    return service?.name || null;
  };

  return (
    <View style={s.grid}>
      {portfolios.map((portfolio) => (
        <PortfolioCard
          key={portfolio.id}
          portfolio={portfolio}
          serviceName={getServiceName(portfolio.serviceId)}
          onPress={onPortfolioPress}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
});