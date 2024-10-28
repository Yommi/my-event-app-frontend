import { Text, View, Dimensions, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const eventCover = require('../../../assets/images/default.jpg');

export default function EventList() {
  return (
    <ScrollView className={'flex-grow '} contentContainerStyle={{ paddingBottom: 20 }}>
      <View className={styles.eventGroupCont}>
        <Text className={styles.eventGroupTitle}> (Event Group)...</Text>
        <View className={styles.eventGroupLine}></View>
      </View>
      <View className={styles.eventCont}>
        <ImageBackground
          source={eventCover}
          className={styles.eventCover}
          resizeMode="cover"
          style={{ height: height * 0.2 }}
        ></ImageBackground>
        <View className={styles.eventInfoCont}>
          <Text className={styles.eventName}>
            <Text className={styles.eventInfoType}>Name:</Text> (Event Name...)
          </Text>
          <Text className={styles.eventAddress}>
            <Text className={styles.eventInfoType}>Address:</Text> (Event Address...)
          </Text>
          <Text className={styles.eventDate}>
            <Text className={styles.eventInfoType}>Date:</Text> (Event Date...)
          </Text>
        </View>
        <View className={'h-12 bg-blue-500 rounded-3xl mt-4 self-end mr-4'}>
          <Text className={'text-white font-bold text-xl my-auto mx-6'}>($Price...)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = {
  eventGroupCont: 'mt-2',
  eventGroupTitle: 'text-white text-lg font-bold mx-auto mb-1',
  eventGroupLine: 'w-full h-[1%] bg-gray-500',
  eventCont: ' flex justify-between mt-8 mx-2 bg-[#191827] rounded-2xl w-[95%] pb-6',
  eventCover: 'rounded-2xl flex-1 justify-center items-center',
  eventInfoCont: 'mt-4 p-2',
  eventInfoType: 'font-bold text-xl text-yellow-200',
  eventName: 'text-white font-bold text-xl',
  eventAddress: 'text-white mt-2',
  eventDate: 'text-white mt-2',
};
