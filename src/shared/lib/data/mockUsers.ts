// src/shared/data/mockUsers.ts
export interface User {
    id: string;
    name: string;
    age: number;
    bio: string;
    distance: number;
    photos: string[];
    interests: string[];
}

const firstNames = [
    'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia',
    'Liam', 'Noah', 'Oliver', 'Elijah', 'James',
    'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
    'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
    'Emily', 'Madison', 'Ella', 'Grace', 'Chloe',
    'Michael', 'Daniel', 'Matthew', 'Jackson', 'David',
];

const bios = [
    'Love traveling and coffee ☕',
    'Foodie | Gym enthusiast 💪',
    'Software developer looking for adventures 🚀',
    'Dog lover | Netflix addict 🐕',
    'Adventure seeker | Photography 📸',
    'Music lover | Concert junkie 🎵',
    'Beach bum | Sunset chaser 🌅',
    'Bookworm | Tea enthusiast 📚',
    'Fitness freak | Healthy living 🥗',
    'Gamer | Anime fan 🎮',
    'Artist | Creative soul 🎨',
    'Entrepreneur | Startup founder 💼',
    'Yoga instructor | Mindfulness 🧘',
    'Chef | Food blogger 👨‍🍳',
    'Traveler | 30+ countries visited ✈️',
];

const interests = [
    'Travel', 'Photography', 'Music', 'Movies', 'Coffee',
    'Fitness', 'Yoga', 'Reading', 'Gaming', 'Cooking',
    'Art', 'Dancing', 'Hiking', 'Beach', 'Dogs',
    'Cats', 'Wine', 'Beer', 'Concerts', 'Sports',
];

function generateRandomUser(id: number): User {
    const name = firstNames[Math.floor(Math.random() * firstNames.length)];
    const age = Math.floor(Math.random() * 15) + 22; // 22-36
    const bio = bios[Math.floor(Math.random() * bios.length)];
    const distance = Math.floor(Math.random() * 50) + 1; // 1-50 km

    // Select 3-5 random interests
    const userInterests = interests
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 3);

    return {
        id: id.toString(),
        name,
        age,
        bio,
        distance,
        photos: [`https://i.pravatar.cc/300?img=${id}`],
        interests: userInterests,
    };
}

// Generate 30 mock users
export const MOCK_USERS: User[] = Array.from({ length: 30 }, (_, i) =>
    generateRandomUser(i + 1)
);