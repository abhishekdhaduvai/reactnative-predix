import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

class About extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>ABOUT</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default About;