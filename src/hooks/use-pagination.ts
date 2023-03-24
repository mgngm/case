import type { SetStateAction } from 'react';
import { useDebugValue, useCallback, useMemo, useState } from 'react';
import type { TablePaginationProps } from '@mui/material';
import { satisfies } from 'src/logic/libs/helpers';

const getTotalPages = (total: number, size: number) => Math.ceil(total / size);

export const paginate = (total: number, size: number, current: number) => {
  // calculate total pages
  const pages = getTotalPages(total, size);

  // ensure current page isn't out of range
  current = Math.min(pages, Math.max(1, current));

  // calculate start and end item indexes
  const startIndex = (current - 1) * size;
  const endIndex = Math.min(startIndex + size - 1, total - 1);

  return {
    startIndex,
    endIndex,
    sliceArgs: satisfies<Parameters<Array<0>['slice']>>()([startIndex, endIndex + 1]),
  };
};

type PaginationOptions = {
  total: number;
  initialSize?: number;
};

export const usePagination = ({
  total,
  initialSize = 10,
}: PaginationOptions): [
  [page: number, setPage: (page: SetStateAction<number>) => void],
  [rowsPerPage: number, setRowsPerPage: (rows: SetStateAction<number>) => void],
  ReturnType<typeof paginate>
] => {
  const [size, _setSize] = useState(initialSize);
  const setSize = useCallback(
    (size: SetStateAction<number>) => _setSize((curr) => Math.max(1, typeof size === 'function' ? size(curr) : size)),
    [_setSize]
  );
  const [page, _setPage] = useState(1);
  const setPage = useCallback(
    (page: SetStateAction<number>) =>
      _setPage((curr) =>
        Math.min(getTotalPages(total, size), Math.max(1, typeof page === 'function' ? page(curr) : page))
      ),
    [size, total]
  );
  const indexes = useMemo(() => paginate(total, size, page), [page, size, total]);

  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue({ page, size, indexes });
  }
  return [[page, setPage], [size, setSize], indexes];
};

export const useMuiTablePagination = ({ total, initialSize }: PaginationOptions) => {
  const [[page, setPage], [rowsPerPage, setRowsPerPage], indexes] = usePagination({ total, initialSize });
  const getPaginationProps = (idPrefix?: string) =>
    satisfies<TablePaginationProps>()({
      count: total,
      page: page - 1, // zero indexed
      onPageChange: (_, page) => setPage(page + 1),
      rowsPerPage,
      onRowsPerPageChange: (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setPage(1);
      },
      showFirstButton: true,
      showLastButton: true,
      ...(idPrefix && {
        backIconButtonProps: { id: idPrefix + '-back-button' },
        nextIconButtonProps: { id: idPrefix + '-next-button' },
        SelectProps: {
          id: idPrefix + '-rows-per-page-select',
          MenuProps: {
            id: idPrefix + '-rows-per-page-menu',
          },
        },
      }),
    });
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue({ page, rowsPerPage, indexes });
  }
  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    ...indexes,
    getPaginationProps,
  };
};

const usePaginationMethods = ({ total, initialSize }: PaginationOptions) => {
  const [[page, setPage], [rowsPerPage, setRowsPerPage], indexes] = usePagination({ total, initialSize });
  const totalPages = useMemo(() => getTotalPages(total, rowsPerPage), [rowsPerPage, total]);
  if (process.env.NODE_ENV === 'development') {
    // this env var should never change within the context of a build/session, so the order should be fine
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebugValue({ page, rowsPerPage, totalPages, indexes });
  }
  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    ...indexes,
    totalPages,
    next: () => setPage((curr) => curr + 1),
    disableNext: page === totalPages,
    prev: () => setPage((curr) => curr - 1),
    disablePrev: page === 1,
    first: () => setPage(1),
    last: () => setPage(getTotalPages(total, rowsPerPage)),
  };
};

export default usePaginationMethods;
