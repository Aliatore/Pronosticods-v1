import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    Image,
    ScrollView,
    ImageBackground
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import Layer from '../../assets/img/svg/Layer.svg'

const SplashScreen = ({navigation}) => {
    const { colors } = useTheme();

    const redireccionar = () => {
        setTimeout(() => {
            navigation.navigate('SelectScreen')
        }, 3000);
    }

    useEffect(() => {
        redireccionar()
    }, [])

    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../assets/img/png/Basket.png')} style={styles.image}>
            <StatusBar backgroundColor='#3d3d3d' barStyle="light-content"/>
            <Animatable.View 
                animation="pulse" 
                easing="ease-out" 
                iterationCount="infinite"
            >
                <Layer/>
            </Animatable.View>
        </ImageBackground>
      </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#1b262c',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

