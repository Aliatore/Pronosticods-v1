import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const BlankScreen = () => {
    return (
      <View style={styles.container}>
        <Text>Support Screen</Text>
        <Button
          title="Click Here"
          onPress={() => alert('Button Clicked!')}
        />
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
