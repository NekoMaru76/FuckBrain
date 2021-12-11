import { Interpreter } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";

const interpreter = new Interpreter(() => "1");

await Deno.test({
  name: "Hello World",
  async fn() {
    console.log("\n");
    await interpreter.execute(`++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.`);
    assertEquals(interpreter.outputs, "Hello World!\n".split(""));
    console.log(interpreter.outputs.join(""));
  }
});
