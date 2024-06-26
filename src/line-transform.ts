import { Transform, type TransformCallback } from 'stream';

export type LineTransformOptions = {
  stripComments: boolean;
  namespace?: string;
};

const COMMENT_REGEX = /^\s*\/{2}([^\/]|$)/;

export class LineTransform extends Transform {
  readonly #stripComments: boolean;
  readonly #namespace: string | undefined;

  #buffer: string | null;

  constructor(options: LineTransformOptions) {
    super({});
    this.#stripComments = options.stripComments;
    this.#namespace = options.namespace;
    this.#buffer = null;
  }

  /**
   * Strips lines that only contain a comment starting with `//`. If the line
   * starts with `///` it will not be stripped.
   */
  #shouldStripCommentLine(line: string) {
    return this.#stripComments && line.match(COMMENT_REGEX) != null;
  }

  _transform(
    chunk: any,
    _encoding: BufferEncoding,
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
      if (!this.#shouldStripCommentLine(lines[i])) {
        if (this.#namespace && lines[i].startsWith('model')) {
          this.push(`/// @namespace ${this.#namespace}\n`);
        }
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
