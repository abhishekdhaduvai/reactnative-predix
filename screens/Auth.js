import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button, 
  ActivityIndicator
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import * as ACTIONS from '../actions';

class Auth extends React.Component {

  state = {
    loggedIn: false,
    username: null,
    loading: false,
  }

  async componentDidMount() {
    this.props.getUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.username)
      this.handleResetNavigationToRoute('Home');
  }

  _handlePressAsync = async () => {
    this.props.getAuthToken();
  };

  handleResetNavigationToRoute = (routeName) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName})]
    })
    this.props.navigation.dispatch(resetAction)
  };

  render() {
    const { loading, username } = this.props;
    return (
      <View style={styles.container}>

        {loading && 
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        }

        {!loading && !username && 
          <Button title="Sign In" onPress={this._handlePressAsync} />
        }

        {!loading && username && 
          <Text>Welcome, {username}</Text>
        }

      </View>
    )
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

function mapStateToProps({ auth }) {
  return { 
    loading: auth.loading,
    username: auth.username 
  };
}

export default connect(mapStateToProps, ACTIONS)(Auth);