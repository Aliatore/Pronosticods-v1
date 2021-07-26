import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const UserProfileData = ({dataUser, have_bets}) => {

    // console.log("User Profile element", dataUser ? dataUser : null)
    console.log(dataUser);
    console.log('bets', have_bets);
    // return(
    //     <></>
    // )
    const dataUserAr = [dataUser];
    console.log("nuevo array", dataUserAr);
    if (dataUserAr !== null && dataUserAr !== '' && dataUserAr !== undefined && dataUserAr !== []) {
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
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>{dataUserAr[0].first_name ? dataUserAr[0].first_name : null}</Text>
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
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>{dataUserAr[0].last_name ? dataUserAr[0].last_name : null}</Text>
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
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>{dataUserAr[0].country_name ? dataUserAr[0].country_name : null}</Text>
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
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>{have_bets !== null && have_bets !== undefined && have_bets !== '' ? have_bets[0].name : "no encontrado"}</Text>
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
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>{dataUserAr[0].email ? dataUserAr[0].email : null}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            disabled={true}
                            style={[styles.signIn, {
                                borderColor: '#fff',
                                borderWidth: 1,
                                marginTop: 25,
                                marginBottom: 25
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>CONTRASEÑA</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            disabled={true}
                            style={[styles.signIn, {
                                borderColor: '#fff',
                                borderWidth: 1,
                                marginTop: 25,
                                marginBottom: 25
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>{dataUserAr[0].first_name ? dataUserAr[0].first_name : null}</Text>
                        </TouchableOpacity>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row',
    },
})
