import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import FilterChip from '../../../components/FilterChip';
import HeaderBackButton from '../../../components/HeaderBackButton';
import InlineButton from '../../../components/InlineButton';
import InlineNotification from '../../../components/InlineNotification';
import Input from '../../../components/Input';
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';
import { Chore, deleteChore, getChoreById, updateChore } from '../../../lib/chores';

const GRADIENT_THRESHOLD = 24;

const FREQUENCY_OPTIONS: { key: string; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'fortnightly', label: 'Fortnightly' },
  { key: 'monthly', label: 'Monthly' },
];

export default function EditChore() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [chore, setChore] = useState<Chore | null>(null);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [dueWithinDays, setDueWithinDays] = useState('7');
  const [dueWithinError, setDueWithinError] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState<boolean | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [notice, setNotice] = useState<{
    type: 'error' | 'success' | 'info' | 'warning' | 'tip';
    text: string;
  } | null>(null);

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;

  const loadChore = useCallback(async () => {
    const fetchId = Array.isArray(id) ? id[0] : id;
    if (!fetchId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getChoreById(fetchId);
      if (!data) throw new Error('Chore not found');
      setChore(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setDueWithinDays(data.meta?.due_in_days?.toString() || '7');
    } catch (e) {
      console.error('Failed to load chore:', e);
      setNotice({ type: 'error', text: 'Could not load chore details. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadChore();
  }, [loadChore]);

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

  const handleSave = async () => {
    setNotice(null);
    setTitleError(null);
    setDescriptionError(null);
    setDueWithinError(null);

    const titleTrimmed = title.trim();
    const descriptionTrimmed = description.trim();
    let hasError = false;

    if (!titleTrimmed) {
      setTitleError('Please enter a chore title');
      hasError = true;
    } else if (titleTrimmed.length < 3 || titleTrimmed.length > 50) {
      setTitleError('Chore title must be between 3 and 50 characters');
      hasError = true;
    }

    if (descriptionTrimmed.length > 200) {
      setDescriptionError('Description must be under 200 characters');
      hasError = true;
    }

    const dwdParsed = parseInt(dueWithinDays, 10);
    if (isNaN(dwdParsed) || dwdParsed <= 0 || dwdParsed > 365) {
      setDueWithinError('Due within days must be between 1 and 365.');
      hasError = true;
    }

    if (hasError) return;

    if (!id) return;

    setLoadingSave(true);
    try {
      await updateChore(id, {
        title: titleTrimmed,
        description: descriptionTrimmed || undefined,
        meta: {
          due_in_days: parseInt(dueWithinDays, 10) || 7,
        },
      });
      router.push('/main/student/chores');
    } catch (e: any) {
      setNotice({ type: 'error', text: e.message || 'Failed to update chore' });
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!id) return;

    setLoadingDelete(true);
    try {
      await deleteChore(id);
      router.push('/main/student/chores');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to delete chore');
    } finally {
      setLoadingDelete(false);
    }
  };

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
            {loading ? (
              <ActivityIndicator size="large" color={COLOURS.primary} />
            ) : chore ? (
              <>
                <Text style={styles.heading}>Edit Chore</Text>

                <Spacer size="small" />

                <Text style={styles.subheading}>
                  Changes will be visible to all members of the dorm
                </Text>

                <Spacer size="large" />

                <Text style={styles.inputLabel}>Title</Text>
                <Input
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Take out the bins"
                  hasError={!!titleError}
                  onBlur={() => setTitleError(null)}
                />
                {titleError && (
                  <InlineNotification type="error" text={titleError} style={{ marginTop: 4 }} />
                )}

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
                  hasError={!!descriptionError}
                  onBlur={() => setDescriptionError(null)}
                />
                {descriptionError && (
                  <InlineNotification
                    type="error"
                    text={descriptionError}
                    style={{ marginTop: 4 }}
                  />
                )}

                <Spacer size="medium" />

                <Text style={styles.inputLabel}>Due Within (Days)</Text>
                <Input
                  value={dueWithinDays}
                  onChangeText={setDueWithinDays}
                  placeholder="e.g. 7"
                  keyboardType="number-pad"
                  hasError={!!dueWithinError}
                  onBlur={() => setDueWithinError(null)}
                />
                {dueWithinError && (
                  <InlineNotification type="error" text={dueWithinError} style={{ marginTop: 4 }} />
                )}
                <Spacer size="medium" />

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

                <Button
                  title={loadingSave ? 'Saving...' : 'Save changes'}
                  onPress={handleSave}
                  variant="standard"
                  disabled={loadingSave}
                />

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

                    <Text style={styles.subheading}>
                      This action cannot be reversed once confirmed
                    </Text>

                    <Spacer size="medium" />

                    <Button
                      title={loadingDelete ? 'Deleting...' : 'Yes, delete chore'}
                      onPress={handleDeleteConfirmed}
                      variant="danger"
                      disabled={loadingDelete}
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
              </>
            ) : (
              <Text style={styles.errorText}>Chore not found.</Text>
            )}
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
  errorText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.error.text,
    textAlign: 'center',
    marginTop: 40,
  },
});
