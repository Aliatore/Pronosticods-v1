import React from 'react';
import { 
    View, 
    TouchableOpacity, 
    Platform,
    StyleSheet ,
    StatusBar,
    ScrollView,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/AntDesign';
import { Portal, Text, Dialog, TextInput} from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import UrlServices from '../../../mixins/Services/UrlServices';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../../components/context';

const CancelSuscription = ({navigation, route}) => {
    const { signOut, toggleTheme, signIn } = React.useContext(AuthContext);
    const [data, setData] = React.useState({
        plan_id: '',
        u_token: '',
    });

    React.useEffect(() => {
        setVariables(route.params);
    }, []);

    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);

    const setVariables = (e) => {
        if(e.length > 0 ) {
            setData({
                ...data,
                plan_id: route.params.plan_id ? route.params.plan_id : '',
                u_token: route.params.u_token ? route.params.u_token : '',
            });
        } else {
            setData({
                ...data,
                plan_id: route.params.plan_id ? route.params.plan_id : '',
                u_token: route.params.u_token ? route.params.u_token : '',
            });
        }
    }


    const sendCancel = () => {   
        let urlApi = UrlServices(1);
        setVisible(true)
        try {
            axios({
                method: 'post',
                url: `${urlApi}/user/subscription/cancel`,
                timeout: 9000,
                data: {
                    plan_id: data.plan_id
                },
                headers: {
                    Authorization: "Bearer" + " " + data.u_token,
                    "Content-Type": "application/json; charset=utf-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
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
                    // console.log("status", response.status);
                    // console.log("data", response.data);
                    if (response.status === 200) {
                        // console.log('correcto');
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Plan cancelado exitosamente`
                        })
                        setTimeout(() => {
                            navigation.navigate('EndCancelScreen');
                        }, 3000);
                    }else if (response.status === 401) {
                        signOut();
                      }else{
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Ha ocurrido un error, ${response.data.message}`
                        })
                    }
                })
        } catch (err) {
                // console.log('catch de errores: ', err);
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `Ha ocurrido un error, ${err}`
                })
        } 
        
    }


    if (route.params == null || route.params == undefined || route.params == "") {
        return(
            <View style={styles.container}>
                <Text style={styles.title_text}>Lo sentimos, no se obtuvo contenido</Text>
            </View>
        )
    } else {
        return (
            <>
                <View style={styles.container}>
                    <StatusBar backgroundColor='#131011' barStyle="light-content"/>
                    <Animatable.View
                            animation="fadeInUpBig"
                            style={styles.top}
                        >   
                            <View style={styles.container_title}>
                                <View style={styles.c1}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Notifications')}
                                    >
                                        <Feather 
                                            name="close"
                                            color="#fff"
                                            size={30}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.c2}>
                                {/* <TouchableOpacity
                                        onPress={() => sendEmail(data.email)}
                                    >
                                        <Feather 
                                            name="check"
                                            color="green"
                                            size={30}
                                        />
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        <Text style={[styles.text_header, {marginTop: 20}]}>CANCELACIÓN DEL PLAN</Text>
                        </Animatable.View>
                    <Animatable.View
                            animation="fadeInUpBig"
                            style={styles.bot}
                        >
                        <ScrollView style={styles.scrollviewSize} showsVerticalScrollIndicator={false}>
                        <View style={styles.black_square}>
                            <View style={styles.price_square}>
                                <Text style={styles.title_text}>Recuerda que perderás todos los beneficios de esta Suscripción</Text>
                                <Text style={[styles.title_text, {marginTop: 20}]}>igualmente Podrás volver a adquirir este plan desde el botón de planes</Text>
                                <Text style={[styles.title_text, {marginTop: 20}]}>¿Estás seguro que quieres continuar?</Text>
                            </View>
                        </View>
                        <View style={[styles.button, {marginTop: 20, marginBottom: 10, justifyContent: 'center', alignItems: 'center'}]}>
                            <TouchableOpacity
                                style={styles.signIn}
                                onPress={() => navigation.navigate('Notifications')}
                            >
                                <LinearGradient
                                    colors={['#01CD01', '#01CD01']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color:'#fff'
                                    }]}>CANCELAR</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.button, {marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center'}]}>
                            <TouchableOpacity
                                style={styles.signIn}
                                onPress={() => sendCancel()}
                            >
                                <LinearGradient
                                    colors={['#CD0101', '#CD0101']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, {
                                        color:'#fff'
                                    }]}>SI</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        </ScrollView>
                    </Animatable.View>
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
    }

    
};

// var v = this.value;
//                                                         if (v.match(/^\d{2}$/) !== null) {
//                                                             this.value = v + '/';
//                                                         }  
export default CancelSuscription;

const {height} = Dimensions.get("screen");
let widthScreen = Dimensions.get('window').width *1.01;
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#303030'
  },
  top: {
    flex: 1, 
    alignItems: 'center',
    width: '98%',
    marginTop: 5
  },
  bot: {
    flex: 5, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  content: {
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
    width: '80%',
  },
  black_square: {
    backgroundColor: '#282424',
    padding: 15,
  },
  container_title: {
    flexDirection: 'row',
    backgroundColor: '#131011',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthScreen,
    marginLeft: 7,
    marginTop: -5,
    height: 50

  },
  c1: {
    flex:2, 
    alignItems: 'flex-start',
    marginLeft: 10
  },
  c2: {
    flex:1, 
    alignItems: 'flex-end', 
    marginRight: 10
  },
  title_text:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  title_text2:{
    color: '#01CD01',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    marginTop: 10
  },
  title_text3:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 18,
    marginTop: 10
  },
  price_square:{
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
