import { SafeAreaView, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LogoAndSearchBar from './LogoAndSearchBar';
import EventList from './EventsList';

export default function index() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className={styles.outerView}>
        <LogoAndSearchBar />
        <EventList />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = {
  outerView: 'flex-1 mx-2',
};
