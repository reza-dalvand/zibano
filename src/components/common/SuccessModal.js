// src/components/common/SuccessModal.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function SuccessModal({
  visible,
  onClose,
  title = 'ثبت‌نام موفق',
  message = 'اطلاعات کسب‌وکار شما با موفقیت ثبت شد. پس از بررسی توسط کارشناسان، نتیجه از طریق پیامک اعلام خواهد شد.',
  confirmText = 'متوجه شدم',
  emoji = '🎉',
}) {
  const { colors } = useTheme();

  // انیمیشن‌ها
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkRotate = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.3)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;
  const sparkles = useRef(
    Array.from({ length: 8 }).map(() => ({
      translate: new Animated.ValueXY({ x: 0, y: 0 }),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.3),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // شروع انیمیشن‌ها
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 10,
          speed: 14,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // انیمیشن حلقه پالس
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(ringScale, {
              toValue: 1.8,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(ringOpacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(ringScale, { toValue: 0.3, duration: 0 }),
            Animated.timing(ringOpacity, { toValue: 1, duration: 0 }),
          ]),
        ])
      ).start();

      // انیمیشن چک‌مارک (با تاخیر)
      setTimeout(() => {
        Animated.spring(checkScale, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 14,
          speed: 12,
        }).start();
      }, 400);

      // انیمیشن sparkles
      sparkles.forEach((spark, i) => {
        const angle = (i * 360) / sparkles.length;
        const distance = 70;
        const tx = Math.cos((angle * Math.PI) / 180) * distance;
        const ty = Math.sin((angle * Math.PI) / 180) * distance;

        setTimeout(() => {
          Animated.parallel([
            Animated.timing(spark.translate.x, {
              toValue: tx,
              duration: 700,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(spark.translate.y, {
              toValue: ty,
              duration: 700,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(spark.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(spark.scale, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start(() => {
            Animated.timing(spark.opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }).start();
          });
        }, 300 + i * 80);
      });
    } else {
      // ریست انیمیشن‌ها هنگام بسته شدن
      scaleAnim.setValue(0.6);
      opacityAnim.setValue(0);
      checkScale.setValue(0);
      checkRotate.setValue(0);
      ringScale.setValue(0.3);
      ringOpacity.setValue(1);
      sparkles.forEach((spark) => {
        spark.translate.x.setValue(0);
        spark.translate.y.setValue(0);
        spark.opacity.setValue(0);
        spark.scale.setValue(0.3);
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={s.backdrop}
      >
        <Animated.View
          style={[
            s.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={s.modalContent}>
              {/* Sparkles دور دایره */}
              <View style={s.sparklesContainer}>
                {sparkles.map((spark, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      s.sparkle,
                      {
                        opacity: spark.opacity,
                        transform: [
                          { translateX: spark.translate.x },
                          { translateY: spark.translate.y },
                          { scale: spark.scale },
                        ],
                      },
                    ]}
                  >
                    <Icon
                      name="auto-awesome"
                      size={16}
                      color={colors.primary}
                    />
                  </Animated.View>
                ))}
              </View>

              {/* حلقه پالس */}
              <Animated.View
                style={[
                  s.pulseRing,
                  {
                    opacity: ringOpacity,
                    transform: [{ scale: ringScale }],
                  },
                ]}
              />

              {/* دایره موفقیت با چک‌مارک */}
              <Animated.View
                style={[
                  s.successIconBox,
                  {
                    transform: [{ scale: checkScale }],
                  },
                ]}
              >
                <View style={s.iconCircle}>
                  <Icon name="check" size={48} color="#fff" />
                </View>
                <View style={s.iconInnerGlow} />
              </Animated.View>

              {/* ایموجی بالای دایره */}
              <Text style={s.emoji}>{emoji}</Text>

              {/* عنوان */}
              <Text style={[s.title, { color: colors.textMain }]}>
                {title}
              </Text>

              {/* کارت پیام */}
              <View
                style={[
                  s.messageCard,
                  {
                    backgroundColor: colors.primary + '08',
                    borderColor: colors.primary + '25',
                  },
                ]}
              >
                <Icon name="sms" size={18} color={colors.primary} />
                <Text style={[s.messageText, { color: colors.textSecondary }]}>
                  {message}
                </Text>
              </View>

              {/* نکات */}
              <View style={s.tipsList}>
                <View style={s.tipItem}>
                  <Icon name="schedule" size={14} color={colors.primary} />
                  <Text style={[s.tipText, { color: colors.textSecondary }]}>
                    بررسی توسط کارشناسان ۲۴ تا ۴۸ ساعت
                  </Text>
                </View>
                <View style={s.tipItem}>
                  <Icon name="notifications-active" size={14} color={colors.primary} />
                  <Text style={[s.tipText, { color: colors.textSecondary }]}>
                    اطلاع‌رسانی از طریق پیامک و نوتیفیکیشن
                  </Text>
                </View>
              </View>

              {/* دکمه */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onClose}
                style={[s.confirmBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={s.confirmBtnText}>{confirmText}</Text>
                <Icon name="check-circle" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  // Sparkles
  sparklesContainer: {
    position: 'absolute',
    top: 48,
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sparkle: {
    position: 'absolute',
  },
  // Pulse Ring
  pulseRing: {
    position: 'absolute',
    top: 28,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignSelf: 'center',
  },
  // Success Icon
  successIconBox: {
    position: 'relative',
    marginBottom: 12,
    zIndex: 2,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  iconInnerGlow: {
    position: 'absolute',
    top: 8,
    left: 16,
    width: 30,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 22,
    textAlign: 'right',
  },
  // Tips
  tipsList: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  // Confirm Button
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
});