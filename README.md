# FuckBrain
Another BrainFuck interpreter written in JavaScript for Deno.

## Usage
```ts
import { Interpreter } from "https://deno.land/x/fuckbrain/mod.ts";

const code = `++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.`;
const debug = false;
const onInput = (): string | number => "R";
const TypedArray = Uint8Array;
const interpreter = new Interpreter({
  onInput, debug, TypedArray
});

await interpreter.execute(code);
console.log(interpreter.outputs.join("")); //Hello World!
```

I also added CLI file (index.ts), you could check the usage with `deno run https://deno.land/x/fuckbrain/index.ts`.

## BrainFuck Example
[Hello World!](https://deno.land/x/fuckbrain/hello_world.bf)

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Author
Discord: Sx | Stupid#9524<br />
GitHub: NekoMaru76
