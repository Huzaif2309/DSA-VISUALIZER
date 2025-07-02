import React from 'react';
import { Code } from 'lucide-react';

const pseudocode = {
    "Bubble Sort": `procedure bubbleSort(A: list of sortable items)
    n = length(A)
    repeat
        swapped = false
        for i = 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure`,
    "Selection Sort": `procedure selectionSort(A: list of sortable items)
    n = length(A)
    for i = 0 to n-1 do
        min_idx = i
        for j = i+1 to n do
            if A[j] < A[min_idx] then
                min_idx = j
            end if
        end for
        swap(A[i], A[min_idx])
    end for
end procedure`,
    "Insertion Sort": `procedure insertionSort(A: list of sortable items)
    n = length(A)
    for i = 1 to n-1 do
        key = A[i]
        j = i-1
        while j >= 0 and A[j] > key do
            A[j+1] = A[j]
            j = j-1
        end while
        A[j+1] = key
    end for
end procedure`,
    "Merge Sort": `procedure mergeSort(A: list of sortable items)
    if length(A) <= 1 then
        return A
    end if
    
    mid = length(A) / 2
    left = mergeSort(A[0...mid])
    right = mergeSort(A[mid...length(A)])
    
    return merge(left, right)
end procedure`,
    "Quick Sort": `procedure quickSort(A: list of sortable items, low, high)
    if low < high then
        pivot = partition(A, low, high)
        quickSort(A, low, pivot-1)
        quickSort(A, pivot+1, high)
    end if
end procedure`,
    "Linear Search": `procedure linearSearch(A: list, target: number)
    for i = 0 to length(A)-1 do
        if A[i] equals target then
            return i
        end if
    end for
    return -1
end procedure`,
    "Binary Search": `procedure binarySearch(A: sorted list, target: number)
    left = 0
    right = length(A)-1
    while left <= right do
        mid = (left + right) / 2
        if A[mid] equals target then
            return mid
        else if A[mid] < target then
            left = mid + 1
        else
            right = mid - 1
        end if
    end while
    return -1
end procedure`,
    "Knapsack": `procedure knapsack(items, capacity)
    n = length(items)
    create dp[0..n][0..capacity] and initialize to 0
    for i = 1 to n:
        for w = 1 to capacity:
            if items[i-1].weight <= w:
                dp[i][w] = max(
                    items[i-1].value + dp[i-1][w - items[i-1].weight],
                    dp[i-1][w]
                )
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]
end procedure`
};

function Pseudocode({ algorithm }) {
    if (!algorithm) return null;

    if (algorithm === "Knapsack") {
        return (
            <div className="shadow-md mt-2 shadow-white p-2 w-[95%] mb-3 md:w-[90%] m-auto rounded-lg">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 lg:mb-2 flex items-center">
                    <Code className='inline-block mr-1 text-purple-500'/>  0/1 Knapsack DP Formula
                </h3>
                <div className="text-white font-mono text-[10px] mb-2">
                    <strong>DP Formula:&nbsp;</strong>
                    <span>
                        dp[i][w] = max(dp[i-1][w], value<sub>i-1</sub> + dp[i-1][w-weight<sub>i-1</sub>]) if weight<sub>i-1</sub> ≤ w<br />
                        dp[i][w] = dp[i-1][w] otherwise
                    </span>
                </div>
                <pre className="text-white font-mono text-[9px] lg:text-[10px] whitespace-pre-wrap overflow-x-auto mb-2">
                    {pseudocode["Knapsack"]}
                </pre>
                <div className="text-white text-xs mt-2">
                    <span className="font-semibold text-blue-300">Explanation:</span>
                    <ul className="list-disc ml-5">
                        <li>For each item, decide to include it or not, based on maximizing value.</li>
                        <li><b>dp[i][w]</b> is the max value for first <b>i</b> items and capacity <b>w</b>.</li>
                        <li>If item fits, take the max of including or excluding it.</li>
                        <li>Otherwise, skip the item.</li>
                    </ul>
                </div>
            </div>
        );
    }

    if (!pseudocode[algorithm]) return null;

    return (
        <div className="shadow-md mt-2 shadow-white p-2 w-[95%] mb-3 md:w-[90%] m-auto rounded-lg">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 lg:mb-2 flex items-center"><Code className='inline-block mr-1 text-purple-500'/>  Pseudocode</h3>
            <pre className="text-white font-mono text-[9px] lg:text-[10px] whitespace-pre-wrap overflow-x-auto">
                {pseudocode[algorithm]}
            </pre>
        </div>
    );
}

export default Pseudocode;
