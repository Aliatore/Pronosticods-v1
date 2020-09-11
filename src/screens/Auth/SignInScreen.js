import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ImageBackground,
    ScrollView,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Layer from '../../assets/img/svg/Layer.svg';

import { useTheme } from 'react-native-paper';

import { AuthContext } from '../../components/context';

import Users from '../../model/users';

const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const { colors } = useTheme();

    const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = (userName, password) => {

        const foundUser = Users.filter( item => {
            return userName == item.username && password == item.password;
        } );

        if ( data.username.length == 0 || data.password.length == 0 ) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }

        if ( foundUser.length == 0 ) {
            Alert.alert('Invalid User!', 'Username or password is incorrect.', [
                {text: 'Okay'}
            ]);
            return;
        }

        signIn(foundUser);
    }
    
    return (
      <View style={styles.container}>
          <ImageBackground source={require('../../assets/img/png/Basket.png')} style={styles.image}>
            <StatusBar backgroundColor='#3d3d3d' barStyle="light-content"/>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.top}
            >   
                <ScrollView style={styles.scrollviewSize} showsVerticalScrollIndicator={false}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Layer style={{marginBottom: 50, marginTop: 50}}/>
                    </View>
                    <View style={styles.login}>
                        <Text style={styles.text_footer}>EMAIL</Text>
                        <View style={styles.action}>
                            <TextInput 
                                placeholder="EMAIL@EMAIL.COM"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#c4c4c4'
                                onChangeText={(val) => textInputChange(val)}
                            />
                            {/* {data.check_textInputChange ? 
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather 
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null} */}
                        </View>
                        <Text style={[styles.text_footer, {marginTop: 20}]}>CONTRASEÑA</Text>
                        <View style={styles.action}>
                            <TextInput 
                                style={[styles.textInput, {color: '#fff'}]}
                                placeholderTextColor='#c4c4c4'
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onChangeText={(val) => textInputChange(val)}
                            />
                            {/* {data.check_textInputChange ? 
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather 
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null} */}
                        </View>
                    </View>
                </ScrollView>
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
                            }]}>ENTRAR</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignInScreen')}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign, {
                            color: '#fff'
                        }]}>¿OLVIDASTE TU CONTRASEÑA?</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </ImageBackground>
      </View>
    );
};

export default SignInScreen;

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
    alignItems: 'center',
    width: '80%'
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
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    color: '#fff',
    borderColor: '#01CD01',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 10
  },
  text_footer: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
  login: {
    width: '100%'
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    padding: 10,
    color: '#fff'
  },
  scrollviewSize: {
    width: '100%'
  }
});

