import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FilterChip from '../../components/FilterChip';
import HeaderBackButton from '../../components/HeaderBackButton';
import SortDropdown from '../../components/SortDropdown';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';

const FILTER_OPTIONS = ['All', 'Mine', 'Recurring', 'Completed'];
const SORT_OPTIONS = ['Due Date', 'Alphabetical', 'Created', 'Priority'];

export default function FilterChipTestPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Due Date');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <HeaderBackButton />
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.title}>Filter Chip Component</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>Testing filter chips and sort dropdown variants</Text>
        </View>

        <Spacer size="large" />

        {/* Filter chips + sort dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter Chips + Sort Dropdown</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>
            As used in the task list screen - first chip active by default
          </Text>
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
          <Text style={styles.stateLabel}>
            Active filter: <Text style={styles.stateLabelBold}>{activeFilter}</Text>
            {'   '}Sort: <Text style={styles.stateLabelBold}>{sortBy}</Text>
          </Text>
        </View>

        <Spacer size="large" />

        {/* Active vs inactive comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active vs Inactive</Text>
          <Spacer size="small" />
          <View style={styles.chipRow}>
            <FilterChip label="Active" active onPress={() => {}} />
            <FilterChip label="Inactive" active={false} onPress={() => {}} />
          </View>
        </View>

        <Spacer size="large" />

        {/* Sort dropdown standalone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort Dropdown Standalone</Text>
          <Spacer size="small" />
          <View style={styles.chipRow}>
            <SortDropdown options={SORT_OPTIONS} selected={sortBy} onSelect={setSortBy} />
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stateLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
  },
  stateLabelBold: {
    fontFamily: 'Inter-Bold',
    color: COLOURS.black,
  },
});
