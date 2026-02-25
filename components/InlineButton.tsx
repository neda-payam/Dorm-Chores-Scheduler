import React from 'react';
import { Text, TextStyle } from 'react-native';
import { COLOURS } from '../constants/colors';

interface InlineButtonProps {
  title: string;
  onPress: () => void;
  style?: TextStyle;
  disabled?: boolean;
}

export default function InlineButton({
  title,
  onPress,
  style,
  disabled = false,
}: InlineButtonProps) {
  return (
    <Text
      onPress={disabled ? undefined : onPress}
      style={[
        {
          fontFamily: 'Inter',
          fontWeight: '700',
          textDecorationLine: 'underline',
          color: disabled ? COLOURS.disabled : COLOURS.primary,
        },
        style,
      ]}
    >
      {title}
    </Text>
  );
}
