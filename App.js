import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button, 
  AsyncStorage,
  StatusBar,
  ActivityIndicator,
  Platform
} from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';

import { Constants, AuthSession } from 'expo';
import { FontAwesome, Ionicons } from '@expo/vector-icons'

import { Provider } from 'react-redux';
import store from './store';

// Screens
import Auth from './screens/Auth';
import Home from './screens/Home';
import About from './screens/About';
import Analytics from './screens/Analytics';

const ACTIVE_TINT_COLOR = 'white';

function AppStatusBar({backgroundColor, ...props}){
  return(
    <View style={{backgroundColor, height: Constants.statusBarHeight}} >
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const Tabs = TabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => {
        if(tintColor === ACTIVE_TINT_COLOR)
          return <Ionicons name='ios-home' size={25} color={tintColor} />
        else
          return <Ionicons name='ios-home-outline' size={25} color={ACTIVE_TINT_COLOR} />
      }
    }
  },
  Analytics: {
    screen: Analytics,
    navigationOptions: {
      tabBarLabel: 'Analytics',
      tabBarIcon: ({ tintColor }) => {
        if(tintColor === ACTIVE_TINT_COLOR)
          return <Ionicons name='ios-speedometer' size={25} color={tintColor} />
        else
          return <Ionicons name='ios-speedometer-outline' size={25} color={ACTIVE_TINT_COLOR} />
      }
    }
  },
  About: {
    screen: About,
    navigationOptions: {
      tabBarLabel: 'About',
      tabBarIcon: ({ tintColor }) => {
        if(tintColor === ACTIVE_TINT_COLOR)
          return <Ionicons name='ios-information-circle' size={25} color={tintColor} />
        else
          return <Ionicons name='ios-information-circle-outline' size={25} color={ACTIVE_TINT_COLOR} />
      }
    }
  }
}, {
  ...TabNavigator.Presets.iOSBottomTabs,
  navigationOptions: {
    header: null,
    swipeEnabled: false,
  },
  tabBarOptions: {
    activeTintColor: ACTIVE_TINT_COLOR,
    labelStyle:{
      color: 'white',
      marginTop: -10
    },
    style: {
      backgroundColor: 'black',
    }
  }
})

const MainNavigator = StackNavigator({
  Auth: { screen: Auth },
  Home: { screen: Tabs },
  initialRouteName: 'Auth'
}, {
  navigationOptions: {
    header: null
  }
});

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppStatusBar backgroundColor={'#111'} barStyle='light-content' />
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
