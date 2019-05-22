            CORE_PEER_LOCALMSPID="{org.name.toUpperCase()}MSP"
            CORE_PEER_TLS_ROOTCERT_FILE=$PEER${i}_{org.name.toUpperCase()}CA
            CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/{org.name}.{domainName}.com/users/Admin@{org.name}.{domainName}.com/msp
            CORE_PEER_ADDRESS=peer{i}.{org.name}.{domainName}.com:{peerPort}
            joinChannelWithRetry $${i} $${org.name}\n`)
            echo "===================== Peer{i}.{org.name} joined Channel '{CHANNEL_NAME}' ===================== "

