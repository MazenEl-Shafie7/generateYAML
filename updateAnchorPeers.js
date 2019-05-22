            CORE_PEER_LOCALMSPID="{org.name.toUpperCase}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_{org.name.toUpperCase}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/{org.name}.{domainName}.com/users/Admin@{org.name}.{domainName}.com/msp
            CORE_PEER_ADDRESS=peer0.{org.name}.{domainName}.com:{peerPort}
        if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
                set -x
                peer channel update -o {ordererName}.{domainName}.com:7050 -c {CHANNEL_NAME}
         -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx >&log.txt
                res=$?
                set +x
        else
                set -x
                peer channel update -o {ordererName}.{domainName}.com:7050 -c {CHANNEL_NAME}
         -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
                res=$?
                set +x
        fi
            cat log.txt
            verifyResult $res "Anchor peer update failed"
            echo "===================== Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel '{CHANNEL_NAME}' ===================== "
            sleep $DELAY
            echo

