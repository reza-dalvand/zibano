// src/components/manageBusiness/services/ServiceTypeIcon.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 🎨 مپ رنگ و آیکون برای هر نوع خدمت
const TYPE_CONFIG = {
  facial:     { icon: 'face-retouching-natural', gradient: ['#F8BBD9', '#F48FB1'], color: '#C2185B' },
  nail:       { icon: 'brush',                  gradient: ['#E1BEE7', '#BA68C8'], color: '#7B1FA2' },
  hair_color: { icon: 'auto-awesome',           gradient: ['#B3E5FC', '#4FC3F7'], color: '#0277BD' },
  keratin:    { icon: 'flare',                  gradient: ['#FFE082', '#FFB74D'], color: '#E65100' },
  laser:      { icon: 'flash-on',               gradient: ['#B2EBF2', '#26C6DA'], color: '#00838F' },
  makeup:     { icon: 'palette',                gradient: ['#F8BBD0', '#EC407A'], color: '#AD1457' },
  eyelash:    { icon: 'visibility',             gradient: ['#D1C4E9', '#7E57C2'], color: '#4527A0' },
  waxing:     { icon: 'spa',                    gradient: ['#C8E6C9', '#66BB6A'], color: '#2E7D32' },
  massage:    { icon: 'self-improvement',       gradient: ['#DCEDC8', '#AED581'], color: '#558B2F' },
  tattoo:     { icon: 'edit',                   gradient: ['#FFCCBC', '#FF8A65'], color: '#D84315' },
  skincare:   { icon: 'water-drop',             gradient: ['#B2DFDB', '#4DB6AC'], color: '#00695C' },
  other:      { icon: 'more-horiz',             gradient: ['#CFD8DC', '#90A4AE'], color: '#455A64' },
};

export default function ServiceTypeIcon({ typeId, size = 56 }) {
  const config = TYPE_CONFIG[typeId] || TYPE_CONFIG.other;
  const iconSize = size * 0.5;

  return (
    <View
      style={[
        s.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: config.gradient[0] + '60',
        },
      ]}
    >
      <View
        style={[
          s.innerCircle,
          {
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: size * 0.39,
            backgroundColor: config.gradient[1] + '40',
          },
        ]}
      >
        <Icon name={config.icon} size={iconSize} color={config.color} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});