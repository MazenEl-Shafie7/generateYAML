1- Clone the project
2- npm install 
3- nodemon index.js
4- Postman:
	URL : http://localhost:3000/generateYAML
	Body:
	{
		"domainName":"domain7",
		"numberOfOrganizations":"2",
		"orgNames":["Barcelona","Google"],
		"numberOfPeers":"3",
		"db":"Couchdb",
		"ordererName":"HnaOrderer1",
		"chainCodeName":"smartContract.js",
		"chainCodeType":"node"
	}
5- check the output files:
		1-docker-compose-e2e.yaml
		2-crypto-config.yaml
		3-configtx.yaml
		4-buildScript.sh
		5-genChaicodeScript.sh
		6-genUtils.sh

6-./buildScript.sh generate  
  ./buildScript.sh up  
  ./buildScript.sh down 
