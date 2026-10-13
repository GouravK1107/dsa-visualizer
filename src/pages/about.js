
import { h } from '../utils/dom.js';

export function AboutPage() {
  const profileImage = h('img', {
    src: '/dsa-visualizer/src/images/Mydp.png',
    alt: 'Gourav R - Backend Developer',
    class: 'about-profile-image'
  });

  const profileLinks = [
    {
      label: 'GitHub',
      url: 'https://github.com/GouravK1107'
    },
    {
      label: 'Portfolio',
      url: 'https://gouravk1107.github.io/my-portfolio/'
    },
    {
      label: 'GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/profile/gouravr/'
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gourav-kumar-r/'
    }
  ];

  return h(
    'main',
    { class: 'page about-page' },

    h(
      'section',
      { class: 'about-profile' },

      h(
        'div',
        { class: 'about-profile-photo' },
        profileImage
      ),

      h(
        'div',
        { class: 'about-profile-content' },

        h(
          'p',
          { class: 'about-eyebrow' },
          'THE DEVELOPER BEHIND THE PROJECT'
        ),

        h('h1', {}, 'Hey, I’m Gourav R.'),

        h(
          'h2',
          { class: 'about-role' },
          'Backend Developer | Python & Django'
        ),

        h(
          'p',
          {},
          'I’m a BCA graduate from Sri Matha Degree College, affiliated with Vijayanagara Sri Krishnadevaraya University, Bellary, with a CGPA of 9.28.'
        ),

        h(
          'p',
          {},
          'I built my technical foundation through self-learning while managing my college academics. My primary interests are backend development, REST APIs, databases, system design, and building practical software projects.'
        ),

        h(
          'p',
          {},
          'I created DSA Visualizer to make data structures and algorithms easier to understand through interactive learning. The goal is simple: turn abstract concepts into something you can explore, experiment with, and learn from.'
        ),

        h(
          'p',
          {},
          'I believe in learning by building, solving problems, and continuously improving my engineering skills.'
        ),

        h(
          'div',
          { class: 'about-profile-links' },

          h(
            'a',
            {
              href: 'https://forms.gle/4hAuDeWuWoKJaKEQ6',
              target: '_blank',
              rel: 'noopener noreferrer',
              class: 'about-link'
            },
            'Share Your Feedback'
          ),

          ...profileLinks.map(({ label, url }) =>
            h(
              'a',
              {
                href: url,
                target: '_blank',
                rel: 'noopener noreferrer',
                class: 'about-link'
              },
              label
            )
          )
        )
      )
    ),

    h(
      'section',
      { class: 'about-project-note' },

      h('h2', {}, 'About DSA Visualizer'),

      h(
        'p',
        {},
        'DSA Visualizer is a free, open-use learning project built to help learners explore data structures and algorithms. It runs in the browser without requiring an account or a backend server.'
      ),

      h(
        'p',
        {},
        'Built with plain HTML, CSS, and JavaScript modules, this project reflects my approach to software development: keep things practical, understandable, and useful.'
      ),

      h('h2', {}, 'Why I Built This Project'),

      h(
        'p',
        {},
        'To be honest, I built DSA Visualizer because I personally found Data Structures and Algorithms (DSA) difficult to learn. I have always been the kind of student who understands concepts more easily when they are explained visually rather than through theory alone.'
      ),

      h(
        'p',
        {},
        'Whenever I struggled with a topic, I searched Google for websites that could help me visualise and understand it better. I found several platforms, but many felt boring, came with subscription requirements, or restricted useful features behind paywalls. I wanted something simple, interactive, and accessible that would help me learn at my own pace.'
      ),

      h(
        'p',
        {},
        'Then I asked myself: why not build it myself? As a backend developer, why shouldn’t I use my own skills to solve a problem I was personally facing? Instead of just looking for the right tool, I decided to create one. That is how DSA Visualizer came to life.'
      ),

      h(
        'p',
        {},
        'My goal is to make learning DSA easier and more engaging through visualisation and hands-on exploration. I built this project not because I had mastered every concept, but because I wanted a better way to learn them myself — and hopefully help other learners along the way.'
      ),

      h('h2', {}, 'Your Feedback Matters'),

      h(
        'p',
        {},
        'DSA Visualizer is a continuous learning project, and there is always room to improve. If you have feedback, suggestions, feature requests, or ideas that could make this tool more useful, I would genuinely love to hear from you.'
      ),

      h(
        'p',
        {},
        'Your feedback can help me identify what works, what needs improvement, and what features would make learning DSA easier for others.'
      ),

      h(
        'p',
        {},
        h(
          'a',
          {
            href: 'https://forms.gle/4hAuDeWuWoKJaKEQ6',
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'about-link'
          },
          'Share Your Feedback'
        )
      )
    )
  );
}
