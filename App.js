import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button, 
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { AuthSession } from 'expo';
import axios from 'axios';
import * as config from './config';

export default class App extends React.Component {

  state = {
    loggedIn: false,
    username: null,
    loading: false,
  }

  async componentDidMount() {
    this._getUserInfo();
  }

  _getUserInfo = async () => {
    this.setState({loading: true});
    let token = await AsyncStorage.getItem('token');    
    if(token) {
      const headers = {
        Authorization: `Bearer ${token}`
      }
  
      axios.get(`${config.credentials.uaaURL}/userinfo`, {headers})
      .then(res => {
        this.setState({
          username: res.data.name,
          loggedIn: true,
          loading: false
        });
      })
      .catch(err => console.log('err ', err))
    }
  }

  _handlePressAsync = async () => {
    let { type, params } = await AuthSession.startAsync({
      authUrl:
        `${config.credentials.uaaURL}/oauth/authorize?` +
        `response_type=code` +
        `&client_id=${config.credentials.clientID}`
    });

    if(type === 'success') {
      const headers = {
        Authorization: `Basic ${config.credentials.base64ClientCredentials}`
      }

      axios.get(`${config.credentials.uaaURL}/oauth/token?`+
        `grant_type=authorization_code` +
        `&response_type=token` +
        `&code=${params.code}`, 
        {headers}
      )
      .then(res => {
        AsyncStorage.setItem('token', res.data.access_token)
        .then(this._getUserInfo());
      })
      .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <View style={styles.container}>

        {this.state.loading && 
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        }

        {!this.state.loading && !this.state.loggedIn && 
          <Button title="Sign In" onPress={this._handlePressAsync} />
        }

        {!this.state.loading && this.state.loggedIn && 
          <Text>Welcome, {this.state.username}</Text>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
