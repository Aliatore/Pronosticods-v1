import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Portal, Dialog,TextInput  } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UrlServices from '../../mixins/Services/UrlServices';
import DefaultUser from '../../assets/img/png/default_user.png';
import ImgToBase64 from 'react-native-image-base64';



const ProfileScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    client_token: '',
    data_user: [],
    error_message: '',
    image_user: '',
    date_today: '',
    home_gambler: '',
    uri_profile: DefaultUser,
    avatar: null
  });

  const theme = useTheme();

  //obtain the token with asyncstorage and set in state data.
  const obtainToken = async () => {
    try {
        const value = await AsyncStorage.getItem('dataUser');
        const valueParsed = JSON.parse(value);
        getHouse(valueParsed)
    } catch(e) {
        console.log(e);
    }
  }
  const getDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    if(date<10)date='0'+date; //agrega cero si el menor de 10
    if(month<10)month='0'+month; //agrega cero si el menor de 10

    return year + '-' + month + '-' + date;//format: dd-mm-yyyy;
}
  //api call
  const getHouse = (token_user) => {   
    let urlApi = UrlServices(1);
    setVisible(true)

    let dateToday = getDate()

    NetInfo.fetch().then(state => {
        // console.log(state.isConnected);
        if (state.isConnected === true){
            if (token_user === null) {
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `Error al obtener el token del usuario, intente nuevamente`
                })
            } else {
                try {
                    axios({
                        method: 'get',
                        url: `${urlApi}/casa_apuesta`,
                        timeout: 9000,
                        headers: {
                          'Authorization': `Bearer ${token_user.api_token}`,
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
                        if (response.status === 200 || response.status === 201) {
                            let filter_casa_apuestas = response.data.data.filter((order) => {
                                if (order.id === token_user.casa_apuestas_id) {
                                    return order;
                                }
                            });
                            setVisible(false)
                            setData({
                                ...data,
                                data_user: token_user,
                                image_user: token_user.avatar_preview,
                                client_token: token_user.api_token,
                                date_today: dateToday,
                                home_gambler: filter_casa_apuestas[0].name,
                            })
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
  const mimeData = (e) => {
    let data_ = {
        filename: e.fileName,
        type: e.type,
        size:e.fileSize,  
    };
    return data_;
  }
  const handlePicker = async () => {
    // console.log('edit');
    const options={
   
    }
    ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            try {
                let mime_data = mimeData(response);
                ImgToBase64.getBase64String(response.uri)
                .then(base64String => {
                    var b64 = base64String;
                    const source = `data:${mime_data.type};base64,` + b64;
                    console.log(source);
                    logger(source, response.uri);
                })
                .catch(err => console.log(err));
    
            } catch (e) {
                console.log(e);
            }
        }
    });
  };

const createFormData= (image) => {
    var mime_data = mimeData(image);
    var data = new FormData();
    data.append(image, {
        uri:  Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""), 
        name: `${mime_data.filename}`,
        type: `${mime_data.type}`
    })
    return data;
}
const createBlob = async (image) => {
    var res = await axios.get(image.uri)
    .then(function (response) {
       return response.blob();
    });
    console.log(res);
}

  
  
  
  const logger = async (e, image) => {
    try {
            let urlApi = UrlServices(1);
            setVisible(true)
            NetInfo.fetch().then(state => {
                if (state.isConnected === true){
                    try {
                        axios({
                            method: 'put',
                            url: `${urlApi}/user/avatar`,
                            timeout: 60000,
                            data: {
                                avatar: e,
                            },
                            headers: {
                                'Authorization': `Bearer ${data.client_token}`,
                                "Content-Type": "application/json; charset=utf-8",
                                "X-Requested-With": "XMLHttpRequest",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Credentials": "true"
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
                            if (response.status === 200) {
                                setVisible(false)
                                setData({
                                    ...data,
                                    image_user: image
                                })
                            }else{
                                setVisible(false)
                                setAlert(true)
                                setData({
                                    ...data,
                                    error_message: 'Ha ocurrido un error',
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
                }else{
                    setData({
                        ...data,
                        error_message: `Ha ocurrido un error`
                    })
                    setVisible(true)
                }
            }); 
    } catch (e) {
        console.log(e);
    }   
  } 

  //this hook calls the token function
  useEffect(() => {
    obtainToken()
  }, []);

  //state hooks for popups
  const [visible, setVisible] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
    return (
      <>
      <View style={styles.container}>
        <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/>
          <ScrollView>
            <View style={styles.card}>
                <Card style={styles.card}>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20}}>
                        <TouchableOpacity
                                    // disabled={true}
                                    onPress={() => handlePicker()}
                                >
                            <Avatar.Image size={120} source={data.image_user != '' ? {uri: data.image_user} : require('../../assets/img/png/default_user.png')} />    
                        </TouchableOpacity>
                    </View>
                    <Card.Content>
                        <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
                            <Title style={styles.card_white}>{data.data_user.first_name ? data.data_user.first_name : null } {data.data_user.last_name ? data.data_user.last_name : null }</Title>
                            <Title style={styles.card_green}>{data.data_user.email ? data.data_user.email : null }</Title>                
                            <Title style={styles.card_white_small}>{data.data_user.country_name ? data.data_user.country_name.trim() : null }</Title>                
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity
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
            <View style={styles.card2}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Title style={styles.title_white2}>Datos Generales</Title>
                    </View>
                    <View style={styles.action}>
                        <TextInput 
                            label="Nombre"
                            style={styles.textInput}
                            value={data.data_user.first_name ? data.data_user.first_name : null}
                            mode="outlined"
                            placeholderTextColor='#fff'
                            outlineColor='#fff'
                            underlineColor='#fff'
                            selectionColor='#01CD01'
                            theme={{
                                colors: {
                                    placeholder: '#fff', text: '#fff', primary: '#fff',
                                    underlineColor: 'transparent', background: '#131011', color: '#fff'
                                },
                            }}
                        />
                    </View>
                    <View style={styles.action}>
                        <TextInput 
                            label="Apellido"
                            style={styles.textInput}
                            value={data.data_user.last_name ? data.data_user.last_name : null}
                            mode="outlined"
                            placeholderTextColor='#fff'
                            outlineColor='#fff'
                            underlineColor='#fff'
                            selectionColor='#01CD01'
                            theme={{
                                colors: {
                                    placeholder: '#fff', text: '#fff', primary: '#fff',
                                    underlineColor: 'transparent', background: '#131011', color: '#fff'
                                },
                            }}
                        />
                    </View>
                    <View style={styles.action}>
                        <TextInput 
                            label="Pais"
                            style={styles.textInput}
                            value={data.data_user.country_name ? data.data_user.country_name : null}
                            mode="outlined"
                            placeholderTextColor='#fff'
                            outlineColor='#fff'
                            underlineColor='#fff'
                            selectionColor='#01CD01'
                            theme={{
                                colors: {
                                    placeholder: '#fff', text: '#fff', primary: '#fff',
                                    underlineColor: 'transparent', background: '#131011', color: '#fff'
                                },
                            }}
                        />
                    </View>
                    <View style={styles.action}>
                        <TextInput 
                            label="Casa de apuestas"
                            style={styles.textInput}
                            value={data.home_gambler ? data.home_gambler : "No posee"}
                            mode="outlined"
                            placeholderTextColor='#fff'
                            outlineColor='#fff'
                            underlineColor='#fff'
                            selectionColor='#01CD01'
                            theme={{
                                colors: {
                                    placeholder: '#fff', text: '#fff', primary: '#fff',
                                    underlineColor: 'transparent', background: '#131011', color: '#fff'
                                },
                            }}
                        />
                    </View>
                    <View style={[styles.action, {marginBottom: 10}]}>
                        <TextInput 
                            label="Correo"
                            style={styles.textInput}
                            value={data.data_user.email ? data.data_user.email : null}
                            mode="outlined"
                            placeholderTextColor='#fff'
                            outlineColor='#fff'
                            underlineColor='#fff'
                            selectionColor='#01CD01'
                            theme={{
                                colors: {
                                    placeholder: '#fff', text: '#fff', primary: '#fff',
                                    underlineColor: 'transparent', background: '#131011', color: '#fff'
                                },
                            }}
                        />
                    </View>
                  
                 
                </View>
          </ScrollView>
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

export default ProfileScreen;
let widthScreen = Dimensions.get('window').width / 1.10
let heightScreen = Dimensions.get('window').height;
let widthButton = Dimensions.get('window').width / 1.28;
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
card2:{
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
title_white2:{
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginBottom: -10
},
card_green2:{
    color: '#01CD01',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    marginBottom: -10
},
card_white_small2:{
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    marginBottom: -10
},
textSign2: {
    color: 'red',
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
},
signIn2: {
    width: widthButton,
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
},
action: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 15, 
    marginRight: 15,

  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -15,
    padding: 10,
    color: '#fff',
    fontSize: 16
},
});


