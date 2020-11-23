import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const UserProfileData = ({dataUser}) => {

    console.log("User Profile element", dataUser ? dataUser : null)
    

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
                            <Text style={[styles.textSign, {
                                color: '#fff',
                                marginLeft: 18,
                            }]}>{dataUser.first_name ? dataUser.first_name : null}</Text>
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
                            }]}>{dataUser.last_name ? dataUser.last_name : null}</Text>
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
                            }]}>{dataUser.country_name ? dataUser.country_name : null}</Text>
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
                            }]}>{dataUser.email ? dataUser.email : null}</Text>
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
                            }]}>{dataUser.email ? dataUser.email : null}</Text>
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
                            }]}>{dataUser.email ? dataUser.email : null}</Text>
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
                            }]}>{dataUser.email ? dataUser.email : null}</Text>
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
                            }]}>{dataUser.email ? dataUser.email : null}</Text>
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
