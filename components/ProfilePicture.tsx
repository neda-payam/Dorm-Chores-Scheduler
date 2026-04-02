/**
 * @file ProfilePicture.tsx
 * @description A circular profile picture component with two size variants.
 *              'small' (44x44) acts as a tappable nav button in the top bar.
 *              'large' (128x128) sits on the profile page with a camera button overlay for photo uploads.
 *              Falls back to a bundled placeholder silhouette when no URI is provided.
 *
 * @usage
 * ```tsx
 * import ProfilePicture from '@/components/ProfilePicture';
 *
 * // Small - top bar nav button
 * <ProfilePicture variant="small" onPress={() => router.push('/profile')} />
 *
 * // Large - profile page header with optional current image
 * <ProfilePicture
 *   variant="large"
 *   imageUri={user.avatarUrl}
 *   onImageChange={(uri) => console.log('new image:', uri)}
 * />
 * ```
 *
 * @props
 * - variant: 'small' | 'large' - Size and behaviour mode
 * - imageUri?: string - Remote or local URI for the profile image
 * - onPress?: () => void - (small only) Called when the avatar is tapped
 * - onImageChange?: (uri: string) => void - (large only) Called with the chosen image URI once upload succeeds
 * - style?: ViewStyle - Custom styles for the outer wrapper
 */

import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

// Place this asset at: assets/images/avatar-placeholder.png
const PLACEHOLDER = require('../assets/images/avatar-placeholder.png');

const SMALL_SIZE = 44;
const LARGE_SIZE = 128;
const CAMERA_BUTTON_SIZE = 32;

interface ProfilePictureProps {
  variant: 'small' | 'large';
  imageUri?: string;
  onPress?: () => void;
  onImageChange?: (uri: string) => void;
  style?: ViewStyle;
}

export default function ProfilePicture({
  variant,
  imageUri,
  onPress,
  onImageChange,
  style,
}: ProfilePictureProps) {
  const isLarge = variant === 'large';
  const size = isLarge ? LARGE_SIZE : SMALL_SIZE;

  // --- Image upload flow (large variant) ---

  const handleCameraPress = async () => {
    // 1. Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library in Settings to update your profile picture.',
        [{ text: 'OK' }],
      );
      return;
    }

    // 2. Open picker
    let result: ImagePicker.ImagePickerResult;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } catch {
      Alert.alert('Error', 'Failed to open the photo library. Please try again.', [{ text: 'OK' }]);
      return;
    }

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];

    // 3. Basic client-side validation
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      Alert.alert('File Too Large', 'Please choose an image smaller than 5 MB.', [{ text: 'OK' }]);
      return;
    }

    // 4. Simulate upload - replace this block with real upload logic
    simulateUpload(asset.uri);
  };

  const simulateUpload = (uri: string) => {
    // Surfaces realistic placeholder outcomes until backend is wired up
    const outcomes = [
      () =>
        Alert.alert(
          'Upload Failed',
          'Could not connect to the server. Please check your connection and try again.',
          [
            { text: 'Retry', onPress: () => simulateUpload(uri) },
            { text: 'Cancel', style: 'cancel' },
          ],
        ),
      () =>
        Alert.alert(
          'Upload Failed',
          'The server rejected the image. Please try a different file.',
          [{ text: 'OK' }],
        ),
      () =>
        Alert.alert(
          'Upload Timed Out',
          'The upload took too long. Please try again on a faster connection.',
          [{ text: 'OK' }],
        ),
      () => {
        // Success path - passes URI back to parent for optimistic UI update
        onImageChange?.(uri);
        Alert.alert('Profile Picture Updated', 'Your new profile picture has been saved.', [
          { text: 'Great!' },
        ]);
      },
    ];

    // Weight success lower while backend is absent
    const weights = [0.35, 0.25, 0.2, 0.2];
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < outcomes.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) {
        outcomes[i]();
        return;
      }
    }
    outcomes[outcomes.length - 1]();
  };

  // --- Render ---

  const imageSource = imageUri ? { uri: imageUri } : PLACEHOLDER;

  const avatarImage = (
    <Image
      source={imageSource}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      resizeMode="cover"
    />
  );

  if (!isLarge) {
    // Small: entire avatar is the press target
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.wrapper, style]}
        accessibilityRole="button"
        accessibilityLabel="View profile"
      >
        {avatarImage}
      </TouchableOpacity>
    );
  }

  // Large: non-tappable avatar + camera button overlay only
  // Wrapper is fixed to the avatar size so absolute positioning is
  // relative to the image, not the parent container width.
  return (
    <View style={[styles.largeWrapper, style]}>
      {avatarImage}

      {/* Camera button - bottom-right corner of the avatar */}
      <TouchableOpacity
        onPress={handleCameraPress}
        activeOpacity={0.8}
        style={styles.cameraButton}
        accessibilityRole="button"
        accessibilityLabel="Change profile picture"
      >
        <FontAwesome5 name="camera" size={14} color="#000000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  largeWrapper: {
    position: 'relative',
    width: LARGE_SIZE,
    height: LARGE_SIZE,
  },
  image: {
    backgroundColor: '#DCDCDC',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: CAMERA_BUTTON_SIZE,
    height: CAMERA_BUTTON_SIZE,
    borderRadius: CAMERA_BUTTON_SIZE / 2,
    backgroundColor: '#F1F1ED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
});
