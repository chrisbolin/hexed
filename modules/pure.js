const toKey = (a, b) => `${a},${b}`;

export const intToBinaryArray = (n) => (
  ('00000000' + (n).toString(2)) // left-padded string
  .split('')
  .map(n => parseInt(n, 10)) // "1" => 1
  .reverse().slice(0, 8).reverse() // last(8)
);


export const toPoint = (a, b) => {
  return {
    a, b,
    key: toKey(a, b)
  };
};