// Challenge: LinkedList<T> implementing Iterable<T>

interface ListNode<T> { value: T; next: ListNode<T> | null }

export class LinkedList<T> implements Iterable<T> {
  private head: ListNode<T> | null = null

  push(value: T): void {
    // add to end of list
  }

  toArray(): T[] {
    return [...this]
  }

  [Symbol.iterator](): Iterator<T> {
    // walk from head to tail using a generator
  }
}
