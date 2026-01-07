import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

export async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
    }
    return true;
}

import { useSettingStore } from '../store/settingStore';

export async function scheduleEventNotification(title: string, startTimestamp: number) {
    try {
        const now = Date.now();
        const diff = startTimestamp - now;
        const notifyTime = useSettingStore.getState().notifyTime;
        const notifyBeforeMs = notifyTime * 60 * 1000;

        if (diff <= 0) return;
        if (diff < notifyBeforeMs) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Upcoming Schedule",
                    body: `"${title}" starts in ${Math.ceil(diff / 60000)} minutes!`,
                },
                trigger: {
                    seconds: 1,
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    repeats: false
                },
            });
        } else {
            const triggerDate = new Date(startTimestamp - notifyBeforeMs);
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Upcoming Schedule",
                    body: `"${title}" starts in ${notifyTime} ${notifyTime === 1 ? 'minute' : 'minutes'}.`,
                },
                trigger: {
                    date: triggerDate,
                    type: Notifications.SchedulableTriggerInputTypes.DATE
                },
            });
        }

    } catch (error) {
        console.log("Error scheduling notification:");
    }
}

export async function sendCreationNotification(title: string) {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Schedule Created",
                body: `You have successfully scheduled "${title}".`,
            },
            trigger: null,
        });
    } catch (error) {
        console.log("Error sending creation notification:");
    }
}
