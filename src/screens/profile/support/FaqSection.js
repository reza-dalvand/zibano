// src/screens/profile/support/FaqSection.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Card from '../../../components/common/Card';
import { FAQ_ITEMS, FAQ_CATEGORIES } from './constants';

// فعال‌سازی LayoutAnimation در اندروید
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FaqSection() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // فیلتر سوالات
  const filteredFaqs = useMemo(() => {
    let items = FAQ_ITEMS;

    if (activeCategory !== 'all') {
      items = items.filter((item) => item.categoryId === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCategoryPress = (categoryId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCategory(categoryId);
    setExpandedId(null);
  };

  return (
    <View style={s.section}>
      {/* هدر */}
      <View style={s.sectionHeader}>
        <View style={[s.sectionIconBox, { backgroundColor: '#9C27B015' }]}>
          <Icon name="help" size={20} color="#9C27B0" />
        </View>
        <View style={s.sectionHeaderText}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            سوالات متداول
          </Text>
          <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
            پاسخ به پرسش‌های رایج کاربران
          </Text>
        </View>
      </View>

      {/* باکس جستجو */}
      <View
        style={[
          s.searchBox,
          {
            backgroundColor: colors.cardBackground,
            borderColor: searchQuery ? colors.primary : colors.border,
          },
        ]}
      >
        <Icon
          name="search"
          size={20}
          color={searchQuery ? colors.primary : colors.textSecondary}
        />
        <Text
          style={[
            s.searchInput,
            { color: colors.textMain },
          ]}
          onPress={() => {
            // برای ساده بودن از Text استفاده کردیم، می‌توان به TextInput تغییر داد
          }}
        >
          {searchQuery || 'جستجو در سوالات...'}
        </Text>
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* فیلتر دسته‌بندی */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.categoriesRow}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleCategoryPress('all')}
          style={[
            s.categoryChip,
            {
              backgroundColor: activeCategory === 'all' ? colors.primary : colors.cardBackground,
              borderColor: activeCategory === 'all' ? colors.primary : colors.border,
            },
          ]}
        >
          <Icon
            name="apps"
            size={14}
            color={activeCategory === 'all' ? '#fff' : colors.textSecondary}
          />
          <Text
            style={[
              s.categoryChipText,
              { color: activeCategory === 'all' ? '#fff' : colors.textMain },
            ]}
          >
            همه ({FAQ_ITEMS.length})
          </Text>
        </TouchableOpacity>

        {FAQ_CATEGORIES.map((cat) => {
          const count = FAQ_ITEMS.filter((f) => f.categoryId === cat.id).length;
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(cat.id)}
              style={[
                s.categoryChip,
                {
                  backgroundColor: isActive ? cat.color : colors.cardBackground,
                  borderColor: isActive ? cat.color : colors.border,
                },
              ]}
            >
              <Icon
                name={cat.icon}
                size={14}
                color={isActive ? '#fff' : cat.color}
              />
              <Text
                style={[
                  s.categoryChipText,
                  { color: isActive ? '#fff' : colors.textMain },
                ]}
              >
                {cat.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* لیست سوالات */}
      <View style={s.faqList}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item) => {
            const category = FAQ_CATEGORIES.find((c) => c.id === item.categoryId);
            const isExpanded = expandedId === item.id;
            return (
              <Card
                key={item.id}
                variant="default"
                padding={0}
                radius={14}
                style={[
                  s.faqCard,
                  {
                    borderColor: isExpanded ? colors.primary : colors.border,
                    backgroundColor: isExpanded
                      ? colors.primary + '05'
                      : colors.cardBackground,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => toggleFaq(item.id)}
                  activeOpacity={0.8}
                  style={s.faqQuestion}
                >
                  <View
                    style={[
                      s.faqIconBox,
                      { backgroundColor: category?.color + '20' },
                    ]}
                  >
                    <Icon
                      name={category?.icon || 'help'}
                      size={16}
                      color={category?.color}
                    />
                  </View>
                  <Text
                    style={[s.faqQuestionText, { color: colors.textMain }]}
                    numberOfLines={isExpanded ? undefined : 2}
                  >
                    {item.question}
                  </Text>
                  <View
                    style={[
                      s.expandIcon,
                      {
                        backgroundColor: isExpanded
                          ? colors.primary + '20'
                          : colors.border + '50',
                      },
                    ]}
                  >
                    <Icon
                      name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={18}
                      color={isExpanded ? colors.primary : colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={[s.faqAnswerBox, { borderTopColor: colors.border }]}>
                    <Text style={[s.faqAnswerText, { color: colors.textSecondary }]}>
                      {item.answer}
                    </Text>

                    {/* دسته‌بندی در پایین */}
                    <View style={s.faqFooter}>
                      <View
                        style={[
                          s.faqCategoryBadge,
                          { backgroundColor: category?.color + '15' },
                        ]}
                      >
                        <Icon
                          name={category?.icon}
                          size={10}
                          color={category?.color}
                        />
                        <Text
                          style={[
                            s.faqCategoryText,
                            { color: category?.color },
                          ]}
                        >
                          {category?.label}
                        </Text>
                      </View>
                      <Text style={[s.faqHelpfulText, { color: colors.textSecondary }]}>
                        آیا این پاسخ مفید بود؟
                      </Text>
                    </View>
                  </View>
                )}
              </Card>
            );
          })
        ) : (
          <View style={s.emptyBox}>
            <Icon name="search-off" size={48} color={colors.textSecondary + '60'} />
            <Text style={[s.emptyTitle, { color: colors.textMain }]}>
              نتیجه‌ای یافت نشد
            </Text>
            <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>
              عبارت جستجو یا دسته‌بندی را تغییر دهید
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },

  // ═══════════ جستجو ═══════════
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Vazir',
  },

  // ═══════════ دسته‌بندی‌ها ═══════════
  categoriesRow: {
    gap: 8,
    paddingRight: 2,
    marginBottom: 14,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════════ لیست FAQ ═══════════
  faqList: {
    gap: 8,
  },
  faqCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  faqIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    lineHeight: 21,
  },
  expandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqAnswerBox: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    marginHorizontal: 8,
    gap: 10,
  },
  faqAnswerText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 23,
    textAlign: 'justify',
  },
  faqFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  faqCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  faqCategoryText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  faqHelpfulText: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },

  // ═══════════ خالی ═══════════
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});