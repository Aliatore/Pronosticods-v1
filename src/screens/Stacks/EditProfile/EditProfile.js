import React, { useEffect, useState } from 'react';
import { 
    View, 
    StyleSheet, 
    StatusBar, 
    ScrollView,
    TouchableOpacity,
    Text, 
    Dimensions, 
} from 'react-native';
import { Avatar, Button, Card, Title, TextInput, Portal, Dialog } from 'react-native-paper';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import Feather from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UserProfileData from '../../../mixins/EditProfile/UserProfileData'
import DefaultUser from '../../../assets/img/png/default_user.png';
import UrlServices from '../../../mixins/Services/UrlServices';
import Countries from '../../../model/countries';
import { AuthContext } from '../../../components/context';
const EditProfile = ({navigation}) => {
    const { signOut, toggleTheme, signIn } = React.useContext(AuthContext);
  const [data, setData] = React.useState({
    client_token: '',
    data_user: null,
    error_message: '',
    date_today: '',
    home_gambler: '',
    paises: '',
    uri_profile: DefaultUser,
    clientName: '', 
    lastname: '', 
    bethouse: '', 
    email: '', 
    callApi: false,
    name: '',
    service: '',
    country: '',
    date_selected: '',
    bet_house: '',
    password: '',
    confirm_password: '',
    viewSecure: true,
    viewSecure2: true,
  });

  const theme = useTheme();

  //obtain the token with asyncstorage and set in state data.
  const obtainToken = async () => {
    try {
        const value = await AsyncStorage.getItem('dataUser');
        const valueParsed = JSON.parse(value);
        getAllData(valueParsed);
    } catch(e) {
        console.log(e);
    }
  }
  const getAllData = (e) => {   
    let urlApi = UrlServices(1);
    setVisible(true)
    console.log(e);

    const requestOne = axios({
        method: 'get',
        url: `${urlApi}/casa_apuesta`,
        timeout: 9000,
        headers: {
            'Authorization': `Bearer ${e.api_token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        validateStatus: (status) => {
            return true; 
        }
    });
    const requestTwo = axios({
        method: 'get',
        url: `${urlApi}/country?limit=all`,
        timeout: 9000,
        headers: {
            'Authorization': `Bearer ${e.api_token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        validateStatus: (status) => {
            return true; 
        }
    })

    NetInfo.fetch().then(state => {
        if (state.isConnected === true){
            if (e.api_token.length === 0) {
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `Error al obtener el token del usuario, intente nuevamente`
                })
            } else {
                axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
                    const responseOne = responses[0].data.data;
                    const responseTwo = responses[1].data.data;

                    console.log(responseOne);
                    console.log(responseTwo);
                    
                    if (responses[0].status === 200 || responses[0].status === 201 && responses[1].status === 200 || responses[1].status === 201) {
                        setVisible(false)
                        setData({
                            ...data,
                            home_gambler: responseOne,
                            paises: responseTwo,
                            data_user: e,
                        })
                    }else if (responses[0].status === 401 || responses[1].status === 401) {
                        signOut();
                      }else{
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Ha ocurrido un error.`
                        })
                    }
                })).catch(errors => {
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
            setLoginState(false)
        }
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
  const setName = async(e) => {
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
  const setLastname = async(e) => {
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
  const setCountry = async(e) => {
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
  const setBetHouse = async(e) => {
    if(e.length !== 0 ) {
        setData({
            ...data,
            bet_house: e
        });
    } else {
        setData({
            ...data,
            bet_house: e
        });
    }
    console.log(e);
  }
  const setCountries = () =>{
    if (data.paises !== undefined && data.paises !== null && data.paises !== "") {
        return data.paises.map((e, i) => {
          return <SelectPicker.Item key={i} label={e.name} value={e.id} />
        }) 
    }
  }
  const setBettHouses = () =>{
      if (data.home_gambler !== undefined && data.home_gambler !== null && data.home_gambler !== "") {
          return data.home_gambler.map((e, i) => {
            return <SelectPicker.Item key={i} label={e.name} value={e.id} />
          }) 
      }
  }
  const setEmail = async(e) => {
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
  const setService = async(e) => {
    if(e.length !== 0 ) {
        setData({
            ...data,
            service: e
        });
    } else {
        setData({
            ...data,
            service: e
        });
    }
    console.log(e);
  }
  const updateProfile = (e) => {
    try {
        let urlApi = UrlServices(1);
        setVisible(true)
        NetInfo.fetch().then(state => {
            console.log(state.isConnected);
            if (state.isConnected === true){
                try {
                    axios({
                        method: 'post',
                        url: `${urlApi}/user`,
                        timeout: 9000,
                        data: {
                            first_name: data.name,
                            last_name: data.lastname,
                            country_id: data.country,
                            casa_apuestas_id: data.setBetHouse
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
                        console.log(response.data);
                        if (response.status === 200) {
                            setVisible(false)
                            setAlert(true)
                            setData({
                                ...data,
                                error_message: `Su perfil ha sido editado satisfactoriamente.`
                            })
                            navigation.goBack();
                        }else{
                            setVisible(false)
                            setAlert(true)
                            setData({
                                ...data,
                                error_message: `Ha ocurrido un error`
                            })
                        }
                    })
                } catch (err) {
                        console.log('catch de errores: ', err);
                        setVisible(false)
                        setAlert(true)
                        
                        setData({
                            ...data,
                            error_message: `Ha ocurrido un error, ${error}`
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
        <Animatable.View
            animation="fadeInUpBig"
            style={styles.top}
        >   
            <View style={styles.container_title2}>
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
                <View style={styles.container_title}>
                    <Text style={styles.text_header}>EDITAR PERFIL</Text>
                </View>
                <View style={styles.card}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Title style={styles.title_white}>Datos Generales</Title>
                    </View>
                    <View style={styles.action}>
                        <TextInput 
                            label="NOMBRE"
                            style={styles.textInput}
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
                            onChangeText={(e) => setName(e)}
                        />
                    </View>
                    <View style={styles.action}>
                        <TextInput 
                            label="APELLIDO"
                            style={styles.textInput}
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
                    <View style={[styles.action_picker, {marginTop: 25}]}>
                        <SelectPicker
                            selectedValue={data.bet_house}
                            style={styles.picker}
                            mode={'dialog'}
                            onValueChange={(e) => setBetHouse(e)}
                        >
                            <SelectPicker.Item value="" label="CASA DE APUESTAS" />
                            {data.home_gambler !== null ? setBettHouses() : null}
                        </SelectPicker>
                    </View>
                    <View style={[styles.action, {marginTop: 20}]}>
                        <TextInput 
                            label="CORREO"
                            style={styles.textInput}
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
                            onChangeText={(e) => setEmail(e)}
                        />
                    </View>
                    {/* <View style={[styles.action_picker, {marginTop: 25, marginBottom:25}]}>
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
                    </View> */}
                </View>
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
let widthScreen = Dimensions.get('window').width / 1.10;
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
    top: {
        flex:0.9, 
        alignItems: 'center',
        width: '100%',
    },
    bot: {
        flex: 5, 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container_title2: {
        flexDirection: 'row',
        backgroundColor: '#171717',
    },
    container_title_img: {
        flexDirection: 'row'
    },
     c1: {
        flex:1, 
        alignItems: 'flex-start',
        padding: 10
    },
    c2: {
        flex:1, 
        alignItems: 'flex-end',
        padding: 10
    },
    // text_header: {
    //     color: '#fff',
    //     fontSize: 14,
    //     fontFamily: 'Montserrat-Bold'
    change_p: {
        width: '100%'
    },
    inputCustom: {
        flex: 1,
        backgroundColor: 'red',
        width: '100%'

    },
    text_footer: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
    },
    text_header: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    card:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
        // height: heightScreen,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#131011',
        borderRadius: 5,
    },
    container_title:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
    },
    title_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        marginBottom: -10
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
        marginTop: Platform.OS === 'ios' ? 0 : -15,
        padding: 10,
        color: '#fff',
        fontSize: 16
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 15, 
        marginRight: 15,
    
      },
      scrollviewSize: {
        width: '100%'
      },
    
});


