export function* mergeSortGenerator(array) {
    const getArr = [...array];
    const n = getArr.length;
    const sortedIndices = new Set();

    function* merge(start, mid, end) {
        let left = getArr.slice(start, mid + 1);
        let right = getArr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;
        while (i < left.length && j < right.length) {
            yield {
                array: [...getArr],
                compare: [start + i, mid + 1 + j],
                swap: [],
                sorted: [...sortedIndices]
            };
            if (left[i] <= right[j]) {
                getArr[k++] = left[i++];
            } else {
                getArr[k++] = right[j++];
            }
            yield {
                array: [...getArr],
                compare: [],
                swap: [k - 1],
                sorted: [...sortedIndices]
            };
        }
        while (i < left.length) {
            getArr[k++] = left[i++];
            yield {
                array: [...getArr],
                compare: [],
                swap: [k - 1],
                sorted: [...sortedIndices]
            };
        }
        while (j < right.length) {
            getArr[k++] = right[j++];
            yield {
                array: [...getArr],
                compare: [],
                swap: [k - 1],
                sorted: [...sortedIndices]
            };
        }
    }

    function* mergeSort(start, end) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        yield* mergeSort(start, mid);
        yield* mergeSort(mid + 1, end);
        yield* merge(start, mid, end);
    }

    yield* mergeSort(0, n - 1);
    // Mark all as sorted at the end
    yield {
        array: [...getArr],
        compare: [],
        swap: [],
        sorted: Array.from({ length: n }, (_, i) => i)
    };
}