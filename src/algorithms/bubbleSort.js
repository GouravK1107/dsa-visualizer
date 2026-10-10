/** Returns recorded steps: {type, array, indices, sorted, message}. */
export function bubbleSort(input) {
  const a = [...input], steps = [], sorted = [];
  const snap = (type, indices, message) => steps.push({ type, array: [...a], indices, sorted: [...sorted], message });
  snap('start', [], 'Initial array');
  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;
    for (let j = 0; j < end; j++) {
      snap('compare', [j, j + 1], `Compare ${a[j]} and ${a[j + 1]}`);
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        snap('swap', [j, j + 1], `Swapped: ${a[j]} now before ${a[j + 1]}`);
      }
    }
    sorted.push(end);
    if (!swapped) break;
  }
  sorted.splice(0, sorted.length, ...a.map((_, i) => i));
  snap('done', [], 'Array is sorted');
  return steps;
}
