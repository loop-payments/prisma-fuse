import { Transform, type TransformCallback } from 'stream';

export type LineTransformOptions = { stripComments: boolean };

export class LineTransform extends Transform {
  readonly #stripComments: boolean;

  #buffer: string | null;

  constructor(options: LineTransformOptions) {
    super({});
    this.#stripComments = options.stripComments;
    this.#buffer = null;
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    // No line transformations required
    if (!this.#stripComments) {
      callback(null, chunk);
      return;
    }

    let str: string;
    if (Buffer.isBuffer(chunk)) {
      str = chunk.toString();
    } else if (typeof chunk === 'string') {
      str = chunk;
    } else {
      callback(new Error('Invalid data type, expected a string or Buffer.'));
      return;
    }

    if (this.#buffer !== null) {
      this.#buffer += str;
    } else {
      this.#buffer = str;
    }

    const lines = this.#buffer.split('\n');

    // Transform all but the last line. There is a chance the final line in
    // this chunk is cut off and does not end in a `\n` character. To handle
    // this, we will store it in the #buffer value to be processed on the next
    // chunk. If this is the last chunk, it will be written on _flush().
    const lastIndex = lines.length - 1;
    for (let i = 0; i < lastIndex; i++) {
      if (
        !this.#stripComments ||
        !lines[i].startsWith('//') ||
        lines[i].startsWith('///')
      ) {
        this.push(lines[i]);
        this.push('\n');
      }
    }
    this.#buffer = lines[lastIndex];

    callback();
  }

  _flush(callback: TransformCallback) {
    if (this.#buffer !== null) {
      this.push(this.#buffer);
      this.#buffer = null;
    }
    callback();
  }
}
