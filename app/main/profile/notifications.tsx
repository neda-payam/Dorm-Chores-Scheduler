import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import HeaderBackButton from '../../../components/HeaderBackButton';
import Spacer from '../../../components/Spacer';
import ToggleItem from '../../../components/ToggleItem';

import { COLOURS } from '../../../constants/colours';
import type { PreferenceKey } from '../../../lib/inAppNotifications';
import { supabase } from '../../../lib/supabase';

const GRADIENT_THRESHOLD = 24;

type NotificationItem = {
  id: PreferenceKey;
  label: string;
  iconName: keyof typeof FontAwesome5.glyphMap;
};

export default function Notifications() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;

  const STUDENT_NOTIFICATIONS: NotificationItem[] = [
    { id: 'new_chore_assignment', label: 'New chore assignment', iconName: 'clipboard-list' },
    { id: 'chore_due_soon', label: 'Chore due soon', iconName: 'clock' },
    { id: 'chore_overdue', label: 'Chore overdue', iconName: 'exclamation-circle' },
    { id: 'chore_completed', label: 'Chore completed', iconName: 'check-circle' },
    { id: 'repair_status_updated', label: 'Repair request status updated', iconName: 'tools' },
    { id: 'repair_comment', label: 'New comment on repair request', iconName: 'comment-alt' },
    { id: 'daily_chore_reminder', label: 'Daily chore reminder', iconName: 'bell' },
    {
      id: 'weekly_schedule_generated',
      label: 'Weekly chore schedule generated',
      iconName: 'calendar-alt',
    },
    { id: 'system_announcement', label: 'System announcement', iconName: 'bullhorn' },
    { id: 'account_activity_update', label: 'Account activity update', iconName: 'user-circle' },
  ];

  const MANAGER_NOTIFICATIONS: NotificationItem[] = [
    { id: 'new_repair_request', label: 'New repair request submitted', iconName: 'tools' },
    { id: 'repair_status_updated', label: 'Repair request status updated', iconName: 'sync-alt' },
    { id: 'repair_comment', label: 'New comment on repair request', iconName: 'comment-alt' },
    { id: 'chore_completed', label: 'Chore completed', iconName: 'check-circle' },
    { id: 'system_announcement', label: 'System announcement', iconName: 'bullhorn' },
    { id: 'account_activity_update', label: 'Account activity update', iconName: 'user-circle' },
  ];

  const notificationsToShow = isManager ? MANAGER_NOTIFICATIONS : STUDENT_NOTIFICATIONS;

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_manager')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.log('Error fetching profile role:', profileError);
        return;
      }

      setIsManager(profile?.is_manager ?? false);

      const { data: prefs, error: prefsError } = await supabase
        .from('notification_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (prefsError) {
        if (prefsError.code !== 'PGRST116') {
          console.log('Error fetching notification preferences:', prefsError);
        }
        return;
      }

      if (prefs?.preferences) {
        setToggleStates(prefs.preferences);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    const headerValue = Math.min(scrollY / GRADIENT_THRESHOLD, 1);
    headerGradientOpacity.setValue(headerValue);
  };

  const toggleNotification = async (key: PreferenceKey) => {
    const updated = {
      ...toggleStates,
      [key]: !(toggleStates[key] ?? true),
    };

    setToggleStates(updated);

    if (!userId) return;

    const { error } = await supabase.from('notification_preferences').upsert({
      user_id: userId,
      preferences: updated,
    });

    if (error) {
      console.log('Error saving notification preferences:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <HeaderBackButton iconName="chevron-left" />
      </View>

      <Animated.View
        style={[styles.headerGradientWrapper, { opacity: headerGradientOpacity }]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['rgba(134,133,133,0.35)', 'rgba(102,102,102,0)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={keyboardVisible ? 0 : -80}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.content}>
            <Text style={styles.heading}>Notifications</Text>

            <Spacer size="small" />

            <Text style={styles.body}>Manage how and when you receive notifications.</Text>

            <Spacer size="large" />

            {notificationsToShow.map((item, index) => (
              <View key={item.id}>
                <ToggleItem
                  title={item.label}
                  iconName={item.iconName}
                  value={toggleStates[item.id] ?? true}
                  onValueChange={() => toggleNotification(item.id)}
                />
                {index < notificationsToShow.length - 1 ? <Spacer size="small" /> : null}
              </View>
            ))}

            <Spacer size="large" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.white,
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLOURS.white,
  },
  headerGradientWrapper: {
    height: 6,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    marginHorizontal: 20,
  },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLOURS.black,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.gray[700],
    lineHeight: 24,
  },
});
