/**
 * @file InfoPanel.tsx
 * @description A stat display tile showing a label and a large value.
 *              Used in dashboard-style layouts to surface key metrics at a glance.
 *
 * @usage
 * ```tsx
 * import InfoPanel from '@/components/InfoPanel';
 *
 * <InfoPanel label="Total chores" value="12" />
 * <InfoPanel label="Completed" value="85%" />
 * ```
 *
 * @props
 * - label: string - The small descriptor shown above the value
 * - value: string - The large prominent figure or text shown below the label
 * - style?: ViewStyle - Custom styles for the outer wrapper
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

interface InfoPanelProps {
  label: string;
  value: string | number;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
}

const BACKGROUND_COLOUR = '#F1F1ED';

export default function InfoPanel({ label, value, style, labelStyle, valueStyle }: InfoPanelProps) {
  return (
    <View style={[styles.panel, style]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    backgroundColor: BACKGROUND_COLOUR,
    paddingTop: 16,
    paddingLeft: 16,
  },
  label: {
    fontSize: 15,
    color: '#000000',
  },
  value: {
    fontSize: 41,
    color: '#000000',
    lineHeight: 46,
  },
});
