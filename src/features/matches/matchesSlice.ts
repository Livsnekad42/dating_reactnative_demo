import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Match, Profile } from "@/shared/lib/types/profile";
import {RootState} from "@/shared/lib/store/store";

interface MatchesState {
    matches: Match[];
    isLoading: boolean;
    showMatchAnimation: boolean;
    currentMatchedProfile: Profile | null;
}

const initialState: MatchesState = {
    matches: [],
    isLoading: false,
    showMatchAnimation: false,
    currentMatchedProfile: null,
};

export const selectRecentMatches = createSelector(
    [(state: RootState) => state.matches.matches],
    (matches) => matches.slice(0, 8)
);

export const selectConversationMatches = createSelector(
    [(state: RootState) => state.matches.matches],
    (matches) => matches.filter(m => m.lastMessage)
);

const matchesSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        addMatch: (state, action: PayloadAction<Profile>) => {
            const profile = action.payload;
            const newMatch: Match = {
                id: `match-${profile.id}`,
                profile,
                matchedAt: Date.now(),
                unreadCount: 0,
            };
            state.matches.unshift(newMatch);
            state.showMatchAnimation = true;
            state.currentMatchedProfile = profile;
        },

        hideMatchAnimation: (state) => {
            state.showMatchAnimation = false;
            state.currentMatchedProfile = null;
        },
        showMatchAnimation: (state, action: PayloadAction<Profile>) => {
            state.showMatchAnimation = true;
            state.currentMatchedProfile = action.payload;
        },

        updateLastMessage: (
            state,
            action: PayloadAction<{ matchId: string; message: string }>
        ) => {
            const match = state.matches.find((m) => m.id === action.payload.matchId);
            if (match) {
                match.lastMessage = {
                    id: `msg-${Date.now()}`,
                    matchId: action.payload.matchId,
                    senderId: match.profile.id,
                    text: action.payload.message,
                    timestamp: new Date(),
                    read: false,
                };
                match.unreadCount += 1;
            }
        },

        markAsRead: (state, action: PayloadAction<string>) => {
            const match = state.matches.find((m) => m.id === action.payload);
            if (match) {
                match.unreadCount = 0;
                if (match.lastMessage) {
                    match.lastMessage.read = true;
                }
            }
        },

        removeMatch: (state, action: PayloadAction<string>) => {
            state.matches = state.matches.filter((m) => m.id !== action.payload);
        },
    },
});

export const {
    addMatch,
    hideMatchAnimation,
    updateLastMessage,
    markAsRead,
    removeMatch,
} = matchesSlice.actions;

export default matchesSlice.reducer;