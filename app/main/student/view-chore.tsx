import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';

const GRADIENT_THRESHOLD = 24;

// TODO: Replace with data fetched from API based on chore ID passed via route params
const CHORE = {
  title: 'Take out the bins',
  description: 'Make sure all bags are tied before taking them out',
  category: 'Bins',
  isRecurring: true,
  frequency: 'Weekly',
  assignedTo: 'Person 1',
  createdBy: 'Person 2',
  createdAt: '14/03/2026',
};

export default function ViewChore() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
            <Text style={styles.heading}>{CHORE.title}</Text>

            <Spacer size="small" />

            <Text style={styles.subheading}>
              Created by {CHORE.createdBy} on {CHORE.createdAt}
            </Text>

            <Spacer size="large" />

            {CHORE.description ? (
              <>
                <Text style={styles.fieldLabel}>Description</Text>
                <Text style={styles.fieldValue}>{CHORE.description}</Text>
                <Spacer size="medium" />
              </>
            ) : null}

            <Text style={styles.fieldLabel}>Category</Text>
            <Text style={styles.fieldValue}>{CHORE.category}</Text>

            <Spacer size="medium" />

            <Text style={styles.fieldLabel}>Repeats</Text>
            <Text style={styles.fieldValue}>{CHORE.isRecurring ? CHORE.frequency : 'No'}</Text>

            <Spacer size="medium" />

            <Text style={styles.fieldLabel}>Assigned to</Text>
            <Text style={styles.fieldValue}>{CHORE.assignedTo}</Text>

            <Spacer size="large" />

            <Button
              title="Reassign chore"
              onPress={() => {
                // TODO: run reassign flow
              }}
            />

            <Spacer size="small" />

            <Button
              title="Edit chore"
              onPress={() => router.push('/main/student/edit-chore')}
              variant="secondary"
            />

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
  centerText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
    textAlign: 'center',
  },
});
