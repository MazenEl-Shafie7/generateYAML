1- Clone the project
2- npm install 
3- nodemon index.js
4- Postman:
	URL : http://localhost:3000/generateYAML
	Body:
	{
		"domainName":"domain",
		"numberOfOrganizations":"2",
		"orgNames":["IBM","Apple"],
		"numberOfPeers":"3",
		"db":"Couchdb",
		"ordererName":"orderer"
	}
5- check the output.yaml(docker.compose.e2e) & output2.yaml(crypto config) output3.yaml(configTx) files.
