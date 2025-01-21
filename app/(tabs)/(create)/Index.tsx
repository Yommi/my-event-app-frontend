import { SafeAreaView, View, ScrollView, Dimensions } from 'react-native';

export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {};
