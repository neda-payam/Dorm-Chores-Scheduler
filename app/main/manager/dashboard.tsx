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
import InfoPanel from '../../../components/InfoPanel';
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
    onPress: () => router.push('/main/manager/dashboard'),
  },
  {
    key: 'requests',
    label: 'Requests',
    iconName: 'wrench',
    onPress: () => router.push('/main/manager/requests'),
  },
  {
    key: 'dorms',
    label: 'Dorms',
    iconName: 'building',
    onPress: () => router.push('/main/manager/dorms'),
  },
];

const GRADIENT_THRESHOLD = 24;

type IconName = keyof typeof FontAwesome5.glyphMap;

type RepairStatus = {
  label: string;
  backgroundColor: string;
  textColor: string;
};

const PRIORITY_REPAIRS: {
  id: string;
  title: string;
  subtitle: string;
  iconName: IconName;
  status: RepairStatus;
}[] = [
  {
    id: '1',
    title: 'Broken bathroom light',
    subtitle: 'Maple House - Reported by Person 1 - 20/03/2026',
    iconName: 'lightbulb',
    status: {
      label: 'High',
      backgroundColor: COLOURS.error.background,
      textColor: COLOURS.error.text,
    },
  },
  {
    id: '2',
    title: 'Leaking kitchen tap',
    subtitle: 'Oak Lodge - Reported by Person 2 - 18/03/2026',
    iconName: 'faucet',
    status: {
      label: 'Medium',
      backgroundColor: COLOURS.warning.background,
      textColor: COLOURS.warning.text,
    },
  },
  {
    id: '3',
    title: 'Broken door hinge',
    subtitle: 'Maple House - Reported by Person 3 - 15/03/2026',
    iconName: 'door-open',
    status: {
      label: 'Low',
      backgroundColor: COLOURS.info.background,
      textColor: COLOURS.info.text,
    },
  },
];

const RECENT_REPAIRS: {
  id: string;
  title: string;
  subtitle: string;
  iconName: IconName;
  status: RepairStatus;
}[] = [
  {
    id: '1',
    title: 'Fix broken sink',
    subtitle: 'Oak Lodge - Reported by Person 4 - 14/03/2026',
    iconName: 'faucet',
    status: {
      label: 'In progress',
      backgroundColor: COLOURS.warning.background,
      textColor: COLOURS.warning.text,
    },
  },
  {
    id: '2',
    title: 'Replace hallway bulb',
    subtitle: 'Elm Court - Reported by Person 5 - 12/03/2026',
    iconName: 'lightbulb',
    status: {
      label: 'Pending',
      backgroundColor: COLOURS.info.background,
      textColor: COLOURS.info.text,
    },
  },
];

export default function Dashboard() {
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

  const items: NavBarItem[] = NAV_ITEMS.map((item) => ({ ...item }));

  const noPriorityRepairs = PRIORITY_REPAIRS.length === 0;
  const noRecentRepairs = RECENT_REPAIRS.length === 0;

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
            {/* Overview stats */}
            <Text style={styles.title}>Overview</Text>
            <Spacer size="small" />
            <View style={styles.infoPanelGrid}>
              <InfoPanel label="Open requests" value="5" />
              <InfoPanel label="In progress" value="2" />
              <InfoPanel label="Resolved this week" value="3" />
              <InfoPanel label="Dorms managed" value="4" />
            </View>

            <Spacer size="large" />

            {/* Priority repairs */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>Needs attention</Text>
              <InlineNotification
                type="info"
                text="Showing top 3"
                style={styles.inlineNotification}
              />
            </View>

            <Spacer size="medium" />

            {noPriorityRepairs ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconWrapper}>
                  <FontAwesome5 name="check" size={40} color={COLOURS.black} />
                </View>
                <Text style={styles.emptyTitle}>All clear</Text>
                <Text style={styles.emptySubtitle}>
                  No high priority repairs waiting for action
                </Text>
              </View>
            ) : (
              <View>
                {PRIORITY_REPAIRS.map((repair, index) => (
                  <View key={repair.id}>
                    <ListItem
                      title={repair.title}
                      subtitle={repair.subtitle}
                      iconName={repair.iconName}
                      onPress={() => router.push('/main/manager/view-request')}
                      statusChip={repair.status}
                    />
                    {index < PRIORITY_REPAIRS.length - 1 ? <Spacer size="small" /> : null}
                  </View>
                ))}
              </View>
            )}

            <View style={styles.inlineAction}>
              <InlineButton
                title="View all requests"
                onPress={() => router.push('/main/manager/requests')}
              />
            </View>

            <Spacer size="large" />

            {/* Recent activity */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>Recent</Text>
              <InlineNotification
                type="info"
                text="Showing last 5"
                style={styles.inlineNotification}
              />
            </View>

            <Spacer size="medium" />

            {noRecentRepairs ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No recent activity</Text>
                <Text style={styles.emptySubtitle}>
                  Repair requests from your dorms will appear here
                </Text>
              </View>
            ) : (
              <View>
                {RECENT_REPAIRS.map((repair, index) => (
                  <View key={repair.id}>
                    <ListItem
                      title={repair.title}
                      subtitle={repair.subtitle}
                      iconName={repair.iconName}
                      onPress={() => router.push('/main/manager/view-request')}
                      statusChip={repair.status}
                    />
                    {index < RECENT_REPAIRS.length - 1 ? <Spacer size="small" /> : null}
                  </View>
                ))}
              </View>
            )}

            <View style={styles.inlineAction}>
              <InlineButton
                title="View all requests"
                onPress={() => router.push('/main/manager/requests')}
              />
            </View>

            <Spacer size="large" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  infoPanelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inlineAction: {
    marginTop: 16,
    alignItems: 'center',
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
