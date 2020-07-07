let fs = require ("fs");
let solc = require ("solc");
let web3 = require ("web3");
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let params = {
	language: "Solidity".
	sources: {
		"example": {
			content: fs.readFileSync ('./nateChat.sol', 'utf-8')
		}
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["abi", "evm.bytcode"]
			}
		}
	}
};
let compiled = JSON.parse (solc.compileStandardWrapper (JSON.stringify (params)));
if (typeof compiled.errors === "undefined") {
  console.log ("Solidity compilation successful");
} else {
  console.error ("Solidity compilation failed:", compiled.errors.length, "errors");
  for (let i = 0; i < compiled.errors.length; i++) {
    console.error (compiled.errors[i].formattedMessage);
  }
  console.error ("Terminating");
  process.exit (1);
}

let abi = compiled.contracts.example.SimpleCoin.abi;
let bytecode = "0x" + compiled.contracts.example.SimpleCoin.evm.bytecode.object;
let gasEstimate = web3.eth.estimateGas({ data: bytecode }) + 100000;
let nateChatContractFactory = web3.eth.contract (abi);

let initialSupply = 10000;
let nateChateInstance = nateChatContractFactory.new (initialSupply, { 
  from: web3.eth.accounts[1], 
  data: bytecode, 
  gas: gasEstimate 
}, function (error, result) { 
  // Note: this function is called twice.
  // The contract address will not be available the first time.
  if (error !== null) {
    console.error ("ERROR: ", error);
    console.error ("Terminating");
    process.exit (1);
  }
  if (typeof result.address !== "undefined") {
    console.log ("Contract address: " + result.address);
    console.log ("Contract transaction hash: " + result.transactionHash);
    fs.writeFileSync ("address.txt", result.address, "utf-8");
    fs.writeFileSync ("abi.json", JSON.stringify (abi), "utf-8");
  }
});