import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import { getDefaultPage, getDefaultPerPage } from "@/utils/helper";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "lodash";
import type Filter from '~/types/filter'

type Options<TypeFilter> = {
    getFilter: () => TypeFilter;
    onFetch: (filter: TypeFilter) => void | Promise<void>;
    debounceKeys? : string[];
    fetchOnMounted?: boolean;
};

/**
 * @param options
 * @description :
 * onMounted doing first fetch (you can disable by set fetchOnMounted to false)
 * then when filter change, update the query route
 * then when query route change, fetch again
 */
export function useFetchQuery<TypeFilter extends Filter>(options: Options<TypeFilter>) {
    const router = useRouter()
    const route = useRoute()


    const {
        getFilter,
        onFetch,
        fetchOnMounted = true,
    } = options;

    const defaultDebounceKeys = ["search"]

    const debounceKeys = [
        ...new Set([
            ...defaultDebounceKeys,
            ...(options.debounceKeys ?? [])
        ])
    ]

    const debouncedFetch = debounce((f: TypeFilter) => {
        onFetch(f);
    }, 300);
    const filter = ref<TypeFilter>(getFilter());

    // Flag to prevent circular watch between filter and route.query
    let isInternalUpdate = false;

    // Watch for deep changes in filter object to update the URL
    watch(
        filter,
        (newVal) => {
            if (isInternalUpdate) return;

            const query: Record<string, any> = {};
            Object.keys(newVal).forEach((key) => {
                const v = newVal[key];
                if (v !== "" && v !== null && v !== undefined) {
                    query[key] = String(v);
                }
            });

            // Compare with current route query to avoid redundant router pushes
            const currentQuery = { ...route.query };
            const allKeys = new Set([...Object.keys(query), ...Object.keys(currentQuery)]);
            const isDifferent = allKeys.size !== Object.keys(currentQuery).length ||
                [...allKeys].some(key => String(query[key] ?? '') !== String(currentQuery[key] ?? ''));

            if (isDifferent) {
                router.replace({ query });
            }
        },
        { deep: true }
    );

    // Watch for route query changes to trigger fetching and sync back to filter ref
    watch(
        () => route.query,
        (newQuery, oldQuery) => {
            // Synchronize back to filter ref if they are different (e.g. back button)
            const syncedFilter = getFilter();
            const filterKeys = new Set([
                ...Object.keys(syncedFilter),
                ...Object.keys(filter.value as Record<string, any>)
            ]);
            const isDifferent = [...filterKeys].some(key =>
                String((syncedFilter as Record<string, any>)[key] ?? '') !==
                String((filter.value as Record<string, any>)[key] ?? '')
            );

            if (isDifferent) {
                isInternalUpdate = true;
                filter.value = syncedFilter;
                nextTick(() => {
                    isInternalUpdate = false;
                });
            }

            // Only debounce if a debounce key actually changed (e.g. search text),
            // not for every query change (e.g. pagination)
            const shouldDebounce = debounceKeys.some(
                key => String(newQuery[key] ?? '') !== String((oldQuery?.[key]) ?? '')
            );

            if (shouldDebounce) {
                debouncedFetch(syncedFilter);
            } else {
                debouncedFetch.cancel();
                onFetch(syncedFilter);
            }
        },
        { deep: true }
    );

    onMounted(async () => {
        if (fetchOnMounted) {
            await onFetch(filter.value)
        }
    })

    onUnmounted(() => {
        debouncedFetch.cancel();
    });

    const resetFilter = () => {
        filter.value = {
            page: getDefaultPage(),
            perpage: getDefaultPerPage()
        } as TypeFilter;
    }

    return {
        resetFilter,
        filter
    }
}
