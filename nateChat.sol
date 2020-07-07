pragma solidity ^ 0.5.1;

contract nateChat{
    struct message{
        address sender;
        address recipient;
        string message;
    }
    event gotMessage(address a, string m, uint256 messagesLeft);
    mapping (address => message[]) convos;
    
    constructor () public{
        
    }
    function sendMessage(address _from, address _to, string memory m) public {
        message memory myMessage = message(_from, _to, m);
        convos[_to].push(myMessage);
    }
    
    function retrieve (address _to) public returns (address, string memory, uint256 left) {
        message memory mostRecent = convos[_to][0];
        address _from = mostRecent.sender;
        string memory str = mostRecent.message;
        remove(_to);
        emit gotMessage(_from, str, convos[_to].length);
        return(_from, str, convos[_to].length);
    }
    function remove(address _to) private{
        message[] memory m = convos[_to];
        for (uint256 i = 0; i < convos[_to].length-1; i++){
            convos[_to][i] = convos[_to][i+1];
        }
        delete convos[_to][m.length-1];
        convos[_to].length--;
    }
}