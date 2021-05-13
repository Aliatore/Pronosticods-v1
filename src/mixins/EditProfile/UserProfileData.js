import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Countries from '../../model/countries'
import AsyncStorage from '@react-native-community/async-storage';

const UserProfileData = ({dataUser, have_bets, clientName, lastname, country, bethouse, email, service}) => {

    const [data, setData] = React.useState({
        name: clientName ? clientName : null,
        lastname: lastname ? lastname : null,
        service: service ? service : null,
        country: country ? country : null,
        date_selected: '',
        bet_house: bethouse ? bethouse : null,
        email: email ? email : null,
        password: '',
        confirm_password: '',
        error_message: '',
        viewSecure: true,
        viewSecure2: true,
    });
    const setName = async(e) => {
        if(e.trim().length >= 3 ) {
            setData({
                ...data,
                name: e
            });
            try {
                await AsyncStorage.setItem('toUpload_username', e)
            } catch (e) {
                console.log(e);
            }
        } else {
            setData({
                ...data,
                name: e
            });
        }
        console.log(e);
    }
    const setLastname = async(e) => {
        if(e.trim().length >= 3 ) {
            setData({
                ...data,
                lastname: e
            });
            try {
                await AsyncStorage.setItem('toUpload_lastname', e)
            } catch (e) {
                console.log(e);
            }
        } else {
            setData({
                ...data,
                lastname: e
            });
        }
        console.log(e);
    }
    const setCountry = async(e) => {
        if(e.length !== 0 ) {
            setData({
                ...data,
                country: e
            });
            try {
                await AsyncStorage.setItem('toUpload_country', e.toString())
            } catch (e) {
                console.log(e);
            }
        } else {
            setData({
                ...data,
                country: e
            });
        }
        console.log(e);
    }
    const setBetHouse = async(e) => {
        if(e.length !== 0 ) {
            setData({
                ...data,
                setBetHouse: e
            });
            try {
                await AsyncStorage.setItem('toUpload_bethouse', e)
            } catch (e) {
                console.log(e);
            }
        } else {
            setData({
                ...data,
                setBetHouse: e
            });
        }
        console.log(e);
    }
    const setCountries = () =>{
        return Countries.map((e, i) => {
          return <SelectPicker.Item key={i} label={e.name} value={e.id} />
        }) 
    }
    const setEmail = async(e) => {
        if(e.length !== 0 ) {
            setData({
                ...data,
                email: e
            });
            try {
                await AsyncStorage.setItem('toUpload_email', e)
            } catch (e) {
                console.log(e);
            }
        } else {
            setData({
                ...data,
                email: e
            });
        }
        console.log(e);
    }
    const setService = async(e) => {
        if(e.length !== 0 ) {
            setData({
                ...data,
                service: e
            });
            try {
                await AsyncStorage.setItem('toUpload_service', e)
            } catch (e) {
                console.log(e);
            }
        } else {
            setData({
                ...data,
                service: e
            });
        }
        console.log(e);
    }

    if (dataUser !== null && dataUser !== '') {
        return(
            <>
                <View style={styles.card}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Title style={styles.title_white}>Datos Generales</Title>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            disabled={true}
                            style={[styles.signIn, {
                                borderColor: '#fff',
                                borderWidth: 1,
                                marginTop: 18
                            }]}
                        >
                             <TextInput 
                                placeholder="NOMBRE"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#fff'
                                onChangeText={(e) => setName(e)}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            disabled={true}
                            style={[styles.signIn, {
                                borderColor: '#fff',
                                borderWidth: 1,
                                marginTop: 25
                            }]}
                        >
                            <TextInput 
                                placeholder="APELLIDO"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#fff'
                                onChangeText={(e) => setLastname(e)}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.action_picker, {marginTop: 25}]}>
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
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            disabled={true}
                            style={[styles.signIn, {
                                borderColor: '#fff',
                                borderWidth: 1,
                                marginTop: 25
                            }]}
                        >
                           <TextInput 
                                placeholder="CASA DE APUESTAS"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#fff'
                                onChangeText={(e) => setBetHouse(e)}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            disabled={true}
                            style={[styles.signIn, {
                                borderColor: '#fff',
                                borderWidth: 1,
                                marginTop: 25
                            }]}
                        >
                            <TextInput 
                                placeholder="CORREO"
                                style={styles.textInput}
                                autoCapitalize="none"
                                placeholderTextColor='#fff'
                                onChangeText={(e) => setEmail(e)}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.action_picker, {marginTop: 25, marginBottom:25}]}>
                        <SelectPicker
                            selectedValue={data.service}
                            style={styles.picker}
                            mode={'dialog'}
                            onValueChange={(e) => setService(e)}
                        >
                            <SelectPicker.Item value="" label="SELECCIONA TU PLAN" />
                            <SelectPicker.Item label="PLAN GOLD" value="gold" />
                            <SelectPicker.Item label="PLAN SILVER" value="silver" />
                            <SelectPicker.Item label="PLAN BRONZE" value="bronze" />
                        </SelectPicker>
                    </View>
                </View>
            </>
        )
    } else {
        return(
            <View style={styles.card}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.title_white}>Cargando...</Text>
                </View>
            </View>
        )
    }
   
}

export default UserProfileData;
let widthScreen = Dimensions.get('window').width / 1.10;
let heightScreen = Dimensions.get('window').height;
let widthButton = Dimensions.get('window').width / 1.28;
const styles = StyleSheet.create({
    card:{
        flex: 1, 
        justifyContent: 'flex-start', 
        alignContent: 'center',
        width: widthScreen,
        // height: heightScreen,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#131011',
        borderRadius: 5
    },
    title_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        marginBottom: -10
    },
    card_green:{
        color: '#01CD01',
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        marginBottom: -10
    },
    card_white_small:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        marginBottom: -10
    },
    textSign: {
        color: 'red',
        fontFamily: 'Montserrat-Medium',
        fontSize: 13,
    },
    signIn: {
        width: widthButton,
        height: 40,
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        borderColor: '#fff',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 15,
        paddingLeft: 10
    },
    action_picker: {
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        backgroundColor: '#131011',
        borderColor: '#fff',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 7,
        paddingLeft: 10,
        marginLeft: 23,

        width: '85%',
    },
    picker: {
        height: 30, 
        width: '100%', 
        paddingBottom: 5,
        marginBottom: 7,
        marginTop: -5,
        color: '#fff',
    },
    textInput: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? 0 : -15,
      paddingLeft: 10,
      color: '#fff'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        color: '#fff',
        borderColor: '#fff',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 15,
        paddingLeft: 10
      },
})
