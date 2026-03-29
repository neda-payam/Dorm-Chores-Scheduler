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
import Input from '../../../components/Input';
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';

const GRADIENT_THRESHOLD = 24;

// TODO: Replace with data fetched from API based on active dorm ID
const EXISTING_DORM = {
  name: 'Maple House',
};

export default function EditDorm() {
  const [name, setName] = useState(EXISTING_DORM.name);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [notice, setNotice] = useState<{
    type: 'error' | 'success' | 'info' | 'warning' | 'tip';
    text: string;
  } | null>(null);

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (confirmingDelete) {
        setConfirmingDelete(false);
        return true;
      }
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, [confirmingDelete]);

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

  const handleSave = useCallback(() => {
    setNotice(null);

    if (!name.trim()) {
      setNotice({ type: 'error', text: 'Please enter a dorm name' });
      return;
    }

    // TODO: submit updated dorm to API
    router.push('/main/student/dorms');
  }, [name]);

  const handleDeleteConfirmed = useCallback(() => {
    // TODO: delete dorm via API
    router.push('/main/student/dorms');
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
            <Text style={styles.heading}>Edit Dorm</Text>

            <Spacer size="small" />

            <Text style={styles.subheading}>
              Changes you make here will be visible to all members of the dorm
            </Text>

            <Spacer size="large" />

            <Text style={styles.inputLabel}>Dorm name</Text>
            <Input value={name} onChangeText={setName} placeholder="e.g. Maple House" />

            <Spacer size="large" />

            <Button title="Save changes" onPress={handleSave} variant="standard" />

            {notice && (
              <>
                <Spacer size="medium" />
                <InlineNotification type={notice.type} text={notice.text} />
              </>
            )}

            <Spacer size="large" />

            <View style={styles.divider} />

            <Spacer size="large" />

            <Text style={styles.dangerLabel}>Delete dorm</Text>

            <Spacer size="small" />

            <Text style={styles.subheading}>
              This is permanent and cannot be undone. All chores and repairs will also be removed
            </Text>

            <Spacer size="medium" />

            {confirmingDelete ? (
              <>
                <Text style={styles.confirmLabel}>Are you sure?</Text>

                <Spacer size="small" />

                <Text style={styles.subheading}>This action cannot be reversed once confirmed</Text>

                <Spacer size="medium" />

                <Button title="Yes, delete dorm" onPress={handleDeleteConfirmed} variant="danger" />
              </>
            ) : (
              <Button
                title="Delete dorm"
                onPress={() => setConfirmingDelete(true)}
                variant="danger"
              />
            )}

            <Spacer size="large" />

            <Text style={styles.centerText}>
              Changed your mind? <InlineButton title="Go back" onPress={() => router.back()} />
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
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 8,
  },
  dangerLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 0,
  },
  confirmLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 0,
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
