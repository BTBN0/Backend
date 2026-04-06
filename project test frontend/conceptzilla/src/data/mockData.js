export const currentUser = {
  id: 'me', name: 'You', initials: 'YO', color: '#5b4fcf', bg: '#ebe9f8', role: 'UX/UI designer',
}

export const navItems = [
  { id: 'assistant', label: 'Assistant', icon: '✦', badge: 'NEW' },
  { id: 'drafts',    label: 'Drafts',    icon: '◻' },
  { id: 'saved',     label: 'Saved items', icon: '⊙' },
  { id: 'inbox',     label: 'Inbox',     icon: '✉', count: 8 },
  { id: 'dm',        label: 'Direct messages', icon: '💬', count: 1 },
]

export const favorites = [
  { id: 'sophia', type: 'dm',      label: 'Sophia Wilson',  icon: 'SW', color:'#be185d', bg:'#fce7f3', count: 2 },
  { id: 'frontend', type: 'channel', label: 'Front-end',     icon: '#',  count: 4 },
]

export const channels = [
  { id: 'general',  label: 'General',       icon: '🔥', count: 1 },
  { id: 'frontend', label: 'Front-end',     icon: '#',  count: 4 },
  { id: 'website',  label: 'Website',       icon: '⚙',
    children: [
      { id: 'v30',  label: 'v3.0', icon: '✨',
        children: [
          { id: 'wireframe', label: 'Wireframe', icon: '↳' },
          { id: 'design',    label: 'Design',    icon: '↳' },
          { id: 'uikit',     label: 'Ui-kit design', icon: '↳', active: true },
        ]
      },
      { id: 'v2actual', label: 'v2.0 - actual version', icon: '#' },
    ]
  },
  { id: 'strategy',  label: 'Strategy',    icon: '⚙' },
  { id: 'events',    label: 'Events',      icon: '🎯' },
  { id: 'announce',  label: 'Announcements', icon: '#' },
  { id: 'uiux',      label: 'UI/UX',       icon: '#', count: 2 },
]

export const members = [
  { id: 'daniel',  name: 'Daniel Anderson', initials:'DA', color:'#7c3aed', bg:'#ede9fe', role:'Art director',    tag:'Design',     tagStyle:'design', status:'online' },
  { id: 'andrew',  name: 'Andrew Miller',   initials:'AM', color:'#d97706', bg:'#fef3c7', role:'Product owner',   tag:'Management', tagStyle:'mgmt',   status:'online' },
  { id: 'william', name: 'William Johnson', initials:'WJ', color:'#0891b2', bg:'#e0f2fe', role:'UX/UI designer',  tag:'Design',     tagStyle:'design', status:'online' },
  { id: 'emily',   name: 'Emily Davis',     initials:'ED', color:'#16a34a', bg:'#dcfce7', role:'Front-end dev',   tag:'Development',tagStyle:'dev',    status:'offline' },
]

export const messages = [
  {
    id: 1,
    author: { name: 'Daniel Anderson', initials: 'DA', color: '#7c3aed', bg: '#ede9fe' },
    time: '3h ago',
    text: 'Hey team, I wanted to discuss the custom UI-kit we\'re developing for the site redesign. We need to finalize some components and make key design decisions to ensure consistency across the board. Let\'s make sure we cover colors, typography, buttons, and any other essential UI elements.',
    mentions: ['@UX/UI', '@Sophia'],
    reactions: [{ emoji: '👍', count: 2, mine: true }],
  },
  {
    id: 2,
    author: { name: 'Diana T.', initials: 'DT', color: '#be185d', bg: '#fce7f3' },
    time: '2d ago',
    text: 'I have already prepared all styles and components according to our standards during the design phase, so the UI kit is 90% complete. All that remains is to add some states to the interactive elements and prepare the Lottie files for animations.',
    mentions: ['@Emily D.'],
    afterMention: ', please take a look and let me know if you have any questions.',
    link: { title: 'Conceptzilla website v.3.0', url: 'www.figma.com', label: 'Quick view' },
    reactions: [{ emoji: '❤️', count: 1, mine: false }],
  },
  {
    id: 3,
    author: { name: 'Daniel A.', initials: 'DA', color: '#7c3aed', bg: '#ede9fe' },
    time: '3h ago',
    text: 'Okay, keep me updated. ',
    mention: '@Diana T.',
    afterText: '. I also wanted to remind you to keep the layers organized.',
    memberPopup: true,
    popupMembers: [
      { name: 'Diana Taylor',   initials: 'DT', color: '#be185d', bg: '#fce7f3' },
      { name: 'Daniel Anderson',initials: 'DA', color: '#7c3aed', bg: '#ede9fe' },
    ],
  },
  {
    id: 4,
    author: { name: 'Emily Davis', initials: 'ED', color: '#16a34a', bg: '#dcfce7' },
    time: '1h ago',
    text: 'Will do! Let\'s finish the states and we\'ll start development. The team is the best in the last time. We\'re breaking all records 💪💪',
    mention: '@Daniel',
  },
]

export const threadInfo = {
  channel: 'Website',
  subpath: 'v3.0 / Ui-kit design',
  creator: 'Andrew M.',
  createdDate: '28 May',
  status: 'Active',
  tags: 13,
  tasks: 4,
  linkedThreads: [
    { label: 'Front-end', count: 4 },
    { label: 'Ui-kit design standards', count: null },
  ],
}
