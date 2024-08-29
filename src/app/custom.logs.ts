class Color {
  public black: string;
  public red: string;
  public green: string;
  public yellow: string;
  public blue: string;
  public magenta: string;
  public cyan: string;
  public white: string;

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
  private min: number;
  private sec: number;
  private mild: number;

  constructor() {
    this.min = new Date().getMinutes();
    this.sec = new Date().getSeconds();
    this.mild = new Date().getMilliseconds();
  }

  public main() {
    return `${this.min}${this.mild}${this.sec}`;
  }
}

export class Logger {
  public time: any;

  constructor() {
    this.time = new Timestamp().main();
  }

  public new(services: any[]) {
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

  public log(message: any) {
    console.log(`${new Color().green}[NODE] : ${new Color().white} ${message}`);
  }

  public warn(message: any, optionalContain?: any) {
    console.log(
      `${new Color().yellow}[NODE] : WARN ${new Color().white} ${message} ${
        optionalContain ?? ''
      }`
    );
  }

  public error(message: any, optionalContain?: any) {
    console.log(
      `${new Color().red}[NODE] : ERROR ${message} ${optionalContain ?? ''}`
    );
  }

  public array(array: any[]) {
    array.forEach((array: string) => {
      console.log(
        `${new Color().green}${new Date().toLocaleDateString()} [NODE] - ${
          this.time
        }-${new Color().yellow}${array.toUpperCase()} `
      );
    });
  }
}
