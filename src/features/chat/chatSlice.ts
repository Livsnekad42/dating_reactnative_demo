// src/features/chat/chatSlice.ts
import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from "@/shared/lib/store/store";

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
}

interface ChatState {
    conversations: Record<string, Message[]>; // matchId -> messages[]
}

const initialState: ChatState = {
    conversations: {},
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (
            state,
            action: PayloadAction<{ matchId: string; message: Message }>
        ) => {
            const { matchId, message } = action.payload;
            if (!state.conversations[matchId]) {
                state.conversations[matchId] = [];
            }
            state.conversations[matchId].push(message);
        },
        markMessagesAsRead: (state, action: PayloadAction<string>) => {
            const matchId = action.payload;
            if (state.conversations[matchId]) {
                state.conversations[matchId].forEach(msg => {
                    msg.isRead = true;
                });
            }
        },
        clearConversation: (state, action: PayloadAction<string>) => {
            delete state.conversations[action.payload];
        },
    },
});

export const { addMessage, markMessagesAsRead, clearConversation } = chatSlice.actions;
export default chatSlice.reducer;