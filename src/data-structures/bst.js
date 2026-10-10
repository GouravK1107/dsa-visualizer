const clone = (n) => n && { v: n.v, l: clone(n.l), r: clone(n.r) };
const node = (v) => ({ v, l: null, r: null });

/** Binary Search Tree (no duplicates). ops: insert, search, delete, min, max, inorder, preorder, postorder, levelorder. */
export function runBST(ops, initial = []) {
  let root = null;
  const steps = [];
  const insertQuiet = (v) => {
    if (!root) { root = node(v); return; }
    let c = root;
    for (;;) { if (v === c.v) return; const k = v < c.v ? 'l' : 'r'; if (!c[k]) { c[k] = node(v); return; } c = c[k]; }
  };
  initial.forEach(insertQuiet);
  const snap = (type, message, extra = {}) => steps.push({ type, tree: clone(root), marks: [], visited: [], message, ...extra });
  const dir = (x, c) => `Compare ${x} with ${c.v}: go ${x < c.v ? 'left' : 'right'}`;
  snap('start', 'Initial tree (initial values inserted in order)');
  for (const { op, args } of ops) {
    const [x] = args;
    if (op === 'insert') {
      if (!root) { root = node(x); snap('add', `Tree was empty: ${x} is the root`, { marks: [x] }); continue; }
      for (let c = root; ;) {
        if (x === c.v) { snap('error', `${x} already exists (duplicates ignored)`, { marks: [c.v] }); break; }
        snap('peek', dir(x, c), { marks: [c.v] });
        const k = x < c.v ? 'l' : 'r';
        if (!c[k]) { c[k] = node(x); snap('add', `Inserted ${x} as the ${k === 'l' ? 'left' : 'right'} child of ${c.v}`, { marks: [x] }); break; }
        c = c[k];
      }
    } else if (op === 'search') {
      let c = root, hit = false;
      while (c && !hit) {
        if (x === c.v) { hit = true; snap('found', `Found ${x}`, { marks: [x] }); } else { snap('peek', dir(x, c), { marks: [c.v] }); c = x < c.v ? c.l : c.r; }
      }
      if (!hit) snap('error', `${x} is not in the tree`);
    } else if (op === 'delete') {
      let p = null, c = root;
      while (c && c.v !== x) { snap('peek', dir(x, c), { marks: [c.v] }); p = c; c = x < c.v ? c.l : c.r; }
      if (!c) { snap('error', `${x} is not in the tree`); continue; }
      snap('remove', `Found ${x}`, { marks: [x] });
      const relink = (parent, old, nw) => { if (!parent) root = nw; else if (parent.l === old) parent.l = nw; else parent.r = nw; };
      if (!c.l || !c.r) { relink(p, c, c.l || c.r); snap('add', `${x} has ${c.l || c.r ? 'one child: child takes its place' : 'no children: removed'}`); }
      else {
        let sp = c, s = c.r;
        while (s.l) { snap('peek', `Looking for inorder successor: at ${s.v}`, { marks: [s.v] }); sp = s; s = s.l; }
        snap('found', `Inorder successor of ${x} is ${s.v}`, { marks: [s.v] });
        c.v = s.v; if (sp === c) c.r = s.r; else sp.l = s.r;
        snap('add', `Copied ${s.v} into the node and removed the successor`, { marks: [c.v] });
      }
    } else if (!root) snap('error', `${op}() on an empty tree`);
    else if (op === 'min' || op === 'max') {
      let c = root; const side = op === 'min' ? 'l' : 'r';
      while (c[side]) { snap('peek', `Go ${side === 'l' ? 'left' : 'right'} from ${c.v}`, { marks: [c.v] }); c = c[side]; }
      snap('found', `${op === 'min' ? 'Minimum' : 'Maximum'} is ${c.v}`, { marks: [c.v] });
    } else {
      const order = [], visit = (n) => { order.push(n.v); snap('peek', `Visit ${n.v}. Order: ${order.join(', ')}`, { marks: [n.v], visited: [...order] }); };
      if (op === 'levelorder') { const q = [root]; while (q.length) { const n = q.shift(); visit(n); if (n.l) q.push(n.l); if (n.r) q.push(n.r); } }
      else {
        const rec = (n) => { if (!n) return; if (op === 'preorder') visit(n); rec(n.l); if (op === 'inorder') visit(n); rec(n.r); if (op === 'postorder') visit(n); };
        rec(root);
      }
      snap('found', `${op} result: ${order.join(', ')}`, { visited: [...order] });
    }
  }
  return steps;
}
