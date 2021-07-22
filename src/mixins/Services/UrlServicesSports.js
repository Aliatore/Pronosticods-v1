export default function UrlServicesSports(el) {
    let sport_url = ""
    if (el !== undefined || el !== null || el !== "") { 
        sport_url = `https://www.thesportsdb.com/api/v2/json/4013017/livescore.php?s=${el}`;
    }else{
        console.log("err");
    }
    return sport_url;
}

