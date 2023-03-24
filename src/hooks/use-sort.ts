import { useCallback, useDebugValue, useState } from 'react';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import type { SortDirection, TableCellProps, TableSortLabelProps } from '@mui/material';
import { satisfies } from 'src/logic/libs/helpers';

export type SortDir = Exclude<SortDirection, false>;

const useSort = <Cols extends string | undefined>(initialCol: Cols, initialDirection: SortDir = 'asc') => {
  const [{ column, direction }, _setSort] = useState<{ column: Cols; direction: SortDir }>({
    column: initialCol,
    direction: initialDirection,
  });
  const toggleSort = useCallback(
    (column: Cols) =>
      _setSort((currSort) => {
        if (currSort.column === column) {
          return { column, direction: currSort.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { column, direction: 'asc' };
      }),
    [_setSort]
  );
  const getCellProps = (headerCol: Cols) =>
    satisfies<TableCellProps>()({
      sortDirection: column === headerCol ? direction : false,
    });
  const getSortLabelProps = (headerCol: Cols) =>
    satisfies<TableSortLabelProps>()({
      active: column === headerCol,
      direction: column === headerCol ? direction : 'asc',
      onClick: () => toggleSort(headerCol),
      IconComponent: ArrowDropDown,
    });
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue({ column, direction });
  }
  return { column, direction, toggleSort, getCellProps, getSortLabelProps };
};

export default useSort;
