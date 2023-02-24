export const btoa = (string: string) => {
    return Buffer.from(string).toString('base64');
}