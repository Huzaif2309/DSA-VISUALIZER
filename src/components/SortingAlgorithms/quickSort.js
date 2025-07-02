export function* quickSortGenerator(array) {
    const getArr = [...array];
    const n = getArr.length;
    const sortedIndices = new Set();

    function* partition(low, high) {
        let pivot = getArr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield {
                array: [...getArr],
                compare: [j, high],
                swap: [],
                sorted: [...sortedIndices]
            };
            if (getArr[j] < pivot) {
                i++;
                [getArr[i], getArr[j]] = [getArr[j], getArr[i]];
                yield {
                    array: [...getArr],
                    compare: [i, j],
                    swap: [i, j],
                    sorted: [...sortedIndices]
                };
            }
        }
        [getArr[i + 1], getArr[high]] = [getArr[high], getArr[i + 1]];
        yield {
            array: [...getArr],
            compare: [i + 1, high],
            swap: [i + 1, high],
            sorted: [...sortedIndices]
        };
        return i + 1;
    }

    function* quickSort(low, high) {
        if (low < high) {
            const piGen = partition(low, high);
            let piResult = piGen.next();
            let pi;
            while (!piResult.done) {
                yield piResult.value;
                piResult = piGen.next();
            }
            pi = piResult.value;
            yield* quickSort(low, pi - 1);
            yield* quickSort(pi + 1, high);
        }
    }

    yield* quickSort(0, n - 1);
    // Mark all as sorted at the end
    yield {
        array: [...getArr],
        compare: [],
        swap: [],
        sorted: Array.from({ length: n }, (_, i) => i)
    };
}