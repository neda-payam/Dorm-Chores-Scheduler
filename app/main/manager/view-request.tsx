import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
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

import Button from '../../../components/Button';
import HeaderBackButton from '../../../components/HeaderBackButton';
import InlineButton from '../../../components/InlineButton';
import InlineNotification from '../../../components/InlineNotification';
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';

const GRADIENT_THRESHOLD = 24;

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  resolved: 'Resolved',
};

// TODO: Replace with data fetched from API based on repair ID passed via route params
const REPAIR = {
  title: 'Broken bathroom light',
  description: 'The overhead light has stopped working. Replaced the bulb but the issue persists',
  dorm: 'Maple House',
  category: 'Bathroom',
  priority: 'High',
  status: 'pending',
  reportedBy: 'Person 1',
  reportedAt: '20/03/2026',
};

export default function ViewRequest() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(REPAIR.status);

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
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
    const { contentOffset } = e.nativeEvent;
    const scrollY = contentOffset.y;
    const headerValue = Math.min(scrollY / GRADIENT_THRESHOLD, 1);
    headerGradientOpacity.setValue(headerValue);
  };

  const handleUpdateStatus = useCallback((newStatus: string) => {
    // TODO: update repair status via API
    setCurrentStatus(newStatus);

    // Optional: automatically route back after resolving, or just let them see the updated state
    if (newStatus === 'resolved') {
      setTimeout(() => {
        router.push('/main/manager/requests');
      }, 1500);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
      />

      <View style={styles.topBar}>
        <HeaderBackButton iconName="times" />
      </View>

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
            <Text style={styles.heading}>{REPAIR.title}</Text>

            <Spacer size="small" />

            <Text style={styles.subheading}>
              {REPAIR.dorm} • Reported by {REPAIR.reportedBy} on {REPAIR.reportedAt}
            </Text>

            <Spacer size="large" />

            {REPAIR.description ? (
              <>
                <Text style={styles.fieldLabel}>Description</Text>
                <Text style={styles.fieldValue}>{REPAIR.description}</Text>
                <Spacer size="medium" />
              </>
            ) : null}

            <Text style={styles.fieldLabel}>Category</Text>
            <Text style={styles.fieldValue}>{REPAIR.category}</Text>

            <Spacer size="medium" />

            <Text style={styles.fieldLabel}>Priority</Text>
            <Text style={styles.fieldValue}>{REPAIR.priority}</Text>

            <Spacer size="medium" />

            <Text style={styles.fieldLabel}>Current Status</Text>
            <Text style={styles.fieldValue}>{STATUS_LABELS[currentStatus] ?? currentStatus}</Text>

            <Spacer size="large" />

            <View style={styles.divider} />

            <Spacer size="large" />

            <Text style={styles.inputLabel}>Manage Request</Text>

            <Spacer size="small" />

            <Text style={styles.subheading}>
              Update the status of this repair request to keep the residents informed of its
              progress.
            </Text>

            <Spacer size="medium" />

            {currentStatus === 'pending' && (
              <>
                <Button
                  title="Mark as In Progress"
                  onPress={() => handleUpdateStatus('in_progress')}
                  variant="secondary"
                />
                <Spacer size="medium" />
              </>
            )}

            {currentStatus !== 'resolved' ? (
              <Button title="Mark as Resolved" onPress={() => handleUpdateStatus('resolved')} />
            ) : (
              <InlineNotification type="success" text="This request has been resolved" />
            )}

            <Spacer size="large" />

            <Text style={styles.centerText}>
              Done here? <InlineButton title="Go back" onPress={() => router.back()} />
            </Text>

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
  subheading: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: COLOURS.gray[500],
    lineHeight: 22,
  },
  fieldLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: COLOURS.gray[700],
    lineHeight: 22,
  },
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLOURS.gray[200],
  },
  centerText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
    textAlign: 'center',
  },
});
