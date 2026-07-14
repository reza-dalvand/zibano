// src/components/home/NotificationModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../common/Button';

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'booking',
    icon: 'event-available',
    color: '#2196F3',
    title: 'رزرو شما تایید شد',
    message: 'رزرو فیشیال تخصصی شما در سالن نیلارام با موفقیت تایید شد. کد تایید: ۵۸۹۲',
    time: '۵ دقیقه پیش',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'discount',
    icon: 'local-offer',
    color: '#4CAF50',
    title: 'تخفیف ویژه برای شما!',
    message: '۳۰٪ تخفیف روی خدمات لیزر در مرکز رویال فقط تا فردا.',
    time: '۱ ساعت پیش',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'reminder',
    icon: 'notifications-active',
    color: '#FF9800',
    title: 'یادآوری نوبت فردا',
    message: 'فردا ساعت ۱۰:۳۰ نوبت کاشت ناخن در سالن افرا دارید.',
    time: '۳ ساعت پیش',
    isRead: false,
  },
  {
    id: 'n4',
    type: 'system',
    icon: 'info',
    color: '#9C27B0',
    title: 'به‌روزرسانی اپلیکیشن',
    message: 'نسخه جدید زیبانو با قابلیت‌های بیشتر و رفع باگ‌ها منتشر شد.',
    time: 'دیروز',
    isRead: true,
  },
  {
    id: 'n5',
    type: 'review',
    icon: 'star',
    color: '#FFC107',
    title: 'از نظر شما متشکریم',
    message: 'نظر شما برای سالن افرا با موفقیت ثبت شد.',
    time: '۲ روز پیش',
    isRead: true,
  },
  {
    id: 'n6',
    type: 'refund',
    icon: 'undo',
    color: '#1E88E5',
    title: 'استرداد وجه',
    message: 'مبلغ ۳۰۰,۰۰۰ تومان به حساب شما واریز شد (لغو نوبت توسط سالن).',
    time: '۳ روز پیش',
    isRead: true,
  },
];

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function NotificationModal({ visible, onClose }) {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };
  
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const deleteAll = () => {
    setNotifications([]);
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={s.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={s.container}>
          <View style={[s.modal, { backgroundColor: colors.cardBackground }]}>
            {/* Handle Bar */}
            <View style={s.handleArea}>
              <View style={[s.handle, { backgroundColor: colors.border }]} />
            </View>
            
            {/* Header */}
            <View style={[s.header, { borderBottomColor: colors.border }]}>
              <View style={s.headerLeft}>
                <View style={[s.headerIconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="notifications" size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.headerTitle, { color: colors.textMain }]}>
                    اعلان‌ها
                  </Text>
                  <Text style={[s.headerSubtitle, { color: colors.textSecondary }]}>
                    {unreadCount > 0
                      ? `${toPersianDigit(unreadCount)} اعلان خوانده نشده`
                      : 'همه اعلان‌ها خوانده شده‌اند'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[s.closeBtn, { backgroundColor: colors.background }]}
              >
                <Icon name="close" size={20} color={colors.textMain} />
              </TouchableOpacity>
            </View>
            
            {/* Actions Bar */}
            {notifications.length > 0 && (
              <View style={[s.actionsBar, { borderBottomColor: colors.border }]}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    onPress={markAllAsRead}
                    style={s.actionBtn}
                  >
                    <Icon name="done-all" size={16} color={colors.primary} />
                    <Text style={[s.actionText, { color: colors.primary }]}>
                      خواندن همه
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={deleteAll} style={s.actionBtn}>
                  <Icon name="delete-sweep" size={16} color="#E53935" />
                  <Text style={[s.actionText, { color: '#E53935' }]}>
                    پاک کردن همه
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Notifications List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.listContent}
            >
              {notifications.length === 0 ? (
                <View style={s.emptyState}>
                  <View style={[s.emptyIconBox, { backgroundColor: colors.primary + '10' }]}>
                    <Icon name="notifications-off" size={56} color={colors.textSecondary + '60'} />
                  </View>
                  <Text style={[s.emptyTitle, { color: colors.textMain }]}>
                    اعلانی وجود ندارد
                  </Text>
                  <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>
                    در حال حاضر اعلان جدیدی برای نمایش وجود ندارد
                  </Text>
                </View>
              ) : (
                notifications.map(notification => (
                  <TouchableOpacity
                    key={notification.id}
                    onPress={() => markAsRead(notification.id)}
                    style={[
                      s.notifCard,
                      {
                        backgroundColor: notification.isRead
                          ? colors.background
                          : colors.primary + '08',
                        borderColor: notification.isRead
                          ? colors.border
                          : colors.primary + '40',
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={s.notifMain}>
                      <View
                        style={[
                          s.notifIconBox,
                          { backgroundColor: notification.color + '18' },
                        ]}
                      >
                        <Icon
                          name={notification.icon}
                          size={22}
                          color={notification.color}
                        />
                      </View>
                      <View style={s.notifContent}>
                        <View style={s.notifTitleRow}>
                          <Text
                            style={[
                              s.notifTitle,
                              { color: colors.textMain },
                              !notification.isRead && { fontFamily: 'Vazir-Bold' },
                            ]}
                            numberOfLines={1}
                          >
                            {notification.title}
                          </Text>
                          {!notification.isRead && (
                            <View
                              style={[
                                s.unreadDot,
                                { backgroundColor: colors.primary },
                              ]}
                            />
                          )}
                        </View>
                        <Text
                          style={[s.notifMessage, { color: colors.textSecondary }]}
                          numberOfLines={2}
                        >
                          {notification.message}
                        </Text>
                        <Text style={[s.notifTime, { color: colors.textSecondary + '90' }]}>
                          {notification.time}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation?.();
                        deleteNotification(notification.id);
                      }}
                      style={s.deleteBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Icon name="close" size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
              <View style={{ height: 20 }} />
            </ScrollView>
            
            {/* Footer */}
            <View style={[s.footer, { borderTopColor: colors.border }]}>
              <Button
                title="بستن"
                onPress={onClose}
                variant="primary"
                size="lg"
                fullWidth
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
  modal: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    marginTop: 2,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyIconBox: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  notifMain: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  notifIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
    gap: 4,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifTitle: {
    fontSize: 14,
    fontFamily: 'Vazir',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifMessage: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 19,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: 'Vazir',
    marginTop: 4,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
});