/**
 * @file ActionPillButton.tsx
 * @description A compact pill button with an icon and label, styled for
 *              quick actions. Supports the standard outline press highlight
 *              system used across button components.
 *
 * @usage
 * ```tsx
 * import ActionPillButton from '@/components/ActionPillButton';
 *
 * <ActionPillButton title="New Chore" iconName="plus" onPress={() => console.log('pressed')} />
 * <ActionPillButton title="Join Dorm" iconName="sign-in-alt" onPress={() => {}} variant="secondary" />
 * ```
 *
 * @props
 * - title: string - The label displayed inside the pill
 * - iconName: keyof typeof FontAwesome5.glyphMap - FontAwesome5 icon name
 * - onPress: () => void - Callback triggered on press
 * - variant?: 'primary' | 'secondary' - Visual style (default: 'primary')
 * - style?: ViewStyle - Custom styles for the outer wrapper
 * - disabled?: boolean - Whether the button is disabled (default: false)
 */

import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLOURS } from '../constants/colours';

interface ActionPillButtonProps {
  title: string;
  iconName: keyof typeof FontAwesome5.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
}

const VARIANTS = {
  primary: {
    background: COLOURS.primary,
    accent: COLOURS.primaryMuted,
    pressedBorder: COLOURS.primary,
  },
  secondary: {
    background: COLOURS.primaryLight,
    accent: COLOURS.black,
    pressedBorder: COLOURS.primaryLight,
  },
} as const;

export default function ActionPillButton({
  title,
  onPress,
  iconName,
  variant = 'primary',
  style,
  disabled = false,
}: ActionPillButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const colours = VARIANTS[variant];

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.borderContainer,
          isPressed && !disabled && { borderColor: colours.pressedBorder },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colours.background },
            disabled && styles.buttonDisabled,
          ]}
          onPress={onPress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          disabled={disabled}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ disabled }}
        >
          <FontAwesome5 name={iconName} size={16} color={colours.accent} solid />
          <Text style={[styles.label, { color: colours.accent }]}>{title}</Text>
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
    borderRadius: 32,
    borderColor: COLOURS.transparent,
    borderWidth: 2,
    padding: 2,
  },
  button: {
    height: 36,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});
