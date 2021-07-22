import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Portal, Text, Dialog, Card } from 'react-native-paper';
import { Spinner } from 'native-base'
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import Feather2 from 'react-native-vector-icons/Feather';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import UrlServicesSports from '../../mixins/Services/UrlServicesSports';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail } from 'native-base';

const ExploreScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    client_token: '',
    data_news: null,
    data_video: null,
    error_message: '',
    page: 1,
    date_today: '',
    sport: '',
    sport_selected: '',
    country: null,
    data_pronosticos: null,
    view_arrow: null,
    is_visible: false,
  });

  const [deporte, setDesportes] = useState();

  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);

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
  const getDateToShow = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    if(date<10)date='0'+date; //agrega cero si el menor de 10
    if(month<10)month='0'+month; //agrega cero si el menor de 10
    let monthText = "";
    switch (month) {
      case '01':
        monthText = "Enero";
        break;
      case '02':
        monthText = "Febrero";
        break;
      case '03':
        monthText = "Marzo";
        break;
      case '04':
        monthText ="Abril";
        break; 
      case '05':
        monthText = "Mayo";
        break;
      case '06':
        monthText = "Junio";
        break;
      case '07':
        monthText = "Julio";
        break;
      case '08':
        monthText = "Agosto";
        break;
      case '09':
        monthText = "Septiembre";
        break;
      case '10':
        monthText = "Octubre";
        break;
      case '11':
        monthText = "Noviembre";
        break;
      case '12':
        monthText = "Diciembre";
        break;
      default:
        break;
    }

    return `${date} de ${monthText} del ${year}`;//format: dd-mm-yyyy;
  }
  const setDeporte = (e) => {
    console.log(e);
    setDesportes(e);
    getForecasts(e);
  }
  //api call news
  const getForecasts = (sport) => {   
    console.log("quewea es esto", sport);
    let urlApi = UrlServicesSports(sport);
    setVisible(true)
    let dateToday = getDate()

    NetInfo.fetch().then(state => {
        // console.log(state.isConnected);
        if (state.isConnected === true){
            if (data.client_token.length === 0) {
                setVisible(false)
                setAlert(true)
                setData({
                    ...data,
                    error_message: `Error al obtener el token del usuario, intente nuevamente`
                })
            } else {
              axios({
                method: 'get',
                url: `${urlApi}`,
                timeout: 9000,
                params: {
                    limit: 10,
                    date: dateToday
                },
                // data: {
                // },
                headers: {
                  'Authorization': `Bearer ${data.client_token}`,
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
                console.log(response);
                  if (response.status === 200 || response.status === 201) {
                      // console.log('correcto');
                      console.log(response.data, "aqui data");
                      setVisible(false)
                      if (response.data.events === null || response.data.events === undefined || response.data.events === '' ) {
                        setVisible(false)
                        setAlert(true)
                        setData({
                            ...data,
                            data_pronosticos: '',
                            is_visible: false,
                            error_message: `No hay juegos disponibles`
                        })
                      }else{
                        const newDirectory = Object.values(response.data.events.reduce((acc, item) => {
                          if (!acc[item.idLeague]) acc[item.idLeague] = {
                              id: item.idLeague,
                              league_name: item.strLeague, 
                              league_logo: item.strHomeTeamBadge, 
                              info: []
                          };
                          acc[item.idLeague].info.push(item);
                          return acc;
                        }, {}))
                        console.log("nuevo beta", newDirectory);
                        setData({
                          ...data,
                          data_pronosticos: newDirectory,
                          is_visible: true,
                        })
                      }
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

  const parseTime = (timex) => {
    var time = timex; 
    time = time.split(':')
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var timeValue;
    
    if (hours > 0 && hours <= 12) {
      timeValue= "" + hours;
    } else if (hours > 12) {
      timeValue= "" + (hours - 12);
    } else if (hours == 0) {
      timeValue= "12";
    }
     
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeValue += (hours >= 12) ? " pm" : " am";

    // show
    return timeValue;
}
  const parseTimeConditional = (timex) => {
    var time = timex; 
    time = time.split(':')
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var timeValue;
    
    if (hours > 0 && hours <= 12) {
      timeValue= "" + hours;
    } else if (hours > 12) {
      timeValue= "" + (hours - 12);
    } else if (hours == 0) {
      timeValue= "12";
    }
     
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeValue += (hours >= 12) ? " pm" : " am";

    var hoursA = new Date().getHours();
    var minA = new Date().getMinutes();

    var timeValueA;
    
    if (hoursA > 0 && hoursA <= 12) {
      timeValueA= "" + hoursA;
    } else if (hoursA > 12) {
      timeValueA= "" + (hoursA - 12);
    } else if (hoursA == 0) {
      timeValueA= "12";
    }

    timeValueA += (minA < 10) ? ":0" + minA : ":" + minA;
    timeValueA += (hoursA >= 12) ? " pm" : " am";
    

    if (timeValueA === timeValue) {
      return 'igual';
    } else if (timeValueA > timeValue){
      return 'mayor';
    } else if (timeValueA < timeValue){
      return 'menor';
    } else {
      return null;
    }
   

    // show
    // return timeValue;
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
            <View style={styles.top}>
                <Card style={styles.card}>
                  <View style={styles.action_picker}>
                    <SelectPicker
                        selectedValue={deporte}
                        style={styles.picker}
                        mode={'dialog'}
                        onValueChange={(e) => setDeporte(e)}
                    >
                        <SelectPicker.Item disabled value="" label="Deporte" />
                        <SelectPicker.Item value="Soccer" label="Fútbol" />
                        <SelectPicker.Item value="Basketball" label="Básquet" />
                        <SelectPicker.Item value="American%20Football" label="Fútbol Americano" />
                        <SelectPicker.Item value="Ice_Hockey" label="Hockey" />
                        <SelectPicker.Item value="Baseball" label="Béisbol" />
                    </SelectPicker>
                  </View>
                </Card>
              </View>
            <View style={styles.bot}>
            {data.is_visible === false && data.data_pronosticos === null || data.data_pronosticos === undefined || data.data_pronosticos === "" ? 
              (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text  style={styles.top_text}>No hay fechas disponibles</Text>
                </View>
              )
              :
              (
                <>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text  style={styles.top_text}>{getDateToShow()}</Text>
                  </View>
                  {data.data_pronosticos.map((e, i) => {
                      return <View key={i} style={{marginTop: 20}}>
                              <Collapse onToggle={(e) => setButton(e)}>
                                <CollapseHeader  style={styles.colapse_header}>
                                  <View style={{width:'25%',alignItems:'center'}}>
                                    <Thumbnail style={{height: 70, resizeMode: 'contain'}} source={{uri: data.league_logo}} />
                                  </View>
                                  <View style={{width:'60%'}}>
                                    <Text style={{color:'#fff'}}>{e.league_name}</Text>
                                  </View>
                                  <View style={styles.custom_icons}>
                                    <Text style={styles.counter_green}>({e.info.length})</Text>
                                    {data.view_arrow == true ?
                                        <Feather2 
                                            name="chevron-up"
                                            size={20}
                                            style={{color: "#fff", marginLeft: 10}}
                                        />
                                    :
                                        <Feather2 
                                            name="chevron-down"
                                            size={20}
                                            style={{color: "#fff", marginLeft: 10}}
                                        />
                                    } 
                                  </View>
                                </CollapseHeader>
                                <CollapseBody style={styles.colapsed_body}>
                                {e.info.map((e, i) => {
                                  return <View key={i} style={styles.container_body}>
                                          <View style={{width:'25%',alignItems:'flex-start', justifyContent: 'center', borderRightColor: '#fff', borderRightWidth: 1,}}>
                                            <Text style={{color:'#fff'}}>{parseTime(e.strEventTime)}</Text>
                                            <Text style={[styles.green_text, {paddingTop: 5}]}> {parseTimeConditional(e.strEventTime) === 'igual' ? "En vivo" : ''}</Text>
                                            <Text style={[styles.red_text, {paddingTop: 5}]}> {parseTimeConditional(e.strEventTime) === 'mayor' ? "Termino" : ''}</Text>
                                          </View>
                                          <View style={{width:'60%'}}>
                                            <View style={{paddingLeft: 20}}>
                                              <Text style={{color:'#fff'}}>{e.strHomeTeam}</Text>
                                              <Text style={{color:'#fff', paddingTop: 5}}>{e.strAwayTeam}</Text>
                                            </View>
                                          </View>
                                          <View style={{ width:'15%', alignItems: 'flex-end'}}>
                                            <View style={{paddingLeft: 20}}>
                                              <Text style={{color:'#fff'}}>{e.intHomeScore}</Text>
                                              <Text style={{color:'#fff', paddingTop: 5}}>{e.intAwayScore}</Text>
                                            </View>
                                          </View>
                                        </View>
                                })}
                                </CollapseBody>
                              </Collapse>
                            </View>
                  })}
                </>
              )
            
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

export default ExploreScreen;

let widthScreen = Dimensions.get('window').width / 1.04
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
    backgroundColor: '#262222',
    borderRadius: 5
   },
   action_picker: {
    flexDirection: 'row',
    color: '#fff',
    backgroundColor: '#262222',
    borderColor: '#262222',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 10
  },
  picker: {
    height: 30, 
    width: '100%', 
    paddingBottom: 5,
    marginBottom: 7,
    marginTop: -5,
    color: '#fff',
  },
  top: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  bot: {
    flex: 2, 
    marginTop: 10
  },
  text_title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
  text_title_accordion: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
  card_img: {
    width: 100,
    height: 50,
    resizeMode: 'contain'
  },
  colapse_header: {
    flexDirection:'row',
    alignItems:'center',
    padding:10,
    backgroundColor:'#262222'
  },
  counter_green: {
      color:'#01CD01',
  },
  colapsed_body: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'column',
    backgroundColor:'#262222', 
  },
  container_body:{
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  custom_icons: {
    width:'15%', 
    alignItems: 'flex-end', 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center'
  },
  red_text: {
    color: 'red'
  },
  green_text: {
    color: 'green'
  },
  top_text:{
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left'
  },
});


