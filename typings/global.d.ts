declare type ClassToPlain<T> = { [key in keyof T]: T[key] };
