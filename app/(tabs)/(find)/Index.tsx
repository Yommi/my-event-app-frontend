import { Text, SafeAreaView, View, StyleSheet, Dimensions } from 'react-native';

export default function index() {
  const style = StyleSheet.create({});

  return (
    <SafeAreaView className={styles.outerView}>
      <View id="title-search-cont">
        <Text className={'text-[white]'}>Start...</Text>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = {
  outerView: 'flex-1',
};
