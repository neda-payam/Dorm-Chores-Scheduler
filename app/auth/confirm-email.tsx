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

export default function ConfirmEmail() {
  const { email } = useLocalSearchParams();
  const [codeValue, setCodeValue] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/auth/signup');
    }
  }, [email]);

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

  const handleConfirmEmail = useCallback(() => {
    if (!codeValue.trim()) {
      return;
    }

    router.push('/');
  }, [codeValue]);

  const handleResend = useCallback(() => {
    console.log('Resend code triggered');
  }, []);

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

        <Spacer size="small" />

        <Text style={styles.bodyText}>
          Not received a code <InlineButton title="Re-send code" onPress={handleResend} />
        </Text>

        <Spacer size="large" />

        <Button title="Submit" onPress={handleConfirmEmail} variant="standard" />

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
