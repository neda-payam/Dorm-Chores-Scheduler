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

import Button from '../../../components/Button';
import HeaderBackButton from '../../../components/HeaderBackButton';
import InlineNotification from '../../../components/InlineNotification';
import Input from '../../../components/Input';
import Spacer from '../../../components/Spacer';

import { COLOURS } from '../../../constants/colours';
import { getCurrentUser, updateDisplayName } from '../../../lib/auth';
import { ValidationError, formatErrorMessage } from '../../../lib/errors';

const GRADIENT_THRESHOLD = 24;

export default function EditDisplayName() {
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [, setKeyboardVisible] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;

  // Fetch current user so we can prep data / extract ID
  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
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

  const handleSave = async () => {
    setNotice(null);

    if (!userId) {
      setNotice({ type: 'error', text: 'You must be logged in to do this.' });
      return;
    }

    setLoading(true);
    try {
      await updateDisplayName(userId, displayName);
      setNotice({ type: 'success', text: 'Display name updated successfully!' });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        setNotice({ type: 'error', text: err.message });
      } else {
        setNotice({
          type: 'error',
          text: err.message ? formatErrorMessage(err.message) : 'An unexpected error occurred.',
        });
      }
    } finally {
      setLoading(false);
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
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.content}>
            <Text style={styles.heading}>Change display name</Text>

            <Spacer size="small" />

            <Text style={styles.body}>
              Enter the display name you’d like to use for your account.
            </Text>

            <Spacer size="large" />

            <Text style={styles.label}>New display name</Text>

            <Input
              value={displayName}
              onChangeText={(val) => {
                setDisplayName(val);
                if (notice?.type === 'error') setNotice(null);
              }}
              placeholder="Example Name"
              hasError={notice?.type === 'error'}
            />

            {notice && (
              <>
                <Spacer size="medium" />
                <InlineNotification type={notice.type} text={notice.text} />
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={loading ? 'Saving...' : 'Save changes'}
            onPress={handleSave}
            disabled={loading}
          />

          <Spacer size="large" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOURS.white },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLOURS.white,
  },
  headerGradientWrapper: { height: 6 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  content: { marginHorizontal: 20 },
  heading: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLOURS.black,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.gray[700],
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: COLOURS.white,
  },
});
