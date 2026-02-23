import React, { useState } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

type ButtonVariant = 'standard' | 'secondary' | 'danger';

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
      case 'danger':
        return styles.danger;
      case 'standard':
      default:
        return styles.standard;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#888888';
    if (variant === 'danger') return '#FFFFFF';
    return '#000000';
  };

  const getBorderColor = () => {
    if (disabled) return '#CCCCCC';
    switch (variant) {
      case 'secondary':
        return '#DDF7D2';
      case 'danger':
        return '#B70000';
      case 'standard':
      default:
        return '#87EA5C';
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
          activeOpacity={0.7}
        >
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
  borderContainer: {
    borderRadius: 100,
    borderColor: 'transparent',
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
    backgroundColor: '#87EA5C',
  },
  secondary: {
    backgroundColor: '#DDF7D2',
  },
  danger: {
    backgroundColor: '#B70000',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
  },
});
