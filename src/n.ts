export const n = (m: number, s = m / 2) =>
  m +
  s *
    Math.sqrt(-2 * Math.log(Math.random())) *
    Math.sin(Math.random() * Math.PI * 2);
