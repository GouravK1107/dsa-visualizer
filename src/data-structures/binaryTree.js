const toTree = (a, i = 0) => (i < a.length ? { id: i, v: a[i], l: toTree(a, 2 * i + 1), r: toTree(a, 2 * i + 2) } : null);

/**
 * General binary tree stored level by level (always a complete tree): insert fills the first free spot,
 * delete replaces the node with the deepest rightmost node. Duplicates allowed.
 * ops: insert, delete, search, inorder, preorder, postorder, levelorder, height.
 */
export function runBinaryTree(ops, initial = []) {
  const a = [...initial], steps = [];
  const snap = (type, message, marks = [], visited = []) => steps.push({
    type, message, marks, visited, index: -1, tree: toTree(a), items: [...a], labels: Object.fromEntries(a.map((_, i) => [i, String(i)])),
  });
  snap('start', 'Initial tree (values placed level by level)');
  for (const { op, args } of ops) {
    const [x] = args;
    if (op === 'insert') { a.push(x); snap('add', `Inserted ${x} in the first free spot, level by level (index ${a.length - 1})`, [a.length - 1]); }
    else if (op === 'search' || op === 'delete') {
      let at = -1;
      for (let k = 0; k < a.length && at < 0; k++) { snap('peek', `Is ${a[k]} equal to ${x}?`, [k]); if (a[k] === x) at = k; }
      if (at < 0) { snap('error', `${x} is not in the tree`); continue; }
      if (op === 'search') { snap('found', `Found ${x} at index ${at}`, [at]); continue; }
      const last = a.length - 1;
      snap('remove', `Found ${x} at index ${at}`, [at]);
      if (at === last) { a.pop(); snap('add', 'It was the deepest rightmost node: simply removed'); }
      else { snap('swap', `Copy the deepest rightmost node ${a[last]} into its place`, [at, last]); a[at] = a[last]; a.pop(); snap('add', 'Removed the deepest rightmost node', [at]); }
    } else if (op === 'height') {
      const hgt = a.length ? Math.floor(Math.log2(a.length)) + 1 : 0;
      snap('found', `Height = ${hgt} level(s)${hgt ? ` (${hgt - 1} edge(s) from root to the deepest leaf)` : ''}`);
    } else if (!a.length) snap('error', `${op}() on an empty tree`);
    else {
      const order = [];
      const visit = (i) => { order.push(i); snap('peek', `Visit ${a[i]}. Order: ${order.map((k) => a[k]).join(', ')}`, [i], [...order]); };
      const rec = (i) => { if (i >= a.length) return; if (op === 'preorder') visit(i); rec(2 * i + 1); if (op === 'inorder') visit(i); rec(2 * i + 2); if (op === 'postorder') visit(i); };
      if (op === 'levelorder') a.forEach((_, i) => visit(i)); else rec(0);
      snap('found', `${op} result: ${order.map((k) => a[k]).join(', ')}`, [], [...order]);
    }
  }
  return steps;
}
