import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  iconName: string;
  onPress: () => void;
  iconColor?: string;
  style?: object;
}

export default function ListItem({
  title,
  subtitle,
  iconName,
  onPress,
  iconColor = '#000000',
  style,
}: ListItemProps) {
  return (
    <TouchableHighlight
      style={[styles.container, style]}
      onPress={onPress}
      underlayColor="#F0F0F0"
      activeOpacity={0.9}
    >
      <View style={styles.innerContainer}>
        <View style={styles.iconCircle}>
          <FontAwesome name={iconName as any} size={16} color={iconColor} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <FontAwesome name="chevron-right" size={16} color="#000000" />
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 4,
    marginHorizontal: -4,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 16,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 14,
    marginTop: 2,
  },
});
