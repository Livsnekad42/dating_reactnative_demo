import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import {Profile} from "@/shared/lib/types/profile";
// import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeCardProps {
    profile: Profile;
    onSwipeLeft: (id: string) => void;
    onSwipeRight: (id: string) => void;
    index: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = React.memo(
    ({ profile, onSwipeLeft, onSwipeRight, index }) => {
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);

        const gestureHandler = useAnimatedGestureHandler({
            onActive: (event) => {
                translateX.value = event.translationX;
                translateY.value = event.translationY;
            },
            onEnd: (event) => {
                if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                    // Swipe completed
                    const direction = event.translationX > 0 ? 1 : -1;
                    translateX.value = withSpring(direction * SCREEN_WIDTH * 1.5, {
                        velocity: event.velocityX,
                    });

                    if (direction > 0) {
                        runOnJS(onSwipeRight)(profile.id);
                    } else {
                        runOnJS(onSwipeLeft)(profile.id);
                    }
                } else {
                    // Snap back
                    translateX.value = withSpring(0);
                    translateY.value = withSpring(0);
                }
            },
        });

        const animatedStyle = useAnimatedStyle(() => {
            const rotate = interpolate(
                translateX.value,
                [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                [-15, 0, 15]
            );

            const opacity = interpolate(
                Math.abs(translateX.value),
                [0, SWIPE_THRESHOLD],
                [1, 0.5]
            );

            return {
                transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value },
                    { rotate: `${rotate}deg` },
                ],
                opacity,
            };
        });

        const likeStampStyle = useAnimatedStyle(() => ({
            opacity: interpolate(
                translateX.value,
                [0, SWIPE_THRESHOLD],
                [0, 1]
            ),
        }));

        const nopeStampStyle = useAnimatedStyle(() => ({
            opacity: interpolate(
                translateX.value,
                [-SWIPE_THRESHOLD, 0],
                [1, 0]
            ),
        }));

        return (
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View
                    style={[
                        styles.card,
                        animatedStyle,
                        { zIndex: 100 - index },
                    ]}
                >
                    <Image source={{ uri: profile.photos[0] }} style={styles.image} />

                    {/* Like Stamp */}
                    <Animated.View style={[styles.stamp, styles.likeStamp, likeStampStyle]}>
                        <Text style={styles.stampText}>LIKE</Text>
                    </Animated.View>

                    {/* Nope Stamp */}
                    <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStampStyle]}>
                        <Text style={styles.stampText}>NOPE</Text>
                    </Animated.View>

                    <View style={styles.info}>
                        <Text style={styles.name}>
                            {profile.name}, {profile.age}
                        </Text>
                        <Text style={styles.bio} numberOfLines={2}>
                            {profile.bio}
                        </Text>
                        <Text style={styles.distance}>{profile.distance} km away</Text>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        );
    },
    (prev, next) => prev.profile.id === next.profile.id && prev.index === next.index
);

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: SCREEN_WIDTH - 40,
        height: SCREEN_HEIGHT * 0.7,
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    info: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    distance: {
        fontSize: 14,
        color: '#999',
    },
    stamp: {
        position: 'absolute',
        top: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 4,
        borderRadius: 10,
        transform: [{ rotate: '-25deg' }],
    },
    likeStamp: {
        right: 30,
        borderColor: '#4CAF50',
    },
    nopeStamp: {
        left: 30,
        borderColor: '#F44336',
        transform: [{ rotate: '25deg' }],
    },
    stampText: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});