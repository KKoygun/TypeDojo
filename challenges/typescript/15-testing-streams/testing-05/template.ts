import { Transform } from 'stream'

// Challenge: JsonLineParser Transform stream

export class JsonLineParser extends Transform {
  private buffer = ''

  constructor() {
    super({ objectMode: true })
  }

  _transform(chunk: Buffer | string, _encoding: string, callback: () => void): void {
    // split on newlines, parse JSON, push objects, skip blanks, emit error on invalid JSON
  }

  _flush(callback: () => void): void {
    // process any remaining buffered content
    callback()
  }
}

export function parseJsonLines<T>(input: string): T[] {
  // synchronously parse newline-delimited JSON string, return array of parsed objects
}
