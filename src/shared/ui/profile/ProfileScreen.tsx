// src/features/profile/ProfileScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import {RootState} from "@/shared/lib/store/store";

export const ProfileScreen: React.FC = () => {
    const matches = useSelector((state: RootState) => state.matches.matches);
    const rejected = useSelector((state: RootState) => state.swipe.passedProfiles);

    // Mock current user data
    const currentUser = {
        name: 'John Doe',
        age: 28,
        bio: 'React Native developer looking for connections',
        interests: ['Coding', 'Travel', 'Coffee', 'Photography'],
        photos: 3,
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {currentUser.name.charAt(0)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.name}>{currentUser.name}, {currentUser.age}</Text>
                <Text style={styles.bio}>{currentUser.bio}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={styles.interestsContainer}>
                    {currentUser.interests.map((interest, index) => (
                        <View key={index} style={styles.interestTag}>
                            <Text style={styles.interestText}>{interest}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stats</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{matches.length}</Text>
                        <Text style={styles.statLabel}>Matches</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{rejected.length}</Text>
                        <Text style={styles.statLabel}>Passed</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{currentUser.photos}</Text>
                        <Text style={styles.statLabel}>Photos</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.disclaimer}>
                    Demo project created for SDG job application
                </Text>
                <Text style={styles.techStack}>
                    React Native + Expo + Redux Toolkit + TypeScript
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FF6B6B',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    bio: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
    },
    section: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    interestTag: {
        backgroundColor: '#FFE5E5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    interestText: {
        color: '#FF6B6B',
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#FF6B6B',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FF6B6B',
    },
    secondaryButtonText: {
        color: '#FF6B6B',
    },
    disclaimer: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginBottom: 8,
    },
    techStack: {
        fontSize: 10,
        color: '#CCC',
        textAlign: 'center',
    },
});