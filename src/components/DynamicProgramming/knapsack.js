export function* knapsackGenerator(items, capacity) {
    // Log if any weight or value is a string
    console.log("Knapsack items received:", items, "capacity:", capacity);

    items.forEach((item, idx) => {
        if (typeof item.weight === "string" || typeof item.value === "string") {
            console.log(`Item at index ${idx} has string values:`, item);
        }
    });

    const n = Array.isArray(items) ? items.length : 0;
    const cap = Number(capacity);
    if (n === 0 || isNaN(cap) || cap <= 0) {
        yield { dp: [[0]], i: 0, w: 0, selected: false };
        return;
    }
    const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));
    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= cap; w++) {
            if (i > 0) {
                console.log(
                    `i=${i}, w=${w}, weight=${items[i-1].weight} (${typeof items[i-1].weight}), value=${items[i-1].value} (${typeof items[i-1].value})`
                );
            }
            if (i === 0 || w === 0) {
                dp[i][w] = 0;
            } else if (items[i - 1].weight <= w) {
                dp[i][w] = Math.max(
                    items[i - 1].value + dp[i - 1][w - items[i - 1].weight],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
            yield {
                dp: dp.map(row => [...row]),
                i,
                w,
                selected: i > 0 && w >= items[i - 1]?.weight && dp[i][w] !== dp[i - 1][w],
            };
        }
    }
    // After the DP loops, before backtracking:
console.log("Final DP table:", dp);
    // Backtrack to find selected items
    let res = dp[n][cap];
    let w = cap;
    let selectedItems = [];
    for (let i = n; i > 0 && res > 0; i--) {
        if (res !== dp[i - 1][w]) {
            selectedItems.push(i - 1);
            res -= items[i - 1].value;
            w -= items[i - 1].weight;
        }
    }
    yield {
        dp: dp.map(row => [...row]),
        i: n,
        w: cap,
        selectedItems: selectedItems.reverse(),
        done: true
    };
}