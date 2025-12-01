// src/features/notifications/NotificationService.ts
import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
import { Platform } from 'react-native';
import React from "react";
import {Profile} from "@/shared/lib/types/profile";

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    // if (Device.isDevice) {
    //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //     let finalStatus = existingStatus;
    //
    //     if (existingStatus !== 'granted') {
    //         const { status } = await Notifications.requestPermissionsAsync();
    //         finalStatus = status;
    //     }
    //
    //     if (finalStatus !== 'granted') {
    //         console.log('Failed to get push token for push notification!');
    //         return;
    //     }
    //
    //     token = (await Notifications.getExpoPushTokenAsync()).data;
    //     console.log('Push token:', token);
    // } else {
    //     console.log('Must use physical device for Push Notifications');
    // }

    return token;
}

export async function scheduleMatchNotification(profile: Profile) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "It's a Match! 🎉",
            body: `You and ${profile.name} liked each other!`,
            data: { type: 'match', matchName: profile.name },
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
        },
    });
}

export async function scheduleMessageNotification(senderName: string, message: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: senderName,
            body: message,
            data: { type: 'message', senderName },
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
        },
    });
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// Hook for listening to notifications
export function useNotificationObserver(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
) {
    React.useEffect(() => {
        const notificationListener = Notifications.addNotificationReceivedListener(onNotificationReceived);
        const responseListener = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, [onNotificationReceived, onNotificationResponse]);
}