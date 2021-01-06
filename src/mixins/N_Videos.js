import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Linking} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

const Video_N = ({dataVideo}) => {

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

    // console.log(dataVideo);


    if (dataVideo !== null && dataVideo !== '') {
        return(
            dataVideo.map((e, i) => {
                return <View key={i} style={styles.card1}>
                            <Card style={styles.card} elevation={0} onPress={() => openLink(e.url_video ? e.url_video : '')}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                        <Card.Cover style={styles.card_cover} source={{ uri: e.imagen_preview_url }} />
                                    </View>
                                    <View style={{flex: 2}}>
                                        <Card.Content>
                                            <Title numberOfLines={1} style={styles.text_all}>{e.titulo ? e.titulo.toUpperCase() : ''}</Title>
                                            <Paragraph numberOfLines={1} style={styles.text_all}>{e.subtitulo ? e.subtitulo.toUpperCase() : ''}</Paragraph>
                                            {/* <Paragraph numberOfLines={1} style={styles.paragraph_grey}>{e.url}</Paragraph> */}
                                        </Card.Content>
                                    </View>
                                </View>
                            </Card>
                        </View>
            })
        )
    }else{
        return(
            <View style={styles.card1}>
                <Card style={styles.card} elevation={0}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Card.Cover style={styles.card_cover} source={{ uri: 'https://picsum.photos/700' }} />
                        </View>
                        <View style={{flex: 2}}>
                            <Card.Content>
                                <Title style={styles.title_text}>Sin resultados</Title>
                                <Paragraph style={styles.paragraph_white}>Sin resultados</Paragraph>
                                {/* <Paragraph style={styles.paragraph_grey}>Sin resultados</Paragraph> */}
                            </Card.Content>
                        </View>
                    </View>
                </Card>
            </View>
        )
    }

}

export default Video_N;
let widthScreen = Dimensions.get('window').width / 1.04
const styles = StyleSheet.create({
    card1:{
        flex: 1, 
        justifyContent: 'center', 
        alignContent: 'center',
        width: widthScreen,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#131011',
        borderRadius: 5
    },
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
        marginLeft: 15,   
        borderRadius: 5,
        height: 100,
        width: 'auto',
        borderRadius: 5
    },
    text_all:{
        color: '#fff',
        // fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        marginLeft: 5
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
