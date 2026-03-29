import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
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

const GRADIENT_THRESHOLD = 24;

const SPECIFIC_NOTIFICATIONS = [
  { id: 'chore_assigned', label: 'New chore assignment' },
  { id: 'chore_due', label: 'Chore due soon' },
  { id: 'chore_overdue', label: 'Chore overdue' },
  { id: 'chore_completed', label: 'Chore completed' },
  { id: 'repair_submitted', label: 'New repair request submitted' },
  { id: 'repair_status', label: 'Repair request status updated' },
  { id: 'repair_comment', label: 'New comment on repair request' },
  { id: 'daily_reminder', label: 'Daily chore reminder' },
  { id: 'weekly_rotation', label: 'Weekly chore schedule generated' },
  { id: 'announcement', label: 'System announcement' },
  { id: 'account_activity', label: 'Account activity update' },
];

type NotificationState = Record<string, boolean>;

const DEFAULT_SPECIFIC_STATE: NotificationState = Object.fromEntries(
  SPECIFIC_NOTIFICATIONS.map((n) => [n.id, true]),
);

export default function Notifications() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [allEnabled, setAllEnabled] = useState(true);
  const [specificState, setSpecificState] = useState<NotificationState>(DEFAULT_SPECIFIC_STATE);

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
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

  // Master toggle - only controls whether notifications are globally allowed
  const handleAllEnabledChange = useCallback((value: boolean) => {
    setAllEnabled(value);
  }, []);

  // Individual toggle - only affects itself, independent of master
  const handleSpecificChange = useCallback((id: string, value: boolean) => {
    setSpecificState((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />

      {/* Static header */}
      <View style={styles.topBar}>
        <HeaderBackButton iconName="chevron-left" />
      </View>

      {/* Header bottom shadow - fades in once user scrolls */}
      <Animated.View
        style={[styles.headerGradientWrapper, { opacity: headerGradientOpacity }]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['rgba(134, 134, 133, 0.35)', 'rgba(102, 102, 102, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Scrollable content */}
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
            <Text style={styles.body}>Manage your notification preferences here</Text>

            <Spacer size="small" />

            {/* Master toggle */}
            <ToggleItem
              title="Allow notifications"
              iconName="bell"
              value={allEnabled}
              onValueChange={handleAllEnabledChange}
            />

            <Spacer size="large" />

            <Text style={styles.sectionTitle}>Specific notifications</Text>
            <Text style={styles.body}>
              Choose which types of notifications you&apos;d like to receive from the app
            </Text>

            <Spacer size="small" />

            {/* Specific notification toggles */}
            {SPECIFIC_NOTIFICATIONS.map((item) => (
              <ToggleItem
                key={item.id}
                title={item.label}
                value={specificState[item.id]}
                onValueChange={(value) => handleSpecificChange(item.id, value)}
                disabled={!allEnabled}
              />
            ))}

            <Spacer size="medium" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOURS.white,
    zIndex: 10,
  },
  headerGradientWrapper: {
    height: 6,
    width: '100%',
    zIndex: 9,
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
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLOURS.black,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.gray[700],
    lineHeight: 24,
  },
});
