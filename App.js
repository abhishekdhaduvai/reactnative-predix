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
const STATUS_BAR_BG = '#111';
const HEADER_BG = '#111';


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
      title: 'Home',
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
      title: 'Analytics',
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
      title: 'About',
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
    swipeEnabled: false,
    headerTitleStyle: {
      color: 'white',
      textAlign: 'center'
    },
    headerStyle: {
      backgroundColor: HEADER_BG
    },
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
});

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppStatusBar backgroundColor={STATUS_BAR_BG} barStyle='light-content' />
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
