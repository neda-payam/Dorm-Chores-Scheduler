import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CurvedBanner from '../../components/CurvedBanner';
import HeaderBackButton from '../../components/HeaderBackButton';
import { COLOURS } from '../../constants/colours';

export default function CurvedBannerTest() {
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
        <Text style={styles.title}>Curved Banner Component</Text>
        <Text style={styles.subtitle}>
          Each variant uses exact SVG parameters ported from the Figma Prototype.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Large Variant</Text>
          <Text style={styles.description}>
            229×402px | cx=139.09, cy=67.89, rx=335.64, ry=144.00, rotation=-13.60°
          </Text>
          <View style={styles.bannerContainer}>
            <CurvedBanner variant="large" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medium Variant</Text>
          <Text style={styles.description}>
            194×402px | cx=134.60, cy=49.34, rx=335.64, ry=124.92, rotation=-13.60°
          </Text>
          <View style={styles.bannerContainer}>
            <CurvedBanner variant="medium" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Small Variant</Text>
          <Text style={styles.description}>
            114×402px | cx=136.47, cy=16.95, rx=335.64, ry=82.12, rotation=-9.24°
          </Text>
          <View style={styles.bannerContainer}>
            <CurvedBanner variant="small" />
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
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
    color: COLOURS.gray[700],
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOURS.black,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLOURS.gray[700],
    marginBottom: 12,
  },
  bannerContainer: {
    marginVertical: 8,
    backgroundColor: COLOURS.gray[50],
    borderRadius: 8,
    position: 'relative',
  },
});
