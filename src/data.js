// All the words on the site live here. Edit this file to update the portfolio.

export const profile = {
  first: 'Bhargav',
  rest: 'Sai Deekonda',
  course: 'B.Tech CSE (AI) · Joy University × NIAT',
  years: '2026 – 2030',
  tagline:
    'A first-year Computer Science (AI) student who learns by building: Python tools, web scrapers and AI automations.',
  email: 'bhargavsaideekonda@gmail.com',
  github: 'https://github.com/bhargavsaideekonda',
  linkedin: 'https://www.linkedin.com/in/bhargav-sai-deekonda-2091913a5',
}

export const sections = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export const about = {
  statement:
    'I learn by building. Each new idea becomes a small working tool, from a web scraper to an n8n automation.',
  stats: [
    { value: 50, suffix: '/50', label: 'Web Development, mid-sem' },
    { value: 50, suffix: '/50', label: 'Mathematics, mid-sem' },
    { value: 49, suffix: '/50', label: 'Computer Programming, mid-sem' },
    { prefix: 'Top ', value: 10, label: 'of 70+ teams, Sept 2026 hackathon' },
  ],
  interests: [
    'Artificial Intelligence & ML',
    'Automation with n8n',
    'Python tools',
    'Web development',
    'IoT',
  ],
  goals:
    'I want to become an AI/ML engineer. Next on my learning path are data structures and algorithms, NumPy and Pandas, machine learning and deep learning. In the long run, I want to build my own technology company.',
}

// Order = orbit rings, innermost first.
export const skillGroups = [
  {
    key: 'languages',
    title: 'Programming languages',
    items: ['Python', 'HTML', 'CSS'],
  },
  {
    key: 'other',
    title: 'Other skills',
    items: ['Prompt engineering', 'AI tools (ChatGPT, Claude)', 'Problem solving', 'Self-learning'],
  },
  {
    key: 'technical',
    title: 'Technical skills',
    items: [
      'Git & GitHub',
      'Terminal (Git Bash)',
      'OOP in Python',
      'Web scraping',
      'REST APIs & JSON',
      'pip & virtual environments',
      'n8n automation',
      'VS Code',
    ],
  },
]

// `pose` drives the chrome sculpture: every project reshapes it.
export const projects = [
  {
    n: '01',
    lines: ['Book', 'Scraper'],
    desc: 'A Python scraper that collects book titles, prices and ratings from books.toscrape.com and saves them to a CSV file.',
    tags: ['Python', 'requests', 'BeautifulSoup', 'CSV'],
    link: `${profile.github}/book-scraper`,
    pose: { freq: 1.25, amp: 0.3, twist: 0.0, squash: 1.0, spread: 1.0 },
  },
  {
    n: '02',
    lines: ['Weather', 'CLI'],
    desc: 'A command-line app that shows the current temperature, humidity and wind for any city using a weather API.',
    tags: ['Python', 'requests', 'REST API', 'venv'],
    link: `${profile.github}/weather-cli`,
    pose: { freq: 0.7, amp: 0.46, twist: 1.3, squash: 0.92, spread: 0.35 },
  },
  {
    n: '03',
    lines: ['Bank', 'Account', 'System'],
    desc: 'An object-oriented bank account: deposits, withdrawals and balance checks, with errors for invalid amounts such as negative withdrawals.',
    tags: ['Python', 'OOP', 'Exceptions'],
    link: `${profile.github}/bank`,
    pose: { freq: 3.1, amp: 0.1, twist: 0.0, squash: 1.16, spread: 0.0 },
  },
  {
    n: '04',
    lines: ['Number', 'Guessing', 'Game'],
    desc: 'Guess a secret number from 1 to 100 in 7 tries, with “higher” or “lower” hints after every guess.',
    tags: ['Python', 'random', 'Loops'],
    link: `${profile.github}/number-guessing-game`,
    pose: { freq: 1.9, amp: 0.3, twist: -2.1, squash: 0.82, spread: 1.4 },
  },
  {
    n: '05',
    lines: ['IoT', 'Intruder', 'Alert'],
    desc: 'An ESP32 sensor that triggers an n8n workflow (webhook → time stamp → Gmail) to email an alert the moment someone walks in.',
    tags: ['ESP32', 'n8n', 'Webhooks', 'Gmail'],
    note: 'Built at NIAT’s IoT Intruder Detector workshop',
    pose: { freq: 4.4, amp: 0.17, twist: 0.5, squash: 1.0, spread: 0.7 },
  },
]

export const poses = {
  hero: { freq: 1.1, amp: 0.24, twist: 0.4, squash: 1.0, spread: 1.0 },
  intro: { freq: 0.9, amp: 0.16, twist: 0.0, squash: 1.0, spread: 0.6 },
  contact: { freq: 0.6, amp: 0.13, twist: 0.0, squash: 1.0, spread: 0.2 },
}

// Oldest first: the timeline builds upward, one level per milestone.
export const journey = [
  {
    date: '2026 – 2030',
    tag: 'Education',
    title: 'B.Tech, Computer Science & Engineering (AI)',
    detail: 'Joy University × NIAT · currently in Semester 1',
  },
  {
    date: 'Jun 2026',
    tag: 'Certificate',
    title: 'Google AI Essentials',
    detail: 'Google, on Coursera · AI tools for everyday work, the art of prompting, and using AI responsibly',
  },
  {
    date: 'Jul 2026',
    tag: 'Certificate',
    title: 'Google Prompting Essentials',
    detail:
      'Google, on Coursera · writing and designing prompts, and using AI for data analysis and presentations',
  },
  {
    date: 'Since Aug 2026',
    tag: 'Course',
    title: 'CS50P: Introduction to Programming with Python',
    detail: 'Harvard University’s free online course · self-paced, alongside college',
  },
  {
    date: 'Sept 2026',
    tag: 'Hackathon',
    title: 'Shortlisted in the top 10 of 70+ teams',
    detail: 'Built a sign-language-to-text project with my team',
  },
  {
    date: 'Oct 2026',
    tag: 'Workshop',
    title: 'IoT Intruder Detector Mega Workshop',
    detail: 'NIAT · built a working ESP32 + n8n intruder alert',
  },
  {
    date: 'Oct 2026',
    tag: 'Academics',
    title: 'Mid-Semester Examinations',
    detail:
      '50/50 in Web Application Development, 50/50 in Mathematics for Computer Science, 49/50 in Computer Programming',
  },
  {
    date: 'Nov 2026',
    tag: 'Bootcamp',
    title: 'AI Agent Bootcamp by GenLab',
    detail: 'Joy University · building AI agents with n8n',
  },
  {
    date: '14–15 Nov 2026',
    tag: 'Hackathon',
    title: 'NASA Space Apps Challenge 2026',
    detail: 'Awarded the Galactic Problem Solver certificate for taking part in NASA’s global hackathon',
  },
]
