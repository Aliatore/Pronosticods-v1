import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native';
import { Portal, Dialog } from 'react-native-paper';
import { Spinner } from 'native-base';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Noticias from '../../mixins/Noticias';
import Videos from '../../mixins/N_Videos';
import Banner from '../../mixins/Banner';
import UrlServices from '../../mixins/Services/UrlServices';
import { AuthContext } from '../../components/context';
const HomeScreen = ({navigation}) => {

  const [data, setData] = React.useState({
    client_token: '',
    client_data: '',
    data_news: null,
    data_video: null,
    error_message: '',
    page: 1,
    date_today: '',
    data_banner: ''
  });

  const theme = useTheme();
  const { signOut, toggleTheme, signIn } = React.useContext(AuthContext);
  //obtain the token with asyncstorage and set in state data.
  const obtainToken = async () => {
    try {
        const value = await AsyncStorage.getItem('userToken');
        const value2 = await AsyncStorage.getItem('dataUser');
        const valueParsed = JSON.parse(value2);
        getNews(value, value2)
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
  //api call news
  const getNews = (token_user, data_user) => {   
    let urlApi = UrlServices(1);
    setVisible(true)
    let dateToday = getDate()

    const requestOne = axios({
        method: 'get',
        url: `${urlApi}/noticias`,
        timeout: 9000,
        params: {
            limit: 3,
            page: data.page
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
    });
    const requestTwo = axios({
        method: 'get',
        url: `${urlApi}/videos`,
        timeout: 9000,
        params: {
            limit: 3,
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
        },
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
                axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
                    const responseOne = responses[0].data.data;
                    const responseTwo = responses[1].data.data;

                    console.log(responseOne);
                    console.log(responseTwo);
                    
                    if (responses[0].status === 200 || responses[0].status === 201 && responses[1].status === 200 || responses[1].status === 201) {
                        setVisible(false)
                        setData({
                            ...data,
                            data_news: responseOne,
                            data_video: responseTwo,
                            client_token: token_user,
                            client_data: JSON.parse(data_user),
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

//   const scrollCall = ({layoutMeasurement, contentOffset, contentSize}) => {
//     const paddingToBottom = 1;
//     return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
//   }

  //this hook calls the token function
  useEffect(() => {
    obtainToken()
  }, []);

  //state hooks for popups
  const [visible, setVisible] = React.useState(true);
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
            <Banner 
                allData={data.client_data}
            />
            <Noticias 
                dataNews={data.data_news}
            />
            <View style={{backgroundColor: '#131011', marginTop: 10, borderRadius: 5}}>
                <Videos 
                    dataVideo={data.data_video}
                />
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

export default HomeScreen;
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
        backgroundColor: '#131011',
        borderRadius: 5
   },
});


