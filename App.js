import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './store';
import Routes from './src/Routes';
import Toast, {SuccessToast, ErrorToast} from 'react-native-toast-message';
import {PersistGate} from 'redux-persist/integration/react';
import Loader from './src/components/Loader';
import {persistor} from './store';
import VersionCheck from 'react-native-version-check';
import {Alert, Linking} from 'react-native';
import {compareVersions} from './src/utils/VersionCheck';

const toastConfig = {
  success: props => (
    <SuccessToast
      {...props}
      text1Style={{
        fontSize: 14,
      }}
      text1NumberOfLines={4}
      text2NumberOfLines={4}
    />
  ),
  error: props => (
    <ErrorToast {...props} text1NumberOfLines={4} text2NumberOfLines={4} />
  ),
};

export default function App() {

  // showing app update popup if update is available on Play Store.
  useEffect(() => {
    VersionCheck.needUpdate().then(async res => {
      let result = compareVersions(res.currentVersion, res.latestVersion);
      if (result < 0) {
        Alert.alert(
          'App Update',
          'An app update is available on play store. Please update for better experience!',
          [
            {
              text: 'Update',
              onPress: () => Linking.openURL(res.storeUrl),
            },
            {
              text: 'Ok',
              onPress: () => {},
            },
          ],
        );
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Routes />
        <Toast config={toastConfig} />
      </PersistGate>
    </Provider>
  );
}
