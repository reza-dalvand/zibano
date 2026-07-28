import EmptyStateVariants from '../../common/EmptyStateVariants';

export default function ModelRequestEmptyState({ onCreate }) {
  return (
    <EmptyStateVariants
      variant="modelRequest"
      onAction={onCreate}
      actionLabel="ایجاد اولین درخواست مدل"
    />
  );
}