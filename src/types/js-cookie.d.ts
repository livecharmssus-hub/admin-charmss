declare module 'js-cookie' {
  interface CookiesStatic {
    get(name?: string): string | undefined;
    get(): { [key: string]: string };
    set(name: string, value: string | object, options?: any): void;
    remove(name: string, options?: any): void;
  }

  const Cookies: CookiesStatic;
  export = Cookies;
}
