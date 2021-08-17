import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Portal, Dialog  } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import * as ImagePicker from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ImgToBase64 from 'react-native-image-base64';
import UrlServices from '../../mixins/Services/UrlServices';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";

const UserProfile = ({dataUser}) => {
    const dataUserAr = [dataUser];
    console.log("nuevo array", dataUserAr);

    const [avatar, setAvatar] = useState({uri: dataUserAr[0].avatar_preview});
    const [b64Avatar, setB63Avatar] = useState(null);
    const [visible, setVisible] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [errorA, setError] = React.useState("");
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
                    ImgToBase64.getBase64String(response.uri)
                    .then(base64String => {
                            setB63Avatar(base64String)
                            logger()
                    })
                    .catch(err => doSomethingWith(err));
           
                } catch (e) {
                    console.log(e);
                }
            }
        });
    };

    const logger = async () => {
        try {
                let urlApi = UrlServices(1);
                setVisible(true)
                NetInfo.fetch().then(state => {
                    console.log(state.isConnected);
                    if (state.isConnected === true){
                        try {
                            axios({
                                method: 'put',
                                url: `${urlApi}/user/avatar`,
                                timeout: 9000,
                                data: {
                                    avatar: b64Avatar ? b64Avatar : null,
                                },
                                headers: {
                                    'Authorization': `Bearer ${dataUser.api_token}`,
                                    "Content-Type": "application/json; charset=utf-8",
                                    "X-Requested-With": "XMLHttpRequest",
                                    "Access-Control-Allow-Origin": "*",
                                    "Access-Control-Allow-Credentials": "true",
                                },
                                validateStatus: (status) => {
                                    return true; 
                                }
                            })
                            .catch(function(error) {
                                console.log(error);
                                setVisible(false)
                                setAlert(true)
                                setError(`Ha ocurrido un error, ${error}`)
                            })
                            .then(response => {
                                console.log(response.data);
                                if (response.status === 200) {
                                    setB63Avatar("")
                                    setVisible(false)
                                }else{
                                    setVisible(false)
                                    setAlert(true)
                                    setError(`Ha ocurrido un error`)
                                }
                            })
                        } catch (err) {
                                console.log('catch de errores: ', err);
                                setVisible(false)
                                setAlert(true)
                                setError(`Ha ocurrido un error, ${error}`)
                        } 
                    }else{
                        setError(`Ha ocurrido un error`)
                        setVisible(true)
                    }
                }); 
        } catch (e) {
            console.log(e);
        }   
    } 

    if (dataUserAr !== null && dataUserAr !== '' && dataUserAr !== undefined && dataUserAr !== []) {
        return(
            <>
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
              message={errorA}
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
        )
    } else {
        return(
            <>
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
              message={errorA}
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
