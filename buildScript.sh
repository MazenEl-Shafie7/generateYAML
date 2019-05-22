    echo "Build is executing"
  function printHelp() {
      echo "Usage: "
      echo "  build.sh <mode>"
      echo "    <mode> - one of 'up', 'down',or 'generate'"
      echo "      - 'up' - bring up the network with docker-compose up"
      echo "      - 'down' - clear the network with docker-compose down"
      echo "      - 'generate' - generate required certificates and genesis block"
      echo "Steps:"
      echo "	build.sh generate"
      echo "	build.sh up"
      echo "	build.sh down"
  }  
  
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


        cd crypto-config/peerOrganizations/Yarab.domain7.com/ca/
        PRIV_KEY=$(ls *_sk)
        cd "$CURRENT_DIR"
        sed $OPTS "s/CA0_PRIVATE_KEY/
${PRIV_KEY}/g" docker-compose-e2e-up.yaml


        cd crypto-config/peerOrganizations/YarabTany.domain7.com/ca/
        PRIV_KEY=$(ls *_sk)
        cd "$CURRENT_DIR"
        sed $OPTS "s/CA1_PRIVATE_KEY/
${PRIV_KEY}/g" docker-compose-e2e-up.yaml


    }
    

function generateChannelArtifacts() {
     which configtxgen
  if [ "$?" -ne 0 ]; then
      echo "configtxgen tool not found. exiting"
      exit 1
  fi
      echo "#########  Generating Orderer Genesis block ##############"
      mkdir channel-artifacts
      echo "CONSENSUS_TYPE="$CONSENSUS_TYPE
      echo "CHANNEL_NAME="$CHANNEL_NAME
      set -x
  if [ "$CONSENSUS_TYPE" == "solo" ]; then
      configtxgen -profile TwoOrdererGenesis -channelID byfn-sys-channel -outputBlock ./channel-artifacts/genesis.block
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
      echo "### Generating channel configuration transaction "channel.tx" ###"
      configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
      res=$?
      set +x
  if [ $res -ne 0 ]; then
      echo "Failed to generate channel configuration transaction..."
      exit 1
  fi



        echo "#######    Generating anchor peer update for ${org.name.toUpperCase()}MSP   ##########"
        configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/YARABMSPanchors.tx -channelID $CHANNEL_NAME -asOrg YARABMSP
        res=$?
        set +x
    if [ $res -ne 0 ]; then
        echo "Failed to generate anchor peer update for YARABMSP..."
        exit 1
    fi


        echo "#######    Generating anchor peer update for ${org.name.toUpperCase()}MSP   ##########"
        configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/YARABTANYMSPanchors.tx -channelID $CHANNEL_NAME -asOrg YARABTANYMSP
        res=$?
        set +x
    if [ $res -ne 0 ]; then
        echo "Failed to generate anchor peer update for YARABTANYMSP..."
        exit 1
    fi

    }


  function networkUp(){
  docker-compose -f $COMPOSE_FILE up
  if [ "$CONSENSUS_TYPE" == "kafka" ]; then
      sleep 1
      echo "Sleeping 10s to allow $CONSENSUS_TYPE cluster to complete booting"
      sleep 9
  fi
  
  if [ "$CONSENSUS_TYPE" == "etcdraft" ]; then
      sleep 1
      echo "Sleeping 15s to allow $CONSENSUS_TYPE cluster to complete booting"
      sleep 14
  fi
      sleep 30
      docker exec cli genChaicodeScript.sh
      echo "Network is up"
  }


  function networkDown(){
     docker-compose -f docker-compose-e2e-up.yaml down --volumes --remove-orphans
     rm -f docker-compose-e2e-up.yaml
    echo "Network is down"
  }
    


  COMPOSE_FILE=docker-compose-e2e-up.yaml
  MODE=$1
  while getopts "h" opt; do
      case "$opt" in
      h | \?)
      printHelp
      exit 0
      ;;
  esac
  done
  
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
  else
      printHelp
      exit 1
  fi

