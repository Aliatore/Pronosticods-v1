import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Portal, Text, Dialog, Card, Title } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UrlServices from '../../mixins/Services/UrlServices';

const ForecastsScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    client_token: '',
    data_news: null,
    data_video: null,
    error_message: '',
    page: 1,
    date_today: '',
    is_registred: ''
  });

  const theme = useTheme();

  //obtain the token with asyncstorage and set in state data.
  const obtainToken = async () => {
    try {
        const value = await AsyncStorage.getItem('userToken');
        setClientToken(value)
    } catch(e) {
        console.log(e);
    }
  }
  const setClientToken = (e) => {
    setData({
        ...data,
        client_token: e
    }); 
    getForecasts(e)
  }
  const getDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    if(date<10)date='0'+date; //agrega cero si el menor de 10
    if(month<10)month='0'+month; //agrega cero si el menor de 10

    return year + '-' + month + '-' + date;//format: dd-mm-yyyy;
  }
  //api call news
  const getForecasts = (token_user) => {   
    let urlApi = UrlServices(1);
    setVisible(true)

    let dateToday = getDate()

    NetInfo.fetch().then(state => {
        // console.log(state.isConnected);
        if (state.isConnected === true){
            if (token_user.length === 0) {
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `Error al obtener el token del usuario, intente nuevamente`
                })
            } else {
              axios({
                method: 'get',
                url: `${urlApi}/forecasts/general`,
                timeout: 9000,
                params: {
                    limit: 10,
                },
                data: {
                  date: dateToday
                },
                headers: {
                  'Authorization': `Bearer ${token_user}`,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
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
                  if (response.status === 200 || response.status === 201) {
                      console.log('correcto');
                      console.log(response.data, "pronosticos");
                      setVisible(false)

                      if (response.data.result === false) {
                        setAlert(true)
                        setData({
                            ...data,
                            error_message: `Ha ocurrido un error, ${response.data.message}`,
                            is_registred: response.data.result,
                        })
                      }else{
                        null;
                      }
                      // setData({
                      //     ...data,
                      //     data_plans: response.data,
                      //     client_token: token_user,
                      //     client_data: userdata
                      // })
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

//   const scrollCall = ({layoutMeasurement, contentOffset, contentSize}) => {
//     const paddingToBottom = 1;
//     return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
//   }

  //this hook calls the token function
  useEffect(() => {
    obtainToken()
  }, []);

  //state hooks for popups
  const [visible, setVisible] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  
    return (
      <>
      {/* {console.log('actuales',data.data_news)} */}
      <View style={styles.container}>
        <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/>
          <ScrollView 
            // onScroll={({nativeEvent}) => {
            //   if (scrollCall(nativeEvent)) {
            //     getNewsRef(data.client_token);
            //   }
            // }}
            // scrollEventThrottle={0}
          >
            <View style={styles.top_container}>
              <Text  style={styles.top_text}>Pronóstico del día</Text>
            </View>
            {data.is_registred === false ?
              (
                <View style={styles.bot_container}>
                  <Text style={styles.bot_text}>No ha obtenido ningún plan prémium para obtener mayores beneficios, dirígete a suscripciones y únete a uno de nuestros equipos.</Text>
                  <Text style={styles.bot_text1}>¡Unete al club de los ganadores!</Text>
                </View>
              ) 
              :
              (
                <View style={styles.bot}>
                    <Card style={styles.card}>
                        <Card.Content>
                          <View style={styles.container_card}>
                            <View style={styles.container1}>
                              <Image style={{width: 70, height: 70, resizeMode: 'contain'}} source={require('../../assets/img/png/realm.png')} />
                            </View>
                            <View style={styles.container2}>
                              <Title style={styles.text_forecast1}>Hoy 2:30 pm</Title>
                              <Title style={styles.text_forecast2}>04:68:00</Title>
                              <Title numberOfLines={1} style={styles.text_forecast3}>Real madrid - Barcelona</Title>
                              <Title numberOfLines={1} style={styles.text_forecast4}>UEFA CHAMPIONS LEAGUE</Title>
                              <Title numberOfLines={1} style={styles.text_forecast5}>Cuartos de final</Title>
                              <Title style={styles.text_forecast6}>Gana real madrid el primer tiempo</Title>
                              <Title numberOfLines={1} style={styles.text_forecast7}>2.050</Title>
                            </View>
                            <View style={styles.container3}>
                            <Image style={{width: 70, height: 70, resizeMode: 'contain'}} source={require('../../assets/img/png/barcelona.png')} />
                            </View>
                          </View>
                        </Card.Content>
                    </Card>
                </View>
              )
            }
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

export default ForecastsScreen;

let widthScreen = Dimensions.get('window').width / 1.04;
let widthScreen1 = Dimensions.get('window').width / 1.3;
let heightScreen = Dimensions.get('window').height / 2.8;
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    backgroundColor: '#303030',
  },
  card:{
    flex: 1, 
    justifyContent: 'center', 
    alignContent: 'center',
    width: widthScreen,
    marginTop: 10,
    // marginBottom: 10,
    backgroundColor: '#131011',
    borderRadius: 5
  },
  bot:{
    flex: 1, 
    justifyContent: 'center', 
    alignContent: 'center',
    width: widthScreen,
    height: heightScreen
  },
  top_container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  top_text:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left'
  },
  container_card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  container1: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  container2: {
    flex: 4,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  container3: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  text_forecast1:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginTop: 10,
  },
  text_forecast2:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginTop: -10,
  },
  text_forecast3:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginTop: 10,
  },
  text_forecast4:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginTop: -15,
  },
  text_forecast5:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginTop: -15,
  },
  text_forecast6:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginTop: -5,
  },
  text_forecast7:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginTop: -15,
  },
  bot_container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  bot_text:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    width: widthScreen1,
  },
  bot_text1:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    width: widthScreen1,
    marginTop: 20
  },
});

