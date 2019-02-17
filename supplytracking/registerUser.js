'use strict';
/*
 * Register and Enroll a user
 */
var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');

//
var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user_supplier_gameshopex = null;
var member_user_oem_zotac = null;
var member_user_bank_unionbank = null;
var member_user_supplier_bestdigitalshop = null;
var member_user_oem_evga = null;
var member_user_bank_metrobank = null;
var supplier1_secret = null;
var oem1_secret = null;
var bank1_secret = null;
var supplier2_secret = null;
var oem2_secret = null;
var bank2_secret = null;

var store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:'+store_path);

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
    // assign the store to the fabric client
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var	tlsOptions = {
    	trustedRoots: [],
    	verify: false
    };
    // be sure to change the http to https when the CA is running TLS enabled
    fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', null , '', crypto_suite);

    // first check to see if the admin is already enrolled
    return fabric_client.getUserContext('admin', true);
}).then((user_from_store) => {
    if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded admin from persistence');
        admin_user = user_from_store;
    } else {
        throw new Error('Failed to get admin.... run enrollAdmin.js');
    }

    // at this point we should have the admin user
    // first need to register the user with the CA server
    //var attributes = {username:"Amol:ecert",org:"ICICI:ecert"};
    let attributes = [
        {name:"username", value:"GameShopEx",ecert:true } , 
        {name:"username", value:"Zotac",ecert:true } , 
        {name:"username", value:"Unionbank",ecert:true },
        {name:"username", value:"BestDigitalShop",ecert:true },
        {name:"username", value:"EVGA",ecert:true },
        {name:"username", value:"Metrobank",ecert:true }];

        return fabric_ca_client
        .register({enrollmentID: 'gameshopex', affiliation: 'org1.department1',role: 'supplier', attrs: attributes}, admin_user)
        .then((supplier1)=>{
            supplier1_secret = supplier1;
            return fabric_ca_client
                .register({enrollmentID: 'zotac', affiliation: 'org1.department1',role: 'oem', attrs: attributes}, admin_user)
                .then((oem1)=>{
                    oem1_secret = oem1
                    return fabric_ca_client
                        .register({enrollmentID: 'unionbank', affiliation: 'org1.department1',role: 'bank', attrs: attributes}, admin_user)
                        .then((bank1)=>{
                            bank1_secret = bank1
                            return fabric_ca_client
                                .register({enrollmentID: 'bestdigitalshop', affiliation: 'org1.department2',role: 'supplier', attrs: attributes}, admin_user)
                                .then((supplier2)=>{
                                    supplier2_secret = supplier2
                                    return fabric_ca_client
                                        .register({enrollmentID: 'evga', affiliation: 'org1.department2',role: 'oem', attrs: attributes}, admin_user)
                                        .then((oem2)=>{
                                            oem2_secret = oem2
                                            return fabric_ca_client
                                                .register({enrollmentID: 'metrobank', affiliation: 'org1.department2',role: 'bank', attrs: attributes}, admin_user)
                                        })
                                })
                        })
                })
        });
})
    .then((bank2) => {

        bank2_secret = bank2

        // next we need to enroll the users with CA server
        console.log('Successfully registered GameShopEx - secret:'+ supplier1_secret);
        console.log('Successfully registered Zotac - secret:'+ oem1_secret);
        console.log('Successfully registered Unionbank - secret:'+ bank1_secret);
        console.log('Successfully registered BestDigitalShop - secret:'+ supplier2_secret);
        console.log('Successfully registered EVGA - secret:'+ oem2_secret);
        console.log('Successfully registered Metrobank - secret:'+ bank2_secret);
        
        return fabric_ca_client
            .enroll({enrollmentID: 'gameshopex', enrollmentSecret: supplier1_secret})
            .then(()=>{
                return fabric_ca_client
                    .enroll({enrollmentID: 'zotac', enrollmentSecret: oem1_secret})
                    .then(()=>{
                        return fabric_ca_client
                            .enroll({enrollmentID: 'unionbank', enrollmentSecret: bank1_secret})
                            .then(()=>{
                                return fabric_ca_client
                                    .enroll({enrollmentID: 'bestdigitalshop', enrollmentSecret: supplier2_secret})
                                    .then(()=>{
                                        return fabric_ca_client
                                            .enroll({enrollmentID: 'evga', enrollmentSecret: oem2_secret})
                                            .then(()=>{
                                                return fabric_ca_client
                                                    .enroll({enrollmentID: 'metrobank', enrollmentSecret: bank2_secret})
                                            })
                                    })
                            })
                    })
            });

    })
        .then((enrollment) => {
        console.log('Successfully enrolled member user "GameShopEx" , "Zotac" , "Unionbank" , "BestDigitalShop" , "EVGA" , "Metrobank" ');
        
        return fabric_client
                .createUser({username: 'GameShopEx',mspid: 'Org1MSP',cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }})
                .then(()=>{
                    return fabric_client
                        .createUser({username: 'Zotac',mspid: 'Org1MSP',cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }})
                        .then(()=>{
                            return fabric_client
                            .createUser({username: 'Unionbank',mspid: 'Org1MSP',cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }})
                            .then(()=>{
                                return fabric_client
                                .createUser({username: 'BestDigitalShop',mspid: 'Org1MSP',cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }})
                                .then(()=>{
                                    return fabric_client
                                    .createUser({username: 'EVGA',mspid: 'Org1MSP',cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }})
                                    .then(()=>{
                                        return fabric_client
                                        .createUser({username: 'Metrobank',mspid: 'Org1MSP',cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }})
                                        
                                    })
                                })
                            })
                        })
                });

        }).then((user) => {
            member_user_supplier_gameshopex = user;
            member_user_oem_zotac = user;
            member_user_bank_unionbank = user;
            member_user_supplier_bestdigitalshop = user;
            member_user_oem_evga = user;
            member_user_bank_metrobank = user;

            return fabric_client
                .setUserContext(member_user_supplier_gameshopex)
                .then(()=>{
                    return fabric_client
                    .setUserContext(member_user_oem_zotac)
                    .then(()=>{
                        return fabric_client
                            .setUserContext(member_user_bank_unionbank)
                            .then(()=>{
                                return fabric_client
                                    .setUserContext(member_user_supplier_bestdigitalshop)
                                    .then(()=>{
                                        return fabric_client
                                            .setUserContext(member_user_oem_evga)
                                            .then(()=>{
                                                return fabric_client
                                                    .setUserContext(member_user_bank_metrobank)
                                            })
                                    })
                            })
                    })
                });

        }).then(()=>{
            console.log('6 users were successfully registered and enrolled and is ready to interact with the fabric network');

        }).catch((err) => {
            console.error('Failed to register: ' + err);
            if(err.toString().indexOf('Authorization') > -1) {
                console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
                'Try again after deleting the contents of the store directory '+store_path);
            }
        });