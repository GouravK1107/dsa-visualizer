/** Prefix tree for lowercase-insensitive words. ops: insert, search, prefix. Filled nodes mark word endings. */
export function runTrie(ops) {
  let id = 0;
  const mk = (c) => ({ id: id++, c, kids: new Map(), end: false });
  const root = mk('•'), steps = [];
  const toTree = (n) => ({ id: n.id, label: n.c, children: [...n.kids.keys()].sort().map((k) => toTree(n.kids.get(k))) });
  const ends = (n, out = []) => { if (n.end) out.push(n.id); n.kids.forEach((c) => ends(c, out)); return out; };
  const snap = (type, message, marks = []) => steps.push({ type, message, marks, tree: toTree(root), visited: ends(root) });
  snap('start', 'Empty trie. Filled nodes mark the end of a stored word.');
  for (const { op, args } of ops) {
    const word = args[0].toLowerCase();
    let n = root; const path = [root.id];
    if (op === 'insert') {
      for (const ch of word) {
        if (n.kids.has(ch)) { n = n.kids.get(ch); path.push(n.id); snap('peek', `'${ch}' already exists: follow it`, [...path]); }
        else { const c = mk(ch); n.kids.set(ch, c); n = c; path.push(c.id); snap('add', `Created node '${ch}'`, [...path]); }
      }
      if (n.end) snap('error', `"${word}" was already stored`, [...path]);
      else { n.end = true; snap('add', `Marked the end of word "${word}"`, [...path]); }
    } else {
      let ok = true;
      for (const ch of word) {
        if (!n.kids.has(ch)) { snap('error', `No '${ch}' after "${word.slice(0, path.length - 1)}": ${op === 'search' ? `"${word}" is not in the trie` : `no word starts with "${word}"`}`, [...path]); ok = false; break; }
        n = n.kids.get(ch); path.push(n.id); snap('peek', `Follow '${ch}'`, [...path]);
      }
      if (!ok) continue;
      if (op === 'prefix') snap('found', `Prefix "${word}" exists in the trie`, [...path]);
      else if (n.end) snap('found', `"${word}" is stored in the trie`, [...path]);
      else snap('error', `"${word}" is only a prefix of other words, not a stored word`, [...path]);
    }
  }
  return steps;
}
