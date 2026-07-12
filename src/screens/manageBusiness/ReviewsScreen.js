// src/screens/manageBusiness/ReviewsScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import EmptyState from '../../components/common/EmptyState';

const FILTER_OPTIONS = [
  { id: 'all', label: 'همه' },
  { id: '5', label: '۵ ستاره' },
  { id: '4', label: '۴ ستاره' },
  { id: '3', label: '۳ ستاره' },
  { id: '2', label: '۲ ستاره' },
  { id: '1', label: '۱ ستاره' },
];

// دیتای موقت نظرات (بعداً از Context یا API)
const MOCK_REVIEWS = [
  {
    id: 'r1',
    userName: 'سارا محمدی',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    date: '۲ روز پیش',
    serviceName: 'فیشیال تخصصی',
    comment:
      'محیط بسیار تمیز و آرام. برخورد پرسنل عالی بود. حتماً دوباره مراجعه می‌کنم.',
  },
  {
    id: 'r2',
    userName: 'نیلوفر رضایی',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    rating: 4,
    date: '۱ هفته پیش',
    serviceName: 'کاشت مژه',
    comment: 'کارشون حرف نداشت. مژه‌ها خیلی طبیعی شدن و ماندگاری خوبی داشتن.',
  },
  {
    id: 'r3',
    userName: 'الهام کریمی',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    date: '۲ هفته پیش',
    serviceName: 'لیزر فول بادی',
    comment:
      'دستگاه پیشرفته و بدون درد. نتیجه فوق‌العاده بود. ممنون از تیم حرفه‌ای نیلارام.',
  },
  {
    id: 'r4',
    userName: 'مریم احمدی',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    rating: 3,
    date: '۳ هفته پیش',
    serviceName: 'کاشت ناخن',
    comment: 'کار خوب بود ولی زمان انتظار زیاد بود.',
  },
  {
    id: 'r5',
    userName: 'زهرا حسینی',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    date: '۱ ماه پیش',
    serviceName: 'رنگ مو',
    comment:
      'بهترین تجربه رنگ مو که تا حالا داشتم. رنگ دقیقاً همونی شد که می‌خواستم.',
  },
];

const toPersianDigit = str =>
  String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function ReviewsScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  const reviews = MOCK_REVIEWS;

  // آمار کلی
  const stats = useMemo(() => {
    const total = reviews.length;
    const avg =
      total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => Math.round(r.rating) === star).length,
    }));
    return { total, avg, dist };
  }, [reviews]);

  // فیلتر نظرات
  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') return reviews;
    return reviews.filter(r => Math.round(r.rating) === parseInt(activeFilter));
  }, [reviews, activeFilter]);

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header
        title="نظرات و امتیازات"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* کارت خلاصه امتیاز */}
        <Card variant="elevated" padding={20} radius={20} style={s.summaryCard}>
          <View style={s.summaryRow}>
            {/* عدد بزرگ امتیاز */}
            <View style={s.bigScore}>
              <Text style={[s.bigNumber, { color: colors.textMain }]}>
                {toPersianDigit(stats.avg.toFixed(1))}
              </Text>
              <StarRating value={stats.avg} size="md" />
              <Text style={[s.totalReviews, { color: colors.textSecondary }]}>
                {toPersianDigit(stats.total)} نظر
              </Text>
            </View>

            {/* توزیع امتیازها */}
            <View style={s.distribution}>
              {stats.dist.map(d => (
                <View key={d.star} style={s.distRow}>
                  <Text style={[s.distStar, { color: colors.textSecondary }]}>
                    {toPersianDigit(d.star)}
                  </Text>
                  <Icon
                    name="star"
                    size={12}
                    color={d.star >= 4 ? '#FFC107' : '#FFA000'}
                  />
                  <View
                    style={[s.distBarBg, { backgroundColor: colors.border }]}
                  >
                    <View
                      style={[
                        s.distBarFill,
                        {
                          backgroundColor:
                            d.star >= 4
                              ? '#43A047'
                              : d.star === 3
                              ? '#FFA000'
                              : '#E53935',
                          width: `${(d.count / stats.total) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[s.distCount, { color: colors.textSecondary }]}>
                    {toPersianDigit(d.count)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* فیلتر امتیاز */}
        <View style={s.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filterRow}
          >
            {FILTER_OPTIONS.map(f => {
              const isActive = activeFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  activeOpacity={0.8}
                  onPress={() => setActiveFilter(f.id)}
                  style={[
                    s.filterChip,
                    {
                      backgroundColor: isActive
                        ? colors.primary
                        : colors.cardBackground,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.filterChipText,
                      {
                        color: isActive ? '#fff' : colors.textMain,
                      },
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* لیست نظرات */}
        <View style={s.reviewsList}>
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <Card
                key={review.id}
                variant="elevated"
                padding={16}
                radius={16}
                style={s.reviewCard}
              >
                <View style={s.reviewHeader}>
                  <Avatar
                    uri={review.userAvatar}
                    name={review.userName}
                    size="md"
                  />
                  <View style={s.reviewUserInfo}>
                    <Text
                      style={[s.reviewUserName, { color: colors.textMain }]}
                    >
                      {review.userName}
                    </Text>
                    <Text
                      style={[s.reviewDate, { color: colors.textSecondary }]}
                    >
                      {review.date}
                    </Text>
                  </View>
                  <View
                    style={[
                      s.reviewRatingBadge,
                      { backgroundColor: '#FFC10720' },
                    ]}
                  >
                    <Icon name="star" size={12} color="#FFC107" />
                    <Text
                      style={[s.reviewRatingText, { color: colors.textMain }]}
                    >
                      {toPersianDigit(review.rating)}
                    </Text>
                  </View>
                </View>

                {review.serviceName && (
                  <View
                    style={[
                      s.reviewServiceChip,
                      { backgroundColor: colors.primary + '15' },
                    ]}
                  >
                    <Text
                      style={[s.reviewServiceText, { color: colors.primary }]}
                    >
                      {review.serviceName}
                    </Text>
                  </View>
                )}

                <Text style={[s.reviewComment, { color: colors.textMain }]}>
                  {review.comment}
                </Text>

                <TouchableOpacity style={s.replyBtn}>
                  <Icon name="reply" size={16} color={colors.primary} />
                  <Text style={[s.replyText, { color: colors.primary }]}>
                    پاسخ به نظر
                  </Text>
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <EmptyState
              icon="💬"
              title="نظری یافت نشد"
              description={
                activeFilter === 'all'
                  ? 'هنوز هیچ مشتری نظری ثبت نکرده است'
                  : `نظری با امتیاز ${activeFilter} ستاره وجود ندارد`
              }
            />
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  bigScore: {
    alignItems: 'center',
    gap: 6,
    minWidth: 100,
  },
  bigNumber: {
    fontSize: 44,
    fontFamily: 'Vazir-Bold',
    lineHeight: 48,
  },
  totalReviews: {
    fontSize: 12,
    fontFamily: 'Vazir',
    marginTop: 4,
  },
  distribution: {
    flex: 1,
    gap: 6,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distStar: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    width: 12,
  },
  distBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  distBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  distCount: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    width: 20,
    textAlign: 'right',
  },
  filterContainer: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  filterRow: {
    gap: 8,
    paddingRight: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    marginBottom: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reviewUserInfo: {
    flex: 1,
    gap: 2,
  },
  reviewUserName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  reviewRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  reviewRatingText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  reviewServiceChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  reviewServiceText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  reviewComment: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 10,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  replyText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});
