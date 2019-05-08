var fileSystem = require("fs");
var fileDataWrite = "";
var fileDataWrite2 = "";
var fileDataPeer = '';
var fileDataCa= '';
var fileDataOrderer='';
let domainName="";
let numberOfOrganizations;
let orgNames = [];
let numberOfPeers;
let DB = "";
let ordererName = "";

var fileDataPeer = fileSystem.readFileSync('peer.txt').toString();
var fileDataCa = fileSystem.readFileSync('ca.txt').toString();
var fileDataOrderer = fileSystem.readFileSync('orderer.txt').toString();
var fileDataCouchDB = fileSystem.readFileSync('couchDB.txt').toString();
var fileDataOrdererOrgsCrypto = fileSystem.readFileSync('ordererOrgsCrypto.txt').toString();
var fileDataPeerOrgsCrypto = fileSystem.readFileSync('peerOrgsCrypto.txt').toString();

const BlockchainSetup = (req,response,next) => {
    domainName = req.body.domainName;
    numberOfOrganizations = req.body.numberOfOrganizations;
    orgNames = req.body.orgNames;
    numberOfPeers = req.body.numberOfPeers;
    DB = req.body.db;
    ordererName = req.body.ordererName;
    fileDataWrite += "version: '2'";
    fileDataWrite += "\n";
    fileDataWrite += "volumes:";
    fileDataWrite += "\n";
    fileDataWrite += "\xa0\xa0" + ordererName + "." + domainName + ".com";
    fileDataWrite += "\n";
    for(let p=0 ; p <  numberOfOrganizations ; p++){
        for(o=0 ; o< numberOfPeers ; o++){
            fileDataWrite +="\xa0\xa0peer" + o + "." + orgNames[p] + "." + domainName + ".com";
            fileDataWrite += "\n";
        }
    }
    fileDataWrite += "\n";
    fileDataWrite +="networks:";
    fileDataWrite += "\n";
    fileDataWrite += "\xa0\xa0byfn:";
    fileDataWrite += "\n";
    fileDataWrite +="services:";
    fileDataWrite += "\n";

    var res = fileDataCa.replace(/mazen/g, domainName);
    for (let i=0 ; i < numberOfOrganizations ; i++){
        var res2 = res.replace(/ca1/g,orgNames[i]+"CA");
        var res1 = res2.replace(/oracle/g, orgNames[i]);
        fileDataWrite += res1;
        fileDataWrite += "\n";
        console.log(fileDataWrite);
    }

    var r= fileDataOrderer.replace(/orderer/g,ordererName);
    var r2= r.replace(/mazen/g,domainName);
    fileDataWrite += r2;
    fileDataWrite += "\n";
    let y=0;
    let b= true;
    let newPeerPorts3=0;
    for(let j=0 ; j <  numberOfOrganizations ; j++){
        for(k=0 ; k< numberOfPeers ; k++){
            let newPeerPorts= (y * 1000) + 7051;
            let newPeerPorts2= newPeerPorts + 1;
            if(k == 0){newPeerPorts3 = newPeerPorts + 1000;}
            else {newPeerPorts3 = newPeerPorts - 1000;}
            var result = fileDataPeer.replace(/microsoft/g, orgNames[j]);
            var result2=result.replace(/mazen/g,domainName);
            var result3=result2.replace(/peer0/g,"peer"+k);
            var result4=result3.replace(/couchdb0/g,"couchdb"+y);
            var result5=result4.replace(/7051/g,newPeerPorts);
            var result6 = result5.replace(/7052/g,newPeerPorts2);
            var result7= result6.replace(/9999/g,newPeerPorts3);
            fileDataWrite +=result7;
            fileDataWrite += "\n";
            y++;
            b=false;
        }
    }
    // "5984:5984"  7051 8051 9051 100
    if(DB == "Couchdb"){
        for(let t=0 ; t< (numberOfPeers * numberOfOrganizations) ; t++){
            let couch = "couchdb" + t;
            var couchReplace = fileDataCouchDB.replace(/couchdb0/g,couch);
            let newPort = (t * 1000) + 5984;
            let newPorts = newPort + ":5984";
            var portsReplace = couchReplace.replace(/5984:5984/g,newPorts);
            fileDataWrite += portsReplace;
            fileDataWrite += "\n";
        }

    }
    // Crypto Config...
    var domainreplace = fileDataOrdererOrgsCrypto.replace(/mazen/g,domainName);
    var ordererReplace = domainreplace.replace(/orderer/g,ordererName);
    fileDataWrite2 += ordererReplace;
    fileDataWrite2 += "\n";
    fileDataWrite2 += "PeerOrgs:";
    fileDataWrite2 += "\n";
    // microsoft => orgNames[m] , mazen => domainName , 2 => numberOfPeers
    for (let m=0 ; m < numberOfOrganizations ; m++){
        var orgNameReplace = fileDataPeerOrgsCrypto.replace(/microsoft/g,orgNames[m]);
        var domainNameReplace = orgNameReplace.replace(/mazen/g,domainName);
        var numberOfPeersReplace = domainNameReplace.replace(/2/g,numberOfPeers);
        fileDataWrite2 += numberOfPeersReplace;
        fileDataWrite2 += "\n";
    }

    fileSystem.writeFileSync('output.yaml',fileDataWrite);
    fileSystem.writeFileSync('output2.yaml',fileDataWrite2);
    response.send("Done el7.. please check output.yaml file");
};

module.exports = {BlockchainSetup};
