    echo "Build is executing"
    
    function generateCerts() {
     which cryptogen
     if [ "$?" -ne 0 ]; then
     echo "cryptogen tool not found. exiting"
     exit 1
     fi
    
     if [ -d "crypto-config" ]; then
     rm -Rf crypto-config
     fi
     set -x
     cryptogen generate --config=./crypto-config.yaml
     res=$?
     set +x
     if [ $res -ne 0 ]; then
     echo "Failed to generate certificates..."
     exit 1
     fi
    }
    



    function replacePrivateKey() {
     ARCH=$(uname -s | grep Darwin)
     if [ "$ARCH" == "Darwin" ]; then
     OPTS="-it"
     else
     OPTS="-i"
     fi
    
     cp docker-compose-e2e.yaml docker-compose-e2e-up.yaml
     CURRENT_DIR=$PWD
// For loop
     cd crypto-config/peerOrganizations/${org.name}.${Data.domainName}.com/ca/
       PRIV_KEY=$(ls *_sk)
       cd "$CURRENT_DIR"
       sed $OPTS "s/CA${caCount}_PRIVATE_KEY/
      ${PRIV_KEY}/g" docker-compose-e2e-up.yaml
// End of For Loop
    }
    



    function generateChannelArtifacts() {
     which configtxgen
     if [ "$?" -ne 0 ]; then
     echo "configtxgen tool not found. exiting"
     exit 1
     fi
     mkdir channel-artifacts
     echo "CONSENSUS_TYPE="$CONSENSUS_TYPE
     set -x
     if [ "$CONSENSUS_TYPE" == "solo" ]; then
     configtxgen -profile OrgsOrdererGenesis -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block
     elif [ "$CONSENSUS_TYPE" == "kafka" ]; then
     configtxgen -profile SampleDevModeKafka -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block
     elif [ "$CONSENSUS_TYPE" == "etcdraft" ]; then
     configtxgen -profile SampleMultiNodeEtcdRaft -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block
     else
     set +x
     echo "unrecognized CONSESUS_TYPE='$CONSENSUS_TYPE'. exiting"
     exit 1
     fi
     res=$?
     set +x
     if [ $res -ne 0 ]; then
     echo "Failed to generate orderer genesis block..."
     exit 1
     fi
     configtxgen -profile OrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
     res=$?
     set +x
     if [ $res -ne 0 ]; then
     echo "Failed to generate channel configuration transaction..."
     exit 1
     fi
// For Loop
 	configtxgen -profile OrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/${org.name.toUpperCase()}MSPanchors.tx -channelID $CHANNEL_NAME -asOrg 		${org.name.toUpperCase()}MSP
       res=$?
       set +x
       if [ $res -ne 0 ]; then
       echo "Failed to generate anchor peer update for ${org.name.toUpperCase()}MSP..."
       exit 1
       fi
// End of For Loop
    }



    function networkUp(){
     docker-compose -f $COMPOSE_FILE up -d
    echo "Network is up"
    }




    function networkDown(){
     docker-compose -f docker-compose-e2e-up.yaml down --volumes --remove-orphans
     rm -f docker-compose-e2e-up.yaml
    echo "Network is down"
    }
    



    COMPOSE_FILE=docker-compose-e2e-up.yaml
    MODE=$1
    CHANNEL_NAME="mychannel"
    CONSENSUS_TYPE="solo"
    
    if [ "${MODE}" == "up" ]; then
    networkUp
    elif [ "${MODE}" == "generate" ]; then
    generateCerts
    replacePrivateKey
    generateChannelArtifacts
    elif [ "${MODE}" == "down" ]; then 
    networkDown
    fi
    build.end();
}

