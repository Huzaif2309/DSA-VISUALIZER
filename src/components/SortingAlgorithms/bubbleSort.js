export function* bubbleSortGenerator(array) {
    const getArr = [...array];
    const n = getArr.length;
    const sortedIndices = new Set();

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            yield {
                array: [...getArr],
                compare: [j, j + 1],
                swap: [],
                sorted: [...sortedIndices]
            };
            if (getArr[j] > getArr[j + 1]) {
                [getArr[j], getArr[j + 1]] = [getArr[j + 1], getArr[j]];
                swapped = true;
                yield {
                    array: [...getArr],
                    compare: [j, j + 1],
                    swap: [j, j + 1],
                    sorted: [...sortedIndices]
                };
            }
        }
        sortedIndices.add(n - i - 1);
    }
    // Mark all as sorted at the end
    yield {
        array: [...getArr],
        compare: [],
        swap: [],
        sorted: Array.from({ length: n }, (_, i) => i)
    };
}