import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import InputCode from '../../components/InputCode';
import Spacer from '../../components/Spacer';

import { COLOURS } from '../../constants/colours';
import { formatErrorMessage } from '../../lib/errors';
import { supabase } from '../../lib/supabase';
import { normaliseEmail, validateNoSqlInjection, validateRequired } from '../../lib/validation';

export default function ConfirmEmail() {
  const { email } = useLocalSearchParams();

  const [codeValue, setCodeValue] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (!email) {
      router.push('/auth/signup');
    }
  }, [email]);

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

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

  const handleConfirmEmail = useCallback(async () => {
    setCodeError(null);
    setNotice(null);
    const cleanedCode = codeValue.replace(/\D/g, '');

    const emailValue = typeof email === 'string' ? normaliseEmail(email) : '';

    try {
      validateRequired(cleanedCode, 'Confirmation code');
      validateNoSqlInjection(cleanedCode, 'Confirmation code');

      const codeFormatCheck = /^\d{6}$/.test(cleanedCode);
      if (!codeFormatCheck) {
        setCodeError('Confirmation code must be a 6-digit number.');
        return;
      }

      const { error, data } = await supabase.auth.verifyOtp({
        email: emailValue,
        token: cleanedCode,
        type: 'signup',
      });

      if (error) {
        setCodeError(formatErrorMessage(error.message));
        return;
      }

      setNotice({
        type: 'success',
        text: 'Email confirmed successfully. Logging you in...',
      });

      setTimeout(() => {
        // By pushing back to index, it will run the session check,
        // see you are logged in from the verifyOtp session,
        // and direct you to the correct manager/student dashboard
        router.replace('/');
      }, 1500);
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        setCodeError(err.message);
        return;
      }
      setNotice({
        type: 'error',
        text: err.message ? formatErrorMessage(err.message) : 'An unexpected error occurred.',
      });
    }
  }, [codeValue, email]);

  const handleResend = useCallback(async () => {
    setCodeError(null);
    setNotice(null);

    const emailValue = typeof email === 'string' ? normaliseEmail(email) : '';

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailValue,
      });

      if (error) {
        setNotice({
          type: 'error',
          text: formatErrorMessage(error.message),
        });
        return;
      }

      setNotice({
        type: 'success',
        text: 'A new confirmation code has been sent.',
      });
    } catch (err: any) {
      setNotice({
        type: 'error',
        text: err.message ? formatErrorMessage(err.message) : 'Failed to resend confirmation code.',
      });
    }
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
        <Text style={styles.title}>CONFIRM EMAIL ADDRESS</Text>
        <Text style={styles.subtitle}>Please confirm your email address</Text>
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

        <Spacer size="small" />

        <InputCode
          value={codeValue}
          onChangeText={setCodeValue}
          onComplete={(code) => console.log('Code completed:', code)}
        />
        {codeError && <InlineNotification type="error" text={codeError} style={{ marginTop: 4 }} />}

        <Spacer size="small" />

        <Text style={styles.bodyText}>
          Not received a code <InlineButton title="Re-send code" onPress={handleResend} />
        </Text>

        <Spacer size="large" />

        <Button title="Submit" onPress={handleConfirmEmail} variant="standard" />

        {notice && (
          <>
            <Spacer size="medium" />
            <InlineNotification type={notice.type} text={notice.text} />
          </>
        )}

        <Spacer size="large" />

        <Text style={[styles.bodyText, styles.centerText]}>
          Incorrect email address{' '}
          <InlineButton title="Return to Sign up" onPress={() => router.push('/auth/signup')} />
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
