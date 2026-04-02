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
  TouchableOpacity,
  View,
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import ActionPillButton from '../../../components/ActionPillButton';
import AvailabilityBadge from '../../../components/AvailabilityBadge';
import DormCard from '../../../components/DormCard';
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

type DormSummary = {
  title: string;
  subtitle: string;
  stats: { value: number; label: string }[];
};

type DormListItem = DormSummary & { id: string };

// When both are empty, it will show the no dorms found screen.
// TODO: Find a way to mandate one always active, if not make the user create / join one.
const CURRENT_DORM: DormSummary | null = {
  title: 'Building / Apartment Name',
  subtitle: 'Created by Name - 20/02/2026',
  stats: [
    { value: 5, label: 'Members' },
    { value: 12, label: 'Chores' },
    { value: 1, label: 'Repairs' },
  ],
};

// const CURRENT_DORM: DormSummary | null = null;

const OTHER_DORMS: DormListItem[] = [
  {
    id: '1',
    title: 'Building / Apartment Name',
    subtitle: 'Created by Name - 20/02/2026',
    stats: [
      { value: 2, label: 'Members' },
      { value: 53, label: 'Chores' },
      { value: 5, label: 'Repairs' },
    ],
  },
];

// const OTHER_DORMS: (DormSummary & { id: string })[] = [];

export default function Dorms() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isJoinPressed, setIsJoinPressed] = useState(false);
  const [isCreatePressed, setIsCreatePressed] = useState(false);

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

  const isEmpty = !CURRENT_DORM && OTHER_DORMS.length === 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />

      {/* Static header */}
      <View style={styles.topBar}>
        <ProfilePicture variant="small" onPress={() => router.push('/main/profile')} />
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
            <Text style={styles.title}>Current dorm</Text>

            {isEmpty ? (
              <>
                <Spacer size="large" />

                <View style={styles.noneFound}>
                  <View style={styles.iconWrapper}>
                    <FontAwesome5 name="bed" size={40} color={COLOURS.black} />
                  </View>

                  <Text style={styles.noneFoundTitle}>No dorms found</Text>

                  <Text style={styles.noneFoundSubtitle}>
                    You will need to join a dorm or create one to get started with{' '}
                    <Text style={styles.noneFoundBold}>Dorm Chores Scheduler</Text>.
                  </Text>
                </View>
              </>
            ) : (
              <>
                {CURRENT_DORM ? (
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <DormCard
                        title={CURRENT_DORM.title}
                        subtitle={CURRENT_DORM.subtitle}
                        stats={CURRENT_DORM.stats}
                        primaryAction={{
                          label: 'Edit dorm',
                          onPress: () => router.push('/main/student/edit-dorm'),
                          variant: 'secondary',
                        }}
                      />
                    </View>
                  </View>
                ) : null}

                <View style={styles.sectionSpacing}>
                  <Text style={styles.title}>Other dorm(s)</Text>
                </View>

                {OTHER_DORMS.length > 0 ? (
                  <View style={styles.table}>
                    {OTHER_DORMS.map((dorm, index) => (
                      <View key={dorm.id} style={styles.tableRow}>
                        <DormCard
                          title={dorm.title}
                          subtitle={dorm.subtitle}
                          stats={dorm.stats}
                          primaryAction={{
                            label: 'Edit dorm',
                            onPress: () => router.push('/main/student/edit-dorm'),
                            variant: 'secondary',
                          }}
                          secondaryAction={{
                            label: 'Switch dorm',
                            onPress: () => {}, // TODO: Implement switch dorm functionality
                            variant: 'primary',
                          }}
                        />
                        {index < OTHER_DORMS.length - 1 ? <Spacer size="small" /> : null}
                      </View>
                    ))}
                  </View>
                ) : null}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {isEmpty ? (
        <View style={styles.emptyActions}>
          <View style={styles.joinButtonWrapper}>
            <View style={[styles.buttonBorder, isJoinPressed && styles.buttonBorderJoinPressed]}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => router.push('/main/student/join-dorm')}
                onPressIn={() => setIsJoinPressed(true)}
                onPressOut={() => setIsJoinPressed(false)}
                activeOpacity={1}
              >
                <Text style={styles.joinButtonText}>Join a dorm</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.orText}>or</Text>

          <View style={styles.createButtonWrapper}>
            <View
              style={[styles.buttonBorder, isCreatePressed && styles.buttonBorderCreatePressed]}
            >
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/main/student/create-dorm')}
                onPressIn={() => setIsCreatePressed(true)}
                onPressOut={() => setIsCreatePressed(false)}
                activeOpacity={1}
              >
                <Text style={styles.createButtonText}>Create a dorm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.pillButtonsWrapper}>
          <ActionPillButton
            title="Join Dorm"
            iconName="sign-in-alt"
            onPress={() => router.push('/main/student/join-dorm')}
            variant="secondary"
          />
          <Spacer size="small" />
          <ActionPillButton
            title="New Dorm"
            iconName="plus"
            onPress={() => router.push('/main/student/create-dorm')}
          />
        </View>
      )}

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
        activeKey={'dorms'}
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
  sectionSpacing: {
    marginTop: 12,
  },
  cardSpacing: {
    marginTop: 12,
  },
  table: {
    marginTop: 12,
    gap: 12,
  },
  tableRow: {
    width: '100%',
  },
  pillButtonsWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 112,
    zIndex: 4,
    alignItems: 'flex-end',
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
  noneFound: {
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
  noneFoundTitle: {
    marginTop: 8,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLOURS.black,
    textAlign: 'center',
  },
  noneFoundSubtitle: {
    marginTop: 4,
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
    textAlign: 'center',
  },
  noneFoundBold: {
    fontFamily: 'Inter-Bold',
    color: COLOURS.gray[700],
  },
  emptyActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 112,
    alignItems: 'center',
    zIndex: 4,
  },
  joinButtonWrapper: {
    width: '100%',
  },
  createButtonWrapper: {
    width: '100%',
  },
  buttonBorder: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLOURS.transparent,
    padding: 2,
  },
  buttonBorderJoinPressed: {
    borderColor: COLOURS.primary,
  },
  buttonBorderCreatePressed: {
    borderColor: COLOURS.primaryLight,
  },
  joinButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: COLOURS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLOURS.primaryMuted,
  },
  orText: {
    marginVertical: 8,
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
  },
  createButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: COLOURS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLOURS.black,
  },
});
