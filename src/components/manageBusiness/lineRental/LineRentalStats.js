import StatsCard from '../../common/StatsCard';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function LineRentalStats({ ads }) {
  const stats = {
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
  };
  
  return (
    <Card variant="elevated" padding={14} radius={18}>
      <View style={s.row}>
        <StatsCard icon="storefront" label="کل آگهی‌ها" value={toPersianDigit(stats.total)} color="#667eea" variant="compact" />
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <StatsCard icon="check-circle" label="فعال" value={toPersianDigit(stats.active)} color="#4CAF50" variant="compact" />
      </View>
    </Card>
  );
}