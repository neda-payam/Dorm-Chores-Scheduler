import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLOURS } from '../constants/colours';

type BannerVariant = 'large' | 'medium' | 'small';

interface CurvedBannerProps {
  variant?: BannerVariant;
  height?: number;
  style?: ViewStyle;
}

export default function CurvedBanner({ variant = 'large', height, style }: CurvedBannerProps) {
  const getBannerSpecs = () => {
    switch (variant) {
      case 'large':
        return {
          height: 229,
          width: 402,
          cx: 139.09,
          cy: 67.8876,
          rx: 335.64,
          ry: 144.003,
          rotation: -13.5999,
        };
      case 'medium':
        return {
          height: 194,
          width: 402,
          cx: 134.604,
          cy: 49.3414,
          rx: 335.64,
          ry: 124.922,
          rotation: -13.5999,
        };
      case 'small':
        return {
          height: 114,
          width: 402,
          cx: 136.472,
          cy: 16.9491,
          rx: 335.64,
          ry: 82.1249,
          rotation: -9.23928,
        };
      default:
        return {
          height: 229,
          width: 402,
          cx: 139.09,
          cy: 67.8876,
          rx: 335.64,
          ry: 144.003,
          rotation: -13.5999,
        };
    }
  };

  const specs = getBannerSpecs();
  const containerHeight = height || specs.height;

  const maxRadius = Math.max(specs.rx, specs.ry);
  const scaleX = specs.rx / maxRadius;
  const scaleY = specs.ry / maxRadius;

  const left = specs.cx - maxRadius;
  const top = specs.cy - maxRadius;

  const ellipseStyle = {
    position: 'absolute' as const,
    width: maxRadius * 2,
    height: maxRadius * 2,
    backgroundColor: COLOURS.primary,
    left: left,
    top: top,
    borderRadius: maxRadius,
    transform: [{ scaleX: scaleX }, { scaleY: scaleY }, { rotate: `${specs.rotation}deg` }],
  };

  return (
    <View style={[styles.container, { height: containerHeight }, style]}>
      <View style={ellipseStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLOURS.transparent,
  },
});
