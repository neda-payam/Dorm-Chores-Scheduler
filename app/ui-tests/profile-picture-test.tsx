import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AvailabilityBadge from '../../components/AvailabilityBadge';
import ProfilePicture from '../../components/ProfilePicture';
import Spacer from '../../components/Spacer';
import { COLOURS } from '../../constants/colours';

export default function ProfilePictureTestPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [uploadedUri, setUploadedUri] = useState<string | undefined>(undefined);

  const handleSmallPress = () => {
    Alert.alert('Navigate', 'Would navigate to /profile');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        {/* Simulated top bar */}
        <View style={styles.topBar}>
          <ProfilePicture variant="small" onPress={handleSmallPress} />
          <AvailabilityBadge isAvailable={isAvailable} onChange={setIsAvailable} />
        </View>

        <Spacer size="medium" />

        <View style={styles.content}>
          <Text style={styles.title}>Profile Picture Component</Text>
          <Spacer size="small" />
          <Text style={styles.subtitle}>
            Two variants - a small nav button and a large editable avatar
          </Text>
        </View>

        <Spacer size="large" />

        {/* Small variant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Small (44x44)</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>Tappable - navigates to the profile page</Text>
          <Spacer size="small" />
          <View style={styles.row}>
            <ProfilePicture variant="small" onPress={handleSmallPress} />
          </View>
        </View>

        <Spacer size="large" />

        {/* Small variant with image URI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Small - with image URI</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>Falls back to placeholder when no URI is set</Text>
          <Spacer size="small" />
          <View style={styles.row}>
            <ProfilePicture variant="small" imageUri={uploadedUri} onPress={handleSmallPress} />
            <Text style={styles.stateLabel}>
              {uploadedUri ? 'Using uploaded URI' : 'Using placeholder'}
            </Text>
          </View>
        </View>

        <Spacer size="large" />

        {/* Large variant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Large (128x128)</Text>
          <Spacer size="small" />
          <Text style={styles.sectionSubtitle}>
            Camera button triggers image picker - upload is simulated
          </Text>
          <Spacer size="small" />
          <ProfilePicture
            variant="large"
            imageUri={uploadedUri}
            onImageChange={(uri) => setUploadedUri(uri)}
          />
        </View>

        <Spacer size="large" />

        {/* Large variant - placeholder only */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Large - placeholder only</Text>
          <Spacer size="small" />
          <ProfilePicture variant="large" onImageChange={() => {}} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stateLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLOURS.gray[700],
  },
});
