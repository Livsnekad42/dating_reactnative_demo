// src/shared/api/mockApi.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {Profile} from "@/shared/lib/types/profile";
import {mockProfiles} from "@/shared/api/mockData";

// Mock data generator
const FIRST_NAMES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Skylar'];
const LOCATIONS = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'Seattle', 'Austin', 'Boston'];
const INTERESTS = ['Travel', 'Photography', 'Cooking', 'Yoga', 'Gaming', 'Music', 'Hiking', 'Coffee', 'Art', 'Fitness'];
const BIOS = [
    'Adventure seeker looking for someone to explore the world with',
    'Coffee enthusiast and bookworm seeking meaningful connections',
    'Passionate about life and always up for trying new things',
    'Dog lover, fitness fanatic, and food connoisseur',
    'Just a simple person looking for someone special',
];

const generateMockProfiles = (count: number): Profile[] => {
    return Array.from({ length: count }, (_, i) => {
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        return {
            id: `profile_${i}`,
            name: firstName,
            age: Math.floor(Math.random() * 15) + 22, // 22-36
            bio: BIOS[Math.floor(Math.random() * BIOS.length)],
            photos: [
                `https://i.pravatar.cc/400?img=${i + 1}`,
                `https://i.pravatar.cc/400?img=${i + 20}`,
                `https://i.pravatar.cc/400?img=${i + 40}`,
            ],
            location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            distance: Math.floor((Math.random() * 100)),
            interests: INTERESTS.sort(() => 0.5 - Math.random()).slice(0, 5),
        };
    });
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = createApi({
    reducerPath: 'mockApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Profiles', 'Matches', 'Messages'],
    endpoints: (builder) => ({
        getProfiles: builder.query<Profile[], void>({
            queryFn: async () => {
                await delay(800); // Simulate network latency
                // return { data: generateMockProfiles(50) };
                return { data: mockProfiles };
            },
            providesTags: ['Profiles'],
        }),
        getMatchedProfiles: builder.query<Profile[], string[]>({
            queryFn: async (likedIds) => {
                await delay(500);
                // Simulate 30% match rate
                const matchedIds = likedIds.filter(() => Math.random() > 0.7);
                const profiles = generateMockProfiles(matchedIds.length);
                return {
                    data: profiles.map((p, i) => ({ ...p, id: matchedIds[i] }))
                };
            },
            providesTags: ['Matches'],
        }),
        likeProfile: builder.mutation<{ matched: boolean; profile?: Profile }, string>({
            queryFn: async (profileId) => {
                await new Promise((resolve) => setTimeout(resolve, 400));

                // Mock match algorithm (30% chance)
                const matched = true;
                const profile = matched
                    ? mockProfiles.find(p => p.id === profileId)
                    : undefined;

                return { data: { matched, profile } };
            },
            invalidatesTags: ['Matches'],
        }),
        sendMessage: builder.mutation<void, { matchId: string; text: string }>({
            queryFn: async ({ matchId, text }) => {
                await new Promise((resolve) => setTimeout(resolve, 200));
                // In real app: POST to /api/messages
                return { data: undefined };
            },
            invalidatesTags: ['Messages'],
        }),
        getChatMessages: builder.query<any[], string>({
            queryFn: async (matchId) => {
                await delay(600);
                return {
                    data: [
                        {
                            id: '1',
                            senderId: matchId,
                            text: 'Hey! How are you?',
                            timestamp: new Date(Date.now() - 3600000).toISOString(),
                            isRead: true,
                        },
                        {
                            id: '2',
                            senderId: 'me',
                            text: 'Great! Thanks for matching 😊',
                            timestamp: new Date(Date.now() - 1800000).toISOString(),
                            isRead: true,
                        },
                    ],
                };
            },
        }),
    }),
});

export const {
    useGetProfilesQuery,
    useGetMatchedProfilesQuery,
    useGetChatMessagesQuery,
    useLikeProfileMutation,
    useSendMessageMutation
} = mockApi;