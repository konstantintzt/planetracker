const mySQL = require("mysql2")
const util = require("util")

var query = undefined

async function createConnection(dbConfig) {

    connection = await mySQL.createConnection(dbConfig)
    connection.connect(err => {
        if (err) {
            console.log(err);
            console.log("COULDN'T CONNECT TO DATABASE. TERMINATING PROGRAM.");
            process.exit(-1)
        }
        else {
            query = util.promisify(connection.query).bind(connection)
            console.log("Database is running 🔥");
        }
    })
}

async function fetchRow(table, rule, ruleParameters) {
    var results = await query(`SELECT * FROM \`${table}\` WHERE ${rule} LIMIT 1`, ruleParameters)
    return results[0]
}

async function insertRow(table, fields, values) {
    var results = await query(`INSERT INTO \`${table}\` ${fields} VALUES (?)`, [values])
    return results
}

exports.createConnection = createConnection
exports.fetchRow = fetchRow
exports.insertRow = insertRow