import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HeaderBackButton from '../../components/HeaderBackButton';
import NavBar from '../../components/Navbar';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';

export default function NavBarTestPage() {
  const [activeKey2, setActiveKey2] = useState('home');
  const [activeKey3, setActiveKey3] = useState('chores');
  const [activeKey4, setActiveKey4] = useState('home');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <HeaderBackButton />
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.title}>NavBar Component Test</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>Test navigation bar layouts and active states</Text>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2 Items</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>Tap tabs to change active state</Text>
          <Spacer size="small" />
          <View style={styles.navBarContainer}>
            <NavBar
              items={[
                {
                  key: 'home',
                  label: 'Home',
                  iconName: 'home',
                  onPress: () => setActiveKey2('home'),
                },
                {
                  key: 'profile',
                  label: 'Profile',
                  iconName: 'user',
                  onPress: () => setActiveKey2('profile'),
                },
              ]}
              activeKey={activeKey2}
            />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3 Items</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>Tap tabs to change active state</Text>
          <Spacer size="small" />
          <View style={styles.navBarContainer}>
            <NavBar
              items={[
                {
                  key: 'chores',
                  label: 'Chores',
                  iconName: 'broom',
                  onPress: () => setActiveKey3('chores'),
                },
                {
                  key: 'repairs',
                  label: 'Repairs',
                  iconName: 'tools',
                  onPress: () => setActiveKey3('repairs'),
                },
                {
                  key: 'dorms',
                  label: 'Dorms',
                  iconName: 'bed',
                  onPress: () => setActiveKey3('dorms'),
                },
              ]}
              activeKey={activeKey3}
            />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4 Items</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>Tap tabs to change active state</Text>
          <Spacer size="small" />
          <View style={styles.navBarContainer}>
            <NavBar
              items={[
                {
                  key: 'home',
                  label: 'Home',
                  iconName: 'home',
                  onPress: () => setActiveKey4('home'),
                },
                {
                  key: 'chores',
                  label: 'Chores',
                  iconName: 'broom',
                  onPress: () => setActiveKey4('chores'),
                },
                {
                  key: 'repairs',
                  label: 'Repairs',
                  iconName: 'tools',
                  onPress: () => setActiveKey4('repairs'),
                },
                {
                  key: 'dorms',
                  label: 'Dorms',
                  iconName: 'bed',
                  onPress: () => setActiveKey4('dorms'),
                },
              ]}
              activeKey={activeKey4}
            />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Static — First Active</Text>
          <Spacer size="small" />
          <View style={styles.navBarContainer}>
            <NavBar
              items={[
                { key: 'home', label: 'Home', iconName: 'home', onPress: () => {} },
                { key: 'search', label: 'Search', iconName: 'search', onPress: () => {} },
                { key: 'bell', label: 'Alerts', iconName: 'bell', onPress: () => {} },
                { key: 'cog', label: 'Settings', iconName: 'cog', onPress: () => {} },
              ]}
              activeKey="home"
            />
          </View>
        </View>

        <Spacer size="small" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Static — Last Active</Text>
          <Spacer size="small" />
          <View style={styles.navBarContainer}>
            <NavBar
              items={[
                { key: 'home', label: 'Home', iconName: 'home', onPress: () => {} },
                { key: 'search', label: 'Search', iconName: 'search', onPress: () => {} },
                { key: 'bell', label: 'Alerts', iconName: 'bell', onPress: () => {} },
                { key: 'cog', label: 'Settings', iconName: 'cog', onPress: () => {} },
              ]}
              activeKey="cog"
            />
          </View>
        </View>

        <Spacer size="large" />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  content: {
    marginHorizontal: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLOURS.black,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.gray[700],
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLOURS.black,
  },
  sectionSubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
  },
  navBarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLOURS.gray[200],
  },
});
