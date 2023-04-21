import { MouseEventHandler } from 'react';
import { SortOrder } from '../types';
import { Field } from './PeopleList';

export function SortButton({
  sortOrder,
  fieldName,
  sortField,
  onClick,
}: {
  sortOrder: SortOrder;
  fieldName: Field;
  sortField: Field;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={`sortButton ${
        sortField === fieldName && sortOrder === 'desc' ? 'sortReverse' : ''
      } ${sortField === fieldName ? 'active' : ''}`}
    >
      ▲
    </button>
  );
}
