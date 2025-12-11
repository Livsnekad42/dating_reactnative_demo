// src/features/chat/ChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import {useAppDispatch, useAppSelector} from "@/shared/lib/store/store";
import {markAsRead, updateLastMessage} from "@/features/matches/matchesSlice";
import {addMessage} from "@/features/chat/chatSlice";
import {useGetChatMessagesQuery} from "@/shared/api/mockApi";

type ChatScreenRouteProp = RouteProp<{ Chat: { matchId: string } }, 'Chat'>;

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
}

const ChatScreen: React.FC = () => {
    const route = useRoute<ChatScreenRouteProp>();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { matchId } = route.params;

    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Get match profile from Redux
    const match = useAppSelector(state =>
        state.matches.matches.find(m => m.profile.id === matchId)
    );

    // Get messages from Redux or API
    const localMessages = useAppSelector(state => state.chat.conversations[matchId]) || [];
    const { data: apiMessages, isLoading } = useGetChatMessagesQuery(matchId);

    // Combine local + API messages
    // const allMessages = [...(apiMessages || []), ...localMessages].sort(
    //     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    // );
    console.log('localMessages', localMessages);
    console.log('apiMessages', apiMessages);
    const allMessages = [...(apiMessages || []), ...localMessages].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    useEffect(() => {
        // Mark messages as read when screen opens
        if (match) {
            dispatch(markAsRead(matchId));
        }
    }, [matchId, match, dispatch]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId: 'me',
            text: inputText.trim(),
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        // Add to Redux
        dispatch(addMessage({ matchId, message: newMessage }));

        // Update last message in matches list
        dispatch(
            updateLastMessage({
                matchId,
                message: newMessage.text,
            })
        );

        // Clear input
        setInputText('');

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulate response after 2 seconds (demo only)
        setTimeout(() => {
            const responseMessage: Message = {
                id: `msg_${Date.now()}`,
                senderId: matchId,
                text: getRandomResponse(),
                timestamp: new Date().toISOString(),
                isRead: false,
            };

            dispatch(addMessage({ matchId, message: responseMessage }));
            dispatch(
                updateLastMessage({
                    matchId,
                    message: responseMessage.text,
                })
            );

            flatListRef.current?.scrollToEnd({ animated: true });
        }, 2000);
    };

    const getRandomResponse = () => {
        const responses = [
            'That sounds great! 😊',
            'Haha yeah! 😄',
            'Tell me more!',
            'I love that too!',
            'When are you free?',
            'We should meet up sometime!',
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isMyMessage = item.senderId === 'me';
        const showTimestamp =
            index === 0 ||
            new Date(item.timestamp).getTime() -
            new Date(allMessages[index - 1].timestamp).getTime() >
            300000; // 5 min

        return (
            <View>
                {showTimestamp && (
                    <Text style={styles.timestamp}>
                        {new Date(item.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </Text>
                )}
                <View
                    style={[
                        styles.messageContainer,
                        isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
                    ]}
                >
                    {!isMyMessage && (
                        <Image
                            source={{ uri: match?.profile.photos[0] }}
                            style={styles.avatar}
                        />
                    )}
                    <View
                        style={[
                            styles.messageBubble,
                            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                isMyMessage ? styles.myMessageText : styles.theirMessageText,
                            ]}
                        >
                            {item.text}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </SafeAreaView>
        );
    }

    if (!match) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Match not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: match.profile.photos[0] }}
                        style={styles.headerAvatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{match.profile.name}</Text>
                        <Text style={styles.headerStatus}>Active now</Text>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Messages List */}
                <FlatList
                    ref={flatListRef}
                    data={allMessages}
                    keyExtractor={item => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                />

                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={inputText.trim() ? '#fff' : '#ccc'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 12,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerStatus: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2,
    },
    moreButton: {
        padding: 8,
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginVertical: 12,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    theirMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '70%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    myMessageBubble: {
        backgroundColor: '#FF6B6B',
        borderBottomRightRadius: 4,
    },
    theirMessageBubble: {
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#fff',
    },
    theirMessageText: {
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#f0f0f0',
    },
    errorText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 40,
    },
});

export default ChatScreen;