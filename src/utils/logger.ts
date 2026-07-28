export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export class Logger {
  private static formatLog(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  static debug(message: string, data?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatLog(LogLevel.DEBUG, message, data));
    }
  }

  static info(message: string, data?: any): void {
    console.log(this.formatLog(LogLevel.INFO, message, data));
  }

  static warn(message: string, data?: any): void {
    console.warn(this.formatLog(LogLevel.WARN, message, data));
  }

  static error(message: string, error?: any): void {
    console.error(this.formatLog(LogLevel.ERROR, message));
    if (error) {
      console.error(error);
    }
  }
}
