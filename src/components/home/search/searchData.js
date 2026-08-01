// src/components/home/search/searchData.js

// ═══════════ 🏪 کسب‌وکارها ═══════════
export const MOCK_BUSINESSES = [
  {
    id: 'b1',
    name: 'سالن زیبایی نیلارام',
    serviceType: 'کلینیک پوست و مو',
    category: 'کلینیک پوست و مو',
    address: 'تهران، سعادت‌آباد، خیابان سرو غربی',
    rating: '۴.۹',
    ratingNum: 4.9,
    reviewsCount: 142,
    discount: 12,
    logo: 'https://picsum.photos/200?random=21',
    servicesCount: 24,
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
  },
  {
    id: 'b2',
    name: 'سالن زیبایی ماهرو',
    serviceType: 'میکاپ و گریم عروس',
    category: 'سالن زیبایی',
    address: 'تهران، نیاوران',
    rating: '۴.۷',
    ratingNum: 4.7,
    reviewsCount: 89,
    discount: 15,
    logo: 'https://picsum.photos/200?random=22',
    servicesCount: 18,
    provinceId: 'tehran',
    cityId: 'shemiran',
    VIP: false,
  },
  {
    id: 'b3',
    name: 'کلینیک رویال لیزر',
    serviceType: 'لیزر الکساندرایت',
    category: 'مرکز لیزر',
    address: 'اصفهان، خیابان چهارباغ',
    rating: '۴.۹',
    ratingNum: 4.9,
    reviewsCount: 215,
    discount: 30,
    logo: 'https://picsum.photos/200?random=23',
    servicesCount: 32,
    provinceId: 'isfahan',
    cityId: 'isfahan-city',
    VIP: true,
  },
  {
    id: 'b4',
    name: 'ناخن گالری پریا',
    serviceType: 'کاشت و طراحی ناخن',
    category: 'مرکز کاشت ناخن',
    address: 'کرج، فردیس',
    rating: '۴.۴',
    ratingNum: 4.4,
    reviewsCount: 56,
    discount: 0,
    logo: 'https://picsum.photos/200?random=26',
    servicesCount: 8,
    provinceId: 'alborz',
    cityId: 'fardis',
    VIP: false,
  },
  {
    id: 'b5',
    name: 'سالن زیبایی افرا',
    serviceType: 'رنگ و لایت مو',
    category: 'سالن زیبایی',
    address: 'تهران، ونک',
    rating: '۴.۸',
    ratingNum: 4.8,
    reviewsCount: 124,
    discount: 20,
    logo: 'https://picsum.photos/200?random=27',
    servicesCount: 20,
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
  },
];

// ═══════════ 👩‍🎨 فرصت‌های مدلینگ ═══════════
export const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    businessId: 'b1',
    city: 'تهران، سعادت‌آباد',
    serviceTypeId: 'facial',
    discount: 50,
    isUrgent: true,
    costType: 'paid',
    contactPhone: '09121234567',
    createdAt: '۱۴۰۳/۰۴/۱۰',
    expiresAt: '۱۴۰۳/۰۴/۲۰',
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    businessId: 'b4',
    city: 'کرج، فردیس',
    serviceTypeId: 'nail',
    discount: 70,
    isUrgent: false,
    costType: 'material_cost',
    contactPhone: '09129876543',
    createdAt: '۱۴۰۳/۰۴/۰۸',
    expiresAt: '۱۴۰۳/۰۴/۱۸',
  },
  {
    id: 'mr_3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    businessId: 'b5',
    city: 'تهران، نیاوران',
    serviceTypeId: 'hair',
    discount: 60,
    isUrgent: false,
    costType: 'paid',
    contactPhone: '09121112233',
    createdAt: '۱۴۰۳/۰۴/۰۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
  },
];

// ═══════════ 🏢 اجاره لاین ═══════════
export const MOCK_LINE_RENTALS = [
  {
    id: 'lr_1',
    businessId: 'b1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    serviceTypeName: 'کاشت ناخن',
    serviceTypeIcon: 'brush',
    serviceTypeColor: '#7B1FA2',
    collabType: 'percent',
    priceDisplay: '۴۰-۶۰٪',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    lineImage: 'https://picsum.photos/400/300?random=70',
    contactPhone: '09121234567',
    description: 'لاین ناخن کامل با میز حرفه‌ای',
    createdAt: '۱۴۰۳/۰۴/۱۱',
    expiresAt: '۱۴۰۳/۰۵/۱۱',
    serviceTypeId: 'nail',
  },
  {
    id: 'lr_2',
    businessId: 'b2',
    title: 'لاین میکاپ با نور طبیعی',
    serviceTypeName: 'میکاپ و گریم',
    serviceTypeIcon: 'palette',
    serviceTypeColor: '#AD1457',
    collabType: 'hourly',
    priceDisplay: '۱۵۰K / ساعت',
    businessName: 'استودیو لاویا',
    city: 'تهران، نیاوران',
    lineImage: 'https://picsum.photos/400/300?random=71',
    contactPhone: '09129876543',
    description: 'لاین میکاپ با نور طبیعی',
    createdAt: '۱۴۰۳/۰۴/۰۴',
    expiresAt: '۱۴۰۳/۰۵/۰۴',
    serviceTypeId: 'makeup',
  },
  {
    id: 'lr_3',
    businessId: 'b3',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeName: 'لیزر موهای زائد',
    serviceTypeIcon: 'flash-on',
    serviceTypeColor: '#00838F',
    collabType: 'fixed',
    priceDisplay: '۸M ماهانه',
    businessName: 'کلینیک رویال',
    city: 'اصفهان',
    lineImage: 'https://picsum.photos/400/300?random=72',
    contactPhone: '09121112233',
    description: 'لاین لیزر با دستگاه الکساندرایت ۲۰۲۴',
    createdAt: '۱۴۰۳/۰۳/۲۷',
    expiresAt: '۱۴۰۳/۰۴/۲۷',
    serviceTypeId: 'laser',
  },
];

// ═══════════ 🎯 تابع جستجو ═══════════
export const searchAll = (query) => {
  if (!query || !query.trim()) {
    return {
      businesses: [],
      modelRequests: [],
      lineRentals: [],
    };
  }

  const q = query.trim().toLowerCase();
  const matches = (text) => text && text.toLowerCase().includes(q);

  const businesses = MOCK_BUSINESSES.filter(
    (b) =>
      matches(b.name) ||
      matches(b.serviceType) ||
      matches(b.category) ||
      matches(b.address)
  );

  const modelRequests = MOCK_MODEL_REQUESTS.filter(
    (m) =>
      matches(m.title) ||
      matches(m.serviceName) ||
      matches(m.businessName) ||
      matches(m.city)
  );

  const lineRentals = MOCK_LINE_RENTALS.filter(
    (l) =>
      matches(l.title) ||
      matches(l.serviceTypeName) ||
      matches(l.businessName) ||
      matches(l.city) ||
      matches(l.description)
  );

  return { businesses, modelRequests, lineRentals };
};

// ═══════════ 📊 محاسبه تعداد نتایج ═══════════
export const getResultCounts = (results) => ({
  all:
    results.businesses.length +
    results.modelRequests.length +
    results.lineRentals.length,
  businesses: results.businesses.length,
  modelRequests: results.modelRequests.length,
  lineRentals: results.lineRentals.length,
});