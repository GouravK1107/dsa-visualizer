export function dfs(graph, start) {
  const steps = [], visited = new Set(), order = [];
  const snap = (type, current, edge, message) => steps.push({ type, graph, visited: [...visited], current, edge, order: [...order], message });
  const visit = (u, from) => {
    visited.add(u); order.push(u);
    snap('visit', u, from ? [from, u] : null, `Visit ${u}${from ? ` (from ${from})` : ''}`);
    for (const v of graph.adj[u]) {
      if (!visited.has(v)) { visit(v, u); snap('back', u, [v, u], `Backtrack to ${u}`); }
      else snap('skip', u, [u, v], `${v} already visited`);
    }
  };
  visit(start, null);
  snap('done', null, null, `Done. DFS order: ${order.join(' → ')}`);
  return steps;
}
