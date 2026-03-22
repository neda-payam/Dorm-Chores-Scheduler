import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AvailabilityBadge from '../../components/AvailabilityBadge';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';

export default function AvailabilityBadgeTestPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [controlledAvailable, setControlledAvailable] = useState(true);
  const [controlledUnavailable, setControlledUnavailable] = useState(false);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        {/* Simulated top bar */}
        <View style={styles.topBar}>
          <View style={styles.avatar} />
          <AvailabilityBadge isAvailable={isAvailable} onChange={setIsAvailable} />
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.title}>Availability Badge</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>
            Tap the badge in the top bar above to toggle status via the dropdown
          </Text>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available State</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>Tap to open dropdown and switch status</Text>
          <Spacer size="small" />
          <View style={styles.badgeRow}>
            <AvailabilityBadge
              isAvailable={controlledAvailable}
              onChange={setControlledAvailable}
            />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unavailable State</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>Tap to open dropdown and switch status</Text>
          <Spacer size="small" />
          <View style={styles.badgeRow}>
            <AvailabilityBadge
              isAvailable={controlledUnavailable}
              onChange={setControlledUnavailable}
            />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Static Previews</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>
            Non-interactive reference for both states side by side
          </Text>
          <Spacer size="small" />
          <View style={styles.staticRow}>
            <AvailabilityBadge isAvailable={true} onChange={() => {}} readOnly />
            <AvailabilityBadge isAvailable={false} onChange={() => {}} readOnly />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current State</Text>
          <Spacer size="small" />
          <Text style={styles.bodyText}>
            Top bar badge is currently:{' '}
            <Text style={styles.bodyBold}>{isAvailable ? 'Available' : 'Unavailable'}</Text>
          </Text>
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
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLOURS.gray[300],
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
  badgeRow: {
    alignItems: 'flex-end',
  },
  staticRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bodyText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: COLOURS.black,
  },
  bodyBold: {
    fontFamily: 'Inter-Bold',
  },
});
