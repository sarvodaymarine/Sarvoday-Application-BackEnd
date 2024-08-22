import dns from 'dns';

export default class Email {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  async validate(): Promise<void> {
    if (!this.isValid(this.value) || !(await this.checkDNSEmailServer(this.domainName(this.value)))) {
      throw new Error('Invalid email format');
    }
  }

  private isValid(email: string): boolean {
    const emailRegex =
      /^(([^<>()[\\]\\\\.,;:\s@"]+(\.[^<>()[\\]\\\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  private domainName(email: string): string {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) {
      return '';
    }
    return email.slice(atIndex + 1);
  }

  private async checkDNSEmailServer(domainName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      dns.resolveMx(domainName, (err, mxRecords) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(mxRecords.length > 0);
      });
    });
  }

  getValue(): string {
    return this.value;
  }
}
