// داده‌های موقت و متادیتای تراکنش‌ها

const toPersianDigit = str =>
  String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = num =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

// وضعیت تراکنش‌ها در سمت صاحب کسب و کار
const TX_STATUS_META = {
  blocked: {
    label: 'بلوکه (در انتظار خدمت)',
    shortLabel: 'بلوکه',
    color: '#FF9800',
    icon: 'hourglass-top',
    bg: '#FF980015',
    description: 'پس از انجام خدمت، وارد چرخه تسویه می‌شود',
  },
  settling: {
    label: 'در حال تسویه',
    shortLabel: 'در حال تسویه',
    color: '#2196F3',
    icon: 'sync',
    bg: '#2196F315',
    description: 'پول در حال واریز به حساب بانکی شماست (تا ۴۸ ساعت)',
  },
  settled: {
    label: 'تسویه شده',
    shortLabel: 'تسویه شده',
    color: '#43A047',
    icon: 'check-circle',
    bg: '#43A04715',
    description: 'به حساب شما واریز شد',
  },
  refunded: {
    label: 'مسترد به مشتری',
    shortLabel: 'مسترد',
    color: '#E53935',
    icon: 'undo',
    bg: '#E5393515',
    description: 'به دلیل لغو نوبت، به حساب مشتری برگشت داده شد',
  },
};

// داده موقت تراکنش‌ها
const MOCK_TRANSACTIONS = [
  {
    id: 'tx_1',
    type: 'deposit',
    customerName: 'نازنین کریمی',
    serviceName: 'فیشیال تخصصی پوست',
    amount: 200000,
    status: 'blocked',
    appointmentDate: '۱۴۰۳/۰۴/۲۰',
    appointmentTime: '۱۰:۳۰',
    createdAt: '۱۴۰۳/۰۴/۱۰ - ۱۴:۳۲',
    trackingCode: 'TRK-1234567890',
  },
  {
    id: 'tx_2',
    type: 'deposit',
    customerName: 'الهام محمدی',
    serviceName: 'کاشت ناخن ژله‌ای',
    amount: 100000,
    status: 'settling',
    appointmentDate: '۱۴۰۳/۰۴/۱۸',
    appointmentTime: '۱۴:۳۰',
    completedAt: '۱۴۰۳/۰۴/۱۸ - ۱۶:۴۵',
    estimatedSettlement: 'تا ۱۴۰۳/۰۴/۲۰ - ساعت ۱۷',
    trackingCode: 'TRK-9876543210',
  },
  {
    id: 'tx_3',
    type: 'deposit',
    customerName: 'سمیرا قاسمی',
    serviceName: 'فیشیال VIP عروس',
    amount: 300000,
    status: 'settling',
    appointmentDate: '۱۴۰۳/۰۴/۲۲',
    appointmentTime: '۰۹:۰۰',
    completedAt: '۱۴۰۳/۰۴/۲۲ - ۱۰:۱۵',
    estimatedSettlement: 'تا ۱۴۰۳/۰۴/۲۴ - ساعت ۱۰',
    trackingCode: 'TRK-7777777777',
  },
  {
    id: 'tx_4',
    type: 'settlement',
    title: 'تسویه خودکار - نوبت فیشیال تخصصی',
    amount: 500000,
    status: 'settled',
    customerName: 'زهرا حسینی',
    serviceName: 'لیزر فول بادی',
    settledAt: '۱۴۰۳/۰۴/۲۰ - ۰۸:۱۵',
    destinationBank: 'بانک ملی',
    trackingCode: 'TRK-5555555555',
  },
  {
    id: 'tx_5',
    type: 'settlement',
    title: 'تسویه خودکار - نوبت رنگ و مش مو',
    amount: 400000,
    status: 'settled',
    customerName: 'مریم احمدی',
    serviceName: 'رنگ و لایت مو',
    settledAt: '۱۴۰۳/۰۴/۱۵ - ۱۰:۰۰',
    destinationBank: 'بانک ملی',
    trackingCode: 'TRK-1111222233',
  },
  {
    id: 'tx_6',
    type: 'refund',
    customerName: 'پریسا نوری',
    serviceName: 'میکاپ مجلسی',
    amount: 200000,
    status: 'refunded',
    createdAt: '۱۴۰۳/۰۴/۱۲ - ۱۸:۰۰',
    reason: 'لغو نوبت توسط صاحب کسب و کار',
  },
  {
    id: 'tx_7',
    type: 'deposit',
    customerName: 'فاطمه رضوی',
    serviceName: 'کراتینه مو',
    amount: 250000,
    status: 'blocked',
    appointmentDate: '۱۴۰۳/۰۴/۲۴',
    appointmentTime: '۱۵:۰۰',
    createdAt: '۱۴۰۳/۰۴/۲۰ - ۱۱:۲۰',
    trackingCode: 'TRK-4444888899',
  },
];

const MOCK_BANK_INFO = {
  ownerName: 'مریم حسینی',
  nationalId: '۰۰۱۲۳۴۵۶۷۸۹',
  sheba: '',
  cardNumber: '',
  bankName: '',
  accountNumber: '',
  isRegistered: false,
  isVerified: false,
};

const TX_TABS = [
  { id: 'all', label: 'همه' },
  { id: 'blocked', label: 'بلوکه' },
  { id: 'settling', label: 'در حال تسویه' },
  { id: 'settled', label: 'تسویه شده' },
  { id: 'refunded', label: 'مسترد شده' },
];

export {
  toPersianDigit,
  formatPrice,
  TX_STATUS_META,
  MOCK_TRANSACTIONS,
  MOCK_BANK_INFO,
  TX_TABS,
};