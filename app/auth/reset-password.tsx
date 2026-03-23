import { Stack, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Button from '../../components/Button';
import CurvedBanner from '../../components/CurvedBanner';
import InlineButton from '../../components/InlineButton';
import InlineNotification from '../../components/InlineNotification';
import Input from '../../components/Input';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';
import { supabase } from '../../lib/supabase';
import { normaliseEmail, validateResetPasswordFields } from '../../lib/validation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<{
    type: 'error' | 'success' | 'info' | 'warning' | 'tip';
    text: string;
  } | null>(null);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleReset = useCallback(async () => {
    setNotice(null);

    const trimmedEmail = normaliseEmail(email);

    const resetValidationResult = validateResetPasswordFields(trimmedEmail);
    if (!resetValidationResult.isValid) {
      setNotice({
        type: 'error',
        text: resetValidationResult.error || 'Invalid email address.',
      });
      return;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);

    console.log('AFTER resetPassword:', { data, error });

    if (error) {
      setNotice({
        type: 'error',
        text: error.message,
      });
      return;
    }

    setNotice({
      type: 'info',
      text: 'If an account exists for this email, a password reset link has been sent.',
    });
  }, [email]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <View style={styles.container}>
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
            />

            <Spacer size="large" />
            {notice && (
              <>
                <InlineNotification type={notice.type} text={notice.text} />
                <Spacer size="medium" />
              </>
            )}

            <Button title="Reset password" onPress={handleReset} variant="standard" />
            <Spacer size="large" />

            <Text style={[styles.bodyText, styles.centerText]}>
              No longer needed?{' '}
              <InlineButton title="Return to Sign in" onPress={() => router.push('/auth/signin')} />
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.white,
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
