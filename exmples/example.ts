/**
 * Comprehensive TypeScript Syntax Example
 * This file demonstrates most TypeScript language features
 * to test theme syntax highlighting
 */

// 1. IMPORTS AND EXPORTS
import { Observable, Subject, BehaviorSubject } from "rxjs";
import * as fs from "fs";
import type { ComponentType } from "react";
export { default as MyComponent } from "./MyComponent";
export * from "./types";

// 2. TYPE DEFINITIONS
type StringOrNumber = string | number;
type Optional<T> = T | undefined;
type Nullable<T> = T | null;
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

// 3. INTERFACES
interface User {
  readonly id: number;
  name: string;
  email?: string;
  roles: string[];
  metadata: Record<string, any>;
}

interface GenericRepository<T, K = string> {
  findById(id: K): Promise<T | null>;
  create(entity: Omit<T, "id">): Promise<T>;
  update(id: K, updates: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
}

// 4. ENUMS
enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 5. CLASSES
abstract class Animal {
  protected readonly species: string;
  private _age: number = 0;

  constructor(species: string) {
    this.species = species;
  }

  public get age(): number {
    return this._age;
  }

  public set age(value: number) {
    if (value < 0) throw new Error("Age cannot be negative");
    this._age = value;
  }

  abstract makeSound(): string;

  protected sleep(): void {
    console.log(`${this.species} is sleeping...`);
  }
}

class Dog extends Animal implements Comparable<Dog> {
  public readonly breed: string;
  static readonly MAX_AGE = 20;

  constructor(breed: string) {
    super("Canis lupus");
    this.breed = breed;
  }

  makeSound(): string {
    return "Woof!";
  }

  compareTo(other: Dog): number {
    return this.age - other.age;
  }

  // Method overloading
  bark(): void;
  bark(times: number): void;
  bark(times?: number): void {
    const barkCount = times ?? 1;
    for (let i = 0; i < barkCount; i++) {
      console.log(this.makeSound());
    }
  }
}

// 6. GENERICS
class Container<T extends Serializable> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get<K extends keyof T>(index: number, key: K): T[K] | undefined {
    return this.items[index]?.[key];
  }

  filter<U extends T>(predicate: (item: T) => item is U): U[] {
    return this.items.filter(predicate);
  }
}

// 7. UTILITY TYPES
type UserKeys = keyof User;
type UserName = Pick<User, "name">;
type OptionalUser = Partial<User>;
type RequiredUser = Required<User>;
type UserWithoutId = Omit<User, "id">;

// 8. CONDITIONAL TYPES
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type IsArray<T> = T extends any[] ? true : false;

// 9. MAPPED TYPES
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 10. TEMPLATE LITERAL TYPES
type EventNames = "click" | "hover" | "focus";
type EventHandlers = {
  [K in EventNames as `on${Capitalize<K>}`]: (event: Event) => void;
};

// 11. FUNCTIONS
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}

const asyncFunction = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

// Higher-order function
const createLogger = <T extends (...args: any[]) => any>(fn: T): T => {
  return ((...args: Parameters<T>) => {
    console.log(`Calling ${fn.name} with args:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  }) as T;
};

// 12. DECORATORS (experimental)
function logged(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with`, args);
    return method.apply(this, args);
  };
}

// 13. NAMESPACES
namespace Utils {
  export const VERSION = "1.0.0";

  export function isString(value: unknown): value is string {
    return typeof value === "string";
  }

  export namespace Validation {
    export function isEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }
}

// 14. MODULES AND AMBIENT DECLARATIONS
declare global {
  interface Window {
    customProperty: string;
  }
}

declare module "some-library" {
  export function someFunction(): void;
}

// 15. ADVANCED PATTERNS
interface Serializable {
  serialize(): string;
}

interface Comparable<T> {
  compareTo(other: T): number;
}

// Factory pattern
class UserFactory {
  static create(type: UserRole, name: string): User {
    const baseUser: User = {
      id: Math.random(),
      name,
      roles: [type],
      metadata: {},
    };

    switch (type) {
      case UserRole.ADMIN:
        return { ...baseUser, roles: [UserRole.ADMIN, UserRole.USER] };
      case UserRole.USER:
        return { ...baseUser, email: `${name.toLowerCase()}@example.com` };
      default:
        return baseUser;
    }
  }
}

// 16. COMPLEX EXPRESSIONS AND OPERATORS
const complexCalculation = (x: number, y: number): number => {
  return x ** 2 + y ** 2 - (x * y) / 2 + Math.sqrt(x + y);
};

const nullishCoalescing = (value: string | null | undefined): string => {
  return value ?? "default";
};

const optionalChaining = (user: User | null): string | undefined => {
  return user?.metadata?.["displayName"]?.toString();
};

// 17. REGEX AND STRINGS
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

const templateString = `
  User: ${JSON.stringify({ name: "John", age: 30 })}
  Timestamp: ${new Date().toISOString()}
  Random: ${Math.random().toFixed(4)}
`;

// 18. ERROR HANDLING
class CustomError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "CustomError";
  }
}

function riskyOperation(): never {
  throw new CustomError("Something went wrong", "ERR_001", 500);
}

// 19. ASSERTIONS AND TYPE GUARDS
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === "number" && typeof obj.name === "string";
}

const processData = (data: unknown) => {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.name);
  }

  const userAssertion = data as User;
  const nonNullAssertion = data!;
};

// 20. COMPLEX TYPES WITH SYMBOLS
const uniqueSymbol = Symbol("unique");
const wellKnownSymbol = Symbol.iterator;

interface SymbolicInterface {
  [uniqueSymbol]: string;
  [Symbol.hasInstance]: boolean;
}

// 21. FINAL EXAMPLE CLASS
export default class ThemeTestComponent<T extends Record<string, any>> {
  private readonly _data: Map<string, T> = new Map();
  public static readonly DEFAULT_CONFIG = { timeout: 5000 } as const;

  constructor(
    private config: typeof ThemeTestComponent.DEFAULT_CONFIG = ThemeTestComponent.DEFAULT_CONFIG
  ) {}

  @logged
  async processItem<K extends keyof T>(
    key: string,
    transform: (value: T[K]) => Promise<T[K]>
  ): Promise<boolean> {
    const item = this._data.get(key);
    if (!item) return false;

    try {
      for (const [prop, value] of Object.entries(item)) {
        item[prop as K] = await transform(value);
      }
      return true;
    } catch (error) {
      console.error(`Processing failed for ${key}:`, error);
      throw error;
    }
  }

  *enumerate(): IterableIterator<[string, T]> {
    for (const [key, value] of this._data) {
      yield [key, value];
    }
  }
}
