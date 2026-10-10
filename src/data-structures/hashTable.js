/** Hash table with separate chaining. hash(k) = |trunc(k)| mod bucketCount. ops: insert, search, delete. */
export function runHashTable(ops, buckets = 5) {
  const t = Array.from({ length: buckets }, () => []), steps = [];
  const hash = (k) => Math.abs(Math.trunc(k)) % buckets;
  const count = () => t.reduce((s, b) => s + b.length, 0);
  const snap = (type, hot, message) => steps.push({
    type, hot, buckets: t.map((b) => [...b]), message: `${message}  (load factor ${(count() / buckets).toFixed(2)})`,
  });
  snap('start', null, `Empty table, ${buckets} buckets, hash(k) = |k| mod ${buckets}`);
  for (const { op, args } of ops) {
    const [k] = args, b = hash(k), chain = t[b], at = chain.indexOf(k);
    snap('peek', { b, i: -1 }, `hash(${k}) = ${b}: go to bucket ${b}`);
    for (let i = 0; i < (at < 0 ? chain.length : at); i++) snap('peek', { b, i }, `Bucket ${b}: ${chain[i]} ≠ ${k}, follow the chain`);
    if (op === 'insert') {
      if (at >= 0) snap('error', { b, i: at }, `${k} already exists in bucket ${b}; not inserted`);
      else { chain.push(k); snap('add', { b, i: chain.length - 1 }, chain.length > 1 ? `Collision: ${k} chained at the end of bucket ${b}` : `Stored ${k} in empty bucket ${b}`); }
    } else if (op === 'search') {
      if (at >= 0) snap('found', { b, i: at }, `Found ${k} in bucket ${b}`); else snap('error', { b, i: -1 }, `${k} not found`);
    } else if (at >= 0) { chain.splice(at, 1); snap('remove', { b, i: -1 }, `Deleted ${k} from bucket ${b}`); }
    else snap('error', { b, i: -1 }, `${k} not found, nothing deleted`);
  }
  return steps;
}
