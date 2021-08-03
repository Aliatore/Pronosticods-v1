import React, { useEffect, useState } from 'react';
import { View, 
    StyleSheet, 
    StatusBar, 
    ScrollView, 
    TouchableOpacity, 
    Platform, 
} from 'react-native';
import { Portal, TextInput, Dialog } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import Feather from 'react-native-vector-icons/AntDesign';
import Feather2 from 'react-native-vector-icons/Feather';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Layer from '../../../assets/img/svg/Layer.svg'
import UrlServices from '../../../mixins/Services/UrlServices';

const ChangePassword = ({navigation}) => {

    const [data, setData] = React.useState({
        client_token: '',
        data_user: null,
        error_message: '',
        date_today: '',
        home_gambler: '',
        viewSecure: true,
        viewSecure1: true,
        viewSecure2: true,
        old_p: '',
        new_p: '',
        c_new_p: '',
    });

    const theme = useTheme();

  //obtain the token with asyncstorage and set in state data.
    const obtainToken = async () => {
        try {
            const value = await AsyncStorage.getItem('dataUser');
            const valueParsed = JSON.parse(value);
            setClientData(valueParsed)
        } catch(e) {
            console.log(e);
        }
    }
    const setClientData = (e) => {
        setData({
            ...data,
            data_user: e
        }); 
        setVisible(false)
        // getHouse(
    }
    const getDate = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if(date<10)date='0'+date; //agrega cero si el menor de 10
        if(month<10)month='0'+month; //agrega cero si el menor de 10

        return year + '-' + month + '-' + date;//format: dd-mm-yyyy;
    }
    const getOldPassword = (e) => {
        if(e.length !== 0) {
            setData({
                ...data,
                old_p: e
            });
        } else {
            setData({
                ...data,
                old_p: e
            });
        }
    }
    const getNewPassword = (e) => {
        if(e.length !== 0) {
            setData({
                ...data,
                new_p: e
            });
        } else {
            setData({
                ...data,
                new_p: e
            });
        }
    }
    const getConfirmNewPassword = (e) => {
        if(e.length !== 0) {
            setData({
                ...data,
                c_new_p: e
            });
        } else {
            setData({
                ...data,
                c_new_p: e
            });
        }
    }
    const viewPassword = () => {
        setData({
            ...data,
            viewSecure: !data.viewSecure
        });
    }
    const viewPassword1 = () => {
        setData({
            ...data,
            viewSecure1: !data.viewSecure1
        });
    }
    const viewPassword2 = () => {
        setData({
            ...data,
            viewSecure2: !data.viewSecure2
        });
    }
    //   api call
    const changePassword = () => {  
        let urlApi = UrlServices(3); 
        setVisible(true)

        if (data.old_p.length === 0 && data.new_p.length === 0 && data.c_new_p.length === 0 ){
            setVisible(false)
            setAlert(true)
            setData({
                ...data,
                error_message: `Los campos no deben estar vacios.`
            })
        } else {
            if (data.new_p.length >= 8) {
                if (data.new_p === data.c_new_p){
                    // let dateToday = getDate()
    
                    NetInfo.fetch().then(state => {
                        console.log(state.isConnected);
    
                        if (state.isConnected === true){
                            if (data.data_user.api_token.length === 0) {
                                setVisible(false)
                                setAlert(true)
                                setData({
                                    ...data,
                                    error_message: `Error al obtener el token del usuario, intente nuevamente`
                                })
                            } else {
                                try {
                                    axios({
                                        method: 'post',
                                        url: `${urlApi}/user/password/update`,
                                        timeout: 9000,
                                        headers: {
                                        'Authorization': `Bearer ${data.data_user.api_token}`,
                                            'Content-Type': 'application/json',
                                            'X-Requested-With': 'XMLHttpRequest'
                                        },
                                        data: {
                                            password: data.new_p.toString(),
                                        },
                                        validateStatus: (status) => {
                                            return true; 
                                        },
                                    })
                                    .catch(function(error) {
                                        console.log("log de error",error);
                                        setVisible(false)
                                        setAlert(true)
                                        setData({
                                            ...data,
                                            error_message: `Ha ocurrido un error, ${error.data.message}`
                                        })
                                    })
                                    .then(response => {
                                        console.log(response)
                                        if (response.status === 200 || response.status === 201) {
                                            console.log('correcto', response);
    
                                            setVisible(false)
                                            setAlert(true)
                                            setData({
                                                ...data,
                                                error_message: `Cambio correcto`,
                                                old_p: '',
                                                new_p: '',
                                                c_new_p: '',
                                            })
                                            navigation.navigate('ResumePasswordScreen')
                                        }else{
                                            console.log(response.data.message);
                                            setVisible(false)
                                            setAlert(true)
                                            setData({
                                                ...data,
                                                error_message: `Ha ocurrido un error, ${response.data.message}`
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
                    
                }else{
                    setVisible(false)
                    setAlert(true)
                    setData({
                        ...data,
                        error_message: `Las contraseñas introducidas no son identicas, verifique e intentelo nuevamente.`
                    })
                }
            }else{
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `La contraseña debe ser mayor a 8 Dígitos.`
                })
            }
        }
    }

  //this hook calls the token function
  useEffect(() => {
    obtainToken()
  }, []);

  //state hooks for popups
  const [visible, setVisible] = React.useState(true);
  const [alert, setAlert] = React.useState(false);
  
    return (
      <>
      <View style={styles.container}>
        <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/>
        <Animatable.View
            animation="fadeInUpBig"
            style={styles.top}
        >   
            <View style={styles.container_title}>
                <View style={styles.c1}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <Feather 
                            name="arrowleft"
                            color="#fff"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.c2}>
                <TouchableOpacity
                        onPress={() => changePassword()}
                        // onPress={() =>  navigation.navigate('ResumePasswordScreen')}
                    >
                        <Feather 
                            name="check"
                            color="green"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
            </View>
          
        {/* <Text style={[styles.text_header, {marginTop: 20}]}>RECUPERAR CONTRASEÑA</Text> */}
        </Animatable.View>
        <Animatable.View
            animation="fadeInUpBig"
            style={styles.bot}
        >
            <ScrollView style={styles.scrollviewSize} showsVerticalScrollIndicator={false}>
                <View style={styles.container_title_img}>
                    <Layer
                        width="75" 
                        style={{marginLeft: 0}}
                    />
                </View>
                <View style={styles.change_p}>
                    {/* <Text style={styles.text_footer}>Antigua Contraseña</Text> */}
                    <View style={styles.action}>
                        <TextInput 
                            label='ANTIGUA CONTRASEÑA'
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
                            onChangeText={(e) => getOldPassword(e)}
                        />
                        <View style={styles.custom_eye}>
                            <TouchableOpacity
                                onPress={viewPassword}
                            >
                                {data.viewSecure ?
                                    <Feather2 
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                        style={{color: "#fff", marginRight: 10}}
                                    />
                                :
                                    <Feather2 
                                        name="eye"
                                        color="grey"
                                        size={20}
                                        style={{color: "#fff", marginRight: 10}}
                                    />
                                }   
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <Text style={[styles.text_footer, {marginTop: 20}]}>Nueva Contraseña</Text> */}
                    <View style={styles.action}>
                        <TextInput 
                            placeholder="NUEVA CONTRASEÑA"
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
                            secureTextEntry={data.viewSecure1 ? true : false}
                            onChangeText={(e) => getNewPassword(e)}
                        />
                        <View style={styles.custom_eye}>
                            <TouchableOpacity
                                onPress={viewPassword1}
                            >
                                {data.viewSecure1 ?
                                    <Feather2 
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                        style={{color: "#fff", marginRight: 10}}
                                    />
                                :
                                    <Feather2 
                                        name="eye"
                                        color="grey"
                                        size={20}
                                        style={{color: "#fff", marginRight: 10}}
                                    />
                                }   
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <Text style={[styles.text_footer, {marginTop: 20}]}>Confirmar Nueva Contraseña</Text> */}
                    <View style={styles.action}>
                        <TextInput 
                            label="CONFIRAMR NUEVA CONTRASEÑA"
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
                            secureTextEntry={data.viewSecure2 ? true : false}
                            onChangeText={(e) => getConfirmNewPassword(e)}
                        />
                        <View style={styles.custom_eye}>
                            <TouchableOpacity
                                onPress={viewPassword2}
                            >
                                {data.viewSecure2 ?
                                    <Feather2 
                                        name="eye-off"
                                        color="grey"
                                        size={20}
                                        style={{color: "#fff", marginRight: 10}}
                                    />
                                :
                                    <Feather2 
                                        name="eye"
                                        color="grey"
                                        size={20}
                                        style={{color: "#fff", marginRight: 10}}
                                    />
                                }   
                            </TouchableOpacity>
                        </View>
                    </View>
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
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        backgroundColor: '#303030',
    },
    text_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        marginBottom: -10
    },
    top: {
        flex: 1, 
        alignItems: 'center',
        width: '100%',
    },
    bot: {
        flex: 5, 
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '80%',
    },
    container_title: {
        flexDirection: 'row',
        backgroundColor: '#171717',
    },
    container_title_img: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
     c1: {
        flex:2, 
        alignItems: 'flex-start',
        padding: 10
    },
    c2: {
        flex:1, 
        alignItems: 'flex-end',
        padding: 10
    },
    text_header: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Montserrat-Bold'
    },
    scrollviewSize: {
        width: '100%'
    },
    change_p: {
        width: '100%'
    },
    text_footer: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
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
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -15,
        padding: 10,
        color: '#fff'
    },
    custom_eye: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center', 
        alignItems: 'center',
        width: 50, 
        zIndex: 5,
        right: 0,
        top: 17
      }
});


