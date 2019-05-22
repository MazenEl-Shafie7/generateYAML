ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/domain7.com/orderers/HnaOrderer1.domain7.com/msp/tlscacerts/tlsca.domain7.com-cert.pem
PEER0_YARAB_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.domain7.com/peers/peer0.Yarab.domain7.com/tls/ca.crt
PEER1_YARAB_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.domain7.com/peers/peer1.Yarab.domain7.com/tls/ca.crt
PEER2_YARAB_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/Yarab.domain7.com/peers/peer2.Yarab.domain7.com/tls/ca.crt
PEER0_YARABTANY_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.domain7.com/peers/peer0.YarabTany.domain7.com/tls/ca.crt
PEER1_YARABTANY_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.domain7.com/peers/peer1.YarabTany.domain7.com/tls/ca.crt
PEER2_YARABTANY_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/YarabTany.domain7.com/peers/peer2.YarabTany.domain7.com/tls/ca.crt
verifyResult(){
  if [ $1 -ne 0 ]; then
      echo "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
      echo "========= ERROR !!! FAILED to execute End-2-End Scenario ==========="
      echo
      exit 1
  fi
  }

  
  setOrdererGlobals() {
      CORE_PEER_LOCALMSPID="OrdererMSP"
      CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/domain7.com/orderers/HnaOrderer1.domain7.com/msp/tlscacerts/tlsca.domain7.com-cert.pem
      CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/domain7.com/users/Admin@domain7.com/msp
  }

  
  joinChannelWithRetry(){
      PEER=$1
      ORG=$2
      set -x
      peer channel join -b mychannel.block >&log.txt
      res=$?
      set +x
      cat log.txt
  if [ $res -ne 0 -a $COUNTER -lt $MAX_RETRY ]; then
     COUNTER=$(expr $COUNTER + 1)
     echo "failed to join the channel, Retry after $DELAY seconds"
     sleep $DELAY
     joinChannelWithRetry $PEER $ORG
  else
     COUNTER=1
  fi
      verifyResult $res "After $MAX_RETRY attempts, failed to join"
  }


