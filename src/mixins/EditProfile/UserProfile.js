import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

const UserProfile = ({dataUser, uri_profile}) => {

    // console.log("User Profile element", dataUser ? dataUser : null)
    const [avatar, setAvatar] = useState(uri_profile);

    const navigation = useNavigation();

    const handlePicker = () => {
        // console.log('edit');
        const options={
            quality:0.7, allowsEditing:true, mediaType: 'photo', noData: true,
            storageOptions: {
                skipBackup: true, waitUntilSave: true, path: 'images', cameraRoll: true
            }
        }
        ImagePicker.launchImageLibrary(options, async(response) => {
            console.log('Response = ', response);
            
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                setAvatar({uri: response.uri});
                try {
                await AsyncStorage.setItem('toUpload_uri_img', response.uri)
                } catch (e) {
                    console.log(e);
                }
            }
        });
    };



    if (dataUser !== null && dataUser !== '') {
        return(
            <>
                <View style={styles.container_title}>
                    <Text style={styles.text_header}>EDITAR PERFIL</Text>
                </View>
                <View style={styles.card}>
                    <Card style={styles.card}>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20}}>
                            <TouchableOpacity
                                        // disabled={true}
                                        onPress={() => handlePicker()}
                                    >
                                <Avatar.Image size={120} source={avatar} />    
                            </TouchableOpacity>
                        </View>
                        <Card.Content>
                            <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
                                <Title style={styles.card_white}>{dataUser.first_name ? dataUser.first_name : null } {dataUser.last_name ? dataUser.last_name : null }</Title>
                                <Title style={styles.card_green}>{dataUser.email ? dataUser.email : null }</Title>                
                                <Title style={styles.card_white_small}>{dataUser.country_name ? dataUser.country_name.trim() : null }</Title>                
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
    container_title:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
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
        textAlign: 'center'
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
    text_header: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        marginBottom: 20,
    },
})
