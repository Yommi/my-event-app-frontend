import { SafeAreaView, Dimensions } from 'react-native';
import LogoAndSearchBar from './LogoAndSearchBar';
import EventList from './EventsList';

export default function index() {
  return (
    <SafeAreaView className={styles.outerView}>
      <LogoAndSearchBar />
      <EventList />
    </SafeAreaView>
  );
}

const styles = {
  outerView: 'flex-1 mx-2',
};
