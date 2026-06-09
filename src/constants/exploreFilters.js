// src/constants/exploreFilters.js

export const PROVINCES = [
    { id: 'tehran', label: 'تهران' },
    { id: 'alborz', label: 'البرز' },
    { id: 'isfahan', label: 'اصفهان' },
    { id: 'fars', label: 'فارس' },
    { id: 'khorasan', label: 'خراسان رضوی' },
  ];
  
  export const CITIES = {
    tehran: [
      { id: 'tehran-city', label: 'تهران' },
      { id: 'shemiran', label: 'شمیرانات' },
      { id: 'rey', label: 'ری' },
    ],
    alborz: [
      { id: 'karaj', label: 'کرج' },
      { id: 'fardis', label: 'فردیس' },
    ],
    isfahan: [
      { id: 'isfahan-city', label: 'اصفهان' },
      { id: 'kashan', label: 'کاشان' },
    ],
    fars: [{ id: 'shiraz', label: 'شیراز' }],
    khorasan: [{ id: 'mashhad', label: 'مشهد' }],
  };
  
  export const BUSINESS_TYPES = [
    { id: 'salon', label: 'سالن زیبایی' },
    { id: 'clinic', label: 'کلینیک پوست و مو' },
    { id: 'nail', label: 'مرکز کاشت ناخن' },
    { id: 'laser', label: 'مرکز لیزر' },
    { id: 'keratin', label: 'مرکز کراتین و رنگ مو' },
    { id: 'makeup', label: 'میکاپ و گریم' },
  ];
  
  export const MIN_RATINGS = [
    { id: '0', label: 'همه' },
    { id: '3', label: '۳ به بالا' },
    { id: '4', label: '۴ به بالا' },
    { id: '4.5', label: '۴.۵ به بالا' },
  ];
  
  export const MOCK_POSTS = [
    {
      id: 'p1',
      businessName: 'کلینیک زیبایی صدف',
      businessLogo: 'https://picsum.photos/100/100?random=1',
      businessId: 'b1',
      provinceId: 'tehran',
      cityId: 'tehran-city',
      businessTypeId: 'clinic',
      rating: 4.8,
      caption: 'فیشیال تخصصی VIP با استفاده از بهترین متریال روز دنیا ✨\nبرای رزرو نوبت به لینک بایو مراجعه کنید.',
      saved: false,
      gallery: [
        'https://picsum.photos/800/800?random=1',
        'https://picsum.photos/800/800?random=2',
      ],
    },
    {
      id: 'p2',
      businessName: 'سالن زیبایی ماهرو',
      businessLogo: 'https://picsum.photos/100/100?random=2',
      businessId: 'b2',
      provinceId: 'tehran',
      cityId: 'shemiran',
      businessTypeId: 'makeup',
      rating: 4.6,
      caption: 'میکاپ و شینیون تخصصی عروس 👰‍♀',
      saved: true,
      gallery: ['https://picsum.photos/800/800?random=3'],
    },
    {
      id: 'p3',
      businessName: 'مرکز لیزر رویال',
      businessLogo: 'https://picsum.photos/100/100?random=3',
      businessId: 'b3',
      provinceId: 'isfahan',
      cityId: 'isfahan-city',
      businessTypeId: 'laser',
      rating: 4.9,
      caption: 'تخفیف ویژه جشنواره بهاره لیزر فول بادی 🌸',
      saved: false,
      gallery: [
        'https://picsum.photos/800/800?random=4',
        'https://picsum.photos/800/800?random=5',
        'https://picsum.photos/800/800?random=6',
      ],
    },
    {
      id: 'p4',
      businessName: 'کراتین سنتر النا',
      businessLogo: 'https://picsum.photos/100/100?random=4',
      businessId: 'b4',
      provinceId: 'alborz',
      cityId: 'karaj',
      businessTypeId: 'keratin',
      rating: 4.2,
      caption: 'احیای ۱۰۰٪ موهای آسیب‌دیده با مواد برزیلی تضمینی.',
      saved: false,
      gallery: ['https://picsum.photos/800/800?random=7'],
    },
    {
      id: 'p5',
      businessName: 'ناخن کار مریم',
      businessLogo: 'https://picsum.photos/100/100?random=5',
      businessId: 'b5',
      provinceId: 'fars',
      cityId: 'shiraz',
      businessTypeId: 'nail',
      rating: 4.5,
      caption: 'طراحی مینیمال و ژلیش ناخن طبیعی 💅',
      saved: false,
      gallery: ['https://picsum.photos/800/800?random=8'],
    },
    {
      id: 'p6',
      businessName: 'سالن زیبایی افرا',
      businessLogo: 'https://picsum.photos/100/100?random=6',
      businessId: 'b6',
      provinceId: 'tehran',
      cityId: 'tehran-city',
      businessTypeId: 'salon',
      rating: 3.8,
      caption: 'رنگ و لایت تخصصی با مواد اورجینال ایتالیایی 🎨',
      saved: false,
      gallery: [
        'https://picsum.photos/800/800?random=9',
        'https://picsum.photos/800/800?random=10',
      ],
    },
    {
      id: 'p7',
      businessName: 'کلینیک ماه',
      businessLogo: 'https://picsum.photos/100/100?random=7',
      businessId: 'b7',
      provinceId: 'khorasan',
      cityId: 'mashhad',
      businessTypeId: 'clinic',
      rating: 4.7,
      caption: 'جوانسازی پوست با جدیدترین تکنولوژی روز دنیا 💫',
      saved: false,
      gallery: ['https://picsum.photos/800/800?random=11'],
    },
    {
      id: 'p8',
      businessName: 'آرایشگاه ستاره',
      businessLogo: 'https://picsum.photos/100/100?random=8',
      businessId: 'b8',
      provinceId: 'tehran',
      cityId: 'rey',
      businessTypeId: 'makeup',
      rating: 4.9,
      caption: 'گریم تخصصی عروس و نامزد با سبک اروپایی 💄',
      saved: false,
      gallery: [
        'https://picsum.photos/800/800?random=12',
        'https://picsum.photos/800/800?random=13',
        'https://picsum.photos/800/800?random=14',
      ],
    },
    {
      id: 'p9',
      businessName: 'ناخن گالری پریا',
      businessLogo: 'https://picsum.photos/100/100?random=9',
      businessId: 'b9',
      provinceId: 'alborz',
      cityId: 'fardis',
      businessTypeId: 'nail',
      rating: 4.4,
      caption: 'طراحی ناخن با سبک ژورنالی و مینیمال 💖',
      saved: false,
      gallery: ['https://picsum.photos/800/800?random=15'],
    },
  ];
  
  // کمکی: تبدیل عدد به رقم فارسی
  export const toPersianDigit = (str) =>
    String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  
  // کمکی: یافتن label بر اساس id
  export const findLabel = (arr, id) => arr.find((item) => item.id === id)?.label;