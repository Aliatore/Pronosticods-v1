import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
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
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';    
import Countries from '../../model/countries'
import { log } from 'react-native-reanimated';

const SignUpScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        date_selected: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });
    const [show, setShow] = useState(false);

    const textInputChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            });
        }
    }
    
    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const setCountries = () =>{
        return Countries.map((e, i) => {
          return <Picker.Item key={i} label={e.name} value={e.name} />
        }) 
    }
    
    const setDate = (event, selectedDate) => {
        setShow(false);
        console.log(event);
        if (event.type === "set") {
        let dates = JSON.stringify(selectedDate);
        let [date, hour] = dates.split('T');
        let [year, month, day] = date.split('-');
        const newDate = `${day}-${month}-${year}`
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

    return (
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
                        {/* <Text style={styles.text_footer}>EMAIL</Text> */}
                        <View style={styles.action}>
                            <TextInput 
                                placeholder="NOMBRE"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#fff'
                                onChangeText={(val) => textInputChange(val)}
                            />
                        </View>
                        <View style={[styles.action, {marginTop: 20}]}>
                            <TextInput 
                                placeholder="APELLIDO"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#fff'
                                onChangeText={(val) => textInputChange(val)}
                            />
                        </View>
                        <View style={[styles.action_picker, {marginTop: 20}]}>
                            <Picker
                                // selectedValue={this.state.language}
                                style={styles.picker}
                                mode={'dialog'}
                                // onValueChange={(itemValue, itemIndex) =>
                                //     this.setState({language: itemValue})
                                // }
                            >
                                <Picker.Item value="" label="SELECCIONA TU PAIS" />
                                {Countries !== null ? setCountries() : null}
                            </Picker>
                        </View>
                        <View style={[styles.action_date, {marginTop: 20}]}>
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
                                    style={styles.picker}
                                    value={new Date()}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={setDate}
                                />
                            )}
                        </View>
                        <View style={[styles.action, {marginTop: 20}]}>
                            <TextInput 
                                placeholder="CORREO"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#fff'
                                onChangeText={(val) => textInputChange(val)}
                            />
                        </View>
                        {/* <Text style={[styles.text_footer, {marginTop: 20}]}>CONTRASEÑA</Text> */}
                        <View style={[styles.action, {marginTop: 20}]}>
                            <TextInput 
                                placeholder="CONTRASEÑA"
                                style={[styles.textInput, {color: '#fff'}]}
                                placeholderTextColor='#fff'
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onChangeText={(val) => textInputChange(val)}
                            />
                        </View>
                        <View style={[styles.action, {marginTop: 20, marginBottom: 20}]}>
                            <TextInput 
                                placeholder="CONFIRMAR CONTRASEÑA"
                                style={[styles.textInput, {color: '#fff'}]}
                                placeholderTextColor='#fff'
                                secureTextEntry={true}
                                autoCapitalize="none"
                                onChangeText={(val) => textInputChange(val)}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => console.warn('Registrado!')}
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
      color: '#fff',
      borderColor: '#fff',
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
      color: '#fff'
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
        paddingLeft: 10
    },
    action_date: {
        flexDirection: 'row',
        marginTop: 10,
        paddingBottom: 10,
        color: '#fff',
        backgroundColor: '#262222',
        borderColor: '#262222',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 10,
        paddingLeft: 10
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
  });
  
  