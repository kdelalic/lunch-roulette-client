// Random number generator
export default function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}
