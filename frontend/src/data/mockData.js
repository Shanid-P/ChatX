// Mock data for the chat application

export const currentUser = {
  id: 'user-0',
  name: 'You',
  avatar: null,
  status: 'online',
};

export const contacts = [
  {
    id: 'user-1',
    name: 'Hamed',
    avatar: 'https://i.pravatar.cc/150?img=11',
    status: 'online',
    about: 'Hello! My name is Hamed. I love traveling and discovering new places around the world.',
    phone: '+1 (555) 012-3456',
    lastSeen: 'Online',
  },
  {
    id: 'user-2',
    name: 'Daria',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'offline',
    about: 'Life is beautiful 🌸',
    phone: '+1 (555) 234-5678',
    lastSeen: '2 hours ago',
  },
  {
    id: 'user-3',
    name: 'Lisa Party',
    avatar: 'https://i.pravatar.cc/150?img=9',
    status: 'online',
    about: 'Music lover & dancer 🎵',
    phone: '+1 (555) 345-6789',
    lastSeen: 'Online',
  },
  {
    id: 'user-4',
    name: 'Jack',
    avatar: 'https://i.pravatar.cc/150?img=12',
    status: 'offline',
    about: 'Developer by day, gamer by night 🎮',
    phone: '+1 (555) 456-7890',
    lastSeen: '30 min ago',
  },
  {
    id: 'user-5',
    name: 'Kate',
    avatar: 'https://i.pravatar.cc/150?img=20',
    status: 'offline',
    about: 'Coffee enthusiast ☕',
    phone: '+1 (555) 567-8901',
    lastSeen: '1 hour ago',
  },
  {
    id: 'user-6',
    name: 'Lisa',
    avatar: 'https://i.pravatar.cc/150?img=25',
    status: 'offline',
    about: 'Photography is my passion 📷',
    phone: '+1 (555) 678-9012',
    lastSeen: '3 hours ago',
  },
  {
    id: 'user-7',
    name: 'Marcus',
    avatar: 'https://i.pravatar.cc/150?img=33',
    status: 'online',
    about: 'Building the future, one line at a time.',
    phone: '+1 (555) 789-0123',
    lastSeen: 'Online',
  },
  {
    id: 'user-8',
    name: 'Sophie',
    avatar: 'https://i.pravatar.cc/150?img=44',
    status: 'offline',
    about: 'Adventure seeker 🏔️',
    phone: '+1 (555) 890-1234',
    lastSeen: '5 hours ago',
  },
];

export const chatMessages = {
  'user-1': [
    {
      id: 'msg-1',
      senderId: 'user-1',
      text: 'Hi there, How are you?',
      timestamp: '12:24 PM',
      status: 'read',
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      text: 'Waiting for your reply. As I have to go back soon. I have to travel long distance.',
      timestamp: '12:25 PM',
      status: 'read',
    },
    {
      id: 'msg-3',
      senderId: 'user-0',
      text: 'Hi, I am coming. Start in few minutes. Please wait! I am in taxi right now.',
      timestamp: '12:28 PM',
      status: 'read',
    },
    {
      id: 'msg-4',
      senderId: 'user-1',
      text: 'Thank you very much. I am waiting here at StarBuck cafe.',
      timestamp: '12:29 PM',
      status: 'read',
    },
    {
      id: 'msg-5',
      senderId: 'user-0',
      text: 'Great! I\'ll be there in about 10 minutes. Order me a cappuccino please! ☕',
      timestamp: '12:31 PM',
      status: 'delivered',
    },
  ],
  'user-2': [
    {
      id: 'msg-6',
      senderId: 'user-2',
      text: 'Call ended',
      timestamp: '12:30 PM',
      status: 'read',
      type: 'call',
    },
    {
      id: 'msg-7',
      senderId: 'user-0',
      text: 'Sorry I missed your call! Was in a meeting.',
      timestamp: '12:45 PM',
      status: 'read',
    },
    {
      id: 'msg-8',
      senderId: 'user-2',
      text: 'No worries! Can we talk later tonight?',
      timestamp: '12:50 PM',
      status: 'read',
    },
  ],
  'user-3': [
    {
      id: 'msg-9',
      senderId: 'user-3',
      text: 'What time are we there?',
      timestamp: '9:12 AM',
      status: 'read',
    },
    {
      id: 'msg-10',
      senderId: 'user-0',
      text: 'Around 8 PM. Is that okay for you?',
      timestamp: '9:15 AM',
      status: 'read',
    },
    {
      id: 'msg-11',
      senderId: 'user-3',
      text: 'Perfect! I\'ll bring the snacks 🎉',
      timestamp: '9:17 AM',
      status: 'read',
    },
  ],
  'user-4': [
    {
      id: 'msg-12',
      senderId: 'user-4',
      text: 'Yo, I will send you the work file',
      timestamp: '9:00 AM',
      status: 'read',
    },
    {
      id: 'msg-13',
      senderId: 'user-0',
      text: 'Thanks Jack! I\'ll review it today.',
      timestamp: '9:05 AM',
      status: 'delivered',
    },
  ],
  'user-5': [
    {
      id: 'msg-14',
      senderId: 'user-5',
      text: 'You will send the work file',
      timestamp: '7:00 PM',
      status: 'read',
    },
    {
      id: 'msg-15',
      senderId: 'user-0',
      text: 'Yes, sending it now!',
      timestamp: '7:05 PM',
      status: 'read',
    },
  ],
  'user-6': [
    {
      id: 'msg-16',
      senderId: 'user-6',
      text: 'You will send the work file',
      timestamp: '7:00 PM',
      status: 'read',
    },
  ],
  'user-7': [
    {
      id: 'msg-17',
      senderId: 'user-7',
      text: 'Hey! Check out this new framework I found.',
      timestamp: '11:30 AM',
      status: 'read',
    },
    {
      id: 'msg-18',
      senderId: 'user-0',
      text: 'Looks awesome! Let me dig into it.',
      timestamp: '11:45 AM',
      status: 'read',
    },
    {
      id: 'msg-19',
      senderId: 'user-7',
      text: 'We should pair program on it sometime 💻',
      timestamp: '11:48 AM',
      status: 'read',
    },
  ],
  'user-8': [
    {
      id: 'msg-20',
      senderId: 'user-8',
      text: 'The hiking trail photos turned out amazing!',
      timestamp: '3:00 PM',
      status: 'read',
    },
    {
      id: 'msg-21',
      senderId: 'user-0',
      text: 'I know right! Let\'s plan another trip soon 🏕️',
      timestamp: '3:15 PM',
      status: 'delivered',
    },
  ],
};

export const getLastMessage = (userId) => {
  const messages = chatMessages[userId];
  if (!messages || messages.length === 0) return null;
  return messages[messages.length - 1];
};

export const getUnreadCount = (userId) => {
  const messages = chatMessages[userId];
  if (!messages) return 0;
  // Simulate some unread messages
  const unreadMap = { 'user-3': 9, 'user-7': 3 };
  return unreadMap[userId] || 0;
};
