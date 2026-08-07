// Seed content for the ASEPH Learning Academy, derived from the
// "Building a Learning Academy on SharePoint" design guide.

export const seedData = {
  site: {
    name: 'ASEPH Academy',
    tagline: 'Grow with ASEPH Academy',
    heroSubtitle:
      'A training hub for reliability, calibration, and lab skills — browse courses, follow a role-based path, and track your progress.',
    footerNote: 'ASEPH Learning Academy · an internal training hub',
  },

  team: {
    title: 'Meet Our IT & Engineering Team',
    description: 'The dedicated experts leading reliability, training, cloud architecture, and compliance across ASEPH.',
    members: [
      { id: 'tm1', name: 'J. Ramirez', role: 'Lead Reliability Engineer & Trainer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', bio: 'Specializes in TCT, HAST testing standards, and compliance training.' },
      { id: 'tm2', name: 'M. Santos', role: 'Senior Systems Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', bio: 'Leads SharePoint tenant governance, security policies, and infrastructure.' },
      { id: 'tm3', name: 'A. Dela Peña', role: 'Data Analytics Specialist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', bio: 'Drives Power BI dashboards, automated lab reporting, and Excel data models.' },
      { id: 'tm4', name: 'R. Cruz', role: 'Metrology & Calibration Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', bio: 'Oversees equipment metrology, calibration workflows, and 5S standards.' }
    ],
  },

  theme: {
    primaryColor: '#0078d4',
    secondaryColor: '#107c41',
    bgColor: '#0b0f19',
    cardBg: '#161e2e',
    textColor: '#f3f4f6',
    headerTitle: 'ASEPH Academy',
    carousel: [
      { id: 'slide1', title: 'SharePoint & IT Training Hub', subtitle: 'Accelerate your technical mastery in security, reliability, and enterprise tools.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', buttonText: 'Explore Courses', buttonUrl: '/catalog' },
      { id: 'slide2', title: 'Interactive Learning Paths', subtitle: 'Structured step-by-step career development tracks for engineers and technicians.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80', buttonText: 'View Paths', buttonUrl: '/paths' }
    ],
    layout: ['carousel', 'quickLinks', 'news', 'team', 'courses', 'resources', 'events', 'progress']
  },

  quickLinks: [
    { id: 'ql1', label: 'New Hire?', to: '/paths', description: 'Start the onboarding path' },
    { id: 'ql2', label: 'Browse courses', to: '/catalog', description: 'See the full catalog' },
    { id: 'ql3', label: 'My progress', to: '/progress', description: 'Check completions & certificates' },
    { id: 'ql4', label: 'Get help', to: '/resources', description: 'Guides, templates, videos' },
  ],

  news: [
    {
      id: 'n1',
      title: 'New course launched: Power BI Intro',
      body: 'A hands-on introduction to building dashboards from lab data. Enroll from the catalog.',
      date: '2026-07-18',
      tag: 'New course',
    },
    {
      id: 'n2',
      title: 'Enrollment deadline — Q3 Reliability cohort',
      body: 'Sign up for the Reliability Engineer path before August 15 to join the next cohort.',
      date: '2026-07-15',
      tag: 'Deadline',
    },
    {
      id: 'n3',
      title: 'Learner spotlight: Lab Technician path',
      body: 'Three technicians completed the full path this month — read what helped them most.',
      date: '2026-07-02',
      tag: 'Spotlight',
    },
  ],

  courses: [
    {
      id: 'tct-basics',
      title: 'TCT Basics',
      category: 'Reliability',
      level: 'Beginner',
      format: 'Classroom',
      duration: '2h',
      owner: 'J. Ramirez',
      featured: true,
      objectives: [
        'Explain the purpose of Temperature Cycling Testing (TCT)',
        'Read and interpret a basic TCT profile',
        'Identify common failure modes revealed by TCT',
      ],
      audience: 'New reliability engineers and lab technicians.',
      trainer: 'J. Ramirez',
      prerequisites: 'None',
      nextSession: '2026-08-22 · 9:00 AM · Room 3',
      modules: ['Intro', 'Theory', 'Hands-on', 'Assessment'],
      materials: [
        { id: 'm1', name: 'JESD22-A104 Primer.pdf', type: 'Guide' },
      ],
    },
    {
      id: 'hast-deep-dive',
      title: 'HAST Deep Dive',
      category: 'Reliability',
      level: 'Intermediate',
      format: 'Hybrid',
      duration: '4h',
      owner: 'M. Santos',
      featured: false,
      objectives: [
        'Set up a Highly Accelerated Stress Test (HAST) run',
        'Interpret HAST results against JEDEC standards',
        'Troubleshoot common chamber issues',
      ],
      audience: 'Technicians who have completed TCT Basics.',
      trainer: 'M. Santos',
      prerequisites: 'TCT Basics',
      nextSession: '2026-08-05 · Lab',
      modules: ['Intro', 'Theory', 'Hands-on', 'Assessment'],
      materials: [
        { id: 'm2', name: 'HAST chamber walkthrough.mp4', type: 'Video' },
      ],
    },
    {
      id: 'cal-metrology',
      title: 'Cal Metrology',
      category: 'Calibration',
      level: 'Advanced',
      format: 'Classroom',
      duration: '8h',
      owner: 'R. Cruz',
      featured: false,
      objectives: [
        'Apply metrology principles to calibration workflows',
        'Complete a calibration worksheet end to end',
        'Maintain traceability records',
      ],
      audience: 'Senior technicians and calibration leads.',
      trainer: 'R. Cruz',
      prerequisites: 'HAST Deep Dive',
      nextSession: '2026-09-02 · Cal Lab',
      modules: ['Intro', 'Theory', 'Hands-on', 'Assessment'],
      materials: [
        { id: 'm3', name: 'Cal worksheet template.xlsx', type: 'Template' },
      ],
    },
    {
      id: 'excel-for-labs',
      title: 'Excel for Labs',
      category: 'Data & Tools',
      level: 'Beginner',
      format: 'E-learning',
      duration: '3h',
      owner: 'A. Dela Peña',
      featured: false,
      objectives: [
        'Organize lab data with structured tables',
        'Build formulas for common lab calculations',
        'Create a simple chart from test results',
      ],
      audience: 'Anyone working with lab data in Excel.',
      trainer: 'A. Dela Peña',
      prerequisites: 'None',
      nextSession: 'Self-paced',
      modules: ['Intro', 'Theory', 'Hands-on', 'Assessment'],
      materials: [],
    },
    {
      id: 'power-bi-intro',
      title: 'Power BI Intro',
      category: 'Data & Tools',
      level: 'Intermediate',
      format: 'E-learning',
      duration: '4h',
      owner: 'A. Dela Peña',
      featured: true,
      objectives: [
        'Connect Power BI to a SharePoint list',
        'Build a completion-rate dashboard',
        'Share and embed a report',
      ],
      audience: 'Trainers and admins who need reporting.',
      trainer: 'A. Dela Peña',
      prerequisites: 'Excel for Labs',
      nextSession: '2026-07-24 · Teams',
      modules: ['Intro', 'Theory', 'Hands-on', 'Assessment'],
      materials: [],
    },
    {
      id: '5s-kaizen',
      title: '5S & Kaizen',
      category: 'Process',
      level: 'Beginner',
      format: 'Classroom',
      duration: '2h',
      owner: 'J. Ramirez',
      featured: false,
      objectives: [
        'Apply the 5S method to a workspace',
        'Identify small Kaizen improvements',
        'Run a simple before/after audit',
      ],
      audience: 'All floor and lab staff.',
      trainer: 'J. Ramirez',
      prerequisites: 'None',
      nextSession: '2026-07-29 · Training Hall',
      modules: ['Intro', 'Theory', 'Hands-on', 'Assessment'],
      materials: [],
    },
  ],

  paths: [
    {
      id: 'new-hire',
      title: 'New Hire Onboarding',
      sequence: ['Orientation', 'Safety', 'Systems', 'Team'],
      effort: '4 courses · ~2 weeks',
      recommendedStart: 'Orientation',
    },
    {
      id: 'lab-technician',
      title: 'Lab Technician',
      sequence: ['Equipment', 'Test methods', 'Cal basics', '5S'],
      effort: '5 courses · ~6 weeks',
      recommendedStart: 'Equipment',
    },
    {
      id: 'reliability-engineer',
      title: 'Reliability Engineer',
      sequence: ['JEDEC stds', 'FA', 'Data analysis', 'Reporting'],
      effort: '6 courses · ~8 weeks',
      recommendedStart: 'JEDEC stds',
    },
    {
      id: 'future-leaders',
      title: 'Future Leaders (HiPo)',
      sequence: ['Process improvement', 'Mentoring', 'Projects'],
      effort: '4 courses + capstone',
      recommendedStart: 'Process improvement',
    },
  ],

  resources: [
    { id: 'r1', name: 'JESD22-A104 Primer.pdf', type: 'Guide', course: 'TCT Basics', owner: 'J. Ramirez', reviewDate: '2026-12-01' },
    { id: 'r2', name: 'HAST chamber walkthrough.mp4', type: 'Video', course: 'HAST Deep Dive', owner: 'M. Santos', reviewDate: '2026-11-01' },
    { id: 'r3', name: 'Cal worksheet template.xlsx', type: 'Template', course: 'Cal Metrology', owner: 'R. Cruz', reviewDate: '2026-10-15' },
    { id: 'r4', name: 'Reliability terms FAQ.pdf', type: 'SOP / Guide', course: 'All courses', owner: 'J. Ramirez', reviewDate: '2026-09-20' },
  ],

  events: [
    { id: 'e1', title: 'TCT Basics', date: '2026-08-22', time: '9:00 AM', venue: 'Room 3', seats: 12 },
    { id: 'e2', title: 'Power BI Intro', date: '2026-08-24', time: '1:00 PM', venue: 'Teams', seats: 20 },
    { id: 'e3', title: '5S & Kaizen', date: '2026-08-29', time: '10:00 AM', venue: 'Training Hall', seats: 25 },
    { id: 'e4', title: 'HAST Deep Dive', date: '2026-09-05', time: '9:00 AM', venue: 'Lab', seats: 8 },
  ],

  progress: {
    learner: 'You',
    pathProgress: { path: 'Lab Technician', percent: 60 },
    completions: [
      { id: 'c1', course: 'TCT Basics', status: 'Completed', score: 90, date: '2026-07-10' },
      { id: 'c2', course: 'Excel for Labs', status: 'Completed', score: 85, date: '2026-06-28' },
      { id: 'c3', course: 'HAST Deep Dive', status: 'In progress', score: null, date: null },
    ],
  },
};
