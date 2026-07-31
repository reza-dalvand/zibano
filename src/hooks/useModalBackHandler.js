// src/hooks/useModalBackHandler.js
import { useEffect, useState } from 'react';
import { BackHandler, Keyboard } from 'react-native';

/**
 * 🎯 Hook مدیریت هوشمند دکمه بک در مدال‌ها
 *
 * مشکل: وقتی کیبورد باز است و دکمه بک زده می‌شود، هم کیبورد و هم مدال بسته می‌شوند
 * راه‌حل: اگر کیبورد باز است، فقط کیبورد بسته می‌شود. اگر بسته است، مدال بسته می‌شود.
 *
 * @param {boolean} visible - وضعیت نمایش مدال
 * @param {function} onClose - تابع بستن مدال
 * @returns {object} - { onRequestClose } برای استفاده در Modal
 */
export function useModalBackHandler(visible, onClose) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // ردیابی وضعیت کیبورد
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // مدیریت دکمه بک سخت‌افزاری (فقط اندروید)
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isKeyboardVisible) {
          // ✅ فقط کیبورد را ببند، مدال را نه
          Keyboard.dismiss();
          return true; // جلوگیری از propagation
        }
        // ✅ کیبورد بسته است، مدال را ببند
        onClose?.();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [visible, onClose, isKeyboardVisible]);

  // تابع هوشمند برای onRequestClose در Modal
  const onRequestClose = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
      return;
    }
    onClose?.();
  };

  return { onRequestClose, isKeyboardVisible };
}