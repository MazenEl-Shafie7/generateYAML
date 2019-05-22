      CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
      CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_{org.name.toUpperCase()}CA
      CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/{org.name}.{domainName}.com/users/Admin@{org.name}.{domainName}.com/msp
      CORE_PEER_ADDRESS=peer0.{org.name}.{domainName}.com:{peerPort}
  
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
      set -x
      peer chaincode instantiate -o {ordererName}.{domainName}.com:7050 -C {CHANNEL_NAME} -n {chaincodeName} -l {CC_lang} -v 1.0 -c '{"Args":[]}' -P "AND ({orgsMSP})" >&log.txt
      res=$?
      set +x
  else
      set -x
      peer chaincode instantiate -o {ordererName}.{domainName}.com:7050 --tls CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C {CHANNEL_NAME} -n {chaincodeName} -l {CC_lang} -v 1.0 -c '{"Args":[]}' -P "AND ({orgsMSP})" >&log.txt
      res=$?
      set +x
  fi
     cat log.txt
     verifyResult $res "Chaincode instantiation on peer0.{org.name} on channel '{CHANNEL_NAME}' failed"
     echo "===================== Chaincode is instantiated on peer0.{org.name} on channel '{CHANNEL_NAME}' ===================== "
     echo

