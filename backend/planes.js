const axios = require("axios")
const database = require("./database")

const offset = 0.5

async function getPlanesNearCoordinates(lat, lng, location){

    lat = parseFloat(lat)
    lng = parseFloat(lng)


    const response = await axios.get(`https://opensky-network.org/api/states/all?lamin=${lat-offset}&lamax=${lat+offset}&lomin=${lng-offset}&lomax=${lng+offset}`)

    if (response.status != 200) {
        return { success: false, response: undefined}
    } else {
        const planeInfo = await getInformationAboutPlane(response.icao24)
        return { success: true, response: response.data, plane: planeInfo}
    }
}


async function getInformationAboutPlane(icao24) {
    const result = await database.fetchRow("planes", "`icao24` = ?", [icao24]) 
    return result
}

exports.getPlanesNearCoordinates = getPlanesNearCoordinates
