import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    runOnJS,
} from 'react-native-reanimated';
import {ChatsStackParamList, Profile, RootTabParamList} from "@/shared/lib/types/profile";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, } = Dimensions.get('window');
type Nav = BottomTabNavigationProp<RootTabParamList, 'Swipe'>;

interface MatchAnimationProps {
    profile: Profile;
    onClose: () => void;
}

export const MatchAnimation: React.FC<MatchAnimationProps> = ({ profile, onClose }) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);



    const navigation = useNavigation<Nav>();

    useEffect(() => {
        // Entrance animation
        scale.value = withSequence(
            withSpring(1.2, { damping: 8 }),
            withSpring(1, { damping: 10 })
        );
        opacity.value = withSpring(1);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handleSendMessage = () => {
        runOnJS(onClose)();
        navigation.navigate('Chats', {
            screen: 'Chat',
            params: { chatId: '1' }
        });
        // Navigate to chat would go here
    };

    const handleKeepSwiping = () => {
        console.log('Received message', onClose);
        scale.value = withSpring(0, { damping: 10 });
        opacity.value = withSpring(0, {}, (finished) => {
            if (finished) {
                runOnJS(onClose)(); // Оборачивай в runOnJS
            }
        });
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.backdrop} onPress={handleKeepSwiping} />

            <Animated.View style={[styles.content, animatedStyle]}>
                <Text style={styles.title}>It's a Match! 🎉</Text>

                <View style={styles.imagesContainer}>
                    <Image
                        source={{ uri: profile.photos[0] }}
                        style={styles.profileImage}
                    />
                </View>

                <Text style={styles.nameText}>
                    You and {profile.name} liked each other!
                </Text>

                <View style={styles.buttonsContainer}>
                    <Pressable
                        style={[styles.button, styles.primaryButton]}
                        onPress={handleSendMessage}
                    >
                        <Text style={styles.primaryButtonText}>Send Message</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.button, styles.secondaryButton]}
                        onPress={handleKeepSwiping}
                    >
                        <Text style={styles.secondaryButtonText}>Keep Swiping</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    content: {
        width: SCREEN_WIDTH - 60,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6B6B',
        marginBottom: 30,
    },
    imagesContainer: {
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: '#FF6B6B',
    },
    nameText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonsContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#FF6B6B',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF6B6B',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
});