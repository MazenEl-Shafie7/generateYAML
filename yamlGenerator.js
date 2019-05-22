let fileSystem = require("fs");
let fileDataWrite = "";
let fileDataWrite2 = "";
let fileDataWrite3 = "";
let fileDataWrite4 = "";
let fileDataWrite5 = "";
let fileDataWrite6 = "";
let NumberReplacer="";
let domainName="";
let numberOfOrganizations;
let orgNames = [];
let numberOfPeers;
let DB = "";
let ordererName = "";
let chainCodeName = "";
let chainCodeType = "";
let CC_Path = `"/opt/gopath/src/github.com/chaincode/${chainCodeName}/${chainCodeType}"`;
let CC_lang = chainCodeType;

let fileDataPeer = fileSystem.readFileSync('peer.txt').toString();
let fileDataCa = fileSystem.readFileSync('ca.txt').toString();
let fileDataOrderer = fileSystem.readFileSync('orderer.txt').toString();

let fileDataCouchDB = fileSystem.readFileSync('couchDB.txt').toString();
let fileDataOrdererOrgsCrypto = fileSystem.readFileSync('ordererOrgsCrypto.txt').toString();
let fileDataPeerOrgsCrypto = fileSystem.readFileSync('peerOrgsCrypto.txt').toString();

let fileDataConfigTxPart1 = fileSystem.readFileSync('genConfigTx/configTxPart1.txt').toString();
let fileDataConfigTxOrganizations = fileSystem.readFileSync('genConfigTx/configTxOrganizations.txt').toString();
let fileDataConfigTxPart3 = fileSystem.readFileSync('genConfigTx/configTxPart3.txt').toString();

let fileDataScriptPart1 = fileSystem.readFileSync('genBuildScript/scriptPart1.txt').toString();
let fileDataScriptPart2 = fileSystem.readFileSync('genBuildScript/scriptPart2.txt').toString();
let fileDataScriptPart3 = fileSystem.readFileSync('genBuildScript/scriptPart3.txt').toString();
let fileDataScriptPart4 = fileSystem.readFileSync('genBuildScript/scriptPart4.txt').toString();
let fileDataScriptPart5 = fileSystem.readFileSync('genBuildScript/scriptPart5.txt').toString();

let fileDataChaincodeScript1= fileSystem.readFileSync('genScript/createChannel.txt').toString();
let fileDataChaincodeScript2= fileSystem.readFileSync('genScript/joinChannel.txt').toString();
let fileDataChaincodeScript3= fileSystem.readFileSync('genScript/updateAnchorPeers.txt').toString();
let fileDataChaincodeScript4= fileSystem.readFileSync('genScript/installCC.txt').toString();
let fileDataChaincodeScript5= fileSystem.readFileSync('genScript/instantiateCC.txt').toString();

let fileDataUtils = fileSystem.readFileSync('genUtils/utils.txt').toString();

const BlockchainSetup = (req,response,next) => {
    chainCodeName =req.body.chainCodeName;
    chainCodeType = req.body.chainCodeType;
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
    let OrgsReplace1 = fileDataScriptPart3.replace(/OrgsOrdererGenesis/g,`${NumberReplacer}OrdererGenesis`);
    let OrgsReplace2 = OrgsReplace1.replace(/OrgsChannel/g,`${NumberReplacer}OrgsChannel`) ;
    fileDataWrite4 += OrgsReplace2;
    fileDataWrite4 += "\n";
    for(let z=0 ; z < numberOfOrganizations ; z++){
        let OrgNameUpperCase = orgNames[z].toUpperCase();
        let scriptPart4Replace = fileDataScriptPart4.replace(/ORGNAME/g,OrgNameUpperCase);
        let scriptPart4Replace2 = scriptPart4Replace.replace(/OrgsChannel/g,`${NumberReplacer}OrgsChannel`) ;
        fileDataWrite4 += scriptPart4Replace2;
        fileDataWrite4 += "\n";
    }
    fileDataWrite4 += fileDataScriptPart5;
    fileDataWrite4 += "\n";



//  generate Chaincode Script
  // Create Channel
  // Replace CHANNEL_NAME => "mychannel" , 
  // CC_PATH = `"/opt/gopath/src/github.com/chaincode/${Data.chaincodeName}/${Data.chaincodeType}"` , 
  // CC_LANG => Data.chaincodeType
  // ORG0NAME => orgNames[0].toUppercase();
  // domainName => domainName
  // ordererName => ordererName 
  // org0nameSmall => orgNames[0]
    let ccReplace1= fileDataChaincodeScript1.replace(/CHANNEL_NAME/g,"mychannel");
    //let ccPath=`"/opt/gopath/src/github.com/chaincode/${chainCodeName}/${chainCodeType}"`;
    let ccReplace2= ccReplace1.replace(/CC_PATH/g,CC_Path);
    let ccReplace3= ccReplace2.replace(/CC_LANG/g,CC_lang);
    let ccReplace4= ccReplace3.replace(/ORG0NAME/g,orgNames[0].toUpperCase());
    let ccReplace5= ccReplace4.replace(/domainName/g,domainName);
    let ccReplace6= ccReplace5.replace(/ordererName/g,ordererName);
    let ccReplace7= ccReplace6.replace(/org0nameSmall/g,orgNames[0]);
    fileDataWrite5 += ccReplace7;
    fileDataWrite5 += "\n";
    fileDataWrite5 += "joinChannel(){";
    fileDataWrite5 += "\n";
	// Replace  {org.name.toUpperCase()} => orgNames[i].toUpperCase();
	// {org.name} => orgNames[i]	
	// {Data.domainName} => domainName
	// {i} => v
	// {peerPort} => peerNumberReplacer
    // {CHANNEL_NAME} => "mychannel"
    let peerNumberReplacer = 7051;
    for (let i=0; i < numberOfOrganizations ; i++){
        for(let v=0 ; v < numberOfPeers ; v++){
            let joinChannelR1= fileDataChaincodeScript2.replace(/{org.name.toUpperCase()}/g,orgNames[i].toUpperCase());
            let joinChannelR2= joinChannelR1.replace(/{org.name}/g,orgNames[i]);
            let joinChannelR3= joinChannelR2.replace(/{domainName}/g,domainName);
            let joinChannelR4= joinChannelR3.replace(/{i}/g,v);
            let joinChannelR5= joinChannelR4.replace(/{peerPort}/g,peerNumberReplacer);
            peerNumberReplacer += 1000;
            let joinChannelR6= joinChannelR5.replace(/{CHANNEL_NAME}/g,"mychannel");
            fileDataWrite5 += joinChannelR6;
            fileDataWrite5 += "\n";
        }
    }
    fileDataWrite5 += "}";
    fileDataWrite5 += "\n";
    fileDataWrite5 += "updateAnchorPeers(){";
// {org.name.toUpperCase()} => orgNames[i].toUpperCase();
// {org.name} => orgNames[i]
// {Data.domainName} => domainName
// {peerPort} => 7051 + (numberOfPeers * i * 1000) 
// {CHANNEL_NAME} => "mychannel"
// {Data.ordererName} => ordererName
    let peerNumberReplacer2= 0;
    for (let l=0 ; l < numberOfOrganizations ; l++){
        let joinChannelR7= fileDataChaincodeScript3.replace(/{org.name.toUpperCase()}/g,orgNames[l].toUpperCase());
        let joinChannelR8= joinChannelR7.replace(/{org.name}/g,orgNames[l]);
        let joinChannelR9= joinChannelR8.replace(/{domainName}/g,domainName);
        let joinChannelR10= joinChannelR9.replace(/{ordererName}/g,ordererName);
        peerNumberReplacer2 = 7051 + (numberOfPeers * l * 1000);
        let joinChannelR11= joinChannelR10.replace(/{peerPort}/g,peerNumberReplacer2);
        let joinChannelR12= joinChannelR11.replace(/{CHANNEL_NAME}/g,"mychannel");
        fileDataWrite5 += joinChannelR12;
        fileDataWrite5 += "\n";
    }
    fileDataWrite5 += "}";
    fileDataWrite5 += "\n";
    fileDataWrite5 += "installChaincode() {";
    fileDataWrite5 += "\n";
// {org.name.toUpperCase()} => orgNames[i].toUpperCase();
// {org.name} => orgNames[u]
// {Data.domainName} => domainName
// {peerPort} => 7051 + (numberOfPeers * i * 1000) 
// {Data.chaincodeName} => chainCodeName
// {CC_lang} => CC_Lang
// {CC_Path} => CC_Path
let peerNumberReplacer3= 0;
    for (let u=0 ; u < numberOfOrganizations ; u++){
        let installCCR1 = fileDataChaincodeScript4.replace(/{org.name.toUpperCase()}/g,orgNames[u].toUpperCase());
        let installCCR2 = installCCR1.replace(/{org.name}/g,orgNames[u]);
        let installCCR3 = installCCR2.replace(/{Data.domainName}/g,domainName);
        peerNumberReplacer3 = 7051 + (numberOfPeers * u * 1000);
        let installCCR4 = installCCR3.replace(/{peerPort}/g,peerNumberReplacer3);
        let installCCR5 = installCCR4.replace(/Data.chaincodeName}/g,chainCodeName);
        let installCCR6 = installCCR5.replace(/{CC_lang}/g,CC_lang);
        let installCCR7 = installCCR6.replace(/{CC_Path}/g,CC_Path);
        fileDataWrite5 += installCCR7;
        fileDataWrite5 += "\n";
    }
    fileDataWrite5 += "}";
    fileDataWrite5 += "\n";
    // {org.name.toUpperCase()} => orgNames[i].toUpperCase(); v
// {org.name} => orgNames[u] v
// {domainName} => domainName v
// {peerPort} => 7051 + (numberOfPeers * i * 1000) v 
// {chaincodeName} => chainCodeName v
// {CC_lang} => CC_Lang v
// {CHANNEL_NAME} => "mychannel" v
// {ordererName} => ordererName v
    fileDataWrite5 += "instantiateChaincode(){";
    fileDataWrite5 += "\n";
    let orgsMSP= '';
    for (const orgName of orgNames){
      orgsMSP += `'{orgName.toUpperCase()}MSP.peer',`
    }
    orgsMSP = orgsMSP.slice(0,-1);
    let peerNumberReplacer4= 0;
    for(let g=0 ; g < numberOfOrganizations ; g++){
        let instantiateCCR1 = fileDataChaincodeScript5.replace(/{org.name.toUpperCase()}/g,orgNames[g].toUpperCase());
        let instantiateCCR2 = instantiateCCR1.replace(/{org.name}/g,orgNames[g]);
        let instantiateCCR3 = instantiateCCR2.replace(/{domainName}/g,domainName);
        peerNumberReplacer3 = 7051 + (numberOfPeers * g * 1000);
        let instantiateCCR4 = instantiateCCR3.replace(/{peerPort}/g,peerNumberReplacer4);
        let instantiateCCR5 = instantiateCCR4.replace(/chaincodeName}/g,chainCodeName);
        let instantiateCCR6 = instantiateCCR5.replace(/{CC_lang}/g,CC_lang);
        let instantiateCCR7 = instantiateCCR6.replace(/{CHANNEL_NAME}/g,"mychannel");
        let instantiateCCR8 = instantiateCCR7.replace(/{ordererName}/g,ordererName);
        fileDataWrite5 += instantiateCCR8;
        fileDataWrite5 += "\n";
    }
    fileDataWrite5 += "}";
    fileDataWrite5 += "\n";

    fileDataWrite5 += 'echo "Creating channel..."';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'createChannel';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'echo "Having all peers join the channel..."';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'joinChannel';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'echo "Updating anchor peers"';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'updateAnchorPeers';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'echo "Installing chaincode"';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'installChaincode';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'echo "Instantiating chaincode"';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'instantiateChaincode';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'echo "All Good, Channel execution completed"';
    fileDataWrite5 += "\n";
    fileDataWrite5 += 'exit 0';
    fileDataWrite5 += "\n";

    fileDataWrite6 += `ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/${domainName}.com/orderers/${ordererName}.${domainName}.com/msp/tlscacerts/tlsca.${domainName}.com-cert.pem`;
    fileDataWrite6 += "\n";
    for (const orgName of orgNames){
        for (let i = 0 ; i < numberOfPeers; i++){
            fileDataWrite6 += `PEER${i}_${orgName.toUpperCase()}_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${orgName}.${domainName}.com/peers/peer${i}.${orgName}.${domainName}.com/tls/ca.crt`;
            fileDataWrite6 += "\n";
        }
    }
    // domainName ordererName CHANNEL_NAME 
    let utilsR1 = fileDataUtils.replace(/{domainName}/g,domainName);
    let utilsR2 = utilsR1.replace(/{ordererName}/g,ordererName);
    let utilsR3 = utilsR2.replace(/{CHANNEL_NAME}/g,"mychannel");
    fileDataWrite6 += utilsR3;
    fileDataWrite6 += "\n";



// Generated Files    
    fileSystem.writeFileSync('docker-compose-e2e.yaml',fileDataWrite);
    fileSystem.writeFileSync('crypto-config.yaml',fileDataWrite2);
    fileSystem.writeFileSync('configtx.yaml',fileDataWrite3);
    fileSystem.writeFileSync('buildScript.sh',fileDataWrite4);
    fileSystem.writeFileSync('genChaicodeScript.sh',fileDataWrite5);
    fileSystem.writeFileSync('genUtils.sh',fileDataWrite6);
    response.send("Done el7.. please check output.yaml file");
};

module.exports = {BlockchainSetup};
