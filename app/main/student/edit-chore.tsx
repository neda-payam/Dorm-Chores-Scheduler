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
import CategoryPicker, { CategoryOption } from '../../../components/CategoryPicker';
import FilterChip from '../../../components/FilterChip';
import HeaderBackButton from '../../../components/HeaderBackButton';
import InlineButton from '../../../components/InlineButton';
import InlineNotification from '../../../components/InlineNotification';
import Input from '../../../components/Input';
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';

const GRADIENT_THRESHOLD = 24;

const CATEGORIES: CategoryOption[] = [
  { key: 'kitchen', label: 'Kitchen', iconName: 'utensils' },
  { key: 'bathroom', label: 'Bathroom', iconName: 'bath' },
  { key: 'corridor', label: 'Corridor', iconName: 'house-user' },
  { key: 'bins', label: 'Bins', iconName: 'trash' },
  { key: 'floors', label: 'Floors', iconName: 'broom' },
  { key: 'other', label: 'Other', iconName: 'ellipsis-h' },
];

const FREQUENCY_OPTIONS: { key: string; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'fortnightly', label: 'Fortnightly' },
  { key: 'monthly', label: 'Monthly' },
];

// TODO: Replace with data fetched from API based on chore ID passed via route params
const EXISTING_CHORE = {
  title: 'Take out the bins',
  description: 'Make sure all bags are tied before taking them out',
  category: 'bins',
  isRecurring: true,
  frequency: 'weekly',
};

export default function EditChore() {
  const [title, setTitle] = useState(EXISTING_CHORE.title);
  const [description, setDescription] = useState(EXISTING_CHORE.description);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(EXISTING_CHORE.category);
  const [isRecurring, setIsRecurring] = useState<boolean | null>(EXISTING_CHORE.isRecurring);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(
    EXISTING_CHORE.frequency,
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [notice, setNotice] = useState<{
    type: 'error' | 'success' | 'info' | 'warning' | 'tip';
    text: string;
  } | null>(null);

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (confirmingDelete) {
        setConfirmingDelete(false);
        return true;
      }
      router.back();
      return true;
    });
    return () => backHandler.remove();
  }, [confirmingDelete]);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = e.nativeEvent;
    const scrollY = contentOffset.y;
    const headerValue = Math.min(scrollY / GRADIENT_THRESHOLD, 1);
    headerGradientOpacity.setValue(headerValue);
  };

  const handleRecurringToggle = (value: boolean) => {
    setIsRecurring(value);
    if (!value) setSelectedFrequency(null);
  };

  const handleSave = useCallback(() => {
    setNotice(null);

    if (!title.trim()) {
      setNotice({ type: 'error', text: 'Please enter a chore title' });
      return;
    }
    if (!selectedCategory) {
      setNotice({ type: 'error', text: 'Please select a category' });
      return;
    }
    if (isRecurring === null) {
      setNotice({ type: 'error', text: 'Please specify whether this chore repeats' });
      return;
    }
    if (isRecurring && !selectedFrequency) {
      setNotice({ type: 'error', text: 'Please select how often this chore repeats' });
      return;
    }

    // TODO: submit updated chore to API
    router.push('/main/student/chores');
  }, [title, selectedCategory, isRecurring, selectedFrequency]);

  const handleDeleteConfirmed = useCallback(() => {
    // TODO: delete chore via API
    router.push('/main/student/chores');
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_right' }}
      />

      <View style={styles.topBar}>
        <HeaderBackButton iconName="times" />
      </View>

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
            <Text style={styles.heading}>Edit Chore</Text>

            <Spacer size="small" />

            <Text style={styles.subheading}>
              Changes will be visible to all members of the dorm
            </Text>

            <Spacer size="large" />

            <Text style={styles.inputLabel}>Title</Text>
            <Input value={title} onChangeText={setTitle} placeholder="e.g. Take out the bins" />

            <Spacer size="medium" />

            <Text style={styles.inputLabel}>
              Description <Text style={styles.optional}>(optional)</Text>
            </Text>
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Any extra details..."
              multiline
              numberOfLines={3}
            />

            <Spacer size="medium" />

            <Text style={styles.inputLabel}>Category</Text>

            <Spacer size="small" />

            <CategoryPicker
              options={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <Spacer size="medium" />

            <Text style={styles.inputLabel}>Does this chore repeat?</Text>

            <Spacer size="small" />

            <View style={styles.chipRow}>
              <FilterChip
                label="Yes"
                active={isRecurring === true}
                onPress={() => handleRecurringToggle(true)}
              />
              <FilterChip
                label="No"
                active={isRecurring === false}
                onPress={() => handleRecurringToggle(false)}
              />
            </View>

            {isRecurring && (
              <>
                <Spacer size="medium" />
                <Text style={styles.inputLabel}>How often?</Text>
                <Spacer size="small" />
                <View style={styles.chipRow}>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <FilterChip
                      key={option.key}
                      label={option.label}
                      active={selectedFrequency === option.key}
                      onPress={() => setSelectedFrequency(option.key)}
                    />
                  ))}
                </View>
              </>
            )}

            <Spacer size="large" />

            <Button title="Save changes" onPress={handleSave} variant="standard" />

            {notice && (
              <>
                <Spacer size="medium" />
                <InlineNotification type={notice.type} text={notice.text} />
              </>
            )}

            <Spacer size="large" />

            <View style={styles.divider} />

            <Spacer size="large" />

            <Text style={styles.inputLabel}>Delete chore</Text>

            <Spacer size="small" />

            <Text style={styles.subheading}>This is permanent and cannot be undone</Text>

            <Spacer size="medium" />

            {confirmingDelete ? (
              <>
                <Text style={styles.inputLabel}>Are you sure?</Text>

                <Spacer size="small" />

                <Text style={styles.subheading}>This action cannot be reversed once confirmed</Text>

                <Spacer size="medium" />

                <Button
                  title="Yes, delete chore"
                  onPress={handleDeleteConfirmed}
                  variant="danger"
                />
              </>
            ) : (
              <Button
                title="Delete chore"
                onPress={() => setConfirmingDelete(true)}
                variant="danger"
              />
            )}

            <Spacer size="large" />

            <Text style={styles.centerText}>
              Changed your mind? <InlineButton title="Go back" onPress={() => router.back()} />
            </Text>

            <Spacer size="large" />
          </View>
        </ScrollView>
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
  subheading: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: COLOURS.gray[500],
    lineHeight: 22,
  },
  inputLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLOURS.black,
    marginBottom: 8,
  },
  optional: {
    fontFamily: 'Inter',
    fontWeight: 'normal',
    color: COLOURS.gray[500],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLOURS.gray[200],
  },
  centerText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
    textAlign: 'center',
  },
});
