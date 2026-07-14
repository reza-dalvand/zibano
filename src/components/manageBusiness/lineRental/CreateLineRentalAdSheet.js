// src/components/manageBusiness/lineRental/CreateLineRentalAdSheet.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../theme/ThemeContext';
import BottomSheet from '../../common/BottomSheet';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Dropdown from '../../common/Dropdown';
import Card from '../../common/Card';

const SERVICE_TYPES = [
  { id: 'facial', label: 'فیشیال و پاکسازی پوست', icon: 'face-retouching-natural', color: '#C2185B' },
  { id: 'nail', label: 'کاشت و طراحی ناخن', icon: 'brush', color: '#7B1FA2' },
  { id: 'hair_color', label: 'رنگ و مش مو', icon: 'auto-awesome', color: '#0277BD' },
  { id: 'keratin', label: 'کراتین و احیای مو', icon: 'flare', color: '#E65100' },
  { id: 'laser', label: 'لیزر موهای زائد', icon: 'flash-on', color: '#00838F' },
  { id: 'makeup', label: 'میکاپ و گریم', icon: 'palette', color: '#AD1457' },
  { id: 'eyelash', label: 'کاشت مژه و ابرو', icon: 'visibility', color: '#4527A0' },
  { id: 'waxing', label: 'اپیلاسیون', icon: 'spa', color: '#2E7D32' },
  { id: 'massage', label: 'ماساژ', icon: 'self-improvement', color: '#558B2F' },
  { id: 'tattoo', label: 'تتو و هاشور', icon: 'edit', color: '#D84315' },
  { id: 'skincare', label: 'مراقبت پوست', icon: 'water-drop', color: '#00695C' },
  { id: 'hair_cut', label: 'کوتاهی و حالت مو', icon: 'content-cut', color: '#5D4037' },
  { id: 'bridal', label: 'خدمات عروس', icon: 'diamond', color: '#880E4F' },
  { id: 'hair_extensions', label: 'اکستنشن مو', icon: 'extension', color: '#4E342E' },
  { id: 'other', label: 'سایر خدمات', icon: 'more-horiz', color: '#455A64' },
];

const COLLAB_TYPES = [
  { id: 'percent', label: 'درصدی', icon: 'pie-chart', color: '#9C27B0', hint: 'تقسیم درآمد با درصد توافقی' },
  { id: 'fixed', label: 'اجاره ثابت', icon: 'attach-money', color: '#2196F3', hint: 'مبلغ ثابت ماهانه + رهن (اختیاری)' },
  { id: 'hourly', label: 'ساعتی', icon: 'schedule', color: '#FF9800', hint: 'به ازای هر ساعت' },
];

const MAX_DESC_LENGTH = 300;

const toEnglishDigits = (str) =>
  String(str || '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const toPersianDigits = (str) =>
  String(str || '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const parseNumber = (str) => {
  const cleaned = toEnglishDigits(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

const formatPriceInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  const num = parseInt(cleaned, 10);
  return toPersianDigits(num.toLocaleString('en-US'));
};

const formatPercentInput = (text) => {
  const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  const num = Math.min(parseInt(cleaned, 10), 100);
  return toPersianDigits(String(num));
};

const getPriceSectionTitle = (collabType) => {
  switch (collabType) {
    case 'percent': return 'درصد تقسیم درآمد';
    case 'fixed': return 'مبلغ اجاره ماهانه + رهن';
    case 'hourly': return 'نرخ ساعتی';
    default: return 'قیمت';
  }
};

export default function CreateLineRentalAdSheet({ visible, onClose, onSave, editingAd }) {
  const { colors } = useTheme();
  const isEditMode = !!editingAd;

  const [title, setTitle] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState(null);
  const [collabType, setCollabType] = useState(null);
  const [description, setDescription] = useState('');
  const [lineImage, setLineImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [percentSalon, setPercentSalon] = useState('');
  const [percentPartner, setPercentPartner] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedDeposit, setFixedDeposit] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    if (visible) {
      if (editingAd) {
        setTitle(editingAd.title || '');
        setServiceTypeId(editingAd.serviceTypeId || null);
        setCollabType(editingAd.collabType || null);
        setDescription((editingAd.description || '').slice(0, MAX_DESC_LENGTH));
        setLineImage(editingAd.lineImage || null);
        setPercentSalon(editingAd.percentSalon ? toPersianDigits(String(editingAd.percentSalon)) : '');
        setPercentPartner(editingAd.percentPartner ? toPersianDigits(String(editingAd.percentPartner)) : '');
        setFixedAmount(editingAd.fixedAmount ? formatPriceInput(String(editingAd.fixedAmount)) : '');
        setFixedDeposit(editingAd.fixedDeposit ? formatPriceInput(String(editingAd.fixedDeposit)) : '');
        setHourlyRate(editingAd.hourlyRate ? formatPriceInput(String(editingAd.hourlyRate)) : '');
      } else {
        setTitle('');
        setServiceTypeId(null);
        setCollabType(null);
        setDescription('');
        setLineImage(null);
        setPercentSalon('');
        setPercentPartner('');
        setFixedAmount('');
        setFixedDeposit('');
        setHourlyRate('');
      }
      setErrors({});
    }
  }, [visible, editingAd]);

  const handleCollabTypeChange = (typeId) => {
    setCollabType(typeId);
    setPercentSalon('');
    setPercentPartner('');
    setFixedAmount('');
    setFixedDeposit('');
    setHourlyRate('');
    if (errors.collabType) setErrors((prev) => ({ ...prev, collabType: '' }));
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!result.didCancel && result.assets?.[0]) {
      setLineImage(result.assets[0].uri);
      if (errors.lineImage) setErrors((prev) => ({ ...prev, lineImage: '' }));
    }
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= MAX_DESC_LENGTH) {
      setDescription(text);
      if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
    }
  };

  const handlePercentSalonChange = (text) => {
    const formatted = formatPercentInput(text);
    setPercentSalon(formatted);
    const salonNum = parseNumber(formatted);
    if (salonNum > 0 && salonNum <= 100) {
      setPercentPartner(toPersianDigits(String(100 - salonNum)));
    } else {
      setPercentPartner('');
    }
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  const handlePercentPartnerChange = (text) => {
    const formatted = formatPercentInput(text);
    setPercentPartner(formatted);
    const partnerNum = parseNumber(formatted);
    if (partnerNum > 0 && partnerNum <= 100) {
      setPercentSalon(toPersianDigits(String(100 - partnerNum)));
    } else {
      setPercentSalon('');
    }
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  const handleFixedAmountChange = (text) => {
    setFixedAmount(formatPriceInput(text));
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  const handleFixedDepositChange = (text) => {
    setFixedDeposit(formatPriceInput(text));
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  const handleHourlyRateChange = (text) => {
    setHourlyRate(formatPriceInput(text));
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'عنوان آگهی الزامی است';
    if (title.trim().length < 5) newErrors.title = 'عنوان باید حداقل ۵ کاراکتر باشد';
    if (!serviceTypeId) newErrors.serviceTypeId = 'نوع خدمت را انتخاب کنید';
    if (!collabType) newErrors.collabType = 'نوع همکاری را انتخاب کنید';
    if (!description.trim()) newErrors.description = 'توضیحات الزامی است';
    if (description.trim().length < 20) newErrors.description = 'توضیحات باید حداقل ۲۰ کاراکتر باشد';
    if (!lineImage) newErrors.lineImage = 'تصویر لاین الزامی است';

    let priceData = {};
    let priceDisplay = '';

    if (collabType === 'percent') {
      const salonNum = parseNumber(percentSalon);
      const partnerNum = parseNumber(percentPartner);
      if (!salonNum || !partnerNum) {
        newErrors.price = 'درصد سالن و همکار را وارد کنید';
      } else if (salonNum + partnerNum !== 100) {
        newErrors.price = 'مجموع درصدها باید ۱۰۰٪ باشد';
      } else {
        priceData = { percentSalon: salonNum, percentPartner: partnerNum };
        priceDisplay = `${toPersianDigits(String(salonNum))}-${toPersianDigits(String(partnerNum))}`;
      }
    } else if (collabType === 'fixed') {
      const fixedNum = parseNumber(fixedAmount);
      const depositNum = parseNumber(fixedDeposit);
      if (!fixedNum) {
        newErrors.price = 'مبلغ اجاره ماهانه را وارد کنید';
      } else {
        priceData = { fixedAmount: fixedNum, fixedDeposit: depositNum };
        if (depositNum > 0) {
          priceDisplay = `${toPersianDigits(fixedNum.toLocaleString('en-US'))} + ${toPersianDigits(depositNum.toLocaleString('en-US'))} رهن`;
        } else {
          priceDisplay = `${toPersianDigits(fixedNum.toLocaleString('en-US'))} تومان`;
        }
      }
    } else if (collabType === 'hourly') {
      const hourlyNum = parseNumber(hourlyRate);
      if (!hourlyNum) {
        newErrors.price = 'نرخ ساعتی را وارد کنید';
      } else {
        priceData = { hourlyRate: hourlyNum };
        priceDisplay = `${toPersianDigits(hourlyNum.toLocaleString('en-US'))} / ساعت`;
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const selectedCollab = COLLAB_TYPES.find((c) => c.id === collabType);
    const selectedService = SERVICE_TYPES.find((s) => s.id === serviceTypeId);

    onSave({
      id: editingAd?.id || `lr_${Date.now()}`,
      title: title.trim(),
      serviceTypeId,
      serviceTypeName: selectedService?.label || '',
      serviceTypeIcon: selectedService?.icon || 'spa',
      serviceTypeColor: selectedService?.color || '#607D8B',
      collabType,
      collabLabel: selectedCollab?.label,
      ...priceData,
      priceDisplay,
      description: description.trim(),
      lineImage,
      status: 'active',
      createdAt: editingAd?.createdAt || new Date().toLocaleDateString('fa-IR'),
      isOwner: true,
    });
    onClose();
  };

  const descLength = description.length;
  const remainingChars = MAX_DESC_LENGTH - descLength;
  const isNearLimit = remainingChars <= 50 && remainingChars > 0;
  const isAtLimit = remainingChars === 0;
  const selectedService = SERVICE_TYPES.find((s) => s.id === serviceTypeId);
  const percentSum = parseNumber(percentSalon) + parseNumber(percentPartner);
  const isPercentValid = percentSum === 100 && parseNumber(percentSalon) > 0;

  const hourlyNum = parseNumber(hourlyRate);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isEditMode ? 'ویرایش آگهی لاین' : 'ثبت آگهی جدید لاین'}
      snapPoint={0.92}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* هدر راهنما */}
        <Card
          variant="default"
          padding={12}
          radius={14}
          style={[s.hintCard, { borderColor: colors.primary + '30', backgroundColor: colors.primary + '08' }]}
        >
          <Icon name="info-outline" size={18} color={colors.primary} />
          <Text style={[s.hintText, { color: colors.textSecondary }]}>
            با ثبت آگهی لاین، می‌توانید همکار متخصص جذب کنید و درآمد سالن خود را افزایش دهید.
          </Text>
        </Card>

        {/* بخش ۱: عنوان آگهی */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="label" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>عنوان آگهی</Text>
          </View>
          <Input
            placeholder="مثال: لاین ناخن با تجهیزات کامل"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={errors.title}
            rightIcon={<Icon name="title" size={20} color={colors.textSecondary} />}
          />
        </View>

        {/* بخش ۲: نوع خدمت */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#4CAF5018' }]}>
              <Icon name="category" size={18} color="#4CAF50" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>نوع خدمت لاین</Text>
          </View>
          <Dropdown
            label="خدمت موردنظر *"
            placeholder="نوع خدمت لاین را انتخاب کنید"
            value={serviceTypeId}
            options={SERVICE_TYPES.map((st) => ({ id: st.id, label: st.label }))}
            onSelect={(val) => {
              setServiceTypeId(val);
              if (errors.serviceTypeId) setErrors((prev) => ({ ...prev, serviceTypeId: '' }));
            }}
          />
          {selectedService ? (
            <View style={[s.servicePreview, { backgroundColor: selectedService.color + '12', borderColor: selectedService.color + '40' }]}>
              <View style={[s.servicePreviewIconBox, { backgroundColor: selectedService.color + '25' }]}>
                <Icon name={selectedService.icon} size={20} color={selectedService.color} />
              </View>
              <View style={s.servicePreviewInfo}>
                <Text style={[s.servicePreviewLabel, { color: colors.textSecondary }]}>لاین تخصصی</Text>
                <Text style={[s.servicePreviewName, { color: selectedService.color }]} numberOfLines={1}>
                  {selectedService.label}
                </Text>
              </View>
              <Icon name="check-circle" size={20} color={selectedService.color} />
            </View>
          ) : null}
          {errors.serviceTypeId ? (
            <View style={s.errorRow}>
              <Icon name="error-outline" size={14} color="#E53935" />
              <Text style={[s.errorText, { color: '#E53935' }]}>{errors.serviceTypeId}</Text>
            </View>
          ) : null}
        </View>

        {/* بخش ۳: نوع همکاری */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#9C27B018' }]}>
              <Icon name="handshake" size={18} color="#9C27B0" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>نوع همکاری</Text>
          </View>
          <View style={s.collabGrid}>
            {COLLAB_TYPES.map((type) => {
              const isSelected = collabType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => handleCollabTypeChange(type.id)}
                  activeOpacity={0.8}
                  style={[
                    s.collabCard,
                    {
                      backgroundColor: isSelected ? type.color + '15' : colors.cardBackground,
                      borderColor: isSelected ? type.color : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={[s.collabIconBox, { backgroundColor: type.color + '20' }]}>
                    <Icon name={type.icon} size={24} color={type.color} />
                  </View>
                  <Text style={[s.collabLabel, { color: isSelected ? type.color : colors.textMain }]}>
                    {type.label}
                  </Text>
                  <Text style={[s.collabHint, { color: colors.textSecondary }]} numberOfLines={1}>
                    {type.hint}
                  </Text>
                  {isSelected ? (
                    <View style={[s.checkBadge, { backgroundColor: type.color }]}>
                      <Icon name="check" size={12} color="#fff" />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.collabType ? (
            <View style={s.errorRow}>
              <Icon name="error-outline" size={14} color="#E53935" />
              <Text style={[s.errorText, { color: '#E53935' }]}>{errors.collabType}</Text>
            </View>
          ) : null}
        </View>

        {/* بخش ۴: قیمت */}
        {collabType ? (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconBox, { backgroundColor: '#4CAF5018' }]}>
                <Icon name="attach-money" size={18} color="#4CAF50" />
              </View>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                {getPriceSectionTitle(collabType)}
              </Text>
            </View>

            {/* حالت درصدی */}
            {collabType === 'percent' ? (
              <Card variant="default" padding={14} radius={14}>
                <Text style={[s.priceHint, { color: colors.textSecondary }]}>
                  درصد سالن و همکار را وارد کنید (مجموع باید ۱۰۰٪ باشد)
                </Text>
                <View style={s.percentRow}>
                  <View style={s.percentField}>
                    <Text style={[s.percentFieldLabel, { color: colors.primary }]}>
                      سهم سالن
                    </Text>
                    <View style={[s.percentInputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                      <Input
                        placeholder="۴۰"
                        value={percentSalon}
                        onChangeText={handlePercentSalonChange}
                        keyboardType="numeric"
                        maxLength={3}
                        inputStyle={s.percentInput}
                        style={s.percentInputNoMargin}
                      />
                      <Text style={[s.percentSign, { color: colors.textSecondary }]}>٪</Text>
                    </View>
                  </View>
                  <View style={s.percentDivider}>
                    <View style={[s.percentDashLine, { backgroundColor: colors.border }]} />
                    <View style={[s.percentDash, { backgroundColor: colors.primary }]}>
                      <Icon name="swap-horiz" size={14} color="#fff" />
                    </View>
                    <View style={[s.percentDashLine, { backgroundColor: colors.border }]} />
                  </View>
                  <View style={s.percentField}>
                    <Text style={[s.percentFieldLabel, { color: '#9C27B0' }]}>
                      سهم همکار
                    </Text>
                    <View style={[s.percentInputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                      <Input
                        placeholder="۶۰"
                        value={percentPartner}
                        onChangeText={handlePercentPartnerChange}
                        keyboardType="numeric"
                        maxLength={3}
                        inputStyle={s.percentInput}
                        style={s.percentInputNoMargin}
                      />
                      <Text style={[s.percentSign, { color: colors.textSecondary }]}>٪</Text>
                    </View>
                  </View>
                </View>
                {parseNumber(percentSalon) > 0 ? (
                  <View style={[
                    s.percentSummary,
                    {
                      backgroundColor: isPercentValid ? '#4CAF5010' : '#FF980010',
                      borderColor: isPercentValid ? '#4CAF5040' : '#FF980040',
                    }
                  ]}>
                    <Icon
                      name={isPercentValid ? 'check-circle' : 'warning'}
                      size={14}
                      color={isPercentValid ? '#4CAF50' : '#FF9800'}
                    />
                    <Text style={[
                      s.percentSummaryText,
                      { color: isPercentValid ? '#4CAF50' : '#FF9800' }
                    ]}>
                      {isPercentValid
                        ? `✓ مجموع: ۱۰۰٪ (${toPersianDigits(String(parseNumber(percentSalon)))}٪ سالن + ${toPersianDigits(String(parseNumber(percentPartner)))}٪ همکار)`
                        : `مجموع فعلی: ${toPersianDigits(String(percentSum))}٪ — باید ۱۰۰٪ باشد`
                      }
                    </Text>
                  </View>
                ) : null}
                <View style={[s.priceGuideBox, { backgroundColor: '#9C27B008', borderColor: '#9C27B025' }]}>
                  <Icon name="lightbulb" size={14} color="#9C27B0" />
                  <Text style={[s.priceGuideText, { color: colors.textSecondary }]}>
                    مثال: سالن ۴۰٪ و همکار ۶۰٪ → از هر ۱۰۰,۰۰۰ تومان درآمد، ۴۰,۰۰۰ تومان به سالن و ۶۰,۰۰۰ تومان به همکار می‌رسد
                  </Text>
                </View>
              </Card>
            ) : null}

            {/* حالت اجاره ثابت */}
            {collabType === 'fixed' ? (
              <Card variant="default" padding={14} radius={14}>
                <Text style={[s.priceHint, { color: colors.textSecondary }]}>
                  مبلغ ثابت ماهانه اجاره لاین را وارد کنید. مبلغ رهن اختیاری است (می‌تواند صفر باشد).
                </Text>
                <Input
                  label="مبلغ اجاره ماهانه (تومان) *"
                  placeholder="مثال: ۵,۰۰۰,۰۰۰"
                  value={fixedAmount}
                  onChangeText={handleFixedAmountChange}
                  keyboardType="numeric"
                  rightIcon={<Text style={[s.currencyText, { color: colors.textSecondary }]}>تومان</Text>}
                />
                <Input
                  label="مبلغ رهن (اختیاری)"
                  placeholder="مثال: ۲۰,۰۰۰,۰۰۰ یا خالی بگذارید"
                  value={fixedDeposit}
                  onChangeText={handleFixedDepositChange}
                  keyboardType="numeric"
                  rightIcon={<Text style={[s.currencyText, { color: colors.textSecondary }]}>تومان</Text>}
                />
              {!!fixedAmount ? (
                <View style={[s.priceGuideBox, { backgroundColor: '#2196F308', borderColor: '#2196F325' }]}>
                  <Icon name="info-outline" size={14} color="#2196F3" />
                  <Text style={[s.priceGuideText, { color: colors.textSecondary }]}>
                    همکار ماهانه {fixedAmount} تومان به سالن پرداخت می‌کند و ۱۰۰٪ درآمد خدمات متعلق به خودش است.
                    {parseNumber(fixedDeposit) > 0 ? <Text>{` همچنین ${fixedDeposit} تومان به عنوان رهن/ودیعه دریافت می‌کنید.`}</Text> : null}
                  </Text>
                </View>
              ) : null}

                {/* FIX: از !! استفاده شد تا string به boolean تبدیل بشه */}
                {!!fixedAmount ? (
                  <View style={[s.combinedPreview, { backgroundColor: '#2196F310', borderColor: '#2196F340' }]}>
                    <View style={s.combinedPreviewHeader}>
                      <Icon name="visibility" size={14} color="#2196F3" />
                      <Text style={[s.combinedPreviewTitle, { color: '#2196F3' }]}>
                        پیش‌نمایش قیمت در آگهی
                      </Text>
                    </View>
                    <View style={s.combinedPreviewRow}>
                      <Text style={[s.combinedPreviewLabel, { color: colors.textSecondary }]}>
                        اجاره ماهانه:
                      </Text>
                      <Text style={[s.combinedPreviewValue, { color: colors.textMain }]}>
                        {fixedAmount} تومان
                      </Text>
                    </View>
                    {parseNumber(fixedDeposit) > 0 ? (
                      <View style={s.combinedPreviewRow}>
                        <Text style={[s.combinedPreviewLabel, { color: colors.textSecondary }]}>
                          رهن / ودیعه:
                        </Text>
                        <Text style={[s.combinedPreviewValue, { color: colors.textMain }]}>
                          {fixedDeposit} تومان
                        </Text>
                      </View>
                    ) : null}
                    {parseNumber(fixedDeposit) === 0 ? (
                      <View style={s.combinedPreviewRow}>
                        <Text style={[s.combinedPreviewLabel, { color: colors.textSecondary }]}>
                          رهن / ودیعه:
                        </Text>
                        <Text style={[s.combinedPreviewValue, { color: colors.textSecondary, fontStyle: 'italic' }]}>
                          بدون رهن
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </Card>
            ) : null}

            {/* حالت ساعتی */}
            {collabType === 'hourly' ? (
              <Card variant="default" padding={14} radius={14}>
                <Text style={[s.priceHint, { color: colors.textSecondary }]}>
                  مبلغی که به ازای هر ساعت استفاده از لاین دریافت می‌کنید را وارد کنید
                </Text>
                <Input
                  label="نرخ هر ساعت (تومان) *"
                  placeholder="مثال: ۱۵۰,۰۰۰"
                  value={hourlyRate}
                  onChangeText={handleHourlyRateChange}
                  keyboardType="numeric"
                  rightIcon={<Text style={[s.currencyText, { color: colors.textSecondary }]}>تومان</Text>}
                />

                {hourlyNum > 0 ? (
                  <View style={[s.combinedPreview, { backgroundColor: '#FF980010', borderColor: '#FF980040' }]}>
                    <View style={s.combinedPreviewHeader}>
                      <Icon name="schedule" size={14} color="#FF9800" />
                      <Text style={[s.combinedPreviewTitle, { color: '#FF9800' }]}>
                        پیش‌نمایش محاسبه
                      </Text>
                    </View>
                    <View style={s.combinedPreviewRow}>
                      <Text style={[s.combinedPreviewLabel, { color: colors.textSecondary }]}>
                        ۲ ساعت:
                      </Text>
                      <Text style={[s.combinedPreviewValue, { color: colors.textMain }]}>
                        {toPersianDigits((hourlyNum * 2).toLocaleString('en-US'))} تومان
                      </Text>
                    </View>
                    <View style={s.combinedPreviewRow}>
                      <Text style={[s.combinedPreviewLabel, { color: colors.textSecondary }]}>
                        ۴ ساعت:
                      </Text>
                      <Text style={[s.combinedPreviewValue, { color: colors.textMain }]}>
                        {toPersianDigits((hourlyNum * 4).toLocaleString('en-US'))} تومان
                      </Text>
                    </View>
                    <View style={s.combinedPreviewRow}>
                      <Text style={[s.combinedPreviewLabel, { color: colors.textSecondary }]}>
                        ۸ ساعت (یک روز):
                      </Text>
                      <Text style={[s.combinedPreviewValue, { color: colors.textMain }]}>
                        {toPersianDigits((hourlyNum * 8).toLocaleString('en-US'))} تومان
                      </Text>
                    </View>
                  </View>
                ) : null}

                <View style={[s.priceGuideBox, { backgroundColor: '#FF980008', borderColor: '#FF980025' }]}>
                  <Icon name="lightbulb" size={14} color="#FF9800" />
                  <Text style={[s.priceGuideText, { color: colors.textSecondary }]}>
                    مدل ساعتی برای لاین‌هایی که به صورت موقت یا چند ساعت در روز استفاده می‌شوند مناسب است. همکار فقط به ازای ساعاتی که از لاین استفاده می‌کند پرداخت می‌کند.
                  </Text>
                </View>
              </Card>
            ) : null}

            {errors.price ? (
              <View style={s.errorRow}>
                <Icon name="error-outline" size={14} color="#E53935" />
                <Text style={[s.errorText, { color: '#E53935' }]}>{errors.price}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* بخش ۵: تصویر لاین */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#FF980018' }]}>
              <Icon name="photo-camera" size={18} color="#FF9800" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>تصویر لاین</Text>
          </View>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.85}
            style={[
              s.imagePicker,
              {
                borderColor: errors.lineImage ? '#E53935' : lineImage ? colors.primary : colors.border,
                borderStyle: lineImage ? 'solid' : 'dashed',
              },
            ]}
          >
            {lineImage ? (
              <View style={s.pickedImageWrap}>
                <Image source={{ uri: lineImage }} style={s.pickedImage} />
                <View style={[s.editBadge, { backgroundColor: colors.primary }]}>
                  <Icon name="edit" size={12} color="#fff" />
                  <Text style={s.editBadgeText}>تغییر تصویر</Text>
                </View>
              </View>
            ) : (
              <View style={s.imagePlaceholder}>
                <View style={[s.placeholderIconBox, { backgroundColor: colors.primary + '20' }]}>
                  <Icon name="add-a-photo" size={36} color={colors.primary} />
                </View>
                <Text style={[s.placeholderTitle, { color: colors.textMain }]}>
                  آپلود تصویر لاین
                </Text>
                <Text style={[s.placeholderHint, { color: colors.textSecondary }]}>
                  تصویری با کیفیت از فضای لاین آپلود کنید
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.lineImage ? (
            <View style={s.errorRow}>
              <Icon name="error-outline" size={14} color="#E53935" />
              <Text style={[s.errorText, { color: '#E53935' }]}>{errors.lineImage}</Text>
            </View>
          ) : null}
        </View>

        {/* بخش ۶: توضیحات */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#2196F318' }]}>
              <Icon name="description" size={18} color="#2196F3" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>توضیحات</Text>
          </View>
          <Input
            placeholder="درباره لاین، تجهیزات، شرایط همکاری و مزایا بنویسید..."
            value={description}
            onChangeText={handleDescriptionChange}
            error={errors.description}
            multiline
            numberOfLines={4}
            maxLength={MAX_DESC_LENGTH}
            rightIcon={<Icon name="notes" size={20} color={colors.textSecondary} />}
          />
          <View style={s.charCounterRow}>
            <Icon
              name="text-fields"
              size={12}
              color={isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.textSecondary}
            />
            <Text
              style={[
                s.charCounterText,
                {
                  color: isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.textSecondary,
                },
              ]}
            >
              {toPersianDigits(String(descLength))} از {toPersianDigits(String(MAX_DESC_LENGTH))} کاراکتر
            </Text>
            <View style={{ flex: 1 }} />
            <View style={[s.charProgressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  s.charProgressFill,
                  {
                    width: `${(descLength / MAX_DESC_LENGTH) * 100}%`,
                    backgroundColor: isAtLimit ? '#E53935' : isNearLimit ? '#FF9800' : colors.primary,
                  },
                ]}
              />
            </View>
          </View>
          {isNearLimit && !isAtLimit ? (
            <View style={[s.charWarning, { backgroundColor: '#FF980010', borderColor: '#FF980030' }]}>
              <Icon name="warning" size={12} color="#FF9800" />
              <Text style={s.charWarningText}>
                فقط {toPersianDigits(String(remainingChars))} کاراکتر باقی مانده است
              </Text>
            </View>
          ) : null}
          {isAtLimit ? (
            <View style={[s.charWarning, { backgroundColor: '#E5393510', borderColor: '#E5393530' }]}>
              <Icon name="error-outline" size={12} color="#E53935" />
              <Text style={[s.charWarningText, { color: '#E53935' }]}>
                به حداکثر تعداد کاراکتر رسیدید
              </Text>
            </View>
          ) : null}
        </View>

        {/* کارت راهنما */}
        <Card
          variant="default"
          padding={14}
          radius={14}
          style={[s.tipsCard, { borderColor: colors.border }]}
        >
          <View style={s.tipsHeader}>
            <Icon name="lightbulb" size={18} color="#FFC107" />
            <Text style={[s.tipsTitle, { color: colors.textMain }]}>نکات مهم</Text>
          </View>
          <View style={s.tipsList}>
            {[
              'آگهی شما کاملاً رایگان ثبت می‌شود',
              'تصاویر با کیفیت، جذب همکار را افزایش می‌دهد',
              'شرایط همکاری را شفاف و دقیق بنویسید',
            ].map((tip, i) => (
              <View key={i} style={s.tipItem}>
                <Icon name="check-circle" size={14} color="#4CAF50" />
                <Text style={[s.tipText, { color: colors.textSecondary }]}>{tip}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* دکمه ثبت/ذخیره */}
        <View style={s.submitSection}>
          <Button
            title={isEditMode ? 'ذخیره تغییرات' : 'ثبت آگهی رایگان'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
            style={s.submitBtn}
          />
          <Text style={[s.submitHint, { color: colors.textSecondary }]}>
            {isEditMode
              ? 'تغییرات شما بلافاصله اعمال خواهد شد'
              : 'آگهی شما پس از ثبت، در بخش آگهی‌های لاین نمایش داده می‌شود'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 20 },
  hintCard: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, borderWidth: 1 },
  hintText: { fontSize: 12, fontFamily: 'Vazir', flex: 1, lineHeight: 19 },
  section: { marginBottom: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  servicePreview: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 8 },
  servicePreviewIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  servicePreviewInfo: { flex: 1, gap: 2 },
  servicePreviewLabel: { fontSize: 11, fontFamily: 'Vazir' },
  servicePreviewName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  collabGrid: { flexDirection: 'row', gap: 8 },
  collabCard: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 14, paddingHorizontal: 8, borderRadius: 14, position: 'relative', overflow: 'hidden' },
  collabIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  collabLabel: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  collabHint: { fontSize: 10, fontFamily: 'Vazir', textAlign: 'center' },
  checkBadge: { position: 'absolute', top: 6, left: 6, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  priceHint: { fontSize: 12, fontFamily: 'Vazir', marginBottom: 12, lineHeight: 18 },
  percentRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  percentField: { flex: 1, gap: 4 },
  percentFieldLabel: { fontSize: 12, fontFamily: 'Vazir-Bold', textAlign: 'center', marginBottom: 2 },
  percentInputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 8, height: 52, gap: 4 },
  percentInput: { textAlign: 'center', fontSize: 18, fontFamily: 'Vazir-Bold', paddingVertical: 0 },
  percentInputNoMargin: { marginBottom: 0, flex: 1 },
  percentSign: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  percentDivider: { alignItems: 'center', justifyContent: 'center', width: 40, paddingBottom: 8, gap: 4 },
  percentDashLine: { width: 2, height: 14, borderRadius: 1 },
  percentDash: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  percentSummary: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  percentSummaryText: { fontSize: 11, fontFamily: 'Vazir-Medium', flex: 1 },
  priceGuideBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 10, padding: 10, borderRadius: 10, borderWidth: 1 },
  priceGuideText: { fontSize: 11, fontFamily: 'Vazir', flex: 1, lineHeight: 18 },
  combinedPreview: { marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, gap: 6 },
  combinedPreviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  combinedPreviewTitle: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  combinedPreviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  combinedPreviewLabel: { fontSize: 11, fontFamily: 'Vazir' },
  combinedPreviewValue: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  currencyText: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  imagePicker: { width: '100%', minHeight: 180, borderRadius: 16, borderWidth: 2, overflow: 'hidden', position: 'relative' },
  pickedImageWrap: { width: '100%', height: 180 },
  pickedImage: { width: '100%', height: '100%' },
  editBadge: { position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  editBadgeText: { color: '#fff', fontSize: 11, fontFamily: 'Vazir-Bold' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 30 },
  placeholderIconBox: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  placeholderTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  placeholderHint: { fontSize: 11, fontFamily: 'Vazir', textAlign: 'center' },
  charCounterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -6, marginBottom: 4, paddingHorizontal: 4 },
  charCounterText: { fontSize: 11, fontFamily: 'Vazir-Medium' },
  charProgressBar: { width: 60, height: 4, borderRadius: 2, overflow: 'hidden' },
  charProgressFill: { height: '100%', borderRadius: 2 },
  charWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, marginTop: -2, marginBottom: 4 },
  charWarningText: { fontSize: 11, fontFamily: 'Vazir-Medium', color: '#FF9800' },
  tipsCard: { borderWidth: 1, marginBottom: 16 },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  tipsTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  tipsList: { gap: 8 },
  tipItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipText: { fontSize: 12, fontFamily: 'Vazir', flex: 1, lineHeight: 19 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, paddingHorizontal: 4 },
  errorText: { fontSize: 12, fontFamily: 'Vazir', flex: 1 },
  submitSection: {
    marginTop: 8,
    gap: 10,
    alignItems: 'center',
  },
  submitBtn: {
    shadowColor: '#A88B7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});