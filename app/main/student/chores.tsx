import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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

import { FontAwesome5 } from '@expo/vector-icons';
import ActionPillButton from '../../../components/ActionPillButton';
import AvailabilityBadge from '../../../components/AvailabilityBadge';
import FilterChip from '../../../components/FilterChip';
import InlineButton from '../../../components/InlineButton';
import ListItem from '../../../components/ListItem';
import NavBar, { NavBarItem } from '../../../components/Navbar';
import ProfilePicture from '../../../components/ProfilePicture';
import SortDropdown from '../../../components/SortDropdown';
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';

const FILTER_OPTIONS = ['All', 'Mine', 'Recurring', 'Completed'];
const SORT_OPTIONS = ['Due Date', 'Alphabetical', 'Date Created'];

const NAV_ITEMS: NavBarItem[] = [
  {
    key: 'home',
    label: 'Home',
    iconName: 'home',
    onPress: () => router.push('/main/student/home'),
  },
  {
    key: 'chores',
    label: 'Chores',
    iconName: 'broom',
    onPress: () => router.push('/main/student/chores'),
  },
  {
    key: 'repairs',
    label: 'Repairs',
    iconName: 'tools',
    onPress: () => router.push('/main/student/repairs'),
  },
  {
    key: 'dorms',
    label: 'Dorms',
    iconName: 'bed',
    onPress: () => router.push('/main/student/dorms'),
  },
];

type ChoreSummary = {
  id: string;
  title: string;
  iconName: keyof typeof FontAwesome5.glyphMap;
  subtitle: string;
  overdue: boolean;
};

const CHORES: ChoreSummary[] = [
  {
    id: '1',
    title: 'Take out the bins',
    iconName: 'trash',
    subtitle: 'You - Due 1 hour ago',
    overdue: true,
  },
  {
    id: '2',
    title: 'Clean the common room',
    iconName: 'broom',
    subtitle: 'You - Due in 3 days',
    overdue: false,
  },
  {
    id: '3',
    title: 'Tidy the hallway',
    iconName: 'house-user',
    subtitle: 'Person 2 - Due 6 years ago',
    overdue: true,
  },
  {
    id: '4',
    title: 'Mop the kitchen',
    iconName: 'broom',
    subtitle: 'Person 2 - Due in 6 days',
    overdue: false,
  },
  {
    id: '5',
    title: 'Clean the bathrooms',
    iconName: 'toilet',
    subtitle: 'Person 3 - Due in 1 week',
    overdue: false,
  },
];

const GRADIENT_THRESHOLD = 24;

export default function Chores() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Due Date');

  const [contentOverflows, setContentOverflows] = useState(false);
  const scrollViewHeight = useRef(0);
  const contentHeight = useRef(0);

  const headerGradientOpacity = useRef(new Animated.Value(0)).current;
  const navGradientOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const checkOverflow = () => {
    if (!scrollViewHeight.current || !contentHeight.current) return;

    const overflows = contentHeight.current > scrollViewHeight.current + 1;
    setContentOverflows(overflows);

    if (!overflows) {
      navGradientOpacity.setValue(0);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollY = contentOffset.y;

    const headerValue = Math.min(scrollY / GRADIENT_THRESHOLD, 1);
    headerGradientOpacity.setValue(headerValue);

    if (contentHeight.current > scrollViewHeight.current) {
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - scrollY;
      const value = distanceFromBottom < GRADIENT_THRESHOLD ? 0 : 1;
      navGradientOpacity.setValue(value);
    }
  };

  const items: NavBarItem[] = NAV_ITEMS.map((item) => ({
    ...item,
  }));

  const isEmpty = CHORES.length === 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />

      {/* Static header */}
      <View style={styles.topBar}>
        <ProfilePicture variant="small" onPress={() => router.push('/main/profile/index')} />
        <AvailabilityBadge isAvailable={isAvailable} onChange={setIsAvailable} />
      </View>

      {/* Header bottom shadow - fades in once user scrolls */}
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

      {/* Scrollable content */}
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
          onLayout={(e) => {
            scrollViewHeight.current = e.nativeEvent.layout.height;
            requestAnimationFrame(checkOverflow);
          }}
          onContentSizeChange={(_, h) => {
            contentHeight.current = h;
            requestAnimationFrame(checkOverflow);
          }}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Chores</Text>

            {isEmpty ? (
              <>
                <Spacer size="large" />

                <View style={styles.completed}>
                  <View style={styles.iconWrapper}>
                    <FontAwesome5 name="check" size={40} color={COLOURS.black} />
                  </View>

                  <Text style={styles.completedTitle}>All chores complete</Text>

                  <Text style={styles.completedSubtitle}>
                    Something need doing?{' '}
                    <InlineButton
                      title="Create new chore"
                      onPress={() => router.push('/main/student/create-chore')}
                    />
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Spacer size="medium" />

                <View style={styles.chipRow}>
                  {FILTER_OPTIONS.map((option) => (
                    <FilterChip
                      key={option}
                      label={option}
                      active={activeFilter === option}
                      onPress={() => setActiveFilter(option)}
                    />
                  ))}
                </View>

                <Spacer size="small" />

                <View style={styles.chipRow}>
                  <SortDropdown options={SORT_OPTIONS} selected={sortBy} onSelect={setSortBy} />
                </View>

                <Spacer size="medium" />

                {CHORES.map((chore, index) => (
                  <View key={chore.id}>
                    <ListItem
                      title={chore.title}
                      iconName={chore.iconName}
                      subtitle={chore.subtitle}
                      onPress={() => router.push(`/main/student/view-chore`)}
                      statusChip={
                        chore.overdue
                          ? {
                              label: 'Overdue',
                              backgroundColor: '#FFE9EA',
                              textColor: '#B70000',
                            }
                          : undefined
                      }
                    />

                    {/* Spacer between items (not after last) */}
                    {index < CHORES.length - 1 && <Spacer size="small" />}
                  </View>
                ))}
              </>
            )}

            <Spacer size="large" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.newChoreButtonWrapper}>
        <ActionPillButton
          title="New Chore"
          iconName="plus"
          onPress={() => router.push('/main/student/create-chore')}
        />
      </View>

      {/* White panel behind navbar to prevent see-through */}
      <View style={styles.navBarBackground} pointerEvents="none" />

      {/* Navbar top shadow - visible when content overflows, hides at bottom */}
      {contentOverflows && (
        <Animated.View
          style={[styles.navGradientWrapper, { opacity: navGradientOpacity }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={['rgba(102, 102, 102, 0)', 'rgba(134, 134, 133, 0.35)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Static navbar */}
      <NavBar
        items={items as [NavBarItem, NavBarItem, ...NavBarItem[]]}
        activeKey={'chores'}
        style={styles.navBar}
      />
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
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLOURS.black,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.gray[700],
    lineHeight: 24,
  },
  navGradientWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 96,
    height: 6,
    zIndex: 3,
  },
  navBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    backgroundColor: COLOURS.white,
    zIndex: 1,
  },
  navBar: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLOURS.black,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  newChoreButtonWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 112,
    zIndex: 4,
  },
  completed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTitle: {
    marginTop: 8,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLOURS.black,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
    textAlign: 'center',
  },
});
