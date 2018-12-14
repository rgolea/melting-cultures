declare type Base64 = string;

export function decode(value: Base64): string {
  return new Buffer(value, 'base64').toString('utf8');
}

export function encode(value: string): Base64 {
  return new Buffer(value, 'utf8').toString('base64');
}

export function isBase64(value: string | Base64): boolean {
  const len = value.length;
  if (!len || len % 4 !== 0 || /[^A-Z0-9+\/=]/i.test(value)) {
    return false;
  }
  const firstPaddingChar = value.indexOf('=');
  return (
    firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && value[len - 1] === '=')
  );
}
