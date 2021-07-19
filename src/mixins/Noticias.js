import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Linking} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const Noticias = ({dataNews}) => {

    const openLink = (url) => {
        // console.log('abriendo link');
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
              Linking.openURL(url);
            } else {
              console.log("Don't know how to open URI: " + url);
            }
        });
    }

    // console.log(dataNews);


    if (dataNews !== null && dataNews !== '') {
        return(
            dataNews.map((e, i) => {
                return <View key={i} style={styles.card}>
                            <Card style={styles.card} onPress={() => openLink(e.url)}>
                                <Card.Cover style={styles.card_cover} source={{ uri: e.imagen }} />
                                <Card.Content>
                                    <Title numberOfLines={1} style={styles.title_text}>{e.titulo.toUpperCase()}</Title>
                                    <Paragraph numberOfLines={1} style={styles.paragraph_white}>{e.subtitulo.toUpperCase()}</Paragraph>
                                    {/* <Paragraph numberOfLines={1} style={styles.paragraph_grey}>{e.url}</Paragraph> */}
                                </Card.Content>
                            </Card>
                        </View>
            })
        )
    }else{
        return(
            <View style={styles.card}>
                <Card style={styles.card}>
                    <Card.Cover style={styles.card_cover} source={require('../assets/img/png/special.png')} />
                    <Card.Content>
                        <Title style={styles.title_text}>Sin resultados</Title>
                        <Paragraph style={styles.paragraph_white}>Sin resultados</Paragraph>
                        {/* <Paragraph style={styles.paragraph_grey}>Sin resultados</Paragraph> */}
                    </Card.Content>
                </Card>
            </View>
        )
    }

}

export default Noticias;
let widthScreen = Dimensions.get('window').width / 1.04
const styles = StyleSheet.create({
    card:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
        marginTop: 10,
        backgroundColor: '#131011',
        borderRadius: 5
    },
    card_cover:{
        marginLeft: 25, 
        marginTop: 15, 
        marginRight: 25, 
        borderRadius: 5
    },
    title_text:{
        color: '#01CD01',
        fontFamily: 'Montserrat-Regular',
        fontSize: 20,
        marginTop: 20,
        marginLeft: 10
    },
    paragraph_white:{
        color: '#fff',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        marginTop: 2,
        marginLeft: 10,
        marginBottom: 18
    },
    paragraph_grey:{
        color: '#8e8e8e',
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
    },
})
