import Node from "./Node.ts";
import Type from "./Type.ts";
import promosify from "./promisify.ts";

type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Uint32Array;

interface Inside {
  new(length: number): TypedArray,
  new(array: number[]): TypedArray
};
interface Options {
  onInput: Function;
  debug: boolean;
  TypedArray: Inside;
};

export default class Interpreter {
  buffer: TypedArray;
  pointer: number = 0;
  outputs: string[] = [];
  onInput: Function;
  debug: boolean;
  TypedArray: Inside;

  constructor({
    onInput, debug = false, TypedArray
  }: Options) {
    this.onInput = onInput;
    this.TypedArray = TypedArray;
    this.debug = debug;
    this.buffer = new this.TypedArray(1);
  }
  reset(): void {
    this.outputs = [];
    this.buffer = new this.TypedArray(1);
    this.pointer = 0;
  }
  execute(code: string): Promise<void> {
    return this.run(this.lexer(code));
  }
  lexer(code: string): Node[] {
    const nodes: Node[] = [];

    for (const char of code) nodes.push(new Node(char));

    return nodes;
  }
  run(nodes: Node[], type: string = "Main"): Promise<void> {
    if (!["Main", "Loop"].includes(type)) throw new Error(`type can only be Main or Loop`);

    const clones = nodes.slice();

    return promosify<void>(async () => {
      const nodes = clones;

      while (nodes.length) {
        const node = nodes.shift() as Node;

        switch (node.type) {
          case Type["+"]: {
            this.increment();

            break;
          }
          case Type["-"]: {
            this.decrement();

            break;
          }
          case Type[">"]: {
            this.next();

            break;
          }
          case Type["<"]: {
            this.previous();

            break;
          }
          case Type[","]: {
            this.input();

            break;
          }
          case Type["."]: {
            this.output();

            break;
          }
          case Type["["]: {
            const hold: Node[] = [];
            let counter = 1;

            while (nodes.length && counter) {
              const node = nodes.shift() as Node;

              switch (node.type) {
                case Type["+"]:
                case Type["-"]:
                case Type["<"]:
                case Type[">"]: {
                  hold.push(node);

                  break;
                }
                case Type["["]: {
                  counter++;

                  hold.push(node);

                  break;
                }
                case Type["]"]: {
                  if (--counter) hold.push(node);

                  break;
                }
                case Type.Unknown: break;
              }
            }

            if (counter) throw new Error(`Unexpected end of line`);

            await this.loop(hold);

            break;
          }
          case Type["]"]: throw new Error(`Unexpected token ]`);
          case Type.Unknown: break;
          default: throw new Error(`${node.type} is not a valid node type`);
        }
      }
    });
  }
  increaseBuffer(length = 1): void {
    this.buffer = new this.TypedArray([...Array.from(this.buffer), ...Array(length).fill(0)]);

    if (this.debug) console.log(`Increased buffer length to ${this.buffer.length}`);
  }
  next(): void {
    const { buffer, debug } = this;

    if (++this.pointer >= buffer.length) this.increaseBuffer(this.pointer-buffer.length+1);
    if (debug) console.log(`Moved pointer to ${this.pointer}`);
  }
  previous(): void {
    this.pointer = Math.max(0, this.pointer-1);

    if (this.debug) console.log(`Moved pointer to ${this.pointer}`);
  }
  async loop(nodes: Node[]): Promise<void> {
    while (this.buffer[this.pointer] !== 0)
      await this.run(nodes);
  }
  increment(): void {
    const v = this.buffer[this.pointer];

    this.buffer[this.pointer]++;

    if (this.debug) console.log(`Increased cell #${this.pointer} value from ${v} to ${this.buffer[this.pointer]}`);
  }
  decrement(): void {
    const v = this.buffer[this.pointer];

    this.buffer[this.pointer]--;

    if (this.debug) console.log(`Decreased cell #${this.pointer} value from ${v} to ${this.buffer[this.pointer]}`);
  }
  async input(): Promise<number> {
    const input: string | number = await this.onInput();
    let result: number = 0;

    switch (typeof input) {
      case "string": result = input.charCodeAt(0); break;
      case "number": result = input; break;
    }

    this.buffer[this.pointer] = result;
  }
  output(): void {
    const { outputs, buffer, pointer } = this;

    outputs.push(String.fromCharCode(buffer[pointer]));
  }
};
