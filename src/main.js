import { h } from './utils/dom.js';
import { createRouter } from './router.js';
import { Navbar, initTheme } from './components/navbar.js';
import { HomePage } from './pages/home.js';
import { LibraryPage } from './pages/library.js';
import { VisualizerPage } from './pages/visualizer.js';
import { AboutPage } from './pages/about.js';
import { DataStructuresPage } from './pages/dataStructures.js';
import { DataStructurePage } from './pages/dsVisualizer.js';
import { DashboardPage } from './pages/dashboard.js';

initTheme();
const outlet = h('div', { id: 'outlet' });
document.getElementById('app').append(Navbar(), outlet, h('footer', { class: 'footer' }, 'Free and open to use.'));
createRouter([
  { path: '', page: HomePage },
  { path: 'algorithms', page: LibraryPage },
  { path: 'algorithms/:id', page: VisualizerPage },
  { path: 'data-structures', page: DataStructuresPage },
  { path: 'data-structures/:id', page: DataStructurePage },
  { path: 'dashboard', page: DashboardPage },
  { path: 'about', page: AboutPage },
], outlet);
