class Color {
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;

  constructor() {
    this.black = '\x1b[30m';
    this.red = '\x1b[31m';
    this.green = '\x1b[32m';
    this.yellow = '\x1b[33m';
    this.blue = '\x1b[34m';
    this.magenta = '\x1b[35m';
    this.cyan = '\x1b[36m';
    this.white = '\x1b[37m';
  }
}

class Timestamp {
  min: number;
  sec: number;
  mild: number;

  constructor() {
    this.min = new Date().getMinutes();
    this.sec = new Date().getSeconds();
    this.mild = new Date().getMilliseconds();
  }

  main() {
    return `${this.min}${this.mild}${this.sec}`;
  }
}

export class Logger {
  time: any;

  constructor() {
    this.time = new Timestamp().main();
  }

  new(services: any[]) {
    services.forEach((service) => {
      console.log(
        `${new Color().green}${new Date().toLocaleDateString()} [NODE] ${
          this.time
        } ${new Color().yellow} [SERVICE] ${
          new Color().green
        } ${service.toUpperCase()} `
      );
    });
  }

  log(message: any) {
    console.log(`${new Color().green}[NODE] : ${new Color().white} ${message}`);
  }

  warn(message: any, optionalContain?: any) {
    console.log(
      `${new Color().yellow}[NODE] : WARN ${new Color().white} ${message} ${
        optionalContain ?? ''
      }`
    );
  }

  error(message: any, optionalContain?: any) {
    console.log(
      `${new Color().red}[NODE] : ERROR ${message} ${optionalContain ?? ''}`
    );
  }

  array(array: any[]) {
    array.forEach((array: string) => {
      console.log(
        `${new Color().green}${new Date().toLocaleDateString()} [NODE] - ${
          this.time
        }-${new Color().yellow}${array.toUpperCase()} `
      );
    });
  }
}
