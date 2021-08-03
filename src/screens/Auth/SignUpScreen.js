import React, { useEffect, useState } from 'react';
import { 
    View, 
    TouchableOpacity, 
    Dimensions,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Layer from '../../assets/img/svg/Layer.svg';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';    
import Countries from '../../model/countries'
import { Portal, Text, Dialog, TextInput } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import UrlServices from '../../mixins/Services/UrlServices';

const SignUpScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        name: '',
        lastname: '',
        country: '',
        date_selected: '',
        email: '',
        password: '',
        confirm_password: '',
        error_message: '',
        viewSecure: true,
        viewSecure2: true,
    });

    const [show, setShow] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);

    const setName = (e) => {
        if(e.trim().length >= 3 ) {
            setData({
                ...data,
                name: e
            });
        } else {
            setData({
                ...data,
                name: e
            });
        }
        console.log(e);
    }

    const setLastname = (e) => {
        if(e.trim().length >= 3 ) {
            setData({
                ...data,
                lastname: e
            });
        } else {
            setData({
                ...data,
                lastname: e
            });
        }
        console.log(e);
    }

    const setCountry = (e) => {
        if(e.length !== 0 ) {
            setData({
                ...data,
                country: e
            });
        } else {
            setData({
                ...data,
                country: e
            });
        }
        console.log(e);
    }

    const setDate = (event, selectedDate) => {
        setShow(false);
        console.log(event);
        if (event.type === "set") {
        let dates = JSON.stringify(selectedDate);
        let [date, hour] = dates.split('T');
        let [year, month, day] = date.split('-');
        const newDate = `${year}-${month}-${day}`
        const newNewDate = newDate.replace(/"/g,"");
      
        if( newNewDate.length !== 0 ) {
            setData({
                ...data,
                date_selected: newNewDate,
            });
        } else {
            setData({
                ...data,
                date_selected: newNewDate,
            });
        }
        } else {
            null
        }
    }

    const setEmail = (e) => {
        if(e.length !== 0 ) {
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
        console.log(e);
    }

    const setPassword = (e) => {
        if(e.trim().length >= 8) {
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
        console.log(e);
    }

    const viewPassword = () => {
        setData({
            ...data,
            viewSecure: !data.viewSecure
        });
    }

    const setConfirmPassword = (e) => {
        if(e.trim().length >= 8) {
            setData({
                ...data,
                confirm_password: e
            });
        } else {
            setData({
                ...data,
                confirm_password: e
            });
        }
        console.log(e);
    }

    const viewConPassword = () => {
        setData({
            ...data,
            viewSecure2: !data.viewSecure2
        });
    }

    const setCountries = () =>{
        return Countries.map((e, i) => {
          return <SelectPicker.Item key={i} label={e.name} value={e.id} />
        }) 
    }
    
    const sendRegister = (name, lastname, email, password, birthday, countryid) => {   
        let urlApi = UrlServices(3);
        setVisible(true)
        NetInfo.fetch().then(state => {
            console.log(state.isConnected);
            if (state.isConnected === true){
                if (data.name.length === 0 && data.lastname.length === 0 && data.country.length === 0 &&
                    data.date_selected.length === 0 && data.email.length === 0 && data.password.length === 0 &&
                    data.confirm_password.length === 0 ) {
                    setVisible(false)
                    setAlert(true)
                    setData({
                        ...data,
                        error_message: `Los campos no deben de estar vacios`
                    })
                } else {
                    if (data.password === data.confirm_password) {
                        try {
                            axios({
                                method: 'post',
                                url: `${urlApi}/register`,
                                timeout: 9000,
                                data: {
                                    first_name: name,
                                    last_name: lastname,
                                    email: email,
                                    password: password,
                                    birth_day: birthday,
                                    country_id: parseInt(countryid),
                                    check: '1'
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
                                    console.log("status", response.status);
                                    console.log("data", response.data);
                                    if (response.status === 200 || response.status === 201) {
                                        console.log('correcto');
                                        setVisible(false)
                                        setAlert(true)
                                        setData({
                                            ...data,
                                            error_message: `Registro realizado satisfatoriamente`
                                        })
                                        navigation.navigate('ResumeSignUpScreen')
                                    }else{
                                        let error = response.data.errors
                                        let parsed_error = JSON.stringify(error)
                                        console.log(parsed_error);
                                        setVisible(false)
                                        setAlert(true)
                                        setData({
                                            ...data,
                                            error_message: `Ha ocurrido un error, ${parsed_error}`
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
                    } else {
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Las contraseñas no coinciden, intentelo nuevamente`
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
    

    return (
        <>
            <View style={styles.container}>
                <StatusBar backgroundColor='#3d3d3d' barStyle="light-content"/>
                <Animatable.View
                animation="fadeInUpBig"
                style={styles.top}
            >   
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Layer 
                        style={{marginBottom: 20, marginTop: 20}}
                    />
                    <Text style={styles.text_title}>¡BIENVENIDO!</Text>
                    <Text style={styles.text_title}>COMPLETA TU REGISTRO</Text>
                </View>
                
            </Animatable.View>
                <Animatable.View
                animation="fadeInUpBig"
                style={styles.bot}
            > 
                    <ScrollView style={styles.scrollviewSize} showsVerticalScrollIndicator={false}>
                        <View style={styles.login}>
                            <View style={styles.action}>
                                <TextInput 
                                    label="NOMBRE"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    mode="outlined"
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
                                    onChangeText={(e) => setName(e)}
                                />
                            </View>
                            <View style={[styles.action, {marginTop: 10}]}>
                                <TextInput 
                                    label="APELLIDO"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    mode="outlined"
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
                                    onChangeText={(e) => setLastname(e)}
                                />
                            </View>
                            <View style={[styles.action_picker, {marginTop: 10}]}>
                                <SelectPicker
                                    selectedValue={data.country}
                                    style={styles.picker}
                                    mode={'dialog'}
                                    onValueChange={(e) => setCountry(e)}
                                >
                                    <SelectPicker.Item value="" label="SELECCIONA TU PAÍS" />
                                    {Countries !== null ? setCountries() : null}
                                </SelectPicker>
                            </View>
                            <View style={[styles.action_date, {marginTop: 10}]}>
                                <View style={styles.container_date}>
                                    <View style={styles.c1}>
                                        <Text style={styles.text_date}>
                                        {data.date_selected !== '' ? data.date_selected : 'FECHA DE NACIMIENTO'} 
                                        </Text>
                                    </View>
                                    <View style={styles.c2}>
                                        <TouchableOpacity
                                            style={styles.signIn_date}
                                            onPress={() => setShow(true)}
                                        >
                                            <Feather 
                                                name="calendar"
                                                color="green"
                                                size={20}
                                            />
                                        </TouchableOpacity>
                                    </View>  
                                </View>
                                {show && (
                                    <DateTimePicker
                                        locale='es-ES'
                                        style={styles.picker}
                                        value={new Date()}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={setDate}
                                    />
                                )}
                            </View>
                            <View style={[styles.action, {marginTop: 10}]}>
                                <TextInput 
                                    label="CORREO"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    mode="outlined"
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
                            
                            <View style={[styles.action, {marginTop: 10}]}>
                                <TextInput 
                                    label="CONTRASEÑA"
                                    style={[styles.textInput, {color: '#fff'}]}
                                    mode="outlined"
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
                                    autoCapitalize="none"
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
                                                    style={{color: "#fff", marginRight: 10}}
                                                />
                                            :
                                                <Feather 
                                                    name="eye"
                                                    color="grey"
                                                    size={20}
                                                    style={{color: "#fff", marginRight: 10}}
                                                />
                                            }   
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.action, {marginTop: 10, marginBottom: 20}]}>
                                <TextInput 
                                    label="CONFIRMAR CONTRASEÑA"
                                    style={[styles.textInput, {color: '#fff'}]}
                                    mode="outlined"
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
                                    autoCapitalize="none"
                                    onChangeText={(e) => setConfirmPassword(e)}
                                />
                                <View style={styles.custom_eye}>
                                    <TouchableOpacity
                                            onPress={viewConPassword}
                                        >
                                            {data.viewSecure2 ?
                                                <Feather 
                                                    name="eye-off"
                                                    color="grey"
                                                    size={20}
                                                    style={{color: "#fff", marginRight: 10}}
                                                />
                                            :
                                                <Feather 
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
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => sendRegister(data.name, data.lastname, data.email,data.password, data.date_selected, data.country)}
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

                    </View>
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

export default SignUpScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#3d3d3d',
    },
    top: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
    },
    bot: {
      flex: 2, 
      justifyContent: 'center',
      width: '80%',
      marginTop: 50
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    signIn: {
        width: 290,
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
    text_title: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'Montserrat-Bold',
    },
    login: {
      width: '100%'
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -15,
      padding: 10,
      color: '#fff',
      height: 60
    },
    scrollviewSize: {
      width: '100%'
    },
    picker: {
        height: 30, 
        width: '100%', 
        paddingBottom: 5,
        marginBottom: 7,
        marginTop: -5,
        color: '#fff',
    },
    action_picker: {
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        backgroundColor: '#262222',
        borderColor: '#262222',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 10,
        paddingLeft: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    action_date: {
        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: 10,
        color: '#fff',
        backgroundColor: '#262222',
        borderColor: '#262222',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 10,
        paddingLeft: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    container_date: {
        flex:1, 
        flexDirection: 'row', 
        marginLeft: 10
    },
    c1: {
        flex:2, 
    },
    c2: {
        flex:1, 
        alignItems: 'flex-end'
    },
    text_date: {
        color: '#fff', 
        fontSize: 16,
    },
    signIn_date: {
        width: 30,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row',
        marginRight: 10
    },
    custom_eye: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center', 
        alignItems: 'center',
        width: 50, 
        zIndex: 5,
        right: 0,
        top: 21
    }
  });
  
  