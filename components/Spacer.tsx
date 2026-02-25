import React from 'react';
import { View, ViewStyle } from 'react-native';

type SpacerSize = 'large' | 'medium' | 'small';

interface SpacerProps {
  size?: SpacerSize;
  height?: number;
  style?: ViewStyle;
}

export default function Spacer({ size = 'large', height, style }: SpacerProps) {
  const getHeight = () => {
    if (height !== undefined) return height;

    switch (size) {
      case 'large':
        return 48;
      case 'medium':
        return 16;
      case 'small':
        return 8;
      default:
        return 48;
    }
  };

  return <View style={[{ height: getHeight() }, style]} />;
}
