/** Requires a sorted ascending array (validated by the page / caller). */
export function binarySearch(input, target) {
  const a = [...input], steps = [];
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const base = { array: a, indices: [mid], found: -1 };
    steps.push({ ...base, type: 'compare', range: [lo, hi], message: `Range [${lo}, ${hi}], middle index ${mid} holds ${a[mid]}` });
    if (a[mid] === target) { steps.push({ ...base, type: 'found', range: [lo, hi], found: mid, message: `Found ${target} at index ${mid}` }); return steps; }
    if (a[mid] < target) { lo = mid + 1; steps.push({ ...base, type: 'narrow', range: [lo, hi], message: `${a[mid]} < ${target}: search right half` }); }
    else { hi = mid - 1; steps.push({ ...base, type: 'narrow', range: [lo, hi], message: `${a[mid]} > ${target}: search left half` }); }
  }
  steps.push({ type: 'notfound', array: a, indices: [], range: [lo, hi], found: -1, message: `${target} is not in the array` });
  return steps;
}
