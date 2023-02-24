import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce, useOnChange } from "@/hooks";

export type PaginationQueryParams = Partial<{
  page: number;
  page_size: number;
}>;

const createDefaultPagination = (search: URLSearchParams): PaginationQueryParams => {
  return {
    page: Number(search.get("page") || 1) || 1,
    page_size: Number(search.get("page_size") || 5)
  }
}

export type usePaginationRet<T extends Record<string, any>> = {
  setPaginationParams: (arg: PaginationQueryParams) => void;
  debouncedPagination: PaginationQueryParams & T;
  handleChangePage: any,
  handleChangeRowsPerPage: any,
  paginationProps: any,
}

export const usePagination = <T extends Record<string, any>>(): usePaginationRet<T> => {

  const [defaultSearchParams, setSearchParams] = useSearchParams();
  const [paginationProps, setPaginationParams] = useState<PaginationQueryParams>(createDefaultPagination(defaultSearchParams));

  const handleChangePage = (event: any, newPage: number) => {
    setPaginationParams({
      ...paginationProps,
      page: newPage,
    });
  };

  const totalParams = useMemo(() => {
    return { ...paginationProps };
  }, [paginationProps]);

  const debouncedPagination = useDebounce(totalParams) as T & PaginationQueryParams;

  useOnChange(() => {
    setSearchParams(new URLSearchParams(debouncedPagination as any), {
      replace: true,
    });
  }, [debouncedPagination]);

  const handleChangeRowsPerPage = (event: any) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPaginationParams({
      page: 1,
      page_size: newPageSize,
    });
  };


  return {
    setPaginationParams,
    handleChangePage,
    handleChangeRowsPerPage,
    paginationProps,
    debouncedPagination
  }
}
