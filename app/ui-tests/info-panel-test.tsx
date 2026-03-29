import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HeaderBackButton from '../../components/HeaderBackButton';
import InfoPanel from '../../components/InfoPanel';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';

export default function InfoPanelTestPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <HeaderBackButton />
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.title}>Info Panel Component</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>Stat tiles for dashboard-style metric displays</Text>
        </View>

        <Spacer size="large" />

        {/* As used in the dashboard - 2x2 grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This week</Text>
          <Spacer size="small" />
          <View style={styles.grid}>
            <InfoPanel label="Total chores" value="12" />
            <InfoPanel label="Completed" value="85%" />
          </View>
          <Spacer size="small" />
          <View style={styles.grid}>
            <InfoPanel label="Overdue" value="2" />
            <InfoPanel label="Open repairs" value="1" />
          </View>
        </View>

        <Spacer size="large" />

        {/* Single panel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Single Panel</Text>
          <Spacer size="small" />
          <View style={styles.grid}>
            <InfoPanel label="Total chores" value="12" />
          </View>
        </View>

        <Spacer size="large" />

        {/* Long value text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Long Values</Text>
          <Spacer size="small" />
          <View style={styles.grid}>
            <InfoPanel label="Completion rate" value="100%" />
            <InfoPanel label="Days remaining" value="31" />
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
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
});
