/**
 * @file FilterChip.tsx
 * @description A pill-shaped filter chip component for filtering lists.
 *              Active chip has a filled dark green background with light green text.
 *              Inactive chip has a transparent background with a grey border and dark green text.
 *
 * @usage
 * ```tsx
 * import FilterChip from '@/components/FilterChip';
 *
 * <FilterChip label="All" active onPress={() => setFilter('all')} />
 * <FilterChip label="Mine" active={false} onPress={() => setFilter('mine')} />
 * ```
 *
 * @props
 * - label: string - The text displayed inside the chip
 * - active?: boolean - Whether the chip is in the active/selected state (default: false)
 * - onPress: () => void - Callback triggered on press
 * - style?: ViewStyle - Custom styles for the outer wrapper
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const ACTIVE_BG = '#153000';
const ACTIVE_TEXT = '#9BE36D';
const INACTIVE_BG = 'transparent';
const INACTIVE_BORDER = '#868685';
const INACTIVE_TEXT = '#153000';

export default function FilterChip({ label, active = false, onPress, style }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active ? styles.activeChip : styles.inactiveChip, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 30,
    borderRadius: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: ACTIVE_BG,
  },
  inactiveChip: {
    backgroundColor: INACTIVE_BG,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  activeLabel: {
    color: ACTIVE_TEXT,
  },
  inactiveLabel: {
    color: INACTIVE_TEXT,
  },
});
