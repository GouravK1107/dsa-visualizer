/** graph = {nodes, adj}. Steps carry the graph so renderers stay stateless. */
export function bfs(graph, start) {
  const steps = [], visited = new Set([start]), queue = [start], order = [];
  const snap = (type, current, edge, message) => steps.push({ type, graph, visited: [...visited], current, edge, order: [...order], message });
  snap('start', start, null, `Start at ${start}; queue = [${start}]`);
  while (queue.length) {
    const u = queue.shift(); order.push(u);
    snap('visit', u, null, `Dequeue ${u}. Order so far: ${order.join(' → ')}`);
    for (const v of graph.adj[u]) {
      if (!visited.has(v)) { visited.add(v); queue.push(v); snap('explore', u, [u, v], `Discover ${v} from ${u}; queue = [${queue.join(', ')}]`); }
      else snap('skip', u, [u, v], `${v} already discovered`);
    }
  }
  snap('done', null, null, `Done. BFS order: ${order.join(' → ')}`);
  return steps;
}
