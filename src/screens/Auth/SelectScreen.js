import React from 'react';
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
import Layer from '../../assets/img/svg/Layer.svg';

const SelectScreen = ({navigation}) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
          <ImageBackground source={require('../../assets/img/png/Basket.png')} style={styles.image}>
            <StatusBar backgroundColor='#3d3d3d' barStyle="light-content"/>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.top}
            >
                <Text style={styles.text_header}>MEJORES PRONOSTICOS</Text>
                <Text style={styles.text_header}>MAYORES BENEFICIOS</Text>
                <Layer style={{marginTop: 50}}/>
            </Animatable.View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.bot}
            >
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => navigation.navigate('SignUpScreen')}
                    >
                        <LinearGradient
                            colors={['#01CD01', '#01CD01']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color:'#fff'
                            }]}>REGISTRATE</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignInScreen')}
                        style={[styles.signIn, {
                            borderColor: '#01CD01',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>INICIO DE SESIÓN</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </ImageBackground>
      </View>
    );
};

export default SelectScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#009387'
  },
  top: {
    flex: 2, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  bot: {
    flex: 1, 
    justifyContent: 'center'
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
  },
  signIn: {
      width: 280,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      flexDirection: 'row'
  },
  textSign: {
      color: 'red',
      fontFamily: 'Montserrat-SemiBold',
      fontSize: 15,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text_header: {
      color: '#fff',
      fontSize: 20,
      fontFamily: 'Montserrat-Bold'
  }
});

