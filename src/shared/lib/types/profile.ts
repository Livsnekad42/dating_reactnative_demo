import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export interface Profile {
    id: string;
    name: string;
    age: number;
    bio: string;
    photos: string[];
    distance: number;
    interests: string[];
    occupation?: string;
    education?: string;
}

export interface Match {
    id: string;
    profile: Profile;
    matchedAt: number;
    lastMessage?: Message;
    unreadCount: number;
}

export interface Message {
    id: string;
    matchId: string;
    senderId: string;
    text: string;
    timestamp: number;
    read: boolean;
}

export interface ChatState {
    conversations: Record<string, Message[]>;
    typing: Record<string, boolean>;
}

export type MatchesStackParamList = {
    MatchesList: undefined;
    Chat: { matchId: string };
};

export type MatchesListNavigationProp = NativeStackNavigationProp<
    MatchesStackParamList,
    'MatchesList'
>;