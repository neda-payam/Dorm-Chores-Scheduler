import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HeaderBackButton from '../../components/HeaderBackButton';
import Selector, { SelectorOption } from '../../components/Selector';
import { COLOURS } from '../../constants/colours';

export default function SelectorTestPage() {
  const [selectedAccountType, setSelectedAccountType] = useState<string>('student');

  const accountTypeOptions: SelectorOption[] = [
    {
      id: 'student',
      icon: 'user-alt',
      title: 'Student',
      subtitle: 'Create and track chores within your student accommodation',
    },
    {
      id: 'manager',
      icon: 'user-tie',
      title: 'Manager',
      subtitle: 'Accept and manage maintenance requests directly from students',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: {
            backgroundColor: COLOURS.white,
          },
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => <HeaderBackButton />,
        }}
      />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Selector Component Test</Text>
        <Text style={styles.subtitle}>
          Test the selector component with different configurations
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Type Selection</Text>
          <Text style={styles.description}>
            Select your account type. Student is selected by default.
          </Text>
          <Selector
            options={accountTypeOptions}
            selectedId={selectedAccountType}
            onSelect={setSelectedAccountType}
          />
          <Text style={styles.selectedText}>
            Selected: {accountTypeOptions.find((opt) => opt.id === selectedAccountType)?.title}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOURS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 20,
    color: COLOURS.black,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 20,
    marginBottom: 24,
    color: COLOURS.black,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOURS.black,
  },
  description: {
    fontSize: 14,
    color: COLOURS.gray[700],
    marginBottom: 16,
    lineHeight: 18,
  },
  selectedText: {
    fontSize: 14,
    color: COLOURS.gray[700],
    marginTop: 12,
    fontStyle: 'italic',
  },
});
