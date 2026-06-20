// Challenge: structural compatibility demonstration

export function isCompatible<T>(value: unknown, check: (v: unknown) => v is T): value is T {
  return check(value)
}

export interface Animal { name: string; sound(): string }
export interface Pet extends Animal { owner: string }
export interface Named { name: string }

export function greet(a: Named): string {
  // return "Hello, {name}!"
}

export function makeSound(a: Animal): string {
  // return "{name} says {sound()}"
}

// Create a Pet and pass it to both functions — no casting needed
export const myPet: Pet = {
  name: "Rex",
  owner: "Alice",
  sound() { return "woof" }
}

export const greeting = greet(myPet)    // structural compat with Named
export const noise = makeSound(myPet)   // structural compat with Animal
