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
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { getCurrentUser, uploadProfilePicture } from '../lib/auth';
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
  imageUri: externalUri,
  onPress,
  onImageChange,
  style,
}: ProfilePictureProps) {
  const isLarge = variant === 'large';
  const size = isLarge ? LARGE_SIZE : SMALL_SIZE;

  const [internalUri, setInternalUri] = useState<string | null>(externalUri || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (externalUri !== undefined) {
      setInternalUri(externalUri);
    } else {
      fetchMyAvatar();
    }
  }, [externalUri]);

  async function fetchMyAvatar() {
    try {
      const user = await getCurrentUser();
      if (user?.avatarUrl) {
        setInternalUri(user.avatarUrl);
      }
    } catch (e) {}
  }

  const handleCameraPress = async () => {
    if (uploading) return;

    // request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library in Settings to update your profile picture.',
        [{ text: 'OK' }],
      );
      return;
    }

    // open picker
    let result: ImagePicker.ImagePickerResult;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
    } catch {
      Alert.alert('Error', 'Failed to open the photo library. Please try again.', [{ text: 'OK' }]);
      return;
    }

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];

    // local file size limitation
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      Alert.alert('File Too Large', 'Please choose an image smaller than 5 MB.', [{ text: 'OK' }]);
      return;
    }

    uploadAvatar(asset.uri);
  };

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);
      const user = await getCurrentUser();
      if (!user) throw new Error('You must be logged in.');

      const publicUrl = await uploadProfilePicture(user.id, uri);

      setInternalUri(publicUrl);
      onImageChange?.(publicUrl);
      Alert.alert('Success', 'Profile picture updated!');
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message || 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  const imageSource = internalUri ? { uri: internalUri } : PLACEHOLDER;

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
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <FontAwesome5 name="camera" size={14} color="#000000" />
        )}
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
