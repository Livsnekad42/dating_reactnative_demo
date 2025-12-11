// App.tsx (UPDATED with Chat navigation)
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {registerForPushNotificationsAsync} from "@/features/notifications/notificationSlice";
import {store} from "@/shared/lib/store/store";
import {SwipeScreen} from "@/shared/ui/swipe/SwipeScreen";
import {ProfileScreen} from "@/shared/ui/profile/ProfileScreen";
import ChatListScreen from "@/shared/ui/chat/ChatListScreen";
import MatchesListScreen from "@/shared/ui/matches/MatchesListScreen";
import ChatScreen from "@/shared/ui/chat/ChatScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

// TODO: Fix the navigation
const Tab = createBottomTabNavigator();
const ChatsStack = createNativeStackNavigator();

function ChatsStackNavigator() {
    return (
        <ChatsStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatsStack.Screen name="ChatsList" component={ChatListScreen} />
            <ChatsStack.Screen name="Chat" component={ChatScreen} />
        </ChatsStack.Navigator>
    );
}
export default function App() {
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <NavigationContainer>
                    <StatusBar style="dark" />
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                let iconName: keyof typeof Ionicons.glyphMap;

                                if (route.name === 'Swipe') {
                                    iconName = focused ? 'flame' : 'flame-outline';
                                } else if (route.name === 'Matches') {
                                    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                                } else if (route.name === 'Profile') {
                                    iconName = focused ? 'person' : 'person-outline';
                                } else {
                                    iconName = 'help-outline';
                                }

                                return <Ionicons name={iconName} size={size} color={color} />;
                            },
                            tabBarActiveTintColor: '#FF6B6B',
                            tabBarInactiveTintColor: 'gray',
                            headerShown: false,
                        })}
                    >
                        <Tab.Screen name="Swipe" component={SwipeScreen} />
                        <Tab.Screen name="Matches" component={MatchesListScreen} />
                        <Tab.Screen name="Chats" component={ChatsStackNavigator} />
                        <Tab.Screen name="Profile" component={ProfileScreen} />
                    </Tab.Navigator>
                </NavigationContainer>
            </Provider>
        </GestureHandlerRootView>
    );
}