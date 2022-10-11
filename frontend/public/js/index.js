const inTheAirIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z" /></svg>'
const onTheGroundIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M14.97,5.92C14.83,5.41 14.3,5.1 13.79,5.24L10.39,6.15L5.95,2.03L4.72,2.36L7.38,6.95L4.19,7.8L2.93,6.82L2,7.07L3.66,9.95L14.28,7.11C14.8,6.96 15.1,6.43 14.97,5.92M21,10L20,12H15L14,10L15,9H17V7H18V9H20L21,10M22,20V22H2V20H15V13H20V20H22Z" /></svg>'


function fetchPlaneData() {
    const location = encodeURIComponent(document.getElementById("location").value)
    fetch("http://planes.tzantchev.com:2022/locate?location="+location)
    .then(res => res.json())
    .then(data => {
        const instant = data.response.time
        const planes = data.response.states
        const planesListUI = document.getElementById("planes")
        const timeUI = document.getElementById("time")

        console.log(instant);

        timeUI.innerHTML = new Date(instant*1000).toDateString()

        planesListUI.innerHTML = ""

        for (let plane of planes) {
            planesListUI.innerHTML = planesListUI.innerHTML + generatePlaneCard(plane)
        }

    })
}

function generatePlaneCard(data) {    
    const processedData = processPlaneData(data)

    if (processedData.onGround) 
        var statusIcon = onTheGroundIcon
    else (processedData.onGround) 
        var statusIcon = inTheAirIcon

    if (processedData.countryISO != undefined)
        var flagImage = '<img src="https://flagcdn.com/'+processedData.countryISO.toLowerCase()+'.svg" width="40" alt="'+processedData.originCountry+'">     '
    else
        var flagImage = ''

    const callsign = processedData.callsign
    const coords = [processedData.latitude, processedData.longitude]

    const geoAltitude = processedData.geoAltitude
    const velocity = processedData.velocity
    const verticalRate = processedData.verticalRate

    const lastContact = processedData.lastContact


    const firstLine = generateLine([
        ["flag", undefined, flagImage],
        ["Callsign", callsign, undefined],
        ["statusIcon", undefined, statusIcon],
        [undefined, coords, undefined],
        ["ICAO24", processedData.icao24, undefined]
    ])
    const secondLine = generateLine([
        ["Altitude", geoAltitude, "m"],
        ["Velocity", velocity, "m/s"],
        ["Climbing rate", verticalRate, "m/s"]
    ])
    const thirdLine = generateLine([
        ["Last Contacted", new Date(lastContact*1000).toISOString().replace("T", " @ ").replace("Z", "").slice(0, -4) + " UTC", undefined]
    ])
    const fourthLine = '<div style="padding: 5px"><a href="https://www.planespotters.net/search?q='+processedData.icao24+'" target="_blank" type="button" class="btn btn-secondary">See plane info</><i class="fa-solid fa-up-right-from-square"></i></div>'

    return '<li class="list-group-item">'+firstLine+secondLine+thirdLine+fourthLine+'</li>'

}

function generateLine(data) {

    var line = '<div style="padding: 5px">'

    for (triple of data) {
        const name = triple[0]
        const value = triple[1]
        const unit = triple[2]

        if (name == "flag") {
            line = line.concat(unit)
        }
        else if (name == "statusIcon") {
            line = line.concat(unit)
            line = line.concat(' | ')
        }
        else if (name == undefined) {
            line = line.concat(value)
            if (unit != undefined)
                line = line.concat(' '+unit)
            line = line.concat(' | ')
        } 
        else if (value != undefined && value != "") {
            line = line.concat('<b>'+name+':</b> ')
            line = line.concat(value)
            if (unit != undefined)
                line = line.concat(' '+unit)
            line = line.concat(' | ')
        } 
        
    }

    if (line.endsWith(" | ")) line =line.slice(0,-3)

    line = line.concat('</div>')

    return line
}

function processPlaneData(data) {
    var dataArray = data.toString().split(",")
    const processedData = {
        icao24: dataArray[0],
        callsign: dataArray[1],
        originCountry: dataArray[2],
        timePosition: dataArray[3],
        lastContact: dataArray[4],
        longitude: dataArray[5],
        latitude: dataArray[6],
        barometricAltitude: dataArray[7],
        onGround: dataArray[8],
        velocity: dataArray[9],
        trueTrack: dataArray[10],
        verticalRate: dataArray[11],
        sensors: dataArray[12],
        geoAltitude: dataArray[13],
        squawk: dataArray[14],
        spi: dataArray[15],
        positionSource: dataArray[16],
        category: dataArray[17],
        countryISO: getCountryISOFromName(dataArray[2].toUpperCase())
    }

    return processedData
}

function getCountryISOFromName(name) {
    var ISOcodes = {
        "AFGHANISTAN": "AF",
        "ALBANIA": "AL",
        "ALGERIA": "DZ",
        "AMERICAN SAMOA": "AS",
        "ANDORRA": "AD",
        "ANGOLA": "AO",
        "ANTARCTICA": "AQ",
        "ANTIGUA AND BARBUDA": "AG",
        "ARGENTINA": "AR",
        "ARMENIA": "AM",
        "ARUBA": "AW",
        "AUSTRALIA": "AU",
        "AUSTRIA": "AT",
        "AZERBAIJAN": "AZ",
        "BAHAMAS": "BS",
        "BAHRAIN": "BH",
        "BANGLADESH": "BD",
        "BARBADOS": "BB",
        "BELARUS": "BY",
        "BELGIUM": "BE",
        "BELIZE": "BZ",
        "BENIN": "BJ",
        "BERMUDA": "BM",
        "BHUTAN": "BT",
        "BOLIVIA": "BO",
        "BOSNIA AND HERZEGOVINA": "BA",
        "BOTSWANA": "BW",
        "BOUVET ISLAND": "BV",
        "BRAZIL": "BR",
        "BRITISH INDIAN OCEAN TERRITORY": "IO",
        "BRUNEI DARUSSALAM": "BN",
        "BULGARIA": "BG",
        "BURKINA FASO": "BF",
        "BURUNDI": "BI",
        "CAMBODIA": "KH",
        "CAMEROON": "CM",
        "CANADA": "CA",
        "CAPE VERDE": "CV",
        "CAYMAN ISLANDS": "KY",
        "CENTRAL AFRICAN REPUBLIC": "CF",
        "CHAD": "TD",
        "CHILE": "CL",
        "CHINA": "CN",
        "CHRISTMAS ISLAND": "CX",
        "COCOS (KEELING) ISLANDS": "CC",
        "COLOMBIA": "CO",
        "COMOROS": "KM",
        "CONGO": "CG",
        "CONGO, THE DEMOCRATIC REPUBLIC OF THE": "CD",
        "COOK ISLANDS": "CK",
        "COSTA RICA": "CR",
        "CÔTE D'IVOIRE": "CI",
        "CROATIA": "HR",
        "CUBA": "CU",
        "CYPRUS": "CY",
        "CZECH REPUBLIC": "CZ",
        "DENMARK": "DK",
        "DJIBOUTI": "DJ",
        "DOMINICA": "DM",
        "DOMINICAN REPUBLIC": "DO",
        "ECUADOR": "EC",
        "EGYPT": "EG",
        "EL SALVADOR": "SV",
        "EQUATORIAL GUINEA": "GQ",
        "ERITREA": "ER",
        "ESTONIA": "EE",
        "ETHIOPIA": "ET",
        "FALKLAND ISLANDS (MALVINAS)": "FK",
        "FAROE ISLANDS": "FO",
        "FIJI": "FJ",
        "FINLAND": "FI",
        "FRANCE": "FR",
        "FRENCH GUIANA": "GF",
        "FRENCH POLYNESIA": "PF",
        "FRENCH SOUTHERN TERRITORIES": "TF",
        "GABON": "GA",
        "GAMBIA": "GM",
        "GEORGIA": "GE",
        "GERMANY": "DE",
        "GHANA": "GH",
        "GIBRALTAR": "GI",
        "GREECE": "GR",
        "GREENLAND": "GL",
        "GRENADA": "GD",
        "GUADELOUPE": "GP",
        "GUAM": "GU",
        "GUATEMALA": "GT",
        "GUINEA": "GN",
        "GUINEA-BISSAU": "GW",
        "GUYANA": "GY",
        "HAITI": "HT",
        "HEARD ISLAND AND MCDONALD ISLANDS": "HM",
        "HONDURAS": "HN",
        "HONG KONG": "HK",
        "HUNGARY": "HU",
        "ICELAND": "IS",
        "INDIA": "IN",
        "INDONESIA": "ID",
        "IRAN, ISLAMIC REPUBLIC OF": "IR",
        "IRAQ": "IQ",
        "IRELAND": "IE",
        "ISRAEL": "IL",
        "ITALY": "IT",
        "JAMAICA": "JM",
        "JAPAN": "JP",
        "JORDAN": "JO",
        "KAZAKHSTAN": "KZ",
        "KENYA": "KE",
        "KIRIBATI": "KI",
        "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF": "KP",
        "KOREA, REPUBLIC OF": "KR",
        "KUWAIT": "KW",
        "KYRGYZSTAN": "KG",
        "LAO PEOPLE'S DEMOCRATIC REPUBLIC": "LA",
        "LATVIA": "LV",
        "LEBANON": "LB",
        "LESOTHO": "LS",
        "LIBERIA": "LR",
        "LIBYAN ARAB JAMAHIRIYA": "LY",
        "LIECHTENSTEIN": "LI",
        "LITHUANIA": "LT",
        "LUXEMBOURG": "LU",
        "MACAO": "MO",
        "MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF": "MK",
        "MADAGASCAR": "MG",
        "MALAWI": "MW",
        "MALAYSIA": "MY",
        "MALDIVES": "MV",
        "MALI": "ML",
        "MALTA": "MT",
        "MARSHALL ISLANDS": "MH",
        "MARTINIQUE": "MQ",
        "MAURITANIA": "MR",
        "MAURITIUS": "MU",
        "MAYOTTE": "YT",
        "MEXICO": "MX",
        "MICRONESIA, FEDERATED STATES OF": "FM",
        "MOLDOVA, REPUBLIC OF": "MD",
        "MONACO": "MD",
        "MONGOLIA": "MN",
        "MONTSERRAT": "MS",
        "MOROCCO": "MA",
        "MOZAMBIQUE": "MZ",
        "MYANMAR": "MM",
        "NAMIBIA": "NA",
        "NAURU": "NR",
        "NEPAL": "NP",
        "NETHERLANDS": "NL",
        "NETHERLANDS ANTILLES": "AN",
        "NEW CALEDONIA": "NC",
        "NEW ZEALAND": "NZ",
        "NICARAGUA": "NI",
        "NIGER": "NE",
        "NIGERIA": "NG",
        "NIUE": "NU",
        "NORFOLK ISLAND": "NF",
        "NORTHERN MARIANA ISLANDS": "MP",
        "NORWAY": "NO",
        "OMAN": "OM",
        "PAKISTAN": "PK",
        "PALAU": "PW",
        "PALESTINIAN TERRITORY, OCCUPIED": "PS",
        "PANAMA": "PA",
        "PAPUA NEW GUINEA": "PG",
        "PARAGUAY": "PY",
        "PERU": "PE",
        "PHILIPPINES": "PH",
        "PITCAIRN": "PN",
        "POLAND": "PL",
        "PUERTO RICO": "PR",
        "QATAR": "QA",
        "RÉUNION": "RE",
        "ROMANIA": "RO",
        "RUSSIAN FEDERATION": "RU",
        "RWANDA": "RW",
        "SAINT HELENA": "SH",
        "SAINT KITTS AND NEVIS": "KN",
        "SAINT LUCIA": "LC",
        "SAINT PIERRE AND MIQUELON": "PM",
        "SAINT VINCENT AND THE GRENADINES": "VC",
        "SAMOA": "WS",
        "SAN MARINO": "SM",
        "SAO TOME AND PRINCIPE": "ST",
        "SAUDI ARABIA": "SA",
        "SENEGAL": "SN",
        "SERBIA AND MONTENEGRO": "CS",
        "SEYCHELLES": "SC",
        "SIERRA LEONE": "SL",
        "SINGAPORE": "SG",
        "SLOVAKIA": "SK",
        "SLOVENIA": "SI",
        "SOLOMON ISLANDS": "SB",
        "SOMALIA": "SO",
        "SOUTH AFRICA": "ZA",
        "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS": "GS",
        "SPAIN": "ES",
        "SRI LANKA": "LK",
        "SUDAN": "SD",
        "SURINAME": "SR",
        "SVALBARD AND JAN MAYEN": "SJ",
        "SWAZILAND": "SZ",
        "SWEDEN": "SE",
        "SWITZERLAND": "CH",
        "SYRIAN ARAB REPUBLIC": "SY",
        "TAIWAN, PROVINCE OF CHINA": "TW",
        "TAJIKISTAN": "TJ",
        "TANZANIA, UNITED REPUBLIC OF": "TZ",
        "THAILAND": "TH",
        "TIMOR-LESTE": "TL",
        "TOGO": "TG",
        "TOKELAU": "TK",
        "TONGA": "TO",
        "TRINIDAD AND TOBAGO": "TT",
        "TUNISIA": "TN",
        "TURKEY": "TR",
        "TURKMENISTAN": "TM",
        "TURKS AND CAICOS ISLANDS": "TC",
        "TUVALU": "TV",
        "UGANDA": "UG",
        "UKRAINE": "UA",
        "UNITED ARAB EMIRATES": "AE",
        "UNITED KINGDOM": "GB",
        "UNITED STATES": "US",
        "UNITED STATES MINOR OUTLYING ISLANDS": "UM",
        "URUGUAY": "UY",
        "UZBEKISTAN": "UZ",
        "VANUATU": "VU",
        "VENEZUELA": "VE",
        "VIET NAM": "VN",
        "VIRGIN ISLANDS, BRITISH": "VG",
        "VIRGIN ISLANDS, U.S.": "VI",
        "WALLIS AND FUTUNA": "WF",
        "WESTERN SAHARA": "EH",
        "YEMEN": "YE",
        "ZAMBIA": "ZM",
        "ZIMBABWE": "ZW"
    }

    return ISOcodes[name]
}