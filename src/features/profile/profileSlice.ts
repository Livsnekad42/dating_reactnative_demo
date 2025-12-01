import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Profile} from "@/shared/lib/types/profile";

interface ProfileState {
    currentUser: Profile | null;
    isLoading: boolean;
}

const initialState: ProfileState = {
    currentUser: {
        id: 'current-user',
        name: 'Alex',
        age: 28,
        bio: 'Demo profile for SDG application showcase',
        photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
        distance: 0,
        interests: ['React Native', 'Redux', 'Mobile Dev'],
        occupation: 'Frontend Developer',
    },
    isLoading: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
            if (state.currentUser) {
                state.currentUser = { ...state.currentUser, ...action.payload };
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        resetProfile: (state) => {
            state.currentUser = initialState.currentUser;
        },
    },
});

export const { updateProfile, setLoading, resetProfile } = profileSlice.actions;

export default profileSlice.reducer;