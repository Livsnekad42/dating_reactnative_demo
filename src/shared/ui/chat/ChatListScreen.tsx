// src/features/chat/AllChatsScreen.tsx
import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {useAppSelector} from "@/shared/lib/store/store";
import {Match} from "@/shared/lib/types/profile";
import {formatTimestamp} from "@/shared/lib/helpers";

type MatchesStackParamList = {
    AllChats: undefined;
    Chat: { matchId: string };
};

type AllChatsNavigationProp = NativeStackNavigationProp<
    MatchesStackParamList,
    'AllChats'
>;

const ChatListScreen: React.FC = () => {
    const navigation = useNavigation<AllChatsNavigationProp>();
    const matches = useAppSelector(state => state.matches.matches);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter matches with messages
    const chatsWithMessages = useMemo(
        () => matches.filter(m => m.lastMessage),
        [matches]
    );

    // Search filter
    const filteredChats = useMemo(() => {
        if (!searchQuery.trim()) return chatsWithMessages;
        const query = searchQuery.toLowerCase();
        return chatsWithMessages.filter(
            m =>
                m.profile.name.toLowerCase().includes(query) ||
                m.lastMessage?.text.toLowerCase().includes(query)
        );
    }, [chatsWithMessages, searchQuery]);

    // Sort by timestamp (most recent first)
    const sortedChats = useMemo(() => {
        return [...filteredChats].sort((a, b) => {
            const timeA = a.lastMessage?.timestamp || a.matchedAt.toString();
            const timeB = b.lastMessage?.timestamp || b.matchedAt.toString();
            return new Date(timeB).getTime() - new Date(timeA).getTime();
        });
    }, [filteredChats]);

    // Count unread messages
    const unreadCount = useMemo(
        () => chatsWithMessages.filter(m => m.lastMessage && !m.lastMessage.read).length,
        [chatsWithMessages]
    );

    const renderChat = ({ item }: ListRenderItemInfo<Match>) => {
        const hasUnread = item.lastMessage && !item.lastMessage.read;
        const timestamp = item.lastMessage?.timestamp || item.matchedAt;

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('Chat', { matchId: item.profile.id })}
                activeOpacity={0.7}
            >
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.profile.photos[0] }} style={styles.avatar} />
                    {hasUnread && <View style={styles.onlineDot} />}
                </View>

                <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                        <Text style={[styles.chatName, hasUnread && styles.unreadName]}>
                            {item.profile.name}
                        </Text>
                        <Text style={[styles.timestamp, hasUnread && styles.unreadTimestamp]}>
                            {formatTimestamp(timestamp)}
                        </Text>
                    </View>

                    <View style={styles.messageRow}>
                        <Text
                            style={[styles.lastMessage, hasUnread && styles.unreadMessage]}
                            numberOfLines={2}
                        >
                            {item.lastMessage?.text || 'Say hi to your new match! 👋'}
                        </Text>
                        {hasUnread && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>NEW</Text>
                            </View>
                        )}
                    </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="chatbubbles-outline" size={80} color="#FFB6C1" />
            </View>
            <Text style={styles.emptyTitle}>No Messages Yet</Text>
            <Text style={styles.emptySubtitle}>
                When you match with someone, you'll be able to chat with them here
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('MatchesList' as any)}
            >
                <Text style={styles.emptyButtonText}>View Matches</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSearchEmpty = () => (
        <View style={styles.searchEmptyContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.searchEmptyText}>No chats found</Text>
            <Text style={styles.searchEmptySubtext}>
                Try searching for a different name
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Messages</Text>
                    <View style={styles.headerActions}>
                        {unreadCount > 0 && (
                            <View style={styles.headerBadge}>
                                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.headerButton}>
                            <Ionicons name="filter-outline" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="#999"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search messages..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Stats Bar */}
                {chatsWithMessages.length > 0 && (
                    <View style={styles.statsBar}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{chatsWithMessages.length}</Text>
                            <Text style={styles.statLabel}>Total Chats</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, styles.unreadStatValue]}>
                                {unreadCount}
                            </Text>
                            <Text style={styles.statLabel}>Unread</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{matches.length}</Text>
                            <Text style={styles.statLabel}>Matches</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Chat List */}
            {chatsWithMessages.length === 0 ? (
                renderEmptyState()
            ) : sortedChats.length === 0 ? (
                renderSearchEmpty()
            ) : (
                <FlatList
                    data={sortedChats}
                    keyExtractor={item => item.profile.id}
                    renderItem={renderChat}
                    contentContainerStyle={styles.chatList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerBadge: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 24,
        alignItems: 'center',
    },
    headerBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        marginHorizontal: 20,
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    statsBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF5F5',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    unreadStatValue: {
        color: '#FF6B6B',
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#FFE0E0',
    },
    chatList: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f5f5f5',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#fff',
    },
    chatContent: {
        flex: 1,
        marginLeft: 16,
        marginRight: 12,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    chatName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    unreadName: {
        fontWeight: '700',
        color: '#000',
    },
    timestamp: {
        fontSize: 13,
        color: '#999',
        marginLeft: 8,
    },
    unreadTimestamp: {
        color: '#FF6B6B',
        fontWeight: '600',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    lastMessage: {
        flex: 1,
        fontSize: 15,
        color: '#999',
        lineHeight: 20,
    },
    unreadMessage: {
        color: '#666',
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    unreadBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#FFF5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    emptyButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    searchEmptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
    },
    searchEmptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
    },
    searchEmptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
});

export default ChatListScreen;