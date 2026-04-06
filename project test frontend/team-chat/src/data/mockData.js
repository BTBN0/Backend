export const workspace = {
  name: 'Meridian Labs',
  plan: 'Pro',
}

export const channels = [
  { id: 'engineering', name: 'engineering', type: 'channel', unread: 0, description: 'Backend · 8 members' },
  { id: 'design', name: 'design', type: 'channel', unread: 0, description: 'Product design' },
  { id: 'product', name: 'product', type: 'channel', unread: 3, description: 'Roadmap & specs' },
  { id: 'releases', name: 'releases', type: 'channel', unread: 0, description: 'Deploy announcements' },
  { id: 'general', name: 'general', type: 'channel', unread: 0, description: 'Company-wide' },
]

export const directMessages = [
  { id: 'sofia', name: 'Sofia R.', initials: 'SR', color: '#c17d3c', bg: '#f5e8d6', status: 'online', statusText: 'In a meeting' },
  { id: 'marcus', name: 'Marcus K.', initials: 'MK', color: '#534AB7', bg: '#EEEDFE', status: 'online', statusText: 'Active', unread: 1 },
  { id: 'priya', name: 'Priya L.', initials: 'PL', color: '#0F6E56', bg: '#E1F5EE', status: 'away', statusText: 'Away' },
]

export const members = [
  { id: 'sofia', name: 'Sofia R.', initials: 'SR', color: '#c17d3c', bg: '#f5e8d6', status: 'online', statusText: 'In a meeting', role: 'Engineer' },
  { id: 'marcus', name: 'Marcus K.', initials: 'MK', color: '#534AB7', bg: '#EEEDFE', status: 'online', statusText: 'Active', role: 'Engineer' },
  { id: 'jamie', name: 'Jamie T.', initials: 'JT', color: '#854F0B', bg: '#FAEEDA', status: 'online', statusText: 'Active', role: 'Engineer' },
  { id: 'priya', name: 'Priya L.', initials: 'PL', color: '#0F6E56', bg: '#E1F5EE', status: 'away', statusText: 'Away', role: 'Backend Lead' },
]

export const messagesByChannel = {
  engineering: [
    {
      id: 1,
      author: { name: 'Sofia R.', initials: 'SR', color: '#c17d3c', bg: '#f5e8d6' },
      time: '3:12 PM',
      date: 'Yesterday',
      text: 'Hey team — just pushed the auth refactor to staging. Would love eyes on the token refresh logic before we merge.',
      reactions: [{ emoji: '👀', count: 4, mine: true }, { emoji: '✅', count: 2, mine: false }],
      threadCount: 3,
      threadAvatars: [
        { initials: 'MK', color: '#534AB7', bg: '#EEEDFE' },
        { initials: 'PL', color: '#0F6E56', bg: '#E1F5EE' },
      ],
      threadLastTime: '4:50 PM',
    },
    {
      id: 2,
      author: { name: 'Marcus K.', initials: 'MK', color: '#534AB7', bg: '#EEEDFE' },
      time: '4:48 PM',
      date: 'Yesterday',
      text: 'Looked through it — the logic looks solid. One thing: the refreshToken() call doesn\'t handle 401 re-entry. Added a comment in the PR.',
      hasCode: true,
      codeWord: 'refreshToken()',
    },
    {
      id: 3,
      author: { name: 'Marcus K.', initials: 'MK', color: '#534AB7', bg: '#EEEDFE' },
      time: '4:49 PM',
      date: 'Yesterday',
      continued: true,
      text: 'Also sharing the updated deploy checklist — we added the DB migration step:',
      attachment: { name: 'deploy-checklist-v4.pdf', size: '84 KB · PDF', icon: '📄' },
    },
    {
      id: 4,
      author: { name: 'Priya L.', initials: 'PL', color: '#0F6E56', bg: '#E1F5EE' },
      time: '9:03 AM',
      date: 'Today',
      text: 'Good morning! Heads up — we\'re cutting the v2.4 release branch today at 2 PM. Please make sure your PRs are merged by 1:30.',
      badge: 'Backend Lead',
      reactions: [{ emoji: '👋', count: 7, mine: true }],
    },
    {
      id: 5,
      author: { name: 'Jamie T.', initials: 'JT', color: '#854F0B', bg: '#FAEEDA' },
      time: '9:31 AM',
      date: 'Today',
      text: 'On it! Just rebasing against main now. Sofia, can you re-request review on the auth PR once Marcus\'s comment is addressed?',
    },
    {
      id: 6,
      author: { name: 'Sofia R.', initials: 'SR', color: '#c17d3c', bg: '#f5e8d6' },
      time: '9:44 AM',
      date: 'Today',
      text: 'Done — addressed the 401 case, added a test. PR is ready for final review 🚀',
    },
  ],
  design: [
    {
      id: 1,
      author: { name: 'Sofia R.', initials: 'SR', color: '#c17d3c', bg: '#f5e8d6' },
      time: '10:15 AM',
      date: 'Today',
      text: 'New component library updates are live in Figma. Check the sidebar redesign tokens.',
    },
  ],
  product: [
    {
      id: 1,
      author: { name: 'Priya L.', initials: 'PL', color: '#0F6E56', bg: '#E1F5EE' },
      time: '8:00 AM',
      date: 'Today',
      text: 'Q3 roadmap review is at 3 PM today. Please come prepared with your team\'s status updates.',
    },
  ],
  releases: [],
  general: [
    {
      id: 1,
      author: { name: 'Marcus K.', initials: 'MK', color: '#534AB7', bg: '#EEEDFE' },
      time: '9:00 AM',
      date: 'Today',
      text: 'Happy Friday everyone! 🎉',
      reactions: [{ emoji: '🎉', count: 5, mine: false }],
    },
  ],
}

export const pinnedMessages = [
  { id: 1, author: 'Priya L.', text: 'Release branch cuts today at 2 PM. PRs due by 1:30.' },
  { id: 2, author: 'Marcus K.', text: 'Staging URL: staging.meridian.dev', isCode: true, code: 'staging.meridian.dev' },
]

export const recentFiles = [
  { id: 1, name: 'deploy-checklist-v4.pdf', author: 'Marcus K.', when: 'Yesterday', icon: '📄', color: '#E6F1FB' },
  { id: 2, name: 'q2-perf-report.xlsx', author: 'Priya L.', when: '3 days ago', icon: '📊', color: '#EEEDFE' },
]
