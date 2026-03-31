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
import InlineNotification from '../../../components/InlineNotification';
import Input from '../../../components/Input';
import Spacer from '../../../components/Spacer';

import { COLOURS } from '../../../constants/colours';
import {
  validateNoSqlInjection,
  validatePassword,
  validateRequired,
} from '../../../lib/validation';

import { supabase } from '../../../lib/supabase';

const GRADIENT_THRESHOLD = 24;

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const clearErrors = () => {
    setNewPasswordError(null);
    setConfirmPasswordError(null);
    setNotice(null);
  };

  const handleChangePassword = useCallback(async () => {
    clearErrors();

    const newPasswordRequired = validateRequired(newPassword, 'New password');
    if (!newPasswordRequired.isValid) {
      setNewPasswordError(newPasswordRequired.error ?? 'New password is required.');
      return;
    }

    const confirmRequired = validateRequired(confirmPassword, 'Confirm new password');
    if (!confirmRequired.isValid) {
      setConfirmPasswordError(confirmRequired.error ?? 'Confirm new password is required.');
      return;
    }

    const newPasswordSqlCheck = validateNoSqlInjection(newPassword, 'New password');
    if (!newPasswordSqlCheck.isValid) {
      setNewPasswordError(newPasswordSqlCheck.error ?? 'New password contains invalid characters.');
      return;
    }

    const confirmSqlCheck = validateNoSqlInjection(confirmPassword, 'Confirm new password');
    if (!confirmSqlCheck.isValid) {
      setConfirmPasswordError(
        confirmSqlCheck.error ?? 'Confirm new password contains invalid characters.',
      );
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setNewPasswordError(passwordValidation.error ?? 'Password is invalid.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setNotice({ type: 'error', text: updateError.message });
        return;
      }

      setNotice({
        type: 'success',
        text: 'Password updated successfully!',
      });

      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.back();
      }, 1500);
    } finally {
      setLoading(false);
    }
  }, [newPassword, confirmPassword]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />

      {/* Static header */}
      <View style={styles.topBar}>
        <HeaderBackButton iconName="chevron-left" />
      </View>

      {/* Header bottom shadow — fades in once user scrolls */}
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
            <Text style={styles.heading}>Change password</Text>

            <Spacer size="small" />

            <Text style={styles.body}>
              Choose a new password for your account. Make sure it&apos;s strong and secure!
            </Text>

            <Spacer size="large" />

            <Text style={styles.inputLabel}>New password</Text>
            <Input
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password"
              secureTextEntry
              hasError={!!newPasswordError}
            />
            {newPasswordError && (
              <InlineNotification type="error" text={newPasswordError} style={{ marginTop: 4 }} />
            )}

            <Spacer size="medium" />

            <Text style={styles.inputLabel}>Confirm new password</Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
              hidePasswordToggle={true}
              hasError={!!confirmPasswordError}
            />
            {confirmPasswordError && (
              <InlineNotification
                type="error"
                text={confirmPasswordError}
                style={{ marginTop: 4 }}
              />
            )}

            {notice && (
              <>
                <Spacer size="medium" />
                <InlineNotification type={notice.type} text={notice.text} />
              </>
            )}

            <Spacer size="large" />
          </View>
        </ScrollView>

        {/* Pinned Save button at the bottom */}
        <View style={styles.footer}>
          <Button
            title={loading ? 'Saving...' : 'Save changes'}
            onPress={handleChangePassword}
            variant="standard"
            disabled={loading}
          />
        </View>
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
  body: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.gray[700],
    lineHeight: 24,
  },
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    paddingTop: 12,
    backgroundColor: COLOURS.white,
  },
});
