# 📊 DSA Visualizer

> A free, interactive **Data Structures and Algorithms visualisation website** built with plain HTML, CSS, and JavaScript, where you enter your own input and step through the real execution.

---
> 🌍 **Project Type: Portfolio & Open for Everyone**
>
> This project started as a part of my portfolio, but it's built to be useful for everyone. Feel free to use it, fork it, and adapt it for your own needs. Contributions, issues, and suggestions are always welcome. If you find it helpful, consider giving it a ⭐!

## 📖 About the Project

**DSA Visualizer** helps students and beginners understand data structures and algorithms by watching them run instead of only reading about them. Every visualisation is generated from the actual algorithm: you type your own array, graph, or operations, the algorithm executes on that input, and the animation replays its recorded steps.

The project is a fully static, client-side web app. There is no backend, no login, and no database, and it needs no build step or dependencies. A reusable playback engine drives every visualisation, and each algorithm or data structure is its own module.

---

## ✨ Features

- ▶️ Playback controls: Play, Pause, Next, Previous, Reset, and speed control
- ⌨️ Custom inputs for arrays, targets, graph edges, and data-structure operations, with validation and clear error messages
- 🔍 Searchable algorithm library with a detail page for each topic
- 📖 Pseudocode, Python code, complexity table, and use cases on every page
- 📈 Dashboard to mark topics as completed and track progress
- 🌙 Dark and light theme, saved in your browser
- 💾 Recently visited topics and last-used inputs saved in `localStorage`
- 🧩 Modular structure: add a new algorithm by creating one file and registering it
- 🧪 Automated tests for algorithms, data structures, parsers, and the playback engine

### 📚 Currently Available

| Type | Topics |
|---|---|
| Algorithms | Bubble Sort, Selection Sort, Linear Search, Binary Search, BFS, DFS |
| Data Structures | Array, String, Linked List, Doubly Linked List, Circular Linked List, Stack, Queue, Deque, Hash Table, Binary Search Tree |

> The code shown on each page is for reading. The animation runs the JavaScript implementation in `src/`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (ES modules) |
| Routing | Custom hash router (`#/...`) |
| Rendering | DOM and SVG, no framework |
| Storage | Browser `localStorage` |
| Testing | Node.js built-in test runner |
| Hosting | Any static host |

---

## 📁 Project Structure

```text
dsa-visualizer/
├── index.html                  # HTML entry point only
├── package.json
├── src/
│   ├── main.js                 # App boot and routes
│   ├── router.js               # Hash router
│   ├── algorithms/             # Algorithm logic + registry (index.js)
│   ├── data-structures/        # Data structure logic + registry (index.js)
│   ├── engine/
│   │   └── player.js           # Playback engine shared by all visualisations
│   ├── visualizers/            # Bars, cells, graph, buckets, and tree renderers
│   ├── pages/                  # Home, Dashboard, Library, Visualizer, About, ...
│   ├── components/             # Navbar, playback controls, complete toggle
│   ├── utils/                  # DOM helper, storage, input parsers
│   └── styles/
│       └── main.css
├── tests/
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python (only to serve the files locally) or any other static file server
- Node.js 18 or newer (only to run the tests)

### Run Locally

1. Open a terminal in the project folder.

2. Start a local server:

   ```bash
   python -m http.server 8080
   ```

   > On macOS/Linux use `python3` if `python` is not found.

3. Open the app:

   ```text
   http://localhost:8080/
   ```

> Opening `index.html` directly by double-clicking will not work, because browsers block ES modules on `file://`.

---

## 💡 Usage

1. Open the **Algorithms** or **Data Structures** page and pick a topic.
2. Enter your own input, or keep the default example.
3. Click **Visualise**.
4. Use Play, Next, Previous, and the speed selector to follow each step.
5. Read the pseudocode, complexity, and code below the visualisation.
6. Click **Mark as completed** to track progress on the Dashboard.

### 🗺️ Routes

| Route | Page |
|---|---|
| `#/` | Home |
| `#/dashboard` | Learning progress |
| `#/algorithms` | Algorithm library with search |
| `#/algorithms/:id` | Algorithm visualiser |
| `#/data-structures` | Data structures list |
| `#/data-structures/:id` | Data structure visualiser |
| `#/about` | About page |

### ➕ Adding a New Algorithm

1. Create `src/algorithms/yourAlgorithm.js` that returns the recorded steps.
2. Register it in `src/algorithms/index.js` with its name, category, complexity, pseudocode, and code.
3. Add a test in `tests/`.

The library card and detail page appear automatically.

---

## 🧪 Running Tests

Run the test suite from the project root:

```bash
npm test
```

The tests cover algorithm correctness, data-structure operations, input parsing, and the playback engine.

---

## 🌐 Deployment

There is no build step. Upload the project folder as it is to GitHub Pages, Netlify, or Vercel. Hash routing works without any server rewrite rules.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## 👤 Author

**Gourav R**

- **GitHub:** [@GouravK1107](https://github.com/GouravK1107)
- **LinkedIn:** [gourav-kumar-r](https://www.linkedin.com/in/gourav-kumar-r)
- **Portfolio:** [Gourav R](https://gouravk1107.github.io/my-portfolio)

---

⭐ If you like this project, consider giving the repository a star!
