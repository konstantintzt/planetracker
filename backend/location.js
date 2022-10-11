const axios = require("axios")
const dotenv = require("dotenv")
const database = require("./database")
const planes = require("./planes")

// Receives location as a string
async function getPlaneDataForLocation(location, API_KEY) {
    var coordinates = undefined
    const locationInDatabase = await isLocationInDatabase(location)
    if (locationInDatabase.success) coordinates = locationInDatabase
    else coordinates = await getCoordinatesFromLocation(location, API_KEY)
    
    const closePlanes = await planes.getPlanesNearCoordinates(coordinates.location.lat, coordinates.location.lng, location)
    return closePlanes

}

// Geocoding API wrapper, returns set of coordinates from location string
async function getCoordinatesFromLocation(location, API_KEY) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`)
    if (response.status != 200) {
        return { success: false, location: undefined}
    } else {
        const coords = response.data.results[0].geometry.location
        await database.insertRow("locations", "(`location`,`lat`, `lng`)", [location, coords.lat, coords.lng])
        return { success: true, location: coords}
    }
}

async function isLocationInDatabase(location) {
    const result = await database.fetchRow("locations", "`location` = ?", [location])
    if (result != undefined) return { success: true, location: { lat: result.lat, lng: result.lng }}
    else return { success: false, location: undefined }
}
exports.getPlaneDataForLocation = getPlaneDataForLocation