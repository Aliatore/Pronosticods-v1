import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Portal, Text, Dialog } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UserProfile from '../../mixins/Profile/UserProfile'
import UserProfileData from '../../mixins/Profile/UserProfileData'

const HomeScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    client_token: '',
    data_user: null,
    error_message: '',
    date_today: '',
    home_gambler: ''
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
    getHouse(e);
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
    setVisible(true)

    let dateToday = getDate()

    NetInfo.fetch().then(state => {
        console.log(state.isConnected);
        if (state.isConnected === true){
            if (token_user.length === 0) {
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
                        url: 'https://admin.pronosticodds.com/api/casa_apuesta',
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
                        console.log(response)
                        if (response.status === 200 || response.status === 201) {
                            console.log('correcto', response);
                            let filter_casa_apuestas = response.data.data.filter((order) => {
                                if (order.id === token_user.casa_apuestas_id) {
                                    return order;
                                }
                            });
                            console.log(filter_casa_apuestas, "aqui llego el resultado de Ksa");
                            console.log(typeof filter_casa_apuestas, "aqui llego el resultado de Ksa");
                            let are_empty = Object.keys(filter_casa_apuestas).length === 0;
                            let result_casa_apuesta = '';
                            are_empty ? result_casa_apuesta = "No posee" : result_casa_apuesta = filter_casa_apuestas;

                            setVisible(false)
                            setData({
                                ...data,
                                data_user: token_user,
                                client_token: token_user.api_token,
                                date_today: dateToday,
                                home_gambler: result_casa_apuesta,
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
            <UserProfile 
              dataUser={data.data_user}
              navigation={navigation}
            />
            <UserProfileData 
              dataUser={data.data_user}
              have_bets={data.home_gambler}
            />
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

export default HomeScreen;

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
});


