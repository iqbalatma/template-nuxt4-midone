export interface ResponseData {
  code: string
  message: string
  timestamp: string
  status_code: number
}

export interface ResponseError extends ResponseData {
    errors?: Record<string, string[]>,
}

export interface PayloadDataCollectionPaginated<T> {
  meta: PaginationMeta
  data: T[]
}

export interface ResponseSingleData<T> extends ResponseData{
    payload: {
        data: T
    }
}

export interface ResponseDataCollectionWithPagination<T> extends ResponseData {
  payload: PayloadDataCollectionPaginated<T>
}

export interface ResponseDataCollectionWithoutPagination<T> extends ResponseData{
    payload: {
        data: T[]
    }
}

/** Mirrors `utils.PaginationMeta` in the Go API - no Laravel-style *_url or links fields */
export interface PaginationMeta {
    current_page: number,
    from: number,
    to: number,
    last_page: number,
    path: string,
    per_page: number,
    total: number
}


export interface ClientSidePaginationProps<T> {
    data: T[],
    start: number;
}

