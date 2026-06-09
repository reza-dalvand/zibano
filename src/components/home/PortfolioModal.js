// src/components/business/PortfolioModal.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PortfolioModal({
  visible,
  onClose,
  portfolio,
  initialIndex = 0,
}) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

  if (!portfolio || !visible) return null;

  const images = portfolio.images || [portfolio.coverImage];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[s.backdrop]}>
        <View style={[s.modalContainer, { backgroundColor: colors.background }]}>
          {/* هدر */}
          <View style={[s.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={onClose}
              style={[s.closeBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            >
              <Icon name="close" size={22} color={colors.textMain} />
            </TouchableOpacity>
            <View style={s.headerCenter}>
              <Text style={[s.title, { color: colors.textMain }]} numberOfLines={1}>
                {portfolio.title || 'نمونه‌کار'}
              </Text>
              <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                {currentIndex + 1} از {images.length}
              </Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* اسلایدر تصاویر */}
          <ScrollView
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setCurrentIndex(index);
            }}
          >
            {images.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={s.mainImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* Indicator */}
          <View style={s.indicators}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  s.dot,
                  {
                    backgroundColor:
                      i === currentIndex ? colors.primary : colors.border,
                    width: i === currentIndex ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>

          {/* توضیحات */}
          {portfolio.description && (
            <View style={s.descriptionBox}>
              <Text style={[s.descriptionText, { color: colors.textMain }]}>
                {portfolio.description}
              </Text>
            </View>
          )}

          {/* دکمه‌های ناوبری */}
          <View style={s.navRow}>
            <TouchableOpacity
              onPress={() => {
                const prev = Math.max(0, currentIndex - 1);
                flatListRef.current?.scrollTo({
                  x: prev * SCREEN_WIDTH,
                  animated: true,
                });
                setCurrentIndex(prev);
              }}
              disabled={currentIndex === 0}
              style={[
                s.navBtn,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  opacity: currentIndex === 0 ? 0.4 : 1,
                },
              ]}
            >
              <Icon name="chevron-left" size={24} color={colors.textMain} />
              <Text style={[s.navBtnText, { color: colors.textMain }]}>
                قبلی
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const next = Math.min(images.length - 1, currentIndex + 1);
                flatListRef.current?.scrollTo({
                  x: next * SCREEN_WIDTH,
                  animated: true,
                });
                setCurrentIndex(next);
              }}
              disabled={currentIndex === images.length - 1}
              style={[
                s.navBtn,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  opacity: currentIndex === images.length - 1 ? 0.4 : 1,
                },
              ]}
            >
              <Text style={[s.navBtnText, { color: colors.textMain }]}>
                بعدی
              </Text>
              <Icon name="chevron-right" size={24} color={colors.textMain} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  mainImage: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.5,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  descriptionBox: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flex: 1,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 22,
    textAlign: 'justify',
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
});