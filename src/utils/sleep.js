export default function sleep(duration = 1000, ...data) {
  return new Promise(resolve => setTimeout(() => resolve(...data), duration));
}
