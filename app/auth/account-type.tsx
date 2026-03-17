import { Stack, router } from 'expo-router';
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
import Selector, { SelectorOption } from '../../components/Selector';
import Spacer from '../../components/Spacer';

import { COLOURS } from '../../constants/colours';

export default function AccountSelector() {
  const [selectedAccountType, setSelectedAccountType] = useState<string>('student');
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

  const accountTypeOptions: SelectorOption[] = [
    {
      id: 'student',
      icon: 'user-alt',
      title: 'Student',
      subtitle: 'Create and track chores within your student accommodation',
    },
    {
      id: 'manager',
      icon: 'user-tie',
      title: 'Manager',
      subtitle: 'Accept and manage maintenance requests directly from students',
    },
  ];

  const scrollContent = (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <CurvedBanner variant="medium" />
      <Spacer size="large" />

      <View style={styles.content}>
        <Text style={styles.title}>ACCOUNT TYPE</Text>
        <Text style={styles.subtitle}>Choose your account type</Text>
      </View>

      <Spacer size="large" />

      <View style={styles.content}>
        <Text style={styles.inputLabel}>Account Type</Text>

        <Spacer size="medium" />

        <Selector
          options={accountTypeOptions}
          selectedId={selectedAccountType}
          onSelect={setSelectedAccountType}
        />

        <Spacer size="large" />

        <Button
          title="Select"
          onPress={() =>
            router.push({ pathname: '/auth/signup', params: { accountType: selectedAccountType } })
          }
          variant="standard"
        />

        <Spacer size="large" />

        <Text style={[styles.bodyText, styles.centerText]}>
          Already have an account?{' '}
          <InlineButton title="Sign in" onPress={() => router.push('/auth/signin')} />
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
});
