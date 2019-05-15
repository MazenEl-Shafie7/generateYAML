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

  # Copy the template to the file that will be modified to add the private key
  cp docker-compose-e2e-template.yaml docker-compose-e2e.yaml

  # The next steps will replace the template's contents with the
  # actual values of the private key file names for the two CAs.
  CURRENT_DIR=$PWD
  cd crypto-config/peerOrganizations/microsoft.mazen.com/ca/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/CA1_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-e2e.yaml
  cd crypto-config/peerOrganizations/oracle.mazen.com/ca/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/CA2_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-e2e.yaml
  cd crypto-config/peerOrganizations/dell.mazen.com/ca/
  PRIV_KEY=$(ls *_sk)
  cd "$CURRENT_DIR"
  sed $OPTS "s/CA3_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-e2e.yaml
  # If MacOSX, remove the temporary backup of the docker-compose file
  if [ "$ARCH" == "Darwin" ]; then
    rm docker-compose-e2e.yamlt
  fi
}

function replacePrivateKey() {
 ARCH=$(uname -s | grep Darwin)
 if [ "$ARCH" == "Darwin" ]; then
 OPTS="-it"
 OPTS="-i"
 fi
 cp docker-compose-e2e.yaml docker-compose-e2e-up.yaml
 CURRENT_DIR=$PWD

 cd crypto-config/peerOrganizations/${org.name}.${Data.domainName}.com/ca/
 PRIV_KEY=$(ls *_sk)
 cd "$CURRENT_DIR"
  sed $OPTS "s/CA${caCount}_PRIVATE_KEY/
${PRIV_KEY}/g" docker-compose-e2e-up.yaml
     
}



function generateChannelArtifacts() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting"
    exit 1
  fi

  echo "CONSENSUS_TYPE="$CONSENSUS_TYPE
  set -x
  if [ "$CONSENSUS_TYPE" == "solo" ]; then
    configtxgen -profile ThreeOrgsOrdererGenesis -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block
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
  echo
  echo "#################################################################"
  echo "### Generating channel configuration transaction 'channel.tx' ###"
  echo "#################################################################"
  set -x
  configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate channel configuration transaction..."
    exit 1
  fi

  echo
  echo "#################################################################"
  echo "#######    Generating anchor peer update for microsoftMSP   ##########"
  echo "#################################################################"
  set -x
  configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/microsoftMSPanchors.tx -channelID $CHANNEL_NAME -asOrg microsoftMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for microsoftMSP..."
    exit 1
  fi

  echo
  echo "#################################################################"
  echo "#######    Generating anchor peer update for dellMSP   ##########"
  echo "#################################################################"
  set -x
  configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/dellMSPanchors.tx -channelID $CHANNEL_NAME -asOrg dellMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for dellMSP..."
    exit 1
  fi

  echo
  echo "#################################################################"
  echo "#######    Generating anchor peer update for oracleMSP   ##########"
  echo "#################################################################"
  set -x
  configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate \
    ./channel-artifacts/oracleMSPanchors.tx -channelID $CHANNEL_NAME -asOrg oracleMSP
  res=$?
  set +x
  if [ $res -ne 0 ]; then
    echo "Failed to generate anchor peer update for oracleMSP..."
    exit 1
  fi
  echo
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
