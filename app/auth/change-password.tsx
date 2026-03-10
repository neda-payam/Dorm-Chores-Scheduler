import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  BackHandler,
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
import InputCode from '../../components/InputCode';
import Spacer from '../../components/Spacer';

import { COLOURS } from '../../constants/colours';
import { validateNoSqlInjection, validatePassword } from '../../lib/validation';

export default function ResetPassword() {
  const { email } = useLocalSearchParams();

  const [codeValue, setCodeValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [codeError, setCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // Track keyboard visibility for KeyboardAvoidingView offset
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

  // Redirect to reset-password if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/auth/reset-password');
    }
  }, [email]);

  const handleReset = () => {
    setCodeError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setNotice(null);

    // Required check
    if (!codeValue) {
      setCodeError('Confirmation code is required.');
      return;
    }
    if (!password) {
      setPasswordError('Password is required.');
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required.');
      return;
    }

    // SQL injection check
    const codeSqlCheck = validateNoSqlInjection(codeValue, 'Confirmation code');
    if (!codeSqlCheck.isValid) {
      setCodeError(codeSqlCheck.error ?? 'Confirmation code contains invalid characters.');
      return;
    }
    const sqlCheck = validateNoSqlInjection(password, 'Password');
    if (!sqlCheck.isValid) {
      setPasswordError(sqlCheck.error ?? 'Password contains invalid characters.');
      return;
    }
    const confirmSqlCheck = validateNoSqlInjection(confirmPassword, 'Confirm password');
    if (!confirmSqlCheck.isValid) {
      setConfirmPasswordError(
        confirmSqlCheck.error ?? 'Confirm password contains invalid characters.',
      );
      return;
    }

    // Code format check
    const codeFormatCheck = /^\d{6}$/.test(codeValue);
    if (!codeFormatCheck) {
      setCodeError('Confirmation code must be a 6-digit number.');
      return;
    }

    // Code match check
    if (codeValue !== '123456') {
      setCodeError('Invalid confirmation code.');
      return;
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error ?? 'Password is invalid.');
      return;
    }

    // Match check
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    setNotice({
      type: 'success',
      text: 'Password changed successfully! Please sign in with your new password.',
    });

    setTimeout(() => {
      router.push('/auth/signin');
    }, 1500);
  };

  const scrollContent = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <CurvedBanner variant="small" />
      <Spacer size="large" />

      <View style={styles.content}>
        <Text style={styles.title}>CHANGE PASSWORD</Text>
        <Text style={styles.subtitle}>Please fill out the details below</Text>
      </View>

      <Spacer size="medium" />

      <View style={styles.content}>
        <InlineNotification
          type="info"
          text={
            email ? (
              <Text>
                We have sent a confirmation code to{' '}
                <Text style={styles.boldUnderline}>{email}</Text>.
              </Text>
            ) : (
              'We have sent a confirmation code to your email.'
            )
          }
        />

        <Spacer size="medium" />

        <Text style={styles.inputLabel}>Confirmation code</Text>
        <Text style={styles.description}>The code you recieved via email</Text>

        <Spacer size="small" />

        <InputCode
          value={codeValue}
          onChangeText={setCodeValue}
          onComplete={(code) => console.log('Code completed:', code)}
        />
        {codeError && <InlineNotification type="error" text={codeError} style={{ marginTop: 4 }} />}

        <Spacer size="medium" />

        <Text style={styles.inputLabel}>Password</Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          hasError={!!passwordError}
        />
        {passwordError && (
          <InlineNotification type="error" text={passwordError} style={{ marginTop: 4 }} />
        )}

        <Spacer size="medium" />

        <Text style={styles.inputLabel}>Confirm password</Text>
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          hidePasswordToggle={true}
          hasError={!!confirmPasswordError}
        />
        {confirmPasswordError && (
          <InlineNotification type="error" text={confirmPasswordError} style={{ marginTop: 4 }} />
        )}

        <Spacer size="large" />

        <Button title="Change password" onPress={handleReset} variant="standard" />

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
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
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
    lineHeight: 56,
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
  description: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: COLOURS.black,
    lineHeight: 12,
  },
  bodyText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
  },
  centerText: {
    textAlign: 'center',
  },
  boldUnderline: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
