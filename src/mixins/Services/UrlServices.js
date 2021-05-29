export default function UrlServices(environment) {
    let groceryURL = ""
    switch (environment) {
        case 1:
            groceryURL = "https://admin.pronosticodds.com/api";
            break
        case 2:
            groceryURL = "https://admin.pronosticodds.com/api";
            break
        case 3:
            groceryURL = "http://dev.pronosticodds.com/api";
            break
        case 4:
            groceryURL = "http://admin.pronosticodds.com";
            break
        default:
            groceryURL = "https://admin.pronosticodds.com/api";
            break
    }
    return groceryURL;
}

