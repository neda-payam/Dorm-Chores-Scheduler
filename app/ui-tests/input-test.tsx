import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import HeaderBackButton from '../../components/HeaderBackButton';
import Input from '../../components/Input';
import InputCode from '../../components/InputCode';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';

export default function InputTest() {
  const [defaultValue, setDefaultValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [placeholderValue, setPlaceholderValue] = useState('');
  const [prefilledValue, setPrefilledValue] = useState('Prefilled text content');
  const [hasError, setHasError] = useState(false);
  const [codeValue, setCodeValue] = useState('');

  const toggleError = () => {
    setHasError(!hasError);
  };

  const clearAllInputs = () => {
    setDefaultValue('');
    setErrorValue('');
    setPlaceholderValue('');
    setPrefilledValue('');
    setHasError(false);
    setCodeValue('');
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
          <Text style={styles.title}>Input Component</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>Test input states, styling and interactions</Text>
        </View>
        <Spacer size="large" />
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Default State</Text>
          <Spacer size="small" />
          <Text style={styles.description}>Normal input with default border styling</Text>
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Input
            value={defaultValue}
            onChangeText={setDefaultValue}
            placeholder="Type something here..."
          />
        </View>

        <Spacer size="large" />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Focus State</Text>
          <Spacer size="small" />
          <Text style={styles.description}>Click to see focus styling with black border</Text>
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Input placeholder="Click to focus and see border change" />
        </View>

        <Spacer size="large" />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Error State</Text>
          <Spacer size="small" />
          <Text style={styles.description}>Error styling with red border - toggle below</Text>
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Input
            value={errorValue}
            onChangeText={setErrorValue}
            hasError={hasError}
            placeholder="This input can show error state"
          />

          <Spacer size="medium" />

          <Button
            title={hasError ? 'Remove Error State' : 'Show Error State'}
            onPress={toggleError}
            variant="secondary"
          />
        </View>

        <Spacer size="large" />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Placeholder Variations</Text>
          <Spacer size="small" />
          <Text style={styles.description}>Different placeholder text examples</Text>
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Input
            value={placeholderValue}
            onChangeText={setPlaceholderValue}
            placeholder="Short placeholder"
          />

          <Spacer size="medium" />

          <Input placeholder="This is a much longer placeholder text to demonstrate how it handles overflow" />

          <Spacer size="medium" />

          <Input placeholder="" />
        </View>

        <Spacer size="large" />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Prefilled Content</Text>
          <Spacer size="small" />
          <Text style={styles.description}>Input with existing content</Text>
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Input value={prefilledValue} onChangeText={setPrefilledValue} />
        </View>

        <Spacer size="large" />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Different Input Types</Text>
          <Spacer size="small" />
          <Text style={styles.description}>Various keyboard and input configurations</Text>
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.inputLabel}>Email Input:</Text>

          <Spacer size="small" />

          <Input
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Spacer size="medium" />

          <Text style={styles.inputLabel}>Number Input:</Text>

          <Spacer size="small" />

          <Input placeholder="Enter number" keyboardType="numeric" />

          <Spacer size="medium" />

          <Text style={styles.inputLabel}>Password Input:</Text>

          <Spacer size="small" />

          <Input placeholder="Enter password" secureTextEntry />
        </View>

        <Spacer size="large" />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Interactive Controls</Text>

          <Spacer size="medium" />

          <Button title="Clear All Inputs" onPress={clearAllInputs} variant="danger" />
        </View>

        <Spacer size="large" />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Code Input Component</Text>
          <Spacer size="small" />
          <Text style={styles.description}>6-digit numeric code input with dash formatting</Text>
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.inputLabel}>Default Code Input:</Text>

          <Spacer size="small" />

          <InputCode
            value={codeValue}
            onChangeText={setCodeValue}
            onComplete={(code) => console.log('Code completed:', code)}
          />

          <Spacer size="medium" />

          <Text style={styles.inputLabel}>Prefilled Code (123456):</Text>

          <Spacer size="small" />

          <InputCode value="123456" />
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
    fontSize: 28,
    fontWeight: 'bold',
    color: COLOURS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLOURS.gray[700],
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOURS.black,
  },
  description: {
    fontSize: 14,
    color: COLOURS.gray[700],
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOURS.black,
  },
});
