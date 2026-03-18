import { StyleSheet, Text, View } from 'react-native';
import { COLOURS } from '../../../constants/colours';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>/manager/dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 10,
    color: COLOURS.gray[800],
  },
});
