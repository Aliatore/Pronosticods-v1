import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { Portal, Text, Dialog, Card, Title } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UrlServices from '../../mixins/Services/UrlServices';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail } from 'native-base';
import Feather2 from 'react-native-vector-icons/Feather';

const ForecastsScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    client_token: '',
    data_news: null,
    data_video: null,
    error_message: '',
    page: 1,
    date_today: '',
    is_registred: '',
    view_arrow: true,
    d_1: '',
    d_2: '',
    d_3: '',
    d_4: '',
    is_visible: false,
    is_visible2: false,
    is_visible3: false,
    is_visible4: false
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
  const setButton = (e) => {
    setData({
      ...data,
      view_arrow: e
  }); 
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

  const getForecasts = (token_user) => {   
    let urlApi = UrlServices(1);
    setVisible(true)
    let dateToday = getDate()
    const requestOne = axios({
        method: 'get',
        url: `${urlApi}/forecasts/general`,
        timeout: 9000,
        headers: {
          'Authorization': `Bearer ${token_user}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        validateStatus: (status) => {
            return true; 
        }
    });
    const requestTwo = axios({
        method: 'get',
        url: `${urlApi}/forecasts/hipismo`,
        timeout: 9000,
        headers: {
          'Authorization': `Bearer ${token_user}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        validateStatus: (status) => {
            return true; 
        }
    });
    const requestThree = axios({
        method: 'get',
        url: `${urlApi}/forecasts/special`,
        timeout: 9000,
        headers: {
          'Authorization': `Bearer ${token_user}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        validateStatus: (status) => {
            return true; 
        }
    });
    const requestFour = axios({
        method: 'get',
        url: `${urlApi}/forecasts/trial`,
        timeout: 9000,
        headers: {
          'Authorization': `Bearer ${token_user}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        validateStatus: (status) => {
            return true; 
        }
    });

    NetInfo.fetch().then(state => {
        if (state.isConnected === true){
            if (token_user.length === 0) {
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `Error al obtener el token del usuario, intente nuevamente`
                })
            } else {
                axios.all([requestOne, requestTwo, requestThree, requestFour]).then(axios.spread((...responses) => {
                    const responseOne = responses[0].data.data;
                    const responseTwo = responses[1].data.data;
                    const responseThree = responses[2].data.data;
                    const responseFour = responses[3].data.data;

                    console.log("general",responseOne);
                    console.log("hipismo",responseTwo);
                    console.log("special",responseThree);
                    console.log("trial",responseFour);
                    
                    if (responses[0].status === 200 || responses[0].status === 201 && responses[1].status === 200 || responses[1].status === 201) {
                        setVisible(false)
                        setData({
                          ...data,
                          d_1: responseOne ? responseOne : null,
                          d_2: responseTwo ? responseTwo : null,
                          d_3: responseThree ? responseThree : null,
                          d_4: responseFour ? responseFour : null,
                          is_visible: responseOne ? false : true,
                          is_visible2: responseTwo ? false : true,
                          is_visible3: responseThree ? false : true,
                          is_visible4: responseFour ? false : true,
                      })
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
                {/* <Text  style={styles.top_text}>Pronóstico del día</Text> */}
              </View>
              <View style={styles.bot}>
              {data.d_1 ==  null && data.d_1 == undefined && data.d_1 == "" ||
              data.d_3 ==  null && data.d_3 == undefined &&  data.d_3 == "" ||
              data.d_4 ==  null && data.d_4 == undefined &&  data.d_4 == "" ||
              data.d_2 == null && data.d_2 == undefined &&  data.d_2 == "" ?
          
                (
                  <Card style={[styles.card, {marginTop: 20}]}>
                          <Card.Content>
                            <View style={styles.colapsed_body}>
                              <View style={styles.container_body}>
                                <View style={{width:'100%'}}>
                                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={styles.top_text_empty}>Nuestros pronosticadores están trabajando... </Text>
                                    <Text style={styles.top_text_empty}>Pronto tendrás tus pronósticos, recibirás una notificación en tu correo electrónico.</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            </Card.Content>
                        </Card>
                )
                :
                null
              }
              {data.d_1 !== null && data.d_1 !== undefined && data.d_1 !== "" ?
              (
                <>
                {data.d_1.simples == null || data.d_1.simples == undefined || data.d_1.simples == "" ? null :
                    data.d_1.simples.map((e, i) => { 
                      return <>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text  style={styles.top_text}>Plan General - Simples</Text>
                                </View>
                              <Card key={i} style={[styles.card, {marginTop: 20}]}>
                                  <Card.Content>
                                  <View style={styles.colapsed_body}>
                                    <View style={styles.container_body}>
                                      <View style={{width:'100%'}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                          <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                          <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} / 4.2</Text>
                                          <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                          <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                          <Text style={styles.text_forecast8}>{e.extra}</Text>
                                          {/* <Text numberOfLines={1} style={styles.text_forecast9}>2.050</Text>
                                          <Text numberOfLines={1} style={[styles.text_forecast10, {marginTop: 20}]}>2.050</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast11}>2.050</Text> */}
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                  </Card.Content>
                              </Card>
                            </>
                })}
                {data.d_1.combinadas == null || data.d_1.combinadas == undefined || data.d_1.combinadas == "" ? null :
                    data.d_1.combinadas.map((e, i) => { 
                      return <View key={i} style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text  style={styles.top_text}>Plan General - Combinadas</Text>
                                </View>
                                  {e.childs.map((e, i) => {  
                                    return <Card key={i} style={[styles.card, {marginTop: 20}]}>
                                            <Card.Content>
                                              <View style={styles.colapsed_body}>
                                                <View style={styles.container_body}>
                                                  <View style={{width:'100%'}}>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                      <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                                      <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} / 4.2</Text>
                                                      <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                                      <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                                      <Text style={styles.text_forecast8}>{e.extra}</Text>
                                                    </View>
                                                  </View>
                                                </View>
                                              </View>
                                              </Card.Content>
                                          </Card>
                                  })}
                              </View>
                })}
                </>
              )
              : null}
              {data.d_3 !== null && data.d_3 !== undefined && data.d_3 !== "" ?
              (
                <>
                {data.d_3.simples == null || data.d_3.simples == undefined || data.d_3.simples == "" ? null :
                    data.d_3.simples.map((e, i) => { 
                      return <>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text  style={styles.top_text}>Plan Sports - Simples</Text>
                                </View>
                              <Card key={i} style={[styles.card, {marginTop: 20}]}>
                                  <Card.Content>
                                  <View style={styles.colapsed_body}>
                                    <View style={styles.container_body}>
                                      <View style={{width:'100%'}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                          <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                          <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} / 4.2</Text>
                                          <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                          <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                          <Text style={styles.text_forecast8}>{e.extra}</Text>
                                          {/* <Text numberOfLines={1} style={styles.text_forecast9}>2.050</Text>
                                          <Text numberOfLines={1} style={[styles.text_forecast10, {marginTop: 20}]}>2.050</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast11}>2.050</Text> */}
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                  </Card.Content>
                              </Card>
                              </>
                })}
                {data.d_3.combinadas == null || data.d_3.combinadas == undefined || data.d_3.combinadas == "" ? null :
                    data.d_3.combinadas.map((e, i) => { 
                      return <View key={i} style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text  style={styles.top_text}>Plan Sports - Combinadas</Text>
                                </View>
                                  {e.childs.map((e, i) => {  
                                    return <Card key={i} style={[styles.card, {marginTop: 20}]}>
                                            <Card.Content>
                                              <View style={styles.colapsed_body}>
                                                <View style={styles.container_body}>
                                                  <View style={{width:'100%'}}>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                      <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                                      <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} / 4.2</Text>
                                                      <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                                      <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                                      <Text style={styles.text_forecast8}>{e.extra}</Text>
                                                    </View>
                                                  </View>
                                                </View>
                                              </View>
                                              </Card.Content>
                                          </Card>
                                  })}
                              </View>
                })}
                </>
              )
              : null}
              {data.d_2 !== null && data.d_2 !== undefined && data.d_2 !== "" ?
              (
                <>
                  {data.d_2 === undefined || data.d_2 === null || data.d_2 === '' ? null :
                      data.d_2.map((e, i) => { 
                        return <View key={i} style={{flex: 1}}>  
                                <Text  style={[styles.top_text_hipismo, {marginTop: 20}]}>Plan Riders</Text>
                                  <Collapse onToggle={(evt) => setButton(evt)}>
                                    <CollapseHeader  style={styles.colapse_header}>
                                      <ImageBackground source={require('../../assets/img/jpg/Hipismo.jpg')} style={styles.image}>
                                          <Text style={[styles.image ,{color:'#fff'}]}>{e.name}</Text>
                                      </ImageBackground>
                                    </CollapseHeader>
                                    <CollapseBody style={styles.colapsed_body}>
                                    {e.forecasts.map((e, i) => {
                                      return  <View key={i} style={styles.container_riders}>
                                                <View style={{width:'100%',alignItems:'flex-start', justifyContent: 'center', borderBottomColor: '#fff', borderBottomWidth: 1,}}>
                                                <Text numberOfLines={1} style={styles.text_forecast9}>Carrera {e.race_number}</Text>
                                                      <Text numberOfLines={1} style={[styles.text_forecast10, {marginTop: 20}]}>1er Favorito {e.favorito1}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast11}>2do Favorito {e.favorito2}</Text>
                                                      <Text numberOfLines={1} style={[styles.text_forecast11, {marginBottom: 20}]}>3er Favorito {e.favorito3}</Text>
                                                </View>
                                              </View>
                                    })}
                                    </CollapseBody>
                                  </Collapse>
                                </View>
                  })}
                </>
              )   
              : null}
              {data.d_4 !== null && data.d_4 !== undefined && data.d_4 !== "" ?
              (
                <>
                {/* {data.d_4.simples == null || data.d_4.simples == undefined || data.d_4.simples == "" ||
                data.d_4.combinadas == "" || data.d_4.combinadas == "" || data.d_4.combinadas == "" ? 
                  (<Text  style={styles.top_text}> </Text>) 
                  : 
                  (<Text  style={styles.top_text}>Plan Trial</Text>)
                } */}
                {data.d_4.simples == null || data.d_4.simples == undefined || data.d_4.simples == "" ? null :
                    data.d_4.simples.map((e, i) => { 
                      return <>
                              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text  style={styles.top_text}>Plan Trial - Simples</Text>
                              </View>
                              <Card key={i} style={[styles.card, {marginTop: 20}]}>
                                  <Card.Content>
                                  <View style={styles.colapsed_body}>
                                    <View style={styles.container_body}>
                                      <View style={{width:'100%'}}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                          <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                          <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} / 4.2</Text>
                                          <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                          <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                          <Text style={styles.text_forecast8}>{e.extra}</Text>
                                          {/* <Text numberOfLines={1} style={styles.text_forecast9}>2.050</Text>
                                          <Text numberOfLines={1} style={[styles.text_forecast10, {marginTop: 20}]}>2.050</Text>
                                          <Text numberOfLines={1} style={styles.text_forecast11}>2.050</Text> */}
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                  </Card.Content>
                              </Card>
                            </>
                })}
                {data.d_4.combinadas == null || data.d_4.combinadas == undefined || data.d_4.combinadas == "" ? null :
                    data.d_4.combinadas.map((e, i) => { 
                      return <View key={i} style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                  <Text  style={styles.top_text}>Plan Trial - Combinadas</Text>
                                </View>
                                  {e.childs.map((e, i) => {  
                                    return <Card key={i} style={[styles.card, {marginTop: 20}]}>
                                            <Card.Content>
                                              <View style={styles.colapsed_body}>
                                                <View style={styles.container_body}>
                                                  <View style={{width:'100%'}}>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                      <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                                      <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                                      <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} / 4.2</Text>
                                                      <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                                      <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                                      <Text style={styles.text_forecast8}>{e.extra}</Text>
                                                    </View>
                                                  </View>
                                                </View>
                                              </View>
                                              </Card.Content>
                                          </Card>
                                  })}
                              </View>
                })}
                </>
              )
              : null}
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
    backgroundColor: '#262222',
    width: '95%',
  },
  bot: {
    flex: 2, 
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  top_text_empty:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center'
  },
  top_text_hipismo:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center'
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
    flex: 1,
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
  },
  text_forecast3:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  text_forecast4:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  text_forecast5:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  text_forecast6:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11
  },
  text_forecast7:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  text_forecast8:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  text_forecast9:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  text_forecast10:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
  text_forecast11:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
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
  mini_container: {
    flex: 1,
    flexDirection: 'column'
  },
  colapsed_body: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    backgroundColor:'#262222', 
    margin:10,
    borderRadius: 20, 
  },
  container_body:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container_riders:{
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '90%',
  },
  red_text: {
    color: 'red'
  },
  colapse_header: {
    flexDirection:'row',
    alignItems:'center',
    margin:10,
    backgroundColor:'#262222',
    borderRadius: 20, 
    justifyContent: 'center', 
    height: 150,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 30,   
    opacity: .4
  },
});

