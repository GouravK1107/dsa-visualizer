const mk = (v) => ({ v, l: null, r: null, h: 1 });
const H = (n) => (n ? n.h : 0);
const refresh = (n) => (n ? (n.h = 1 + Math.max(refresh(n.l), refresh(n.r))) : 0);
const bf = (n) => H(n.l) - H(n.r);
const cl = (n) => n && { v: n.v, sub: `bf ${bf(n)}`, l: cl(n.l), r: cl(n.r) };
const rotR = (y) => { const x = y.l; y.l = x.r; x.r = y; return x; };
const rotL = (x) => { const y = x.r; x.r = y.l; y.l = x; return y; };

/** AVL tree (self-balancing BST, no duplicates). ops: insert, delete, search, inorder. Each node shows its balance factor. */
export function runAVL(ops, initial = []) {
  let root = null, quiet = true;
  const steps = [];
  const snap = (type, message, marks = []) => { if (quiet) return; refresh(root); steps.push({ type, message, marks, visited: [], tree: cl(root) }); };
  const attach = (parent, old, nw) => { if (!parent) root = nw; else if (parent.l === old) parent.l = nw; else parent.r = nw; };

  function rebalance(path, stopAfterRotation) {
    for (let i = path.length - 1; i >= 0; i--) {
      const n = path[i], parent = path[i - 1];
      refresh(root);
      const b = bf(n);
      if (Math.abs(b) <= 1) { snap('peek', `Check ${n.v}: balance factor ${b} is fine`, [n.v]); continue; }
      if (b > 1) {
        const lr = bf(n.l) < 0;
        snap('remove', `${n.v} is unbalanced (balance factor ${b}): ${lr ? 'Left-Right' : 'Left-Left'} case`, [n.v]);
        if (lr) { n.l = rotL(n.l); snap('swap', 'Step 1: rotate left on the left child', [n.l.v]); }
        const top = rotR(n); attach(parent, n, top);
        snap('swap', `${lr ? 'Step 2: ' : ''}rotate right on ${n.v}; ${top.v} becomes the subtree root`, [top.v]);
      } else {
        const rl = bf(n.r) > 0;
        snap('remove', `${n.v} is unbalanced (balance factor ${b}): ${rl ? 'Right-Left' : 'Right-Right'} case`, [n.v]);
        if (rl) { n.r = rotR(n.r); snap('swap', 'Step 1: rotate right on the right child', [n.r.v]); }
        const top = rotL(n); attach(parent, n, top);
        snap('swap', `${rl ? 'Step 2: ' : ''}rotate left on ${n.v}; ${top.v} becomes the subtree root`, [top.v]);
      }
      if (stopAfterRotation) return;
    }
  }
  const insert = (v) => {
    const path = []; let c = root;
    while (c) {
      if (v === c.v) { snap('error', `${v} already exists (duplicates ignored)`, [v]); return; }
      snap('peek', `Compare ${v} with ${c.v}: go ${v < c.v ? 'left' : 'right'}`, [c.v]); path.push(c); c = v < c.v ? c.l : c.r;
    }
    const nn = mk(v);
    if (!path.length) root = nn; else if (v < path.at(-1).v) path.at(-1).l = nn; else path.at(-1).r = nn;
    snap('add', `Inserted ${v}; now check balance on the way back up`, [v]);
    rebalance(path, true);
    snap('found', 'All balance factors are between -1 and 1');
  };
  const remove = (v) => {
    const path = []; let c = root;
    while (c && c.v !== v) { snap('peek', `Compare ${v} with ${c.v}: go ${v < c.v ? 'left' : 'right'}`, [c.v]); path.push(c); c = v < c.v ? c.l : c.r; }
    if (!c) { snap('error', `${v} is not in the tree`); return; }
    snap('remove', `Found ${v}`, [v]);
    if (c.l && c.r) {
      path.push(c); let s = c.r;
      while (s.l) { snap('peek', `Looking for inorder successor: at ${s.v}`, [s.v]); path.push(s); s = s.l; }
      snap('found', `Inorder successor is ${s.v}`, [s.v]);
      const sp = path.at(-1); c.v = s.v; if (sp === c) c.r = s.r; else sp.l = s.r;
      snap('add', `Copied ${s.v} up and removed the successor`, [c.v]);
    } else { attach(path.at(-1), c, c.l || c.r); snap('add', `Removed ${v}`); }
    rebalance(path, false);
    snap('found', 'All balance factors are between -1 and 1');
  };
  initial.forEach(insert);
  quiet = false;
  snap('start', 'Initial tree. Under each node: balance factor = height(left) - height(right)');
  for (const { op, args } of ops) {
    const [x] = args;
    if (op === 'insert') insert(x);
    else if (op === 'delete') remove(x);
    else if (op === 'search') {
      let c = root, hit = false;
      while (c && !hit) { if (c.v === x) { hit = true; snap('found', `Found ${x}`, [x]); } else { snap('peek', `Compare ${x} with ${c.v}: go ${x < c.v ? 'left' : 'right'}`, [c.v]); c = x < c.v ? c.l : c.r; } }
      if (!hit) snap('error', `${x} is not in the tree`);
    } else if (!root) snap('error', 'inorder() on an empty tree');
    else {
      const order = [];
      const rec = (n) => { if (!n) return; rec(n.l); order.push(n.v); snap('peek', `Visit ${n.v}. Order: ${order.join(', ')}`, [n.v]); rec(n.r); };
      rec(root); snap('found', `inorder result: ${order.join(', ')} (always sorted)`);
    }
  }
  return steps;
}
