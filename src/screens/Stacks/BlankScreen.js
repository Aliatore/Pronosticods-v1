import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const BlankScreen = () => {
    return (
      <View style={styles.container}>
        <Text>Test 4</Text>
      </View>
    );
};

export default BlankScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#303030',
  },
});
