/**
 * @file BlockButton.tsx
 * @description A quick-action block button with an icon and label, styled as a rounded tile.
 *              Supports a press highlight border effect consistent with other button components.
 *
 * @usage
 * ```tsx
 * import BlockButton from '@/components/BlockButton';
 *
 * <BlockButton
 *   title="Create Chore"
 *   iconName="plus"
 *   onPress={() => console.log('pressed')}
 * />
 *
 * // Disabled state
 * <BlockButton
 *   title="Request Repair"
 *   iconName="wrench"
 *   onPress={handlePress}
 *   disabled
 * />
 * ```
 *
 * @props
 * - title: string - The label displayed below the icon
 * - iconName: keyof typeof FontAwesome5.glyphMap - FontAwesome5 icon name
 * - onPress: () => void - Callback triggered on press
 * - style?: ViewStyle - Custom styles for the outer wrapper
 * - disabled?: boolean - Whether the button is disabled (default: false)
 */

import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLOURS } from '../constants/colours';

interface BlockButtonProps {
  title: string;
  iconName: keyof typeof FontAwesome5.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const BACKGROUND_COLOUR = '#F1F1ED';
const ACTIVE_ICON_COLOUR = COLOURS.black;
const DISABLED_COLOUR = COLOURS.gray[400];

export default function BlockButton({
  title,
  iconName,
  onPress,
  style,
  disabled = false,
}: BlockButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const iconColour = disabled ? DISABLED_COLOUR : ACTIVE_ICON_COLOUR;
  const textColour = disabled ? DISABLED_COLOUR : COLOURS.black;

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[styles.borderContainer, isPressed && !disabled && styles.borderContainerPressed]}
      >
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={onPress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          disabled={disabled}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ disabled }}
        >
          <FontAwesome5 name={iconName} size={32} color={iconColour} solid />
          <Text style={[styles.label, { color: textColour }]}>{title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: -4,
  },
  borderContainer: {
    borderRadius: 20,
    borderColor: COLOURS.transparent,
    borderWidth: 2,
    padding: 2,
  },
  borderContainerPressed: {
    borderColor: BACKGROUND_COLOUR,
  },
  button: {
    width: 170,
    height: 74,
    borderRadius: 16,
    backgroundColor: BACKGROUND_COLOUR,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
});
