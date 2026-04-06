import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

const MOCK_STORIES = [
  {
    userId: 'sofia',
    userName: 'Sofia R.',
    userInitials: 'SR',
    userColor: '#be185d',
    userBg: '#fce7f3',
    stories: [
      { id: 's1', type: 'text', content: 'UI kit refactor 90% done! 🚀', bg: 'from-pink-500 to-rose-600', createdAt: Date.now() - 3600000 },
      { id: 's2', type: 'text', content: 'PR is up for review — check it out 👀', bg: 'from-violet-500 to-purple-600', createdAt: Date.now() - 1800000 },
    ],
    seen: false,
  },
  {
    userId: 'marcus',
    userName: 'Marcus K.',
    userInitials: 'MK',
    userColor: '#7c3aed',
    userBg: '#ede9fe',
    stories: [
      { id: 's3', type: 'text', content: 'Fixed the refreshToken edge case 🔧', bg: 'from-blue-500 to-cyan-600', createdAt: Date.now() - 7200000 },
    ],
    seen: false,
  },
  {
    userId: 'priya',
    userName: 'Priya L.',
    userInitials: 'PL',
    userColor: '#059669',
    userBg: '#d1fae5',
    stories: [
      { id: 's4', type: 'text', content: 'Sprint planning done. Let\'s ship! 💪', bg: 'from-emerald-500 to-teal-600', createdAt: Date.now() - 10800000 },
    ],
    seen: true,
  },
]

export function StoryProvider({ children }) {
  const { user, profile } = useAuth()
  const [allStories, setAllStories] = useState(MOCK_STORIES)
  const [myStories,  setMyStories]  = useState([])

  const addStory = useCallback((story) => {
    const newStory = {
      id: 's' + Date.now(),
      type: story.type || 'text',
      content: story.content,
      bg: story.bg || 'from-accent to-blue-600',
      image: story.image || null,
      createdAt: Date.now(),
    }
    setMyStories(prev => [...prev, newStory])
  }, [])

  const markSeen = useCallback((userId) => {
    setAllStories(prev =>
      prev.map(s => s.userId === userId ? { ...s, seen: true } : s)
    )
  }, [])

  const SKINS_LOCAL = [
    { bg: '#FDDBB4', fg: '#8B5E3C' }, { bg: '#F5C99A', fg: '#7A4A2A' },
    { bg: '#E8A87C', fg: '#6B3820' }, { bg: '#C68642', fg: '#3E1F00' },
    { bg: '#8D5524', fg: '#FFD5A8' }, { bg: '#4A2912', fg: '#F5C99A' },
    { bg: '#DBEAFE', fg: '#1D4ED8' }, { bg: '#EDE9FE', fg: '#7C3AED' },
    { bg: '#FCE7F3', fg: '#BE185D' }, { bg: '#D1FAE5', fg: '#065F46' },
  ]
  const skin = SKINS_LOCAL[profile?.skinIdx ?? 0] || SKINS_LOCAL[0]

  const myStoryGroup = user && myStories.length > 0 ? {
    userId: String(user.id),
    userName: profile?.name || user.name,
    userInitials: user.initials,
    userColor: skin.fg,
    userBg: skin.bg,
    stories: myStories,
    seen: true,
    isMe: true,
  } : null

  const allVisible = [
    ...(myStoryGroup ? [myStoryGroup] : []),
    ...allStories,
  ]

  return (
    <Ctx.Provider value={{ allStories: allVisible, myStories, addStory, markSeen }}>
      {children}
    </Ctx.Provider>
  )
}

export const useStory = () => useContext(Ctx)
