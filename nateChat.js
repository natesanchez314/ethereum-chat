let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let nateChatContract = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			}
		],
		"name": "retrieve",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "left",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "m",
				"type": "string"
			}
		],
		"name": "sendMessage",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "a",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "m",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "messagesLeft",
				"type": "uint256"
			}
		],
		"name": "gotMessage",
		"type": "event"
	}
]);
let nateChat = nateChatContract.at("0x1933595372c42734f69a4bf94f27992b41a1727b");

function send(){
	let sender = $("#from").val();
	let recipient = $("#to").val();
	let message = $("#Message").val();
	nateChat.sendMessage(sender, recipient, message, {from : sender, gas : 200000});	
	//alert("Message sent!");
}
function get(){
	let recipient = $("#to").val();
	let gotMessageEvent = nateChat.gotMessage();
	//let m = nateChat.retrieve(recipient, {from : recipient, gas : 200000});
	//alert(m);
	//console.log(m);
	gotMessageEvent.watch(function(error, result){
		if(!error){
			$("#recieved").html("Message from: " + result.args.a + "\n\n" + result.args.m + "\n\nYou have " + result.args.messagesLeft + " new messages");
		}
		else{
			console.log(error);
		}
	});
}