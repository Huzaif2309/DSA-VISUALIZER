export function* selectionSortGenerator(array) {
    const getArr = [...array];
    const n = getArr.length;
    const sortedIndices = new Set();

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            yield {
                array: [...getArr],
                compare: [minIdx, j],
                swap: [],
                sorted: [...sortedIndices]
            };
            if (getArr[j] < getArr[minIdx]) {
                minIdx = j;
            }
        }
        // Always yield a swap step, even if minIdx === i
        [getArr[i], getArr[minIdx]] = [getArr[minIdx], getArr[i]];
        yield {
            array: [...getArr],
            compare: [i, minIdx],
            swap: [i, minIdx],
            sorted: [...sortedIndices]
        };
        sortedIndices.add(i);
    }
    // Mark all as sorted at the end
    yield {
        array: [...getArr],
        compare: [],
        swap: [],
        sorted: Array.from({ length: n }, (_, i) => i)
    };
}