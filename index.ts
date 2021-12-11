import yargs from 'https://deno.land/x/yargs@v17.3.0-deno/deno.ts';
import { Arguments } from 'https://deno.land/x/yargs@v17.3.0-deno/deno-types.ts';
import { Interpreter } from "./mod.ts";

const interpreter = new Interpreter(prompt);

yargs(Deno.args)
  .scriptName("brainfuck-interpreter")
  .usage('$0 <cmd> [args]')
  .command('run <file>', 'Runs BrainFuck file', (yargs: any) => {
    yargs.positional("file", {
      describe: "BrainFuck file path",
      alias: "f"
    });
    yargs.option("debug", {
      describe: "Enables debugging",
      alias: "d",
      type: "boolean"
    });
  }, async (argv: Arguments) => {
    interpreter.debug = argv.debug || false;
    const code = await Deno.readTextFile(argv.file);

    await interpreter.execute(code);
    console.log(interpreter.outputs.join(''));
  })
  .help()
  .parse();
