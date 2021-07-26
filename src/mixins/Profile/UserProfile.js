import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const UserProfile = ({dataUser}) => {
    console.log("User Profile element", dataUser ? dataUser : null)
    const dataUserAr = [dataUser];
    console.log("nuevo array", dataUserAr);
    // return(
    //             <></>
    // )
    const navigation = useNavigation();
    if (dataUserAr !== null && dataUserAr !== '' && dataUserAr !== undefined && dataUserAr !== []) {
        return(
            <>
                <View style={styles.card}>
                    <Card style={styles.card}>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
                            <Avatar.Image size={120} source={{ uri: `${dataUserAr[0].avatar_preview}` }} />
                        </View>
                        <Card.Content>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Title style={styles.card_white}>{dataUserAr[0].first_name ? dataUserAr[0].first_name : null } {dataUserAr[0].last_name ? dataUserAr[0].last_name : null }</Title>
                                <Title style={styles.card_green}>{dataUserAr[0].email ? dataUserAr[0].email : null }</Title>                
                                <Title style={styles.card_white_small}>{dataUserAr[0].country_name ? dataUserAr[0].country_name.trim() : null }</Title>                
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity
                                    // disabled={true}
                                    onPress={() => navigation.navigate('Notifications')}
                                    style={[styles.signIn, {
                                        borderColor: '#01CD01',
                                        borderWidth: 1,
                                        marginTop: 15
                                    }]}
                                >
                                    <Text style={[styles.textSign, {
                                        color: '#01CD01'
                                    }]}>MOSTRAR PLANES</Text>
                                </TouchableOpacity>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </>
        )
    } else {
        return(
            <View style={styles.card}>
                <Card style={styles.card}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Avatar.Image size={120} source={{ uri: 'https://picsum.photos/700' }} />
                    </View>
                    <Card.Content>
                        <Title>Cargando...</Title>
                        <Paragraph>Cargando...</Paragraph>                
                    </Card.Content>
                </Card>
            </View>
        )
    }
   
}

export default UserProfile;
let widthScreen = Dimensions.get('window').width / 1.10
const styles = StyleSheet.create({
    card:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
        marginTop: 10,
        backgroundColor: '#131011',
        borderRadius: 5
    },
    card_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
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
        marginBottom: -10,
    },
    textSign: {
        color: 'red',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
    },
    signIn: {
        width: 210,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row'
    },
})
