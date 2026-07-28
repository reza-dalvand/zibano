export const COST_TYPE_META = {
  paid: { 
    label: 'با هزینه',
    icon: 'attach-money', 
    color: '#2196F3', 
    bg: '#2196F318', 
    border: '#2196F340',
    description: 'مدل بخشی از هزینه خدمت را پرداخت می‌کند',
  },
  material_cost: { 
    label: 'با هزینه مواد',
    icon: 'science', 
    color: '#FF9800', 
    bg: '#FF980018', 
    border: '#FF980040',
    description: 'فقط هزینه مواد مصرفی دریافت می‌شود',
  },
  free: { 
    label: 'کاملاً رایگان',
    icon: 'redeem', 
    color: '#4CAF50', 
    bg: '#4CAF5018', 
    border: '#4CAF5040',
    description: 'هیچ هزینه‌ای از مدل دریافت نمی‌شود',
  },
};

export const COLLAB_TYPE_META = {
  percent: { 
    label: 'درصدی',
    longLabel: 'همکاری درصدی',
    icon: 'pie-chart', 
    color: '#9C27B0', 
    bg: '#9C27B018',
    border: '#9C27B040',
    description: 'تقسیم درآمد با درصد توافقی بین سالن و همکار',
  },
  fixed: { 
    label: 'اجاره ثابت',
    longLabel: 'اجاره ثابت',
    icon: 'attach-money', 
    color: '#2196F3', 
    bg: '#2196F318',
    border: '#2196F340',
    description: 'مبلغ ثابت ماهانه + رهن (اختیاری)',
  },
  hourly: { 
    label: 'ساعتی',
    longLabel: 'همکاری ساعتی',
    icon: 'schedule', 
    color: '#FF9800', 
    bg: '#FF980018',
    border: '#FF980040',
    description: 'به ازای هر ساعت استفاده از لاین',
  },
};

export const STATUS_META = {
  success: { label: 'موفق', color: '#43A047', icon: 'check-circle', bg: '#43A04715' },
  failed: { label: 'ناموفق', color: '#E53935', icon: 'cancel', bg: '#E5393515' },
  pending: { label: 'در انتظار', color: '#FFA000', icon: 'schedule', bg: '#FFA00015' },
  refunded: { label: 'مسترد شده', color: '#1E88E5', icon: 'undo', bg: '#1E88E515' },
};

export const APPOINTMENT_STATUS_META = {
  reserved: { label: 'رزرو شده', color: '#2196F3', icon: 'event-available', bg: '#2196F320' },
  upcoming: { label: 'نوبت آینده', color: '#2196F3', icon: 'event-available' },
  done: { label: 'انجام شده', color: '#43A047', icon: 'task-alt', bg: '#43A04720' },
  cancelled: { label: 'لغو شده', color: '#E53935', icon: 'cancel' },
  cancelled_by_salon: { label: 'لغو توسط سالن', color: '#E53935', icon: 'cancel', bg: '#E5393520' },
};

export const PAYMENT_METHOD_META = {
  online: { label: 'درگاه بانکی', icon: 'credit-card', color: '#2196F3' },
  wallet: { label: 'کیف پول', icon: 'account-balance-wallet', color: '#9C27B0' },
  refund: { label: 'استرداد به کارت', icon: 'undo', color: '#1E88E5' },
};

export const PAYMENT_TYPE_META = {
  deposit: { label: 'بیعانه', color: '#FF9800', icon: 'account-balance-wallet' },
  full_payment: { label: 'پرداخت کامل', color: '#2196F3', icon: 'payments' },
  service_purchase: { label: 'خرید سرویس', color: '#9C27B0', icon: 'workspace-premium' },
  refund: { label: 'استرداد', color: '#1E88E5', icon: 'undo' },
};