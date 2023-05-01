declare global {
  interface String {
    toKebabCase(): string;
    toCamelCase(separator?: string): string;
  }
}

export {};
