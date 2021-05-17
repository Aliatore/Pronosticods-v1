import React, { useEffect, useState } from 'react';
import { 
    View, 
    StyleSheet, 
    StatusBar, 
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Portal, Text, Dialog } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import Feather from 'react-native-vector-icons/AntDesign';
import Feather2 from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UserProfile from '../../../mixins/EditProfile/UserProfile'
import UserProfileData from '../../../mixins/EditProfile/UserProfileData'
import DefaultUser from '../../../assets/img/png/default_user.png';

const EditProfile = ({navigation}) => {

  const [data, setData] = React.useState({
    client_token: '',
    data_user: null,
    error_message: '',
    date_today: '',
    home_gambler: '',
    uri_profile: DefaultUser,
    clientName: '', 
    lastname: '', 
    country: '', 
    bethouse: '', 
    email: '', 
    service: '',

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
  const updateProfile = async() => {   
    setVisible(true)
    console.log(data.data_user.api_token)
    try {
        const it1 = await AsyncStorage.getItem('toUpload_uri_img');
        const it2 = await AsyncStorage.getItem('toUpload_username');
        const it3 = await AsyncStorage.getItem('toUpload_lastname');
        const it4 = await AsyncStorage.getItem('toUpload_country');
        const it5 = await AsyncStorage.getItem('toUpload_bethouse');
        const it6 = await AsyncStorage.getItem('toUpload_email');
        const it7 = await AsyncStorage.getItem('toUpload_service');
        if(it1 !== null &&  it2 !== null && it3 !== null && it4 !== null &&
            it5 !== null && it6 !== null && it7 !== null) {
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

                        const requestOne = axios({
                            method: 'post',
                            url: 'https://admin.pronosticodds.com/user',
                            timeout: 9000,
                            data: {
                                first_name: it2,
                                last_name: it3,
                                country_id: it4,
                                casa_apuestas_id: it5
                            },
                            headers: {
                              'Authorization': `Bearer ${data.data_user.api_token}`,
                              'Content-Type': 'application/json; charset=utf-8',
                              'X-Requested-With': 'XMLHttpRequest',
                              'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Credentials': 'true'
                            },
                            validateStatus: (status) => {
                                return true; 
                            }
                        });
                        const requestTwo = axios({
                            method: 'put',
                            url: 'https://admin.pronosticodds.com/user/avatar',
                            timeout: 9000,
                            data: {
                                avatar: it1,
                            },
                            headers: {
                                'Authorization': `Bearer ${data.data_user.api_token}`,
                                "Content-Type": "application/json; charset=utf-8",
                                "X-Requested-With": "XMLHttpRequest",
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Credentials": "true",
                            },
                            validateStatus: (status) => {
                                return true; 
                            }
                        });

                        axios.all([requestOne, requestTwo]).then(axios.spread( async(...responses) => {
                            const responseOne = responses[0];
                            const responseTwo = responses[1];
                            console.log("RESPUESTA DE 1",responseOne);
                            console.log("RESPUESTA DE 2",responseTwo);
                            
                            if (responses[0].status === 200 || responses[0].status === 201 && responses[1].status === 200 || responses[1].status === 201) {
                                setVisible(false)
                                setData({
                                    ...data,
                                    uri_profile: DefaultUser,
                                    clientName: '', 
                                    lastname: '', 
                                    country: '', 
                                    bethouse: '', 
                                    email: '', 
                                    service: '',
                                })
                                await AsyncStorage.removeItem('toUpload_uri_img');
                                await AsyncStorage.removeItem('toUpload_username');
                                await AsyncStorage.removeItem('toUpload_lastname');
                                await AsyncStorage.removeItem('toUpload_country');
                                await AsyncStorage.removeItem('toUpload_bethouse');
                                await AsyncStorage.removeItem('toUpload_email');
                                await AsyncStorage.removeItem('toUpload_service');
                            }else{
                                // let error = response.data.errors
                                // let parsed_error = JSON.stringify(error)
                                // console.log(parsed_error);
                                setVisible(false)
                                setAlert(true)
                                setData({
                                    ...data,
                                    error_message: `Ha ocurrido un error. ${responses[0].status}`
                                })
                            }
                        })).catch(errors => {
                            // react on errors.
                            // console.log(errors);
                            // console.log(error);
                            setVisible(false)
                            setAlert(true)
                            setData({
                            ...data,
                            error_message: `Ha ocurrido un error, ${errors}`
                            })
                        })
                    }
                }else{
                    setData({
                        ...data,
                        error_message: 'Por favor, revise su conexión a internet.',
                    });
                    setVisible(true)
                }
            }); 
        }else{
            setVisible(false)
            setAlert(true)
            setData({
                ...data,
                error_message: `Los datos a enviar no pueden estar vacios`
            })
        }
    } catch(e) {
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
                        onPress={() => updateProfile()}
                    >
                        <Feather 
                            name="check"
                            color="green"
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Animatable.View>
        <Animatable.View
            animation="fadeInUpBig"
            style={styles.bot}
        >
          <ScrollView>
            <UserProfile 
              dataUser={data.data_user}
              uri_profile={data.uri_profile}
            />
            <UserProfileData 
                dataUser={data.data_user}
                have_bets={data.home_gambler}
                clientName={data.clientName}
                lastname={data.lastname}
                country={data.country}
                bethouse={data.bethouse}
                email={data.email}
                service={data.service}
            />
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

export default EditProfile;

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
        flex: 0.8, 
        alignItems: 'center',
        width: '100%',
    },
    bot: {
        flex: 5, 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container_title: {
        flexDirection: 'row',
        backgroundColor: '#171717',
    },
    container_title_img: {
        flexDirection: 'row'
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
        fontSize: 14,
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
        marginTop: 10,
        color: '#fff',
        borderColor: '#01CD01',
        borderWidth: 1.5,
        borderRadius: 5,
        paddingTop: 10,
        paddingLeft: 10
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -15,
        padding: 10,
        color: '#fff'
    },
});


