export function* insertionSortGenerator(array) {
    const getArr = [...array];
    const n = getArr.length;
    const sortedIndices = new Set();

    for (let i = 1; i < n; i++) {
        let key = getArr[i];
        let j = i - 1;
        // Compare key with each element on the left
        while (j >= 0) {
            yield {
                array: [...getArr],
                compare: [j, j + 1],
                swap: [],
                sorted: [...sortedIndices]
            };
            if (getArr[j] > key) {
                getArr[j + 1] = getArr[j];
                yield {
                    array: [...getArr],
                    compare: [j, j + 1],
                    swap: [j, j + 1],
                    sorted: [...sortedIndices]
                };
                j--;
            } else {
                break;
            }
        }
        getArr[j + 1] = key;
        yield {
            array: [...getArr],
            compare: [j + 1, i],
            swap: [j + 1, i],
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