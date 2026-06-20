import { map, filter, reduce, pipe, sumEvenSquares } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)
const collect = <T>(g: Iterable<T>) => [...g]

ok(JSON.stringify(collect(map([1,2,3], x => x * 2))) === JSON.stringify([2,4,6]), "map doubles")
ok(JSON.stringify(collect(map(["a","b"], s => s.toUpperCase()))) === JSON.stringify(["A","B"]), "map strings")
ok(collect(map([], (x: number) => x)).length === 0, "map empty")

ok(JSON.stringify(collect(filter([1,2,3,4,5], x => x % 2 === 0))) === JSON.stringify([2,4]), "filter evens")
ok(JSON.stringify(collect(filter(["a","bb","ccc"], s => s.length > 1))) === JSON.stringify(["bb","ccc"]), "filter strings")

ok(reduce([1,2,3,4], (a, b) => a + b, 0) === 10, "reduce sum")
ok(reduce(["a","b","c"], (a, b) => a + b, "") === "abc", "reduce concat")
ok(reduce([], (a: number, b: number) => a + b, 99) === 99, "reduce empty returns initial")

ok(JSON.stringify(collect(pipe([1,2], [3,4], [5]))) === JSON.stringify([1,2,3,4,5]), "pipe concatenates")
ok(JSON.stringify(collect(pipe([1], [], [2]))) === JSON.stringify([1,2]), "pipe skips empty")

// 2²=4, 4²=16, 6²=36, 8²=64, 10²=100, 12²=144, 14²=196, 16²=256, 18²=324, 20²=400 → sum=1540
ok(sumEvenSquares() === 1540, "sum of even squares 1..20")

// verify laziness — map/filter should not require arrays
const lazyGen = function*() { yield 1; yield 2; yield 3 }
ok(JSON.stringify(collect(map(lazyGen(), x => x + 10))) === JSON.stringify([11,12,13]), "map works on generators")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
