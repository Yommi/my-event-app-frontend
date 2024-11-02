// index.tsx
import { SafeAreaView, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LogoAndSearchBar from './LogoAndSearchBar';
import EventList from './EventsList';
import { EventProvider } from './EventProvider'; // Import the context provider

export default function Index() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className={styles.outerView}>
        <EventProvider>
          <LogoAndSearchBar />
          <EventList />
        </EventProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = {
  outerView: 'flex-1 mx-2',
};
