import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Profile} from "@/shared/lib/types/profile";

interface SwipeState {
    currentStack: Profile[];
    swipedProfiles: string[];
    likedProfiles: string[];
    passedProfiles: string[];
    isLoading: boolean;
}

const initialState: SwipeState = {
    currentStack: [],
    swipedProfiles: [],
    likedProfiles: [],
    passedProfiles: [],
    isLoading: false,
};

const swipeSlice = createSlice({
    name: 'swipe',
    initialState,
    reducers: {
        setProfiles: (state, action: PayloadAction<Profile[]>) => {
            state.currentStack = action.payload.filter(
                (p) => !state.swipedProfiles.includes(p.id)
            );
        },

        swipeRight: (state, action: PayloadAction<string>) => {
            const profileId = action.payload;
            state.swipedProfiles.push(profileId);
            state.likedProfiles.push(profileId);
            state.currentStack = state.currentStack.filter((p) => p.id !== profileId);
        },

        swipeLeft: (state, action: PayloadAction<string>) => {
            const profileId = action.payload;
            state.swipedProfiles.push(profileId);
            state.passedProfiles.push(profileId);
            state.currentStack = state.currentStack.filter((p) => p.id !== profileId);
        },

        undoSwipe: (state) => {
            const lastSwipedId = state.swipedProfiles.pop();
            if (lastSwipedId) {
                state.likedProfiles = state.likedProfiles.filter((id) => id !== lastSwipedId);
                state.passedProfiles = state.passedProfiles.filter((id) => id !== lastSwipedId);
                // Note: Need to fetch profile data again to add back to stack
            }
        },

        resetStack: (state) => {
            state.currentStack = [];
            state.swipedProfiles = [];
            state.likedProfiles = [];
            state.passedProfiles = [];
        },
    },
});

export const {
    setProfiles,
    swipeRight,
    swipeLeft,
    undoSwipe,
    resetStack
} = swipeSlice.actions;

export default swipeSlice.reducer;