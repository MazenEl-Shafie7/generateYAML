  #!/bin/bash
  
  COUNTER=1
  MAX_RETRY=10
  DELAY=3
  
  echo "Channel name : mychannel"
  echo "Chaincode path: CC_Path"
  . scripts/utils.sh
  
  createChannel(){
      CORE_PEER_LOCALMSPID="YARABMSP"
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_YARABCA
      CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.domain7.com/users/Admin@Yarab.domain7.com/msp
      CORE_PEER_ADDRESS=peer0.Yarab.domain7.com:7051
      if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
          set -x
          peer channel create -o HnaOrderer1.domain7.com:7050 -c mychannel -f ./channel-artifacts/channel.tx >&log.txt
          res=$?
          set +x
      else
          set -x
          peer channel create -o HnaOrderer1.domain7.com:7050 -c mychannel -f ./channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
          res=$?
          set +x
      fi
      cat log.txt
      verifyResult $res "Channel creation failed"
      echo "===================== Channel 'mychannel' created ===================== "
      echo
  }



joinChannel(){
            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER$0_{org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.{Data.domainName}.com/users/Admin@Yarab.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer0.Yarab.{Data.domainName}.com:7051
            joinChannelWithRetry $$0 $$Yarab\n`)
            echo "===================== Peer0.Yarab joined Channel 'mychannel' ===================== "




            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER$1_{org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.{Data.domainName}.com/users/Admin@Yarab.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer1.Yarab.{Data.domainName}.com:8051
            joinChannelWithRetry $$1 $$Yarab\n`)
            echo "===================== Peer1.Yarab joined Channel 'mychannel' ===================== "




            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER$2_{org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.{Data.domainName}.com/users/Admin@Yarab.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer2.Yarab.{Data.domainName}.com:9051
            joinChannelWithRetry $$2 $$Yarab\n`)
            echo "===================== Peer2.Yarab joined Channel 'mychannel' ===================== "




            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER$0_{org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.{Data.domainName}.com/users/Admin@YarabTany.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer0.YarabTany.{Data.domainName}.com:10051
            joinChannelWithRetry $$0 $$YarabTany\n`)
            echo "===================== Peer0.YarabTany joined Channel 'mychannel' ===================== "




            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER$1_{org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.{Data.domainName}.com/users/Admin@YarabTany.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer1.YarabTany.{Data.domainName}.com:11051
            joinChannelWithRetry $$1 $$YarabTany\n`)
            echo "===================== Peer1.YarabTany joined Channel 'mychannel' ===================== "




            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER$2_{org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.{Data.domainName}.com/users/Admin@YarabTany.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer2.YarabTany.{Data.domainName}.com:12051
            joinChannelWithRetry $$2 $$YarabTany\n`)
            echo "===================== Peer2.YarabTany joined Channel 'mychannel' ===================== "




}
updateAnchorPeers(){            CORE_PEER_LOCALMSPID="YARABMSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_YARABCA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.{Data.domainName}.com/users/Admin@Yarab.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer0.Yarab.{Data.domainName}.com:7051
        if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
                set -x
                peer channel update -o {Data.ordererName}.{Data.domainName}.com:7050 -c mychannel
         -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx >&log.txt
                res=$?
                set +x
        else
                set -x
                peer channel update -o {Data.ordererName}.{Data.domainName}.com:7050 -c mychannel
         -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
                res=$?
                set +x
        fi
            cat log.txt
            verifyResult $res "Anchor peer update failed"
            echo "===================== Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel 'mychannel' ===================== "
            sleep $DELAY
            echo


            CORE_PEER_LOCALMSPID="YARABTANYMSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_YARABTANYCA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.{Data.domainName}.com/users/Admin@YarabTany.{Data.domainName}.com/msp
            CORE_PEER_ADDRESS=peer0.YarabTany.{Data.domainName}.com:10051
        if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
                set -x
                peer channel update -o {Data.ordererName}.{Data.domainName}.com:7050 -c mychannel
         -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx >&log.txt
                res=$?
                set +x
        else
                set -x
                peer channel update -o {Data.ordererName}.{Data.domainName}.com:7050 -c mychannel
         -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
                res=$?
                set +x
        fi
            cat log.txt
            verifyResult $res "Anchor peer update failed"
            echo "===================== Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel 'mychannel' ===================== "
            sleep $DELAY
            echo


}
installChaincode() {
            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_${org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.domain7.com/users/Admin@Yarab.domain7.com/msp
            CORE_PEER_ADDRESS=peer0.Yarab.domain7.com:{7051+peerPort}
            set -x
            peer chaincode install -n {smartContract.js -v 1.0 -l  -p "/opt/gopath/src/github.com/chaincode//" >&log.txt
            res=$?
            set +x
            cat log.txt
            verifyResult $res "Chaincode installation on peer0.Yarab has failed"
            echo "===================== Chaincode is installed on peer0.Yarab ===================== "
            echo
            sleep 2


            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_${org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.domain7.com/users/Admin@YarabTany.domain7.com/msp
            CORE_PEER_ADDRESS=peer0.YarabTany.domain7.com:{7051+peerPort}
            set -x
            peer chaincode install -n {smartContract.js -v 1.0 -l  -p "/opt/gopath/src/github.com/chaincode//" >&log.txt
            res=$?
            set +x
            cat log.txt
            verifyResult $res "Chaincode installation on peer0.YarabTany has failed"
            echo "===================== Chaincode is installed on peer0.YarabTany ===================== "
            echo
            sleep 2


}
instantiateChaincode(){
      CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_{org.name.toUpperCase()}CA
      CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.domain7.com/users/Admin@Yarab.domain7.com/msp
      CORE_PEER_ADDRESS=peer0.Yarab.domain7.com:0
  
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
      set -x
      peer chaincode instantiate -o HnaOrderer1.domain7.com:7050 -C mychannel -n {smartContract.js -l  -v 1.0 -c '{"Args":[]}' -P "AND ({orgsMSP})" >&log.txt
      res=$?
      set +x
  else
      set -x
      peer chaincode instantiate -o HnaOrderer1.domain7.com:7050 --tls CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C mychannel -n {smartContract.js -l  -v 1.0 -c '{"Args":[]}' -P "AND ({orgsMSP})" >&log.txt
      res=$?
      set +x
  fi
     cat log.txt
     verifyResult $res "Chaincode instantiation on peer0.Yarab on channel 'mychannel' failed"
     echo "===================== Chaincode is instantiated on peer0.Yarab on channel 'mychannel' ===================== "
     echo


      CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_{org.name.toUpperCase()}CA
      CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.domain7.com/users/Admin@YarabTany.domain7.com/msp
      CORE_PEER_ADDRESS=peer0.YarabTany.domain7.com:0
  
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
      set -x
      peer chaincode instantiate -o HnaOrderer1.domain7.com:7050 -C mychannel -n {smartContract.js -l  -v 1.0 -c '{"Args":[]}' -P "AND ({orgsMSP})" >&log.txt
      res=$?
      set +x
  else
      set -x
      peer chaincode instantiate -o HnaOrderer1.domain7.com:7050 --tls CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C mychannel -n {smartContract.js -l  -v 1.0 -c '{"Args":[]}' -P "AND ({orgsMSP})" >&log.txt
      res=$?
      set +x
  fi
     cat log.txt
     verifyResult $res "Chaincode instantiation on peer0.YarabTany on channel 'mychannel' failed"
     echo "===================== Chaincode is instantiated on peer0.YarabTany on channel 'mychannel' ===================== "
     echo


}
echo "Creating channel..."
createChannel
echo "Having all peers join the channel..."
joinChannel
echo "Updating anchor peers"
updateAnchorPeers
echo "Installing chaincode"
installChaincode
echo "Instantiating chaincode"
instantiateChaincode
echo "All Good, Channel execution completed"
exit 0
