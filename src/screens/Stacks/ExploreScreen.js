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
import { Thumbnail, List, ListItem, Separator } from 'native-base';

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
  });

  const [country, setCountrys] = useState();

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
  const setCountry = (e) => {
    console.log(e);
    setCountrys(e)
    getForecasts(e)
      
  }
  //api call news
  const getForecasts = (sport) => {   
    console.log(sport);
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
                      // console.log(response.data, "aqui");
                      setVisible(false)
                      setData({
                          ...data,
                          data_pronosticos: response.data,
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
            <View style={styles.top}>
                <Card style={styles.card}>
                  <View style={styles.action_picker}>
                    <SelectPicker
                        selectedValue={country}
                        style={styles.picker}
                        mode={'dialog'}
                        onValueChange={(e) => setCountry(e)}
                    >
                        <SelectPicker.Item disabled value="" label="Deporte" />
                        <SelectPicker.Item value="1" label="Fútbol" />
                        <SelectPicker.Item value="2" label="Básquet" />
                        <SelectPicker.Item value="3" label="Fútbol Americano" />
                        <SelectPicker.Item value="4" label="Hockey" />
                        <SelectPicker.Item value="5" label="Béisbol" />
                    </SelectPicker>
                  </View>
                </Card>
              </View>
            <View style={styles.bot}>
              <View style={{marginTop: 20}}>
                <Collapse onToggle={(e) => setButton(e)}>
                  <CollapseHeader  style={styles.colapse_header}>
                    <View style={{width:'25%',alignItems:'center'}}>
                      <Thumbnail source={require('../../assets/img/png/spain.png')} />
                    </View>
                    <View style={{width:'60%'}}>
                      <Text style={{color:'#fff'}}>La Liga Santander</Text>
                    </View>
                    <View style={styles.custom_icons}>
                      <Text style={styles.counter_green}>(10)</Text>
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
                    <View style={styles.container_body}>
                      <View style={{width:'25%',alignItems:'flex-start', justifyContent: 'center', borderRightColor: '#fff', borderRightWidth: 1,}}>
                        <Text style={{color:'#fff'}}>10:30 am</Text>
                        <Text style={[styles.red_text, {paddingTop: 5}]}>Terminó</Text>
                      </View>
                      <View style={{width:'60%'}}>
                        <View style={{paddingLeft: 20}}>
                          <Text style={{color:'#fff'}}>Bayer Munchen</Text>
                          <Text style={{color:'#fff', paddingTop: 5}}>Borussia Dormunt</Text>
                        </View>
                      </View>
                      <View style={{ width:'15%', alignItems: 'flex-end'}}>
                        <View style={{paddingLeft: 20}}>
                          <Text style={{color:'#fff'}}>1</Text>
                          <Text style={{color:'#fff', paddingTop: 5}}>0</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.container_body}>
                      <View style={{width:'25%',alignItems:'flex-start', justifyContent: 'center', borderRightColor: '#fff', borderRightWidth: 1,}}>
                        <Text style={{color:'#fff'}}>10:30 am</Text>
                        <Text style={[styles.green_text, {paddingTop: 5}]}>En vivo</Text>
                      </View>
                      <View style={{width:'60%'}}>
                        <View style={{paddingLeft: 20}}>
                          <Text style={{color:'#fff'}}>Bayer Munchen</Text>
                          <Text style={{color:'#fff', paddingTop: 5}}>Borussia Dormunt</Text>
                        </View>
                      </View>
                      <View style={{ width:'15%', alignItems: 'flex-end'}}>
                        <View style={{paddingLeft: 20}}>
                          <Text style={{color:'#fff'}}>1</Text>
                          <Text style={{color:'#fff', paddingTop: 5}}>0</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.container_body}>
                      <View style={{width:'25%',alignItems:'flex-start', justifyContent: 'center', borderRightColor: '#fff', borderRightWidth: 1,}}>
                        <Text style={{color:'#fff'}}>1:30 pm</Text>
                        {/* <Text style={[styles.green_text, {paddingTop: 5}]}>En vivo</Text> */}
                      </View>
                      <View style={{width:'60%'}}>
                        <View style={{paddingLeft: 20}}>
                          <Text style={{color:'#fff'}}>Bayer Munchen</Text>
                          <Text style={{color:'#fff', paddingTop: 5}}>Borussia Dormunt</Text>
                        </View>
                      </View>
                      <View style={{ width:'15%', alignItems: 'flex-end'}}>
                        <View style={{paddingLeft: 20}}>
                          <Text style={{color:'#fff'}}>0</Text>
                          <Text style={{color:'#fff', paddingTop: 5}}>0</Text>
                        </View>
                      </View>
                    </View>
                  </CollapseBody>
                </Collapse>
              </View>
              {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.text_title}>Seleccione para continuar</Text>
                  
              </View>     */}
              {/* <List.Section>
                <List.Accordion
                  style={{backgroundColor: '#262222', color: '#fff'}}
                  title="Bundesliga"
                  titleStyle={{color: '#fff'}}
                  theme={{ colors: { primary: '#4169e1' } }}
                  left={props => <Image {...props} style={styles.card_img} source={require('../../assets/img/png/barcelona.png')} />}
                  right={props => <Image {...props}  style={styles.card_img} source={require('../../assets/img/png/barcelona.png')} />}
                >
                  <List.Item  style={{backgroundColor: '#262222', color: '#fff'}} titleStyle={{color: '#fff'}} 
                    title={
                      <View style={{flex: 1, flexDirection: 'row', width: '100%'}}>
                        <View style={{flex: 1, backgroundColor: 'red'}}>
                          <Text style={styles.text_title}>1</Text>
                          
                        </View>
                        <View style={{flex: 1, backgroundColor: 'blue'}}>
                          <Text style={styles.text_title}>1</Text>

                        </View>
                        <View style={{flex: 1, backgroundColor: 'yellow'}}>
                          <Text style={styles.text_title}>1</Text>

                        </View>
                          
                      </View>
                    } 

                  />
                </List.Accordion>
              </List.Section> */}
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
    marginTop: 50
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
});


