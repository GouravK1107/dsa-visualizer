/** Disjoint Set Union with path compression and union by size. ops: find, union, connected. */
export function runDSU(ops, n = 8) {
  const parent = Array.from({ length: n }, (_, i) => i), size = Array(n).fill(1), steps = [];
  const forest = () => {
    const kids = parent.map(() => []);
    parent.forEach((p, i) => { if (p !== i) kids[p].push(i); });
    const build = (i) => ({ id: i, label: String(i), children: kids[i].map(build) });
    return parent.map((_, i) => i).filter((i) => parent[i] === i).map(build);
  };
  const snap = (type, message, marks = []) => steps.push({
    type, message, marks, visited: [], index: -1, tree: forest(), items: [...parent],
    labels: Object.fromEntries(parent.map((_, i) => [i, `idx ${i}`])),
  });
  const find = (x, tag = '') => {
    const path = [x]; let r = x;
    snap('peek', `${tag}find(${x}): start at ${x}`, [x]);
    while (parent[r] !== r) { r = parent[r]; path.push(r); snap('peek', `${tag}Go up to parent ${r}`, [...path]); }
    snap('found', `${tag}Root of ${x} is ${r}`, [r]);
    for (const v of path.slice(0, -1)) if (parent[v] !== r) { parent[v] = r; snap('add', `Path compression: ${v} now points directly to ${r}`, [v, r]); }
    return r;
  };
  snap('start', `${n} separate sets. The array below is parent[]; a root is its own parent.`);
  for (const { op, args } of ops) {
    if (args.some((x) => x >= n)) { snap('error', `Element out of range (valid: 0..${n - 1})`); continue; }
    if (op === 'find') { find(args[0]); continue; }
    const ra = find(args[0], `(${args[0]}) `), rb = find(args[1], `(${args[1]}) `);
    if (op === 'connected') snap(ra === rb ? 'found' : 'error', ra === rb ? `Yes: ${args[0]} and ${args[1]} share root ${ra}` : `No: roots ${ra} and ${rb} differ`, [ra, rb]);
    else if (ra === rb) snap('peek', `${args[0]} and ${args[1]} are already in the same set (root ${ra})`, [ra]);
    else {
      const [big, small] = size[ra] >= size[rb] ? [ra, rb] : [rb, ra];
      parent[small] = big; size[big] += size[small];
      snap('add', `Union by size: root ${small} attached under root ${big} (set size ${size[big]})`, [small, big]);
    }
  }
  return steps;
}
