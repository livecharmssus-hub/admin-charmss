declare module 'js-cookie' {
  interface CookiesStatic {
    get(name?: string): string | undefined;
    get(): { [key: string]: string };
    set(name: string, value: string | object, options?: Record<string, unknown>): void;
    remove(name: string, options?: Record<string, unknown>): void;
  }

  const Cookies: CookiesStatic;
  export = Cookies;
}
