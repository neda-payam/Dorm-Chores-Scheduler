/**
 * @file SortDropdown.tsx
 * @description A pill-shaped sort/dropdown chip that displays the current sort option
 *              with a FontAwesome5 chevron-down icon. Matches the FilterChip visual style
 *              (inactive state) - transparent background, grey inner border, dark green text.
 *              Opens a modal dropdown with a list of sort options.
 *
 * @usage
 * ```tsx
 * import SortDropdown from '@/components/SortDropdown';
 *
 * const SORT_OPTIONS = ['Due Date', 'Alphabetical', 'Created'];
 *
 * <SortDropdown
 *   options={SORT_OPTIONS}
 *   selected="Due Date"
 *   onSelect={(option) => setSortBy(option)}
 * />
 * ```
 *
 * @props
 * - options: string[] - The list of sort options to display in the dropdown
 * - selected: string - The currently selected sort option (shown as the chip label)
 * - onSelect: (option: string) => void - Callback when the user picks an option
 * - style?: ViewStyle - Custom styles for the outer wrapper
 */

import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface SortDropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  style?: ViewStyle;
}

const INACTIVE_BORDER = '#868685';
const INACTIVE_TEXT = '#153000';

export default function SortDropdown({ options, selected, onSelect, style }: SortDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <>
      {/* Chip trigger */}
      <TouchableOpacity
        style={[styles.chip, style]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Sort by ${selected}`}
        accessibilityHint="Opens sort options"
      >
        <Text style={styles.label}>{selected}</Text>
        <View style={styles.iconWrapper}>
          <FontAwesome5 name="chevron-down" size={10} color={INACTIVE_TEXT} solid />
        </View>
      </TouchableOpacity>

      {/* Dropdown modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[styles.menuItem, index < options.length - 1 && styles.menuItemBorder]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.menuItemText, option === selected && styles.menuItemTextSelected]}
                >
                  {option}
                </Text>
                {option === selected && (
                  <FontAwesome5 name="check" size={12} color={INACTIVE_TEXT} solid />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 30,
    borderRadius: 32,
    paddingLeft: 16,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: INACTIVE_BORDER,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: INACTIVE_TEXT,
    paddingRight: 8,
  },
  iconWrapper: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
  },
  menuItemTextSelected: {
    color: INACTIVE_TEXT,
    fontFamily: 'Inter-Bold',
  },
});
