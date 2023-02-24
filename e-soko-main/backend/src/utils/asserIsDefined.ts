export function assertIsDefined<T>(val: T): asserts val is NonNullable<T>{
    if(!val) {
        throw new Error('Exprected val but received ' + val);
    }
}