/**
 * @file CategoryPicker.tsx
 * @description A wrapping row of pill-shaped category chips for selecting a single chore category.
 *              Active chip has a filled dark green background with light green text and a matching icon.
 *              Inactive chip has a transparent background with a grey border, dark green text and a dark icon.
 *
 * @usage
 * ```tsx
 * import CategoryPicker from '@/components/CategoryPicker';
 *
 * const CATEGORIES = [
 *   { key: 'kitchen', label: 'Kitchen', iconName: 'utensils' },
 *   { key: 'bins',    label: 'Bins',    iconName: 'trash'    },
 * ];
 *
 * <CategoryPicker
 *   options={CATEGORIES}
 *   selected={selectedCategory}
 *   onSelect={setSelectedCategory}
 * />
 * ```
 *
 * @props
 * - options: CategoryOption[] - Array of { key, label, iconName } objects defining each chip
 * - selected: string | null   - The key of the currently selected chip, or null for none
 * - onSelect: (key: string) => void - Callback triggered when a chip is pressed
 * - style?: ViewStyle          - Optional custom styles applied to the wrapping container
 */

import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

const ACTIVE_BG = '#153000';
const ACTIVE_TEXT = '#9BE36D';
const ACTIVE_ICON = '#9BE36D';
const INACTIVE_BG = 'transparent';
const INACTIVE_BORDER = '#868685';
const INACTIVE_TEXT = '#153000';
const INACTIVE_ICON = '#153000';

export type CategoryOption = {
  key: string;
  label: string;
  iconName: keyof typeof FontAwesome5.glyphMap;
};

interface CategoryPickerProps {
  options: CategoryOption[];
  selected: string | null;
  onSelect: (key: string) => void;
  style?: ViewStyle;
}

export default function CategoryPicker({
  options,
  selected,
  onSelect,
  style,
}: CategoryPickerProps) {
  return (
    <View style={[styles.grid, style]}>
      {options.map((option) => {
        const isSelected = selected === option.key;
        return (
          <TouchableOpacity
            key={option.key}
            style={[styles.chip, isSelected ? styles.activeChip : styles.inactiveChip]}
            onPress={() => onSelect(option.key)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
          >
            <FontAwesome5
              name={option.iconName}
              size={12}
              color={isSelected ? ACTIVE_ICON : INACTIVE_ICON}
            />
            <Text style={[styles.label, isSelected ? styles.activeLabel : styles.inactiveLabel]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 30,
    borderRadius: 32,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
