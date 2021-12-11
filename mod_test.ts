import { Interpreter } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

const debug = false;
const onInput = (): string | number => "R";
const TypedArray = Uint8Array;
const interpreter = new Interpreter({
  onInput, debug, TypedArray
});

await Deno.test({
  name: "Hello World",
  async fn() {
    await interpreter.execute(`++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.`);
    assertEquals(interpreter.outputs, "Hello World!\n".split(""));
  }
});

await Deno.test({
  name: "Size Limit",
  async fn() {
    interpreter.reset();
    await interpreter.execute(`-.+.`);
    assertEquals(interpreter.outputs, [String.fromCharCode(255), String.fromCharCode(0)]);
  }
});
