import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLOURS } from '../constants/colours';

interface HeaderBackButtonProps {
  onPress?: () => void;
  style?: object;
  iconColor?: string;
  backgroundColor?: string;
  iconName?: string;
}

export default function HeaderBackButton({
  onPress = () => router.back(),
  style,
  iconColor = COLOURS.black,
  backgroundColor = COLOURS.gray[100],
  iconName = 'chevron-left',
}: HeaderBackButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.headerBackButton, { backgroundColor }, style]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={iconName as any} size={16} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerBackButton: {
    width: 42,
    height: 42,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  iconContainer: {
    transform: [{ translateX: -1 }],
  },
});
