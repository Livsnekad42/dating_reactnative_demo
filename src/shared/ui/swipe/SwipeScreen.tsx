import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import {RootState} from "@/shared/lib/store/store";
import {setProfiles, swipeLeft, swipeRight} from "@/features/swipe/swipeSlice";
import {addMatch, hideMatchAnimation} from "@/features/matches/matchesSlice";
import {SwipeCard} from "@/shared/ui/swipe/SwipeCard";
import {MatchAnimation} from "@/shared/ui/swipe/MatchAnimation";
import {scheduleMatchNotification} from "@/features/notifications/notificationSlice";
import {useGetProfilesQuery, useLikeProfileMutation} from "@/shared/api/mockApi";

export const SwipeScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { data: profiles, isLoading } = useGetProfilesQuery();
    const [likeProfile] = useLikeProfileMutation();

    const currentStack = useSelector((state: RootState) => state.swipe.currentStack);
    const showMatchAnimation = useSelector(
        (state: RootState) => state.matches.showMatchAnimation
    );
    const currentMatchedProfile = useSelector(
        (state: RootState) => state.matches.currentMatchedProfile
    );

    useEffect(() => {
        if (profiles) {
            dispatch(setProfiles(profiles));
        }
    }, [profiles]);

    const handleSwipeLeft = (profileId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        dispatch(swipeLeft(profileId));
    };

    const handleSwipeRight = async (profileId: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        dispatch(swipeRight(profileId));

        // Check for match
        const result = await likeProfile(profileId);
        console.log('res', result);
        if ('data' in result && result?.data?.matched && result.data.profile) {
            // Match detected!
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            dispatch(addMatch(result.data.profile));

            // Schedule notification
            await scheduleMatchNotification(result.data.profile);
        }
    };

    const handleCloseMatchAnimation = () => {
        dispatch(hideMatchAnimation());
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    if (currentStack.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No more profiles 😢</Text>
                <Text style={styles.emptySubtext}>Check back later for new matches!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!showMatchAnimation && <View style={styles.cardContainer}>

                {currentStack.slice(0, 3).map((profile, index) => (
                    <SwipeCard
                        key={profile.id}
                        profile={profile}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                        index={index}
                    />
                ))}

            </View> }

            {showMatchAnimation && currentMatchedProfile && (
                <MatchAnimation
                    profile={currentMatchedProfile}
                    onClose={handleCloseMatchAnimation}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    emptyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#666',
    },
});