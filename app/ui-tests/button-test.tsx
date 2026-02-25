import { Stack } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import HeaderBackButton from '../../components/HeaderBackButton';
import InlineButton from '../../components/InlineButton';
import { COLOURS } from '../../constants/colors';

export default function ButtonTestPage() {
  const handleStandardPress = () => {
    Alert.alert('Standard Button Pressed!', 'You pressed the standard button');
  };

  const handleSecondaryPress = () => {
    Alert.alert('Secondary Button Pressed!', 'You pressed the secondary button');
  };

  const handleTertiaryPress = () => {
    Alert.alert('Tertiary Button Pressed!', 'You pressed the tertiary button');
  };

  const handleDangerPress = () => {
    Alert.alert('Danger Button Pressed!', 'You pressed the danger button');
  };

  const handleInlinePress = () => {
    Alert.alert('Inline Button Pressed!', 'You pressed an inline button');
  };

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
      <View style={styles.container}>
        <Text style={styles.title}>Button Component</Text>
        <Text style={styles.subtitle}>Testing different button variants and states</Text>

        <View style={styles.buttonContainer}>
          <Button title="Standard Button" onPress={handleStandardPress} variant="standard" />

          <Button title="Secondary Button" onPress={handleSecondaryPress} variant="secondary" />

          <Button title="Tertiary Button" onPress={handleTertiaryPress} variant="tertiary" />

          <Button title="Danger Button" onPress={handleDangerPress} variant="danger" />

          <Button title="Disabled Button" onPress={() => {}} disabled={true} />
        </View>

        <Text style={styles.sectionTitle}>Inline Button Component</Text>
        <Text style={styles.subtitle}>
          Testing inline buttons that inherit text size from their context
        </Text>

        <View style={styles.inlineButtonSection}>
          <Text style={styles.bodyText}>
            Here is some body text with an{' '}
            <InlineButton title="inline link" onPress={handleInlinePress} /> that inherits the text
            size.
          </Text>

          <Text style={styles.largeText}>
            Large text with <InlineButton title="inline button" onPress={handleInlinePress} /> that
            inherits the text size.
          </Text>

          <Text style={styles.smallText}>
            Small text with <InlineButton title="inline link" onPress={handleInlinePress} /> that
            inherits the text size.
          </Text>
        </View>

        <View style={{ height: 50 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLOURS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLOURS.black,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 24,
    color: COLOURS.black,
  },
  buttonContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLOURS.black,
    marginTop: 32,
    marginBottom: 8,
  },
  inlineButtonSection: {
    gap: 16,
  },
  bodyText: {
    fontSize: 16,
    color: COLOURS.black,
    lineHeight: 24,
  },
  largeText: {
    fontSize: 20,
    color: COLOURS.black,
    lineHeight: 28,
  },
  smallText: {
    fontSize: 12,
    color: COLOURS.black,
    lineHeight: 18,
  },
});
