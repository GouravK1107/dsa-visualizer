export function selectionSort(input) {
  const a = [...input], steps = [], sorted = [];
  const snap = (type, indices, message) => steps.push({ type, array: [...a], indices, sorted: [...sorted], message });
  snap('start', [], 'Initial array');
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      snap('compare', [min, j], `Compare current minimum ${a[min]} with ${a[j]}`);
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      snap('swap', [i, min], `Moved minimum ${a[i]} to position ${i}`);
    }
    sorted.push(i);
  }
  sorted.splice(0, sorted.length, ...a.map((_, i) => i));
  snap('done', [], 'Array is sorted');
  return steps;
}
