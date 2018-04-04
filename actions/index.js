import { AsyncStorage, Platform } from 'react-native';
import { AuthSession, SecureStore } from 'expo';
import axios from 'axios';
import * as config from '../config';

export const getUserInfo = () => {
  return (dispatch) => {

    // Try to get the auth token from SecureStore
    SecureStore.getItemAsync('token').then(token => {
      if(!token) {
        dispatch({type: 'LOGIN_FAILED'});
      } else {
        // If token exists, make request
        this.makeRequest(dispatch, token);
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
    /*
     * If the reqeuest fails with the given auth token,
     * try to get a new token using the refresh_token from SecureStore.
     * This is to avoid having the user to login again.
    */
    this.refreshToken(dispatch);
  });
}

refreshToken = (dispatch) => {
  // Try to get the refresh_token from SecureStore.
  SecureStore.getItemAsync('refresh_token')
  .then(refresh_token => {
    // If a refresh_token exists, get the auth token using that
    axios.post(`${config.credentials.uaaURL}/oauth/token?` +
      `grant_type=refresh_token` +
      `refresh_token=${token}` +
      `client_id=${config.credentials.clientID}`
    )
    .then(res => {
      // Store the new auth token, and the new refresh_token in the SecureStore.
      SecureStore.setItemAsync('refresh_token', res.data.refresh_token);
      SecureStore.setItemAsync('token', res.data.access_token)
      .then(() => {
        dispatch(getUserInfo());
      });
    })
    .catch(err => {
      /*
       * If the request to get an auth token using the refresh_token fails,
       * that means the refresh_token has expired.
       * The user will have to login again.
      */
      dispatch({type: 'LOGIN_FAILED'});
    });
  })
  .catch(() => {
    // If the refresh_token doesn't exist, the user has to login again.
    dispatch({type: 'LOGIN_FAILED'});
  });
}