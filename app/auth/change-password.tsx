import { Stack, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Button from '../../components/Button';
import CurvedBanner from '../../components/CurvedBanner';
import InlineButton from '../../components/InlineButton';
import InlineNotification from '../../components/InlineNotification';
import Input from '../../components/Input';
import InputCode from '../../components/InputCode';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';
import { supabase } from '../../lib/supabase';
import { validatePassword } from '../../lib/validation';

export default function ChangePassword() {
  const [codeValue, setCodeValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notice, setNotice] = useState<{
    type: 'error' | 'success' | 'info' | 'warning' | 'tip';
    text: string;
  } | null>(null);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleReset = useCallback(async () => {
    setNotice(null);

    if (!password || !confirmPassword) {
      setNotice({
        type: 'error',
        text: 'Please enter and confirm your new password.',
      });
      return;
    }

    const passwordValidationResult = validatePassword(password);
    if (!passwordValidationResult.isValid) {
      setNotice({
        type: 'error',
        text: passwordValidationResult.error || 'Invalid password.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({
        type: 'error',
        text: 'Passwords do not match.',
      });
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    console.log('AFTER changePassword:', { data, error });

    if (error) {
      setNotice({
        type: 'error',
        text: error.message,
      });
      return;
    }

    setNotice({
      type: 'success',
      text: 'Password changed successfully. Please sign in.',
    });

    router.push('/auth/signin');
  }, [password, confirmPassword]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <View style={styles.container}>
          <CurvedBanner variant="medium" />
          <Spacer size="medium" />

          <View style={styles.content}>
            <Text style={styles.title}>CHANGE PASSWORD</Text>
            <Text style={styles.subtitle}>Please fill out the details below</Text>
          </View>

          <Spacer size="medium" />
          {/* NOTE:
            Supabase reset flow uses email reset link.
            Confirmation code UI currently not connected to backend.
            */}

          <View style={styles.content}>
            <Text style={styles.inputLabel}>Confirmation code</Text>
            <Text style={[styles.description, styles.inputMargin]}>
              The code you received via email
            </Text>

            <Spacer size="small" />

            <InputCode
              value={codeValue}
              onChangeText={setCodeValue}
              onComplete={(code) => console.log('Code completed:', code)}
            />
          </View>

          <Spacer size="medium" />

          <View style={styles.content}>
            <Text style={[styles.inputLabel, styles.inputMargin]}>Password</Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <Spacer size="medium" />

            <Text style={[styles.inputLabel, styles.inputMargin]}>Confirm password</Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
            />

            <Spacer size="small" />
            <Spacer size="medium" />

            {notice && (
              <>
                <InlineNotification type={notice.type} text={notice.text} />
                <Spacer size="medium" />
              </>
            )}

            <Button title="Change password" onPress={handleReset} variant="standard" />
            <Spacer size="medium" />

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
  },
  inputMargin: {
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
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLOURS.black,
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
    lineHeight: 18,
  },
});
