export interface ResponseData {
  code: string
  message: string
  timestamp: string
  status_code: number
}

export interface ResponseError extends ResponseData {
    errors?: Record<string, string[]>,
}

export interface ResponseSingleData<T> extends ResponseData{
    payload: {
        data: T
    }
}
export interface ResponseDataCollectionWithPagination<T> extends ResponseData{
    payload: {
        meta: PaginationMeta,
        data: T[]
    }
}

export interface ResponseDataCollectionWithoutPagination<T> extends ResponseData{
    payload: {
        data: T[]
    }
}

export interface PaginationMeta {
    current_page: number,
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: {
        url: string | null,
        label: string,
        active: boolean,
    }[],
    next_page_url: string | null,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: null|number,
    total: number
}


export interface ClientSidePaginationProps<T> {
    data: T[],
    start: number;
}
