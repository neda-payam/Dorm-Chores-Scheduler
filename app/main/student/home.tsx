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
import AvailabilityBadge from '../../../components/AvailabilityBadge';
import BlockButton from '../../../components/BlockButton';
import InlineButton from '../../../components/InlineButton';
import InlineNotification from '../../../components/InlineNotification';
import ListItem from '../../../components/ListItem';
import NavBar, { NavBarItem } from '../../../components/Navbar';
import ProfilePicture from '../../../components/ProfilePicture';
import Spacer from '../../../components/Spacer';
import { COLOURS } from '../../../constants/colours';

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

const GRADIENT_THRESHOLD = 24;

type IconName = keyof typeof FontAwesome5.glyphMap;

const TODAY_TASKS: {
  id: string;
  title: string;
  subtitle: string;
  iconName: IconName;
  overdue: boolean;
}[] = [
  {
    id: '1',
    title: 'Take out the bins',
    subtitle: 'You - Due 1 hour ago',
    iconName: 'trash' as IconName,
    overdue: true,
  },
  {
    id: '2',
    title: 'Tidy the corridor',
    subtitle: 'You - Due in 1 hour',
    iconName: 'house-user' as IconName,
    overdue: false,
  },
  {
    id: '3',
    title: 'Clean the kitchen area',
    subtitle: 'Person 2 - Due 6 years ago',
    iconName: 'utensils' as IconName,
    overdue: true,
  },
  {
    id: '4',
    title: 'Mop the floor',
    subtitle: 'Person 3 - Due in 5 hours',
    iconName: 'broom' as IconName,
    overdue: false,
  },
  {
    id: '5',
    title: 'Hoover the floors',
    subtitle: 'Person 4 - Due in 8 hours',
    iconName: 'wind' as IconName,
    overdue: false,
  },
];

const OPEN_REPAIRS: {
  id: string;
  title: string;
  subtitle: string;
  iconName: IconName;
  status?: {
    label: string;
    backgroundColor: string;
    textColor: string;
  };
}[] = [
  {
    id: '1',
    title: 'Fix broken sink',
    subtitle: 'Created by Person 2 - 20/02/2026',
    iconName: 'faucet' as IconName,
    status: {
      label: 'In Progress',
      backgroundColor: '#FFF7D3',
      textColor: 'rgba(0, 0, 0, 0.65)',
    },
  },
];

export default function Home() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

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

  const noChores = TODAY_TASKS.length === 0;
  const noRepairs = OPEN_REPAIRS.length === 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />

      {/* Static header */}
      <View style={styles.topBar}>
        <ProfilePicture variant="small" onPress={() => router.push('/main/profile')} />
        <AvailabilityBadge isAvailable={isAvailable} onChange={setIsAvailable} />
      </View>

      {/* Header bottom shadow — fades in once user scrolls */}
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
            <View style={styles.titleRow}>
              <Text style={styles.title}>Today</Text>
              <InlineNotification
                type="info"
                text="Showing top 5 due tasks"
                style={styles.inlineNotification}
              />
            </View>

            <Spacer size="medium" />

            {noChores ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconWrapper}>
                  <FontAwesome5 name="check" size={40} color={COLOURS.black} />
                </View>
                <Text style={styles.emptyTitle}>All chores complete</Text>
                <Text style={styles.emptySubtitle}>
                  Something need doing?{' '}
                  <InlineButton
                    title="Create new chore"
                    onPress={() => router.push('/main/student/create-chore')}
                  />
                </Text>
              </View>
            ) : (
              <View>
                {TODAY_TASKS.map((task, index) => (
                  <View key={task.id}>
                    <ListItem
                      title={task.title}
                      subtitle={task.subtitle}
                      iconName={task.iconName}
                      onPress={() => router.push(`/main/student/chore/${task.id}`)}
                      statusChip={
                        task.overdue
                          ? {
                              label: 'Overdue',
                              backgroundColor: '#FFE9EA',
                              textColor: '#B70000',
                            }
                          : undefined
                      }
                    />
                    {index < TODAY_TASKS.length - 1 ? <Spacer size="small" /> : null}
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.inlineAction, styles.inlineActionLarge]}>
              <InlineButton
                title="View all chores"
                onPress={() => router.push('/main/student/chores')}
              />
            </View>

            <Spacer size="large" />

            <Text style={styles.title}>This week</Text>
            <Spacer size="small" />
            <Text style={styles.placeholderText}>
              This week summary components are coming soon.
            </Text>

            <Spacer size="large" />

            <View style={styles.titleRow}>
              <Text style={styles.title}>Open repairs</Text>
              <InlineNotification
                type="info"
                text="Showing max 3"
                style={styles.inlineNotification}
              />
            </View>

            <Spacer size="medium" />

            {noRepairs ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No repairs found</Text>
                <Text style={styles.emptySubtitle}>
                  Something need repaired?{' '}
                  <InlineButton
                    title="Request repair"
                    onPress={() => router.push('/main/student/request-repair')}
                  />
                </Text>
              </View>
            ) : (
              <View>
                {OPEN_REPAIRS.map((repair, index) => (
                  <View key={repair.id}>
                    <ListItem
                      title={repair.title}
                      subtitle={repair.subtitle}
                      iconName={repair.iconName}
                      onPress={() => router.push(`/main/student/repairs/${repair.id}`)}
                      statusChip={repair.status}
                    />
                    {index < OPEN_REPAIRS.length - 1 ? <Spacer size="small" /> : null}
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.inlineAction, styles.inlineActionLarge]}>
              <InlineButton
                title="View all repairs"
                onPress={() => router.push('/main/student/repairs')}
              />
            </View>

            <Spacer size="large" />

            <Text style={styles.title}>Quick actions</Text>
            <Spacer size="small" />
            <View style={styles.quickActionsRow}>
              <BlockButton
                title="Create Chore"
                iconName="plus"
                onPress={() => router.push('/main/student/create-chore')}
              />
              <BlockButton
                title="Request Repair"
                iconName="wrench"
                onPress={() => router.push('/main/student/request-repair')}
              />
            </View>

            <Spacer size="large" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* White panel behind navbar to prevent see-through */}
      <View style={styles.navBarBackground} pointerEvents="none" />

      {/* Navbar top shadow — visible when content overflows, hides at bottom */}
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
        activeKey={'home'}
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLOURS.black,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inlineNotification: {
    flexShrink: 1,
    flexGrow: 0,
  },
  inlineAction: {
    marginTop: 8,
    alignItems: 'center',
  },
  inlineActionLarge: {
    marginTop: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  placeholderText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 8,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLOURS.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
    textAlign: 'center',
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
});
