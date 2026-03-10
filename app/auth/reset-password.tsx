import { Stack, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../../components/Button';
import CurvedBanner from '../../components/CurvedBanner';
import InlineButton from '../../components/InlineButton';
import InlineNotification from '../../components/InlineNotification';
import Input from '../../components/Input';
import Spacer from '../../components/Spacer';

import { COLOURS } from '../../constants/colours';
import { supabase } from '../../lib/supabase';
import { normaliseEmail, validateNoSqlInjection, validateRequired } from '../../lib/validation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [notice, setNotice] = useState<{
    type: 'error' | 'success' | 'info' | 'warning' | 'tip';
    text: string;
  } | null>(null);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const clearErrors = () => {
    setEmailError(null);
    setNotice(null);
  };

  const handleReset = useCallback(async () => {
    clearErrors();
    const emailRequired = validateRequired(email, 'Email address');
    if (!emailRequired.isValid) {
      setEmailError(emailRequired.error!);
      return;
    }
    const emailSqlCheck = validateNoSqlInjection(email, 'Email address');
    if (!emailSqlCheck.isValid) {
      setEmailError(emailSqlCheck.error!);
      return;
    }
    const normalisedEmail = normaliseEmail(email);
    const { error } = await supabase.auth.resetPasswordForEmail(normalisedEmail);
    if (error) {
      setNotice({ type: 'error', text: error.message });
      return;
    }
    setNotice({
      type: 'success',
      text: 'Password reset email sent. Please check your inbox.',
    });
    router.push('/auth/change-password');
  }, [email]);

  const scrollContent = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <CurvedBanner variant="large" />
      <Spacer size="large" />

      <View style={styles.content}>
        <Text style={styles.title}>RESET PASSWORD</Text>
        <Text style={styles.subtitle}>Please fill out the details below</Text>
      </View>

      <Spacer size="large" />

      <View style={styles.content}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="example@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          autoComplete="email"
          hasError={!!emailError}
          onBlur={() => setEmailError(null)}
        />
        {emailError && (
          <InlineNotification type="error" text={emailError} style={{ marginTop: 4 }} />
        )}

        <Spacer size="large" />

        <Button title="Reset password" onPress={handleReset} variant="standard" />

        {notice && (
          <>
            <Spacer size="medium" />
            <InlineNotification type={notice.type} text={notice.text} />
          </>
        )}

        <Spacer size="large" />

        <Text style={[styles.bodyText, styles.centerText]}>
          No longer needed?{' '}
          <InlineButton title="Return to Sign in" onPress={() => router.push('/auth/signin')} />
        </Text>

        <Spacer size="large" />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={keyboardVisible ? 0 : -80}
      >
        {scrollContent}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    marginHorizontal: 24,
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 56,
    color: COLOURS.primary,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.primary,
  },
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 8,
  },
  bodyText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
  },
  centerText: {
    textAlign: 'center',
  },
});
