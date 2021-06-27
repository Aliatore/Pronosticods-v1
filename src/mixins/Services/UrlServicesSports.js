export default function UrlServicesSports(el) {
    let sport_url = ""
    switch (el) {
        case '1':
            sport_url = "https://dev.pronosticodds.com/api/v2/json/4013017/livescore.php?s=Soccer";
            break
        case '2':
            sport_url = "https://dev.pronosticodds.com/api/v2/json/4013017/livescore.php?s=Basketball";
            break
        case '3':
            sport_url = "https://dev.pronosticodds.com/api/v2/json/4013017/livescore.php?s=American%20Football";
            break
        case '4':
            sport_url = "https://dev.pronosticodds.com/api/v2/json/4013017/livescore.php?s=Ice_Hockey";
            break
        case '5':
            sport_url = "https://dev.pronosticodds.com/api/v2/json/4013017/livescore.php?s=Baseball";
            break
        default:
            sport_url = "https://admin.pronosticodds.com/api";
            break
    }
    return sport_url;
}

