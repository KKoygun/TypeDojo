import { isCompatible, greet, makeSound, myPet, greeting, noise } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

ok(greet({ name: "Alice" }) === "Hello, Alice!", "greet with Named")
ok(greet(myPet) === "Hello, Rex!", "greet with Pet (structural compat)")
ok(makeSound(myPet) === "Rex says woof", "makeSound with Pet (structural compat)")
ok(makeSound({ name: "Cat", sound: () => "meow" }) === "Cat says meow", "makeSound with plain object")

ok(greeting === "Hello, Rex!", "greeting exported correctly")
ok(noise === "Rex says woof", "noise exported correctly")

const isString = (v: unknown): v is string => typeof v === "string"
ok(isCompatible("hello", isString) === true, "isCompatible true")
ok(isCompatible(42, isString) === false, "isCompatible false")
ok(isCompatible(null, isString) === false, "isCompatible null")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
