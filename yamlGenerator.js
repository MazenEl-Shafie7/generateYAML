let fileSystem = require("fs");
let fileDataWrite = "";
let fileDataWrite2 = "";
let fileDataWrite3 = "";
let fileDataWrite4 = "";
let domainName="";
let numberOfOrganizations;
let orgNames = [];
let numberOfPeers;
let DB = "";
let ordererName = "";

let fileDataPeer = fileSystem.readFileSync('peer.txt').toString();
let fileDataCa = fileSystem.readFileSync('ca.txt').toString();
let fileDataOrderer = fileSystem.readFileSync('orderer.txt').toString();

let fileDataCouchDB = fileSystem.readFileSync('couchDB.txt').toString();
let fileDataOrdererOrgsCrypto = fileSystem.readFileSync('ordererOrgsCrypto.txt').toString();
let fileDataPeerOrgsCrypto = fileSystem.readFileSync('peerOrgsCrypto.txt').toString();

let fileDataConfigTxPart1 = fileSystem.readFileSync('configTxPart1.txt').toString();
let fileDataConfigTxOrganizations = fileSystem.readFileSync('configTxOrganizations.txt').toString();
let fileDataConfigTxPart3 = fileSystem.readFileSync('configTxPart3.txt').toString();


let fileDataScriptPart1 = fileSystem.readFileSync('scriptPart1.txt').toString();
let fileDataScriptPart2 = fileSystem.readFileSync('scriptPart2.txt').toString();
let fileDataScriptPart3 = fileSystem.readFileSync('scriptPart3.txt').toString();
let fileDataScriptPart4 = fileSystem.readFileSync('scriptPart4.txt').toString();
let fileDataScriptPart5 = fileSystem.readFileSync('scriptPart5.txt').toString();

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

    let res = fileDataCa.replace(/mazen/g, domainName);
    for (let i=0 ; i < numberOfOrganizations ; i++){
        let res2 = res.replace(/ca1/g,orgNames[i]+"CA");
        let res1 = res2.replace(/oracle/g, orgNames[i]);
        fileDataWrite += res1;
        fileDataWrite += "\n";
        console.log(fileDataWrite);
    }

    let r= fileDataOrderer.replace(/orderer/g,ordererName);
    let r2= r.replace(/mazen/g,domainName);
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
            let result = fileDataPeer.replace(/microsoft/g, orgNames[j]);
            let result2=result.replace(/mazen/g,domainName);
            let result3=result2.replace(/peer0/g,"peer"+k);
            let result4=result3.replace(/couchdb0/g,"couchdb"+y);
            let result5=result4.replace(/7051/g,newPeerPorts);
            let result6 = result5.replace(/7052/g,newPeerPorts2);
            let result7= result6.replace(/9999/g,newPeerPorts3);
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
            let couchReplace = fileDataCouchDB.replace(/couchdb0/g,couch);
            let newPort = (t * 1000) + 5984;
            let newPorts = newPort + ":5984";
            let portsReplace = couchReplace.replace(/5984:5984/g,newPorts);
            fileDataWrite += portsReplace;
            fileDataWrite += "\n";
        }

    }
    // Crypto Config...
    let domainreplace = fileDataOrdererOrgsCrypto.replace(/mazen/g,domainName);
    let ordererReplace = domainreplace.replace(/orderer/g,ordererName);
    fileDataWrite2 += ordererReplace;
    fileDataWrite2 += "\n";
    fileDataWrite2 += "PeerOrgs:";
    fileDataWrite2 += "\n";
    // microsoft => orgNames[m] , mazen => domainName , 2 => numberOfPeers
    for (let m=0 ; m < numberOfOrganizations ; m++){
        let orgNameReplace = fileDataPeerOrgsCrypto.replace(/microsoft/g,orgNames[m]);
        let domainNameReplace = orgNameReplace.replace(/mazen/g,domainName);
        let numberOfPeersReplace = domainNameReplace.replace(/2/g,numberOfPeers);
        fileDataWrite2 += numberOfPeersReplace;
        fileDataWrite2 += "\n";
    }

    // ConfigTX ...
    let configTXordererReplace = fileDataConfigTxPart1.replace(/orderer/g,ordererName);
    let configTXdomainReplace = configTXordererReplace.replace(/mazen/g,domainName);
    fileDataWrite3 += configTXdomainReplace;
    fileDataWrite3 += "\n";
    let replace7051 = "";
    for(let q=0 ; q < numberOfOrganizations ; q++){
        let configTxOrganizationsReplace = fileDataConfigTxOrganizations.replace(/microsoft/g,orgNames[q]);
        let configTxOrganizationsReplaceDomain = configTxOrganizationsReplace.replace(/mazen/g,domainName);
        replace7051 = 7051 + (q*1000*numberOfPeers);
        let configTx7051Replace = configTxOrganizationsReplaceDomain.replace(/7051/g,replace7051);
        fileDataWrite3 += configTx7051Replace;
        fileDataWrite3 += "\n";
    }
    let part3domainReplace = fileDataConfigTxPart3.replace(/mazen/g,domainName);
    let part3ordererReplace = part3domainReplace.replace(/orderer/g,ordererName);
    let NumberReplacer="";
    if( numberOfOrganizations == "1"){
        NumberReplacer="One";
    }
    else if( numberOfOrganizations == "2"){
        NumberReplacer="Two";
    }
    else if( numberOfOrganizations == "3"){
        NumberReplacer="Three";
    }
    else if( numberOfOrganizations == "4"){
        NumberReplacer="Four";
    }
    else if( numberOfOrganizations == "5"){
        NumberReplacer="Five";
    }
    let part3NumberReplace = part3ordererReplace.replace(/Three/g,NumberReplacer);

    let replacer = "";
    let replacer2 = "";
    for(let a=0 ; a < numberOfOrganizations ; a++){
        if(a == 0){
            replacer += orgNames[a];
            replacer += "\n";
            replacer2 += orgNames[a];
            replacer2 += "\n";
        }
        else {
            replacer += "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0-\xa0*"+orgNames[a];
            replacer += "\n";
            replacer2 += "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0-\xa0*"+orgNames[a];
            replacer2 += "\n";
        }
    }
    let part3OrgsReplace = part3NumberReplace.replace(/microsoft/g,replacer);
    let part3firstOrgReplace = part3OrgsReplace.replace(/firstORG/g,replacer2);
    fileDataWrite3 += part3firstOrgReplace;
    fileDataWrite3 += "\n";


// Build Script...
    fileDataWrite4 += fileDataScriptPart1;
    fileDataWrite4 += "\n";
    for (let e=0 ; e < numberOfOrganizations ; e++){
        let scriptPart2ReplaceOrgName = fileDataScriptPart2.replace(/ORGname/g,orgNames[e]);
        let scriptPart2ReplaceDomainName = scriptPart2ReplaceOrgName.replace(/DOMAINname/g,domainName);
        let scriptPart2ReplaceCAnumber = scriptPart2ReplaceDomainName.replace(/caCount/g,e);
        fileDataWrite4 += scriptPart2ReplaceCAnumber;
        fileDataWrite4 += "\n";
    }
    fileDataWrite4 += fileDataScriptPart3;
    fileDataWrite4 += "\n";
    for(let z=0 ; z < numberOfOrganizations ; z++){
        let OrgNameUpperCase = orgNames[z].toUpperCase();
        let scriptPart4Replace = fileDataScriptPart4.replace(/ORGNAME/g,OrgNameUpperCase);
        fileDataWrite4 += scriptPart4Replace;
        fileDataWrite4 += "\n";
    }
    fileDataWrite4 += fileDataScriptPart5;
    fileDataWrite4 += "\n";

    

// Generated Files    
    fileSystem.writeFileSync('docker-compose-e2e.yaml',fileDataWrite);
    fileSystem.writeFileSync('crypto-config.yaml',fileDataWrite2);
    fileSystem.writeFileSync('configtx.yaml',fileDataWrite3);
    fileSystem.writeFileSync('buildScript.sh',fileDataWrite4);
    response.send("Done el7.. please check output.yaml file");
};

module.exports = {BlockchainSetup};
