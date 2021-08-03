import React from 'react';
import { 
    View, 
    TouchableOpacity, 
    Platform,
    StyleSheet ,
    StatusBar,
    ImageBackground,
    ScrollView,
    Dimensions
} from 'react-native';
import { Portal, Text, Dialog, TextInput } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Layer from '../../assets/img/svg/Layer.svg';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";

import UrlServices from '../../mixins/Services/UrlServices';
import { useTheme } from 'react-native-paper';

import { AuthContext } from '../../components/context';

const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        email: '',
        password: '',
        error_message: '',
        viewSecure: true

    });
    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);

    const { colors } = useTheme();
    const { signIn } = React.useContext(AuthContext);

    const setEmail = (e) => {
        if(e.trim().length >= 4 ) {
            setData({
                ...data,
                email: e
            });
        } else {
            setData({
                ...data,
                email: e
            });
        }
    }
    const setPassword = (e) => {
        if(e.length !== 0) {
            setData({
                ...data,
                password: e
            });
        } else {
            setData({
                ...data,
                password: e
            });
        }
    }
    const viewPassword = () => {
        setData({
            ...data,
            viewSecure: !data.viewSecure
        });
    }
    const loginHandle = (email, password) => {
        let urlApi = UrlServices(3);
        setVisible(true)
        NetInfo.fetch().then(state => {
            console.log(state.isConnected);
            if (state.isConnected === true){
                if (data.email.length === 0 || data.password.length === 0) {
                    setVisible(false)
                    setAlert(true)
                    setData({
                        ...data,
                        error_message: `Los campos no deben de estar vacios`
                    })
                } else {
                    try {
                        axios({
                            method: 'post',
                            url: `${urlApi}/login`,
                            timeout: 9000,
                            data: {
                                email: email,
                                password: password
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            validateStatus: (status) => {
                                return true; 
                            },
                        })
                        .catch(function(error) {
                            console.log(error);
                            setVisible(false)
                            setAlert(true)
                            setData({
                                ...data,
                                error_message: `Ha ocurrido un error, ${error}`
                            })
                        })
                        .then(response => {
                            console.log(response);
                            console.log("status", response.status);
                            console.log("data", response.data);
                            if (response.status === 200) {
                                const token_user = response.data.token
                                executeValidation(email, password, token_user)
                                setVisible(false)
                            }else{
                                setVisible(false)
                                setAlert(true)
                                setData({
                                    ...data,
                                    error_message: `Ha ocurrido un error, ${response.data.errors.email}`
                                })
                            }
                        })
                    } catch (err) {
                            console.log('catch de errores: ', err);
                            setVisible(false)
                            setAlert(true)
                            setData({
                                ...data,
                                error_message: `Ha ocurrido un error, ${err}`
                            })
                    }   
                }
            }else{
                setData({
                    ...data,
                    error_message: 'Por favor, revise su conexión a internet.',
                });
                setVisible(true)
                setLoginState(false)
            }
        }); 
    }
    const executeValidation = async (email, password, token) => {
        let urlApi = UrlServices(3);
        const email_user = await email;
        const password_user = await password;
        const token_user = await token;
        console.log(email_user);
        console.log(password_user);
        console.log(token_user);
        // logica para validacion de usuario
        NetInfo.fetch().then(state => {
            console.log(state.isConnected);
            if (state.isConnected === true){
                try {
                    axios({
                        method: 'get',
                        url: `${urlApi}/user`,
                        headers: {
                            'Authorization': `Bearer ${token_user}`,
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        validateStatus: (status) => {
                            return true; 
                        },
                    })
                    .catch(function(error) {
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Ha ocurrido un error, ${error}`
                        })
                    })
                    .then(response => {
                        // console.log(response.data);
                        if (response !== null) {
                                const api_token = response.data.data.api_token
                                const data_user = response.data.data
                                console.log(api_token);
                                let foundUser = api_token === token_user ? token_user : false
                                console.log(foundUser);
        
                                if (foundUser === false) {
                                    setVisible(false)
                                    setAlert(true)
                                    setData({
                                        ...data,
                                        error_message: `Usuario invalido.`
                                    })
                                }
                                setVisible(false)
                                signIn(foundUser, data_user);
                        }
                    })
                } catch (err) {
                    setVisible(false)
                    setAlert(true)
                    setData({
                        ...data,
                        error_message: `Ha ocurrido un error, ${err}`
                    })
                }
            }else{
                setData({
                    ...data,
                    error_message: 'Por favor, revise su conexión a internet.',
                });
                setVisible(true)
                setLoginState(false)
            }
        });
    }
    
    return (
        <>
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
                                {/* <Text style={styles.text_footer}>EMAIL</Text> */}
                                <View style={styles.action}>
                                    <TextInput 
                                        label="EMAIL"
                                        mode="outlined"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        placeholderTextColor='#01CD01'
                                        outlineColor='#01CD01'
                                        underlineColor='#01CD01'
                                        selectionColor='#01CD01'
                                        theme={{
                                            colors: {
                                                placeholder: '#01CD01', text: '#fff', primary: '#01CD01',
                                                underlineColor: 'transparent', background: '#303030', color: '#fff'
                                            },
                                        }}
                                        onChangeText={(e) => setEmail(e)}
                                    />
                                </View>
                                {/* <Text style={[styles.text_footer, {marginTop: 20}]}>CONTRASEÑA</Text> */}
                                <View style={[styles.action, {marginTop: 20}]}>
                                    <TextInput 
                                        label="CONTRASEÑA"
                                        mode="outlined"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        placeholderTextColor='#01CD01'
                                        outlineColor='#01CD01'
                                        underlineColor='#01CD01'
                                        selectionColor='#01CD01'
                                        theme={{
                                            colors: {
                                                placeholder: '#01CD01', text: '#fff', primary: '#01CD01',
                                                underlineColor: 'transparent', background: '#303030', color: '#fff'
                                            },
                                        }}
                                        secureTextEntry={data.viewSecure ? true : false}
                                        onChangeText={(e) => setPassword(e)}
                                    />
                                    <View style={styles.custom_eye}>
                                        <TouchableOpacity
                                            onPress={viewPassword}
                                        >
                                            {data.viewSecure ?
                                                <Feather 
                                                    name="eye-off"
                                                    color="grey"
                                                    size={20}
                                                    style={{color: "#01CD01", marginRight: 10}}
                                                />
                                            :
                                                <Feather 
                                                    name="eye"
                                                    color="grey"
                                                    size={20}
                                                    style={{color: "#01CD01", marginRight: 10}}
                                                />
                                            }   
                                        </TouchableOpacity>
                                    </View>
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
                                onPress={() => loginHandle(data.email, data.password)}
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
                                onPress={() => navigation.navigate('ForgotPasswordScreen')}
                                style={[styles.signIn, {marginTop: 10}]}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>¿OLVIDASTE TU CONTRASEÑA?</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </ImageBackground>
            </View>
            <View>
                <Portal>
                    <StatusBar
                        barStyle={Platform.OS === true && theme.dark ? 'light-content' : 'light-content'}
                        backgroundColor='#000000'
                    />
                    <Dialog 
                        visible={visible} 
                        // onDismiss={() => setVisible(false)}
                        dismissable={false}
                        style={{borderRadius: 20, backgroundColor: 'transparent'}}
                    >
                        <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{paddingHorizontal: 24, marginTop: 50, marginBottom: 30, alignItems: 'center'}}>
                            <Spinner 
                                color={"#fff"}
                            />             
                                            
                        </ScrollView>
                        </Dialog.ScrollArea>
                    </Dialog>
                </Portal>
            </View>
            <View>
                <AwesomeAlert
                    show={alert}
                    showProgress={false}
                    title="INFORMACIÓN"
                    message={data.error_message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    // cancelText="CANCELAR"
                    confirmText="ACEPTAR"
                    confirmButtonColor="#01CD01"
                    contentContainerStyle={{backgroundColor: '#262222'}}
                    titleStyle={{color: '#fff'}}
                    messageStyle={{color: '#fff', textAlign: 'center'}}
                    // onCancelPressed={() => {
                    //     this.hideAlert();
                    // }}
                    onConfirmPressed={() => {
                        setAlert(false);
                    }}
                />
            </View>
        </>
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
    marginTop: 15,
    color: '#fff',
    // borderColor: '#01CD01',
    // borderWidth: 1.5,
    // borderRadius: 5,
    // paddingTop: 10,
    // paddingLeft: 10
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
    paddingTop: 5,
    fontSize: 16,
  },
  scrollviewSize: {
    width: '100%'
  },
  custom_eye: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center', 
    alignItems: 'center',
    width: 50, 
    zIndex: 5,
    right: 0,
    top: 14
  }
});

