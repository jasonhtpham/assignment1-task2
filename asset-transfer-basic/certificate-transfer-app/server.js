const express = require('express');
const server = express();
const HyperledgerApp = require('./hyperledgerApp.js');
const { IdentityProviderRegistry } = require('fabric-network');

const PORT = 3000;

const hyperledgerApp = new HyperledgerApp();

server.use(express.static(__dirname + '/public'));

server.get('/getAllCerts', async (req, res) => {
    const certs = await hyperledgerApp.GetAllCerts();
    res.send(certs);
});

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