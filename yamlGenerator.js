var fileSystem = require("fs");
var fileDataWrite = "";
var fileDataPeer = '';
var fileDataCa= '';
var fileDataOrderer='';
let domainName="";
let numberOfOrganizations;
let orgNames = [];
let numberOfPeers;
let DB;
let ordererName = "";

var fileDataPeer = fileSystem.readFileSync('C:\\Users\\MazenEl-Shafie\\Documents\\YAML-Generator-Task\\peer.txt').toString();
var fileDataCa = fileSystem.readFileSync('C:\\Users\\MazenEl-Shafie\\Documents\\YAML-Generator-Task\\ca.txt').toString();
var fileDataOrderer = fileSystem.readFileSync('C:\\Users\\MazenEl-Shafie\\Documents\\YAML-Generator-Task\\orderer.txt').toString();

const BlockchainSetup = (req,response,next) => {
    //console.log(req.body.numberOfPeers);
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

    for(let j=0 ; j <  numberOfOrganizations ; j++){
        for(k=0 ; k< numberOfPeers ; k++){
            var result = fileDataPeer.replace(/microsoft/g, orgNames[j]);
            var result2=result.replace(/mazen/g,domainName);
            var result3=result2.replace(/peer0/g,"peer"+k);
            fileDataWrite +=result3;
            fileDataWrite += "\n";
        }
    }

    fileSystem.writeFileSync('C:\\Users\\MazenEl-Shafie\\Documents\\YAML-Generator-Task\\output.yaml',fileDataWrite);
    response.send("Done el7.. please check output.yaml file");
};

module.exports = {BlockchainSetup};