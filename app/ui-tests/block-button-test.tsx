import { Stack } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import BlockButton from '../../components/BlockButton';
import HeaderBackButton from '../../components/HeaderBackButton';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';

export default function BlockButtonTestPage() {
  const handlePress = (label: string) => {
    Alert.alert(`${label} Pressed!`, `You pressed the ${label.toLowerCase()} block button`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <HeaderBackButton />
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.title}>Block Button Component</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>Test quick-action block button layouts and states</Text>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Single Button</Text>
          <Spacer size="small" />
          <BlockButton
            title="Create Chore"
            iconName="plus"
            onPress={() => handlePress('Create Chore')}
          />
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Side by Side</Text>
          <Spacer size="small" />
          <View style={styles.row}>
            <BlockButton
              title="Create Chore"
              iconName="plus"
              onPress={() => handlePress('Create Chore')}
            />
            <BlockButton
              title="Request Repair"
              iconName="wrench"
              onPress={() => handlePress('Request Repair')}
            />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Various Icons</Text>
          <Spacer size="small" />
          <View style={styles.row}>
            <BlockButton
              title="Add Item"
              iconName="plus-circle"
              onPress={() => handlePress('Add Item')}
            />
            <BlockButton title="My Dorm" iconName="bed" onPress={() => handlePress('My Dorm')} />
          </View>
          <Spacer size="small" />
          <View style={styles.row}>
            <BlockButton
              title="Messages"
              iconName="comment-alt"
              onPress={() => handlePress('Messages')}
            />
            <BlockButton title="Settings" iconName="cog" onPress={() => handlePress('Settings')} />
          </View>
        </View>

        <Spacer size="large" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disabled State</Text>
          <Spacer size="small" />
          <View style={styles.row}>
            <BlockButton title="Create Chore" iconName="plus" onPress={() => {}} disabled />
            <BlockButton title="Request Repair" iconName="wrench" onPress={() => {}} disabled />
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
