// src/features/matches/MatchesListScreen.tsx
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {useAppSelector} from "@/shared/lib/store/store";
import {Match, MatchesListNavigationProp} from "@/shared/lib/types/profile";
import {selectConversationMatches, selectRecentMatches} from "@/features/matches/matchesSlice";
import {formatTimestamp} from "@/shared/lib/helpers";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MATCH_CARD_SIZE = (SCREEN_WIDTH - 48) / 3;


const MatchesListScreen: React.FC = () => {
    const navigation = useNavigation<MatchesListNavigationProp>();
    const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');

    const recentMatches = useAppSelector(selectRecentMatches);
    const conversationMatches = useAppSelector(selectConversationMatches);



    const renderMatchCard = ({ item }: ListRenderItemInfo<Match>) => (
        <TouchableOpacity
            style={styles.matchCard}
            onPress={() => navigation.navigate('Chat', { matchId: item.profile.id })}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.profile.photos[0] }} style={styles.matchImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.matchGradient}
            >
                <Text style={styles.matchName} numberOfLines={1}>
                    {item.profile.name}
                </Text>
            </LinearGradient>
            {item.lastMessage && !item.lastMessage.read && (
                <View style={styles.unreadBadge}>
                    <View style={styles.unreadDot} />
                </View>
            )}
        </TouchableOpacity>
    );

    const renderConversation = ({ item }: ListRenderItemInfo<Match>) => {
        const hasUnread = item.lastMessage && !item.lastMessage.read;

        return (
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => navigation.navigate('Chat', { matchId: item.profile.id })}
                activeOpacity={0.7}
            >
                <View style={styles.conversationAvatarContainer}>
                    <Image
                        source={{ uri: item.profile.photos[0] }}
                        style={styles.conversationAvatar}
                    />
                    {hasUnread && <View style={styles.onlineDot} />}
                </View>

                <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                        <Text style={[styles.conversationName, hasUnread && styles.unreadText]}>
                            {item.profile.name}
                        </Text>
                        <Text style={styles.conversationTime}>
                            {item.lastMessage
                                ? formatTimestamp(item.lastMessage.timestamp)
                                : formatTimestamp(item.matchedAt)}
                        </Text>
                    </View>

                    <View style={styles.conversationMessageRow}>
                        <Text
                            style={[
                                styles.conversationMessage,
                                hasUnread && styles.unreadMessageText,
                            ]}
                            numberOfLines={1}
                        >
                            {item.lastMessage?.text || 'You matched!'}
                        </Text>
                        {hasUnread && <View style={styles.unreadIndicator} />}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyMatches = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="heart-outline" size={64} color="#FFB6C1" />
            </View>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>
                Keep swiping to find your perfect match!
            </Text>
        </View>
    );

    const renderEmptyConversations = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="chatbubbles-outline" size={64} color="#FFB6C1" />
            </View>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
                Start chatting with your matches!
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
                    onPress={() => setActiveTab('matches')}
                >
                    <Text
                        style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}
                    >
                        Matches
                    </Text>
                    {recentMatches.length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{recentMatches.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
                    onPress={() => setActiveTab('messages')}
                >
                    <Text
                        style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}
                    >
                        Messages
                    </Text>
                    {conversationMatches.filter(m => m.lastMessage && !m.lastMessage.read)
                        .length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>
                                {
                                    conversationMatches.filter(
                                        m => m.lastMessage && !m.lastMessage.read
                                    ).length
                                }
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Content */}
            {activeTab === 'matches' ? (
                recentMatches.length === 0 ? (
                    renderEmptyMatches()
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>
                            New Matches ({recentMatches.length})
                        </Text>
                        <FlatList
                            data={recentMatches}
                            keyExtractor={item => item.profile.id}
                            renderItem={renderMatchCard}
                            numColumns={3}
                            contentContainerStyle={styles.matchesGrid}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                )
            ) : conversationMatches.length === 0 ? (
                renderEmptyConversations()
            ) : (
                <FlatList
                    data={conversationMatches}
                    keyExtractor={item => item.profile.id}
                    renderItem={renderConversation}
                    contentContainerStyle={styles.conversationsList}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
    },
    activeTab: {
        backgroundColor: '#FFE5E5',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
    },
    activeTabText: {
        color: '#FF6B6B',
    },
    tabBadge: {
        backgroundColor: '#FF6B6B',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    tabBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    matchesGrid: {
        paddingHorizontal: 16,
    },
    matchCard: {
        width: MATCH_CARD_SIZE,
        height: MATCH_CARD_SIZE * 1.3,
        margin: 4,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    matchImage: {
        width: '100%',
        height: '100%',
    },
    matchGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        justifyContent: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    matchName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    unreadBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF6B6B',
    },
    conversationsList: {
        paddingHorizontal: 20,
    },
    conversationItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    conversationAvatarContainer: {
        position: 'relative',
    },
    conversationAvatar: {
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
    conversationContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    conversationName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },
    unreadText: {
        color: '#000',
        fontWeight: '700',
    },
    conversationTime: {
        fontSize: 13,
        color: '#999',
    },
    conversationMessageRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    conversationMessage: {
        flex: 1,
        fontSize: 15,
        color: '#999',
    },
    unreadMessageText: {
        color: '#333',
        fontWeight: '500',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF6B6B',
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
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
    },
});

export default MatchesListScreen;