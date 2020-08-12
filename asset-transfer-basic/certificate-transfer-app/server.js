const express = require('express');
const HyperledgerApp = require('./hyperledgerApp.js');
const { IdentityProviderRegistry } = require('fabric-network');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require ('body-parser');


// Load the database object
const uri = "mongodb+srv://dbUser:dbUser@hyperledgercertificate.hgp6r.mongodb.net/firstdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize the server object
const server = express();
const PORT = 3000;

// Communicate with the chaincode by create a hyperledgerApp object
const hyperledgerApp = new HyperledgerApp();

server.use(express.static(__dirname + '/public'));
// bodyParse setup
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

let firstCall = true;
let lastUpdateEntries = 0;

/*
    BUG!!!!
    The client side browser (html + jquery) reloading will cause the list of users to be blank

    Cause:
    After the first call to the /registeredUsers endpoint, the browser will only receives newly added user (if available)
*/

server.get('/registeredUsers', async (req, res) => {
    try {
        if (firstCall) {
            await client.connect();

            const users = await client.db("firstdb").collection("Users").find({}).toArray();

            if (!users) {
                throw new Error ("Nothing found from database");
            }
            firstCall = false;
            lastUpdateEntries = users.length;
            
            res.send(users);
        } else {
            const newUsers = await client.db("firstdb").collection("Users").find().skip(parseInt(lastUpdateEntries)).toArray();
            if (newUsers) {
                lastUpdateEntries += newUsers.length;
                res.send(newUsers);
            }
            res.end()
        }
    } catch (err) {
        console.log(`Problems connecting with database ${err}`);
    } 
    // finally {
    //     await client.close();
    //     console.log('Database connection closed');
    // }
})

server.get('/getAllCerts', async (req, res) => {
    const certs = await hyperledgerApp.GetAllCerts();
    res.send(certs);
})

server.get('/createCert', async (req, res) => {
    const { firstName, lastName, unitCode, grade, credit } = req.query;

    const certId = produceCertId(firstName, lastName, unitCode);

    const owner = firstName + ' ' + lastName;

    await hyperledgerApp.CreateCert(certId, unitCode, grade, owner, credit);
    res.send(certId);
})

// produce the certId to be stored on the ledger
produceCertId = (firstName, lastName, unitCode) => {
    // certID = first name + last name + last 3 digits from the unitCode
    const processedFirstName = firstName.trim().toLowerCase();
    const processedLastName = lastName.trim().toLowerCase();
    const processedUnitCode = unitCode.substring(3);

    const certId = processedFirstName + processedLastName + processedUnitCode;
    
    return certId;
}

server.get('/getCertByOwner', async (req, res) => {
    const { firstName, lastName } = req.query;

    const owner = firstName + ' ' + lastName;

    const certs = await hyperledgerApp.GetCertsByOwner(owner);

    res.send(certs);
})

server.get('/getCertHistory', async (req, res) => {
    const { certId } = req.query;

    const certHistory = await hyperledgerApp.GetCertHistory(certId);

    res.send(certHistory);
})

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})