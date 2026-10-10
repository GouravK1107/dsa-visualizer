/** Hash router (#/path) – works on any static host without server rewrites. */
export function createRouter(routes, outlet) {
  let current;
  const render = () => {
    current?.cleanup?.();
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    for (const r of routes) {
      const p = r.path.split('/').filter(Boolean);
      if (p.length !== parts.length) continue;
      const params = {};
      if (p.every((seg, i) => (seg.startsWith(':') ? ((params[seg.slice(1)] = decodeURIComponent(parts[i])), true) : seg === parts[i]))) {
        current = r.page(params); outlet.replaceChildren(current); window.scrollTo(0, 0); return;
      }
    }
    outlet.textContent = 'Page not found.'; current = null;
  };
  addEventListener('hashchange', render);
  render();
}
