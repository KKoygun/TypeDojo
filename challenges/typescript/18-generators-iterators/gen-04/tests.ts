import { range, take, fibonacci } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const collect = <T>(g: Iterable<T>) => [...g]

ok(JSON.stringify(collect(range(0, 5))) === JSON.stringify([0,1,2,3,4]), "range 0..5")
ok(JSON.stringify(collect(range(1, 10, 2))) === JSON.stringify([1,3,5,7,9]), "range with step 2")
ok(JSON.stringify(collect(range(5, 5))) === JSON.stringify([]), "range empty when start=end")
ok(JSON.stringify(collect(range(10, 13))) === JSON.stringify([10,11,12]), "range partial")

ok(JSON.stringify(collect(take([1,2,3,4,5], 3))) === JSON.stringify([1,2,3]), "take from array")
ok(JSON.stringify(collect(take(range(0,100), 5))) === JSON.stringify([0,1,2,3,4]), "take from generator")
ok(JSON.stringify(collect(take([1,2], 10))) === JSON.stringify([1,2]), "take more than available")
ok(JSON.stringify(collect(take([], 5))) === JSON.stringify([]), "take from empty")

const fibs = collect(take(fibonacci(), 10))
ok(JSON.stringify(fibs) === JSON.stringify([0,1,1,2,3,5,8,13,21,34]), "fibonacci first 10")
ok(collect(take(fibonacci(), 1))[0] === 0, "fibonacci starts at 0")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
