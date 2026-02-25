import React, { useState } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLOURS } from '../constants/colors';

type ButtonVariant = 'standard' | 'secondary' | 'tertiary' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'standard',
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getButtonStyle = () => {
    if (disabled) return styles.disabled;

    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'tertiary':
        return styles.tertiary;
      case 'danger':
        return styles.danger;
      case 'standard':
      default:
        return styles.standard;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLOURS.disabled;

    switch (variant) {
      case 'secondary':
        return COLOURS.primaryMuted;
      case 'tertiary':
        return COLOURS.primary;
      case 'danger':
        return COLOURS.white;
      case 'standard':
      default:
        return COLOURS.black;
    }
  };

  const getBorderColor = () => {
    if (disabled) return styles.disabled.backgroundColor;
    switch (variant) {
      case 'secondary':
        return styles.secondary.backgroundColor;
      case 'tertiary':
        return styles.tertiary.backgroundColor;
      case 'danger':
        return styles.danger.backgroundColor;
      case 'standard':
      default:
        return styles.standard.backgroundColor;
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.borderContainer,
          isPressed &&
            !disabled && {
              borderColor: getBorderColor(),
              borderWidth: 2,
            },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, getButtonStyle()]}
          onPress={onPress}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          disabled={disabled}
          activeOpacity={1}
        >
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
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
    borderRadius: 100,
    borderColor: COLOURS.transparent,
    borderWidth: 2,
    padding: 2,
  },
  button: {
    height: 48,
    width: '100%',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
  },
  standard: {
    backgroundColor: COLOURS.primaryLight,
  },
  secondary: {
    backgroundColor: COLOURS.primary,
  },
  tertiary: {
    backgroundColor: COLOURS.primarySoft,
  },
  danger: {
    backgroundColor: COLOURS.error.text,
  },
  disabled: {
    backgroundColor: COLOURS.gray[300],
  },
});
