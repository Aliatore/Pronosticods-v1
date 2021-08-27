import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { Portal, Text, Dialog, Card, Title } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import UrlServices from '../../mixins/Services/UrlServices';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../components/context';
const ForecastsScreen = ({navigation}) => {
  const { signOut, toggleTheme, signIn } = React.useContext(AuthContext);
  const [data, setData] = React.useState({
    client_token: '',
    client_data: '',
    data_news: null,
    data_video: null,
    error_message: '',
    page: 1,
    date_today: '',
    is_registred: '',
    view_arrow: true,
    prueba_finalizada: false,
    d_1_c: [],
    d_1_s: [],
    d_2: [],
    d_3_c: [],
    d_3_s: [],
    d_4_c: [],
    d_4_s: [],
  });

  const theme = useTheme();

  //obtain the token with asyncstorage and set in state data.
  const obtainToken = async () => {
    try {
        const value = await AsyncStorage.getItem('userToken');
        const dataUser = await AsyncStorage.getItem('dataUser');
        var new_data = JSON.parse(dataUser);
        getForecasts(value, new_data)
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
  const getDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    if(date<10)date='0'+date; //agrega cero si el menor de 10
    if(month<10)month='0'+month; //agrega cero si el menor de 10

    return year + '-' + month + '-' + date;//format: dd-mm-yyyy;
  }

  const getForecasts = (token_user, data_user) => {   
    console.log(data_user);
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
                  let responseOneCombinadas = [];
                  let responseOneSimples = [];
                  let responseTwo = [];
                  let responseThreeCombinadas = [];
                  let responseThreeSimples = [];
                  let responseFourCombinadas = [];
                  let responseFourSimples   = [];
                  if (!(responses[0].data.data == undefined || responses[0].data.data == null || responses[0].data.data == '') ) {
                    if (responses[0].data.data.hasOwnProperty('combinadas')) {
                      responseOneCombinadas = responses[0].data.data.combinadas;  
                    }
                    if (responses[0].data.data.hasOwnProperty('simples')) {  
                      responseOneSimples = responses[0].data.data.simples;
                    }
                  }
                  if (!(responses[1].data.data == undefined || responses[1].data.data == null || responses[1].data.data == '') ) {
                    if (responses[1].data.hasOwnProperty('data')) {  
                      responseTwo = responses[1].data.data;
                    }
                  }
                  if (!(responses[2].data.data == undefined || responses[2].data.data == null || responses[2].data.data == '') ) {
                    if (responses[2].data.data.hasOwnProperty('combinadas')) {
                      responseThreeCombinadas = responses[2].data.data.combinadas;
                    }
                    if (responses[2].data.data.hasOwnProperty('simples')) {  
                      responseThreeSimples = responses[2].data.data.simples;
                    }
                  }
                  if (!(responses[3].data.data == undefined || responses[3].data.data == null || responses[3].data.data == '') ) {
                    if (responses[3].data.data.hasOwnProperty('combinadas')) {
                      responseFourCombinadas = responses[3].data.data.combinadas;
                    }
                    if (responses[3].data.data.hasOwnProperty('simples')) {  
                      responseFourSimples = responses[3].data.data.simples;
                    }
                  }
                  console.log(responses[1].data.data);
                  // console.log(responseThreeCombinadas);
                    if (responses[0].status === 200 || responses[0].status === 201 && responses[1].status === 200 || responses[1].status === 201) {
                        setVisible(false)
                        var date_end = data_user.trial_ends_at != null ? data_user.trial_ends_at.split('T')[0] : null;
                        var prueba_finalizada = false;
                        if (date_end != null ) {
                          if (dateToday === date_end) {
                            prueba_finalizada = true;
                          }
                        }
                        setData({
                          ...data,
                          client_token: token_user,
                          client_data: data_user,
                          prueba_finalizada: prueba_finalizada,
                          d_1_c: responseOneCombinadas,
                          d_1_s: responseOneSimples,
                          d_2: responseTwo,
                          d_3_c: responseThreeCombinadas,
                          d_3_s: responseThreeSimples,
                          d_4_c: responseFourCombinadas,
                          d_4_s: responseFourSimples,
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
             
             {data.prueba_finalizada === true ?
              (
                <Card style={[styles.card, {marginTop: 20}]}>
                    <Card.Content>
                      <View style={styles.colapsed_body}>
                        <View style={styles.container_body}>
                          <View style={{width:'100%'}}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                              <Text style={styles.top_text_empty}>Lamentamos informarte que tu tiempo de prueba ha vencido. Para seguir disfrutando la jugada del día y demas pronósticos</Text>
                              <View style={styles.button}>
                                <TouchableOpacity
                                  style={styles.signIn}
                                  onPress={() => navigation.navigate('Notifications')}
                                >
                                    <LinearGradient
                                        colors={['#01CD01', '#01CD01']}
                                        style={styles.signIn}
                                    >
                                        <Text style={[styles.textSign, {
                                            color:'#fff'
                                        }]}>Suscribete Aquí </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            </View>
                          </View>
                        </View>
                      </View>
                      </Card.Content>
                  </Card>
              )
              :
              <>
                {data.d_1_c.length == 0 && data.d_1_s.length == 0 && data.d_2.length == 0 &&
                data.d_3_c.length == 0 && data.d_3_s.length == 0 &&  data.d_4_c.length == 0 &&
                data.d_4_s.length == 0 ?
          
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
                {data.d_4_s.length == 0 ? null :
                  <>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text  style={styles.top_text}>La jugada del día - Simples</Text>
                    </View>
                    {
                      data.d_4_s.map((e, i) => { 
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
                                                <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} </Text>
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
                      })
                    }
                    </>
                }
                {data.d_4_c.length == 0 ? null :                    
                  <>
                    {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text  style={styles.top_text}>La jugada del día - Combinadas</Text>
                    </View> */}
                    {
                      data.d_4_c.map((e, i) => { 
                            return <View key={i} style={{flex: 1}}>
                                      <Collapse onToggle={(evt) => setButton(evt)}>
                                        <CollapseHeader  style={styles.colapse_header2}>
                                          <View style={styles.container_tab}>
                                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                              <Text style={styles.textCard}>La jugada del Día</Text>
                                            </View>
                                          </View>
                                        </CollapseHeader>
                                        <CollapseBody style={styles.colapsed_body}>
                                        {e.childs.map((e, i) => {
                                          return  <View key={i} style={styles.container_riders}>
                                                    <View style={styles.colapsed_body}>
                                                      <View style={styles.container_body}>
                                                        <View style={{width:'100%'}}>
                                                          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                            <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                                            <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} </Text>
                                                            <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                                            {e.extra !== null ? 
                                                              (
                                                                <>
                                                                  <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                                                  <Text style={styles.text_forecast8}>{e.extra}</Text>
                                                                </>
                                                              )
                                                              :
                                                              null
                                                            }
                                                            
                                                          </View>
                                                        </View>
                                                      </View>
                                                    </View>
                                                    <View
                                                      style={{
                                                        borderBottomColor: '#fff',
                                                        borderBottomWidth: 1,
                                                      }}
                                                    />
                                                  </View>
                                        })}
                                        </CollapseBody>
                                      </Collapse>
                                    </View>
                      })
                    }
                    </>
                }
                {data.d_3_s.length == 0 ? null :
                  <>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text  style={styles.top_text}>Sports Pack - Simples</Text>
                    </View>
                    {
                      data.d_3_s.map((e, i) => { 
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
                                                <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} </Text>
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
                      })
                    }
                    </>
                }
                {data.d_3_c.length == 0 ? null :
                  <>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text  style={styles.top_text}>Sports Pack - Combinadas</Text>
                    </View>
                    {
                      data.d_3_c.map((e, i) => { 
                            return <View key={i} style={{flex: 1}}>
                                      <Collapse onToggle={(evt) => setButton(evt)}>
                                        <CollapseHeader  style={styles.colapse_header2}>
                                          <View style={styles.container_tab}>
                                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                              <Text style={styles.textCard}>COMBINADAS #{i + 1}</Text>
                                            </View>
                                          </View>
                                        </CollapseHeader>
                                        <CollapseBody style={styles.colapsed_body}>
                                        {e.childs.map((e, i) => {
                                          return  <View key={i} style={styles.container_riders}>
                                                    <View style={styles.colapsed_body}>
                                                      <View style={styles.container_body}>
                                                        <View style={{width:'100%'}}>
                                                          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                            <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                                            <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} </Text>
                                                            <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                                            {e.extra !== null ? 
                                                              (
                                                                <>
                                                                  <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                                                  <Text style={styles.text_forecast8}>{e.extra}</Text>
                                                                </>
                                                              )
                                                              :
                                                              null
                                                            }
                                                            
                                                          </View>
                                                        </View>
                                                      </View>
                                                    </View>
                                                    <View
                                                      style={{
                                                        borderBottomColor: '#fff',
                                                        borderBottomWidth: 1,
                                                      }}
                                                    />
                                                  </View>
                                        })}
                                        </CollapseBody>
                                      </Collapse>
                                    </View>
                      })
                    }
                    </>
                }
                {data.d_1_s.length == 0 ? null :
                    <>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text  style={styles.top_text}>Plan General - Simples</Text>
                    </View>
                    {
                      data.d_1_s.map((e, i) => { 
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
                                                <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} </Text>
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
                      })
                    }
                    </>
                }
                {data.d_1_c.length == 0 ? null :
                    <>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text  style={styles.top_text}>Plan General - Combinadas</Text>
                    </View>
                    {
                      data.d_1_c.map((e, i) => { 
                            return <View key={i} style={{flex: 1}}>
                                      <Collapse onToggle={(evt) => setButton(evt)}>
                                        <CollapseHeader  style={styles.colapse_header2}>
                                          <View style={styles.container_tab}>
                                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                              <Text style={styles.textCard}>COMBINADAS #{i + 1}</Text>
                                            </View>
                                          </View>
                                        </CollapseHeader>
                                        <CollapseBody style={styles.colapsed_body}>
                                        {e.childs.map((e, i) => {
                                          return  <View key={i} style={styles.container_riders}>
                                                    <View style={styles.colapsed_body}>
                                                      <View style={styles.container_body}>
                                                        <View style={{width:'100%'}}>
                                                          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                            <Text style={styles.text_forecast1}>{e.competition_name}</Text>
                                                            <Text style={styles.text_forecast2}>{e.team1.name} - {e.team2.name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast3}>{e.competition_name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast4}>{e.forecast_type.name}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast5}>{e.casa_apuesta_name} </Text>
                                                            <Text style={styles.text_forecast6}>Cuota {e.cuota_decimal} / Stake {e.stake}</Text>
                                                            {e.extra !== null ? 
                                                              (
                                                                <>
                                                                  <Text numberOfLines={1} style={[styles.text_forecast7, {marginTop: 20}]}>Análisis</Text>
                                                                  <Text style={styles.text_forecast8}>{e.extra}</Text>
                                                                </>
                                                              )
                                                              :
                                                              null
                                                            }
                                                            
                                                          </View>
                                                        </View>
                                                      </View>
                                                    </View>
                                                    <View
                                                      style={{
                                                        borderBottomColor: '#fff',
                                                        borderBottomWidth: 1,
                                                      }}
                                                    />
                                                  </View>
                                        })}
                                        </CollapseBody>
                                      </Collapse>
                                    </View>
                      })
                    }
                    </>
                    
                }
                {data.d_2.length == 0 ? null :
                    <>
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text  style={styles.top_text}>Club Riders</Text>
                      </View>
                      {
                        data.d_2.map((e, i) => { 
                              return <View key={i} style={{flex: 1}}>  
                                        <Collapse onToggle={(evt) => setButton(evt)}>
                                          <CollapseHeader  style={styles.colapse_header}>
                                          <ImageBackground source={require('../../assets/img/jpg/Hipismo.jpg')} style={{width: '100%', height: '100%'}}>
                                          <View style={{width: '100%', height: '100%', backgroundColor: '#262222', opacity: .5}}>
                                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', opacity: .9}}>
                                              <Text style={styles.textCard}>{e.name}</Text>
                                            </View>
                                          </View>
                                          </ImageBackground>
                                          </CollapseHeader>
                                          <CollapseBody style={styles.colapsed_body}>
                                          {e.forecasts.map((e, i) => {
                                            return  <View key={i} style={styles.container_riders}>
                                                      <View style={{width:'100%',alignItems:'flex-start', justifyContent: 'center', borderBottomColor: '#fff', borderBottomWidth: 1,}}>
                                                      <Text numberOfLines={1} style={styles.text_forecast9}>Carrera {e.race_number}</Text>
                                                            <Text numberOfLines={1} style={[styles.text_forecast10, {marginTop: 20}]}>1er Favorito #{e.favorito1}</Text>
                                                            <Text numberOfLines={1} style={styles.text_forecast11}>2do Favorito #{e.favorito2}</Text>
                                                            <Text numberOfLines={1} style={[styles.text_forecast11, {marginBottom: 20}]}>3er Favorito #{e.favorito3}</Text>
                                                      </View>
                                                    </View>
                                          })}
                                          </CollapseBody>
                                        </Collapse>
                                      </View>
                        })
                      }
                    </>
                }
              </>
             }
              
              
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
  textCard:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 19
  },
  colapse_header2: {
    flexDirection:'row',
    alignItems:'center',
    margin:10,
    backgroundColor:'#01CD01',
    borderRadius: 20, 
    justifyContent: 'center', 
    height: 150,
    zIndex: 1
  },
  colapse_header: {
    flexDirection:'row',
    alignItems:'center',
    margin:10,
    backgroundColor:'#262222',
    borderRadius: 20, 
    justifyContent: 'center', 
    height: 150,
    zIndex: 1
  },
  container_tab:{
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 30, 
    zIndex: 2  
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 30,   
    opacity: .4
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 20
  },
  signIn: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row'
  },
  textSign: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
});

