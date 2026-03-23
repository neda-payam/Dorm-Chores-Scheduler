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
import Spacer from '../../components/Spacer';

import { COLOURS } from '../../constants/colours';

function formatAccountType(type: string | string[]) {
  if (typeof type === 'string') {
    return type.charAt(0).toUpperCase() + type.slice(1);
  } else {
    return type.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
  }
}

export default function SignUp() {
  const { accountType } = useLocalSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Redirect to account-type if no accountType selected
  useEffect(() => {
    if (!accountType) {
      router.push('/auth/account-type');
    }
  }, [accountType]);

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
        <Text style={styles.title}>CREATE ACCOUNT</Text>
        <Text style={styles.subtitle}>Please enter the following information</Text>
      </View>

      <Spacer size="medium" />

      <View style={styles.content}>
        <InlineNotification
          type="info"
          text={
            accountType ? (
              <Text>
                You are creating a{' '}
                <Text style={styles.boldUnderline}>{formatAccountType(accountType)} Account</Text>.
              </Text>
            ) : (
              'Please select your account type.'
            )
          }
        />

        <Spacer size="medium" />

        <Text style={styles.inputLabel}>Display Name</Text>
        <Input value={displayName} onChangeText={setDisplayName} placeholder="Example Name" />

        <Spacer size="medium" />

        <Text style={styles.inputLabel}>Email Address</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Spacer size="medium" />

        <Text style={styles.inputLabel}>Password</Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Spacer size="medium" />

        <Text style={styles.inputLabel}>Confirm password</Text>
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          hidePasswordToggle={true}
        />

        <Spacer size="large" />

        <Button
          title="Sign Up"
          onPress={() => router.push({ pathname: '/auth/confirm-email', params: { email } })}
          variant="standard"
        />

        <Spacer size="large" />

        <Text style={[styles.bodyText, styles.centerText]}>
          Incorrect type?{' '}
          <InlineButton
            title="Change account type"
            onPress={() => router.push('/auth/account-type')}
          />
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
