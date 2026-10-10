export function linearSearch(input, target) {
  const a = [...input], steps = [];
  const snap = (type, indices, message, found = -1) => steps.push({ type, array: a, indices, range: [0, a.length - 1], found, message });
  for (let i = 0; i < a.length; i++) {
    snap('compare', [i], `Is ${a[i]} equal to ${target}?`);
    if (a[i] === target) { snap('found', [i], `Found ${target} at index ${i}`, i); return steps; }
  }
  snap('notfound', [], `${target} is not in the array`);
  return steps;
}
