import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLOURS } from '../constants/colours';

export type SelectorOption = {
  id: string;
  icon: keyof typeof FontAwesome5.glyphMap;
  title: string;
  subtitle: string;
};

interface SelectorProps {
  options: SelectorOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

interface SelectorItemProps {
  option: SelectorOption;
  isSelected: boolean;
  onPress: () => void;
}

function SelectorItem({ option, isSelected, onPress }: SelectorItemProps) {
  const getBorderStyle = () => {
    if (isSelected) {
      return {
        borderWidth: 4,
        borderColor: COLOURS.input.focus,
      };
    }
    return {
      borderWidth: 2,
      borderColor: COLOURS.input.default,
    };
  };

  return (
    <TouchableOpacity style={[styles.item, getBorderStyle()]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name={option.icon} size={40} color={COLOURS.black} style={styles.icon} />
      </View>
      <View style={styles.spacer} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{option.title}</Text>
        <Text style={styles.subtitle}>{option.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Selector({ options, selectedId, onSelect }: SelectorProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <SelectorItem
          key={option.id}
          option={option}
          isSelected={selectedId === option.id}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  item: {
    height: 110,
    width: '100%',
    backgroundColor: COLOURS.transparent,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    overflow: 'hidden',
  },
  icon: {
    maxWidth: 48,
    maxHeight: 48,
  },
  spacer: {
    width: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: COLOURS.black,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    color: COLOURS.gray[700],
    lineHeight: 18,
    flexWrap: 'wrap',
  },
});
