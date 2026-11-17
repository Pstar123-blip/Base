// Compile-time exhaustiveness check for switches over a union.
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};
