import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button, 
  AsyncStorage,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Constants, AuthSession } from 'expo';
import { Provider } from 'react-redux';

import store from './store';

import Auth from './screens/Auth';

function AppStatusBar({backgroundColor, ...props}){
  return(
    <View style={{backgroundColor, height:Constants.statusBarHeight}} >
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const MainNavigator = StackNavigator({
  Auth: {
    screen: Auth,
    navigationOptions: {
      header: null
    },
  },
  initialRouteName: 'Auth'
});

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppStatusBar backgroundColor={'#222'} barStyle='light-content' />
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
