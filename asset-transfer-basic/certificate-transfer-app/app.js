/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');
const registerUser = require('./registerUser');
const enrollAdmin = require('./enrollAdmin');

const myChannel = 'mychannel';
const myChaincodeName = 'updatedcert';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// fabric-sample test-network setup with two peers and an ordering service,
// the companion chaincode is deployed, approved and committed on the channel mychannel
class HyperledgerApp {
    constructor() {
        this.InitLedger();
    }

    InitLedger = async () => {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const fileExists = fs.existsSync(ccpPath);
            if (!fileExists) {
                throw new Error(`no such file or directory: ${ccpPath}`);
            }
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(__dirname, 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
    
            // Steps:
            // Note: Steps 1 & 2 need to done only once in an app-server per blockchain network
            // 1. register & enroll admin user with CA, stores admin identity in local wallet
            await enrollAdmin.EnrollAdminUser();
    
            // 2. register & enroll application user with CA, which is used as client identify to make chaincode calls, stores app user identity in local wallet
            await registerUser.RegisterAppUser();
    
            // Check to see if app user exist in wallet.
            const identity = await wallet.get(registerUser.ApplicationUserId);
            if (!identity) {
                console.log(`An identity for the user does not exist in the wallet: ${registerUser.ApplicationUserId}`);
                return;
            }
    
            //3. Prepare to call chaincode using fabric javascript node sdk
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: registerUser.ApplicationUserId,
                discovery: {enabled: true, asLocalhost: true}
            });
            try {
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork(myChannel);
    
                // Get the contract from the network.
                const contract = network.getContract(myChaincodeName);
    
                // Initialize the chaincode by calling its InitLedger function
                console.log('Submit Transaction: InitLedger to create the very first cert');
                await contract.submitTransaction('InitLedger');
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = HyperledgerApp;
    // try {
    //     // load the network configuration
    //     const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    //     const fileExists = fs.existsSync(ccpPath);
    //     if (!fileExists) {
    //         throw new Error(`no such file or directory: ${ccpPath}`);
    //     }
    //     const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    //     // Create a new file system based wallet for managing identities.
    //     const walletPath = path.join(__dirname, 'wallet');
    //     const wallet = await Wallets.newFileSystemWallet(walletPath);
    //     console.log(`Wallet path: ${walletPath}`);


    //     // Steps:
    //     // Note: Steps 1 & 2 need to done only once in an app-server per blockchain network
    //     // 1. register & enroll admin user with CA, stores admin identity in local wallet
    //     await enrollAdmin.EnrollAdminUser();

    //     // 2. register & enroll application user with CA, which is used as client identify to make chaincode calls, stores app user identity in local wallet
    //     await registerUser.RegisterAppUser();

    //     // Check to see if app user exist in wallet.
    //     const identity = await wallet.get(registerUser.ApplicationUserId);
    //     if (!identity) {
    //         console.log(`An identity for the user does not exist in the wallet: ${registerUser.ApplicationUserId}`);
    //         return;
    //     }

    //     //3. Prepare to call chaincode using fabric javascript node sdk
    //     // Create a new gateway for connecting to our peer node.
    //     const gateway = new Gateway();
    //     await gateway.connect(ccp, {
    //         wallet,
    //         identity: registerUser.ApplicationUserId,
    //         discovery: {enabled: true, asLocalhost: true}
    //     });
    //     try {
    //         // Get the network (channel) our contract is deployed to.
    //         const network = await gateway.getNetwork(myChannel);

    //         // Get the contract from the network.
    //         const contract = network.getContract(myChaincodeName);

    //         // Initialize the chaincode by calling its InitLedger function
    //         console.log('Submit Transaction: InitLedger to create the very first cert');
    //         await contract.submitTransaction('InitLedger');


/*
            // Get the certificates stored on ledger
            let result = await contract.evaluateTransaction('GetAllCerts');
            console.log(`\nEvaluate Transaction: GetAllCerts got result: ${prettyJSONString(result.toString())}`)

            console.log('\n***********************');

            // Create certifications
            console.log('\nSubmit Transaction: Create a new certificate for studentA');
            await contract.submitTransaction('CreateCert', 'studentA430','SIT430', '60', 'studentA', '2');

            console.log('\nSubmit Transaction: Create a new certificate for studentB');
            await contract.submitTransaction('CreateCert', 'studentB123','SIT123', '76', 'studentB', '1');

            console.log('\nSubmit Transaction: Create a new certificate for studentB');
            await contract.submitTransaction('CreateCert', 'studentB456','SIT456', '90', 'studentB', '2');

            // Get the certificates stored on ledger
            console.log('\nEvaluate Transaction: ReadCert() with id:studentA430 to check if the cert is issued')
            result = await contract.evaluateTransaction('ReadCert', 'studentA430');
            console.log(`\nresult: ${prettyJSONString(result.toString())}`)

            console.log('\n***********************');

            // Query certs by owner
            console.log('\nEvaluate Transaction: QueryCertsByOwner() with owner:studentA')
            result = await contract.evaluateTransaction('QueryCertsByOwner', 'studentA');
            console.log(`\nCerts of StudentA: ${prettyJSONString(result.toString())}`);

            console.log('\nEvaluate Transaction: QueryCertsByOwner() with owner:studentB')
            result = await contract.evaluateTransaction('QueryCertsByOwner', 'studentB');
            console.log(`\nCerts of StudentB: ${prettyJSONString(result.toString())}`);

            console.log('\n***********************');

            // GetCertHistory to view a certificate's history since creation
            console.log('\nEvaluate Transaction: GetCertHistory()');
            result = await contract.evaluateTransaction('GetCertHistory', 'studentA725');
            console.log(`\nHistory of certificate studentA725: ${prettyJSONString(result.toString())}`);

            // try {
            //     console.log('\nSubmit Transaction: TransferCert SIT725 to its owner');
            //     //Non existing asset asset70 should throw Error
            //     await contract.submitTransaction('TransferCert', 'SIT725', 'Jason');
            // } catch (error) {
            //     console.log(`Expected an error on TransferCert of non-existing Asset: ${error}`);
            // }

        } finally {
            // Disconnect from the gateway peer when all work for this client identity is complete
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}


main();
*/