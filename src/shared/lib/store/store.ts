import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import swipeReducer from '@/features/swipe/swipeSlice'
import matchReducer from '@/features/matches/matchesSlice'
import chatReducer from '@/features/chat/chatSlice'
import profileReducer from '@/features/profile/profileSlice'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {mockApi} from "@/shared/api/mockApi";
export const store = configureStore({
    reducer: {
        [mockApi.reducerPath]: mockApi.reducer,
        swipe: swipeReducer,
        matches: matchReducer,
        chat: chatReducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(mockApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;