// src/components/manageBusiness/services/ServiceEmptyState.js
import React from 'react';
import EmptyStateVariants from '../../common/EmptyStateVariants';


export default function ServiceEmptyState({ onAdd }) {
  return (
    <EmptyStateVariants
      variant="service"
      onAction={onAdd}
    />
  );
}

