import { LinkedList } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const list = new LinkedList<number>()
ok(list.toArray().length === 0, "empty list")

list.push(1)
list.push(2)
list.push(3)
ok(JSON.stringify(list.toArray()) === JSON.stringify([1,2,3]), "toArray after 3 pushes")

const collected: number[] = []
for (const v of list) collected.push(v)
ok(JSON.stringify(collected) === JSON.stringify([1,2,3]), "for...of iterates correctly")

ok([...list].length === 3, "spread works")
ok([...list][0] === 1, "spread first element")

const strList = new LinkedList<string>()
strList.push("a")
strList.push("b")
ok(JSON.stringify([...strList]) === JSON.stringify(["a","b"]), "works with strings")

// multiple iterations
const r1 = [...list]
const r2 = [...list]
ok(JSON.stringify(r1) === JSON.stringify(r2), "can iterate multiple times")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
