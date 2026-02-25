import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { COLOURS } from '../constants/colors';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dorm Chores Scheduler</Text>
      <Text style={styles.subtitle}>Edit app/index.tsx to edit this screen.</Text>

      <View style={styles.linksContainer}>
        <Link href="/auth/signin">
          <Text style={styles.linkText}>Sign In</Text>
        </Link>

        <Link href="/ui-tests">
          <Text style={styles.linkText}>Go to UI Test Page</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLOURS.gray[800],
  },
  subtitle: {
    fontSize: 16,
    color: COLOURS.gray[700],
    textAlign: 'center',
    marginBottom: 30,
  },
  linksContainer: {
    gap: 16,
  },
  linkText: {
    color: COLOURS.gray[800],
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
