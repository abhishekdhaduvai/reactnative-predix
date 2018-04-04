import { AsyncStorage, Platform } from 'react-native';
import { AuthSession, SecureStore } from 'expo';
import axios from 'axios';
import * as config from '../config';

export const getUserInfo = () => {
  return async (dispatch) => {

    // Try to get token from LocalStorage
    // let token = await AsyncStorage.getItem('token');

    // if(token) {
    //   // If token exists, get userinfo from UAA
    //   this.makeRequest(dispatch, token);
    // } else {
    //   // If there is no token
    //   dispatch({type: 'LOGIN_FAILED'});
    // }

    SecureStore.getItemAsync('token').then(value => {
      if(!value) {
        dispatch({type: 'LOGIN_FAILED'});
      } else {
        this.makeRequest(dispatch, value);
      }
    });

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
        // AsyncStorage.setItem('refresh_token', res.data.refresh_token);
        // AsyncStorage.setItem('token', res.data.access_token)
        // .then(dispatch(getUserInfo()));
        SecureStore.setItemAsync('refresh_token', res.data.refresh_token);
        SecureStore.setItemAsync('token', res.data.access_token)
        .then(() => {
          dispatch(getUserInfo());
        });
      })
      .catch(err => console.log(err));
    }
  }
}

makeRequest = (dispatch, token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  axios.get(`${config.credentials.uaaURL}/userinfo`, {headers})
  .then(res => {
    dispatch({type: 'LOGIN_SUCCESS', payload: res.data});
  })
  .catch(err => {
    this.refreshToken(dispatch);
  });
}

refreshToken = async (dispatch) => {
  let token = await AsyncStorage.getItem('refresh_token');

  axios.post(`${config.credentials.uaaURL}/oauth/token?` +
    `grant_type=refresh_token` +
    `refresh_token=${token}` +
    `client_id=${config.credentials.clientID}`
  )
  .then(res => {
    SecureStore.setItemAsync('refresh_token', res.data.refresh_token);
    SecureStore.setItemAsync('token', res.data.access_token)
    .then(() => {
      dispatch(getUserInfo());
    });
  })
  .catch(err => {
    dispatch({type: 'LOGIN_FAILED'});
  })
}