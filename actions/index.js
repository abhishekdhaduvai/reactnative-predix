import { AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
import axios from 'axios';
import * as config from '../config';

export const getUserInfo = () => {
  return async (dispatch) => {

    //Try to get token from LocalStorage
    let token = await AsyncStorage.getItem('token');    

    //If token exists, get userinfo from UAA
    if(token) {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      axios.get(`${config.credentials.uaaURL}/userinfo`, {headers})
      .then(res => {
        dispatch({type: 'LOGIN_SUCCESS', payload: res.data});
      })
      .catch(err => console.log('err ', err))
    }
  }

}

export const getAuthToken = () => {
  return async (dispatch) => {

    // Get Auth Code from UAA
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
      
      // Get Auth token from UAA and store it in LocalStorage
      axios.get(`${config.credentials.uaaURL}/oauth/token?`+
        `grant_type=authorization_code` +
        `&response_type=token` +
        `&code=${params.code}`, 
        {headers}
      )
      .then(res => {
        AsyncStorage.setItem('token', res.data.access_token)
        .then(dispatch(getUserInfo()));
      })
      .catch(err => console.log(err));
    }
  }
}