import Type from "./Type.ts";

export default class Node {
  type: string;

  constructor(char: string) {
    switch (char) {
      case "+": {
        this.type = Type["+"];

        break;
      }
      case "-": {
        this.type = Type["-"];

        break;
      }
      case ">": {
        this.type = Type[">"];

        break;
      }
      case "<": {
        this.type = Type["<"];

        break;
      }
      case "[": {
        this.type = Type["["];

        break;
      }
      case "]": {
        this.type = Type["]"];

        break;
      }
      case ",": {
        this.type = Type[","];

        break;
      }
      case ".": {
        this.type = Type["."];

        break;
      }
      default: this.type = Type.Unknown;
    }
  }
};
