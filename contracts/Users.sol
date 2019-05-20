pragma solidity ^0.5.2;

contract Users {
    struct User {
        uint accountId;
        string userType;
        string fullName;
        string phone;
        address wallet;
    }

    uint public userCount = 0;

    mapping(address => User) public users;

    event UserCreated(
        uint accountId,
        string fullName
    );

    // method register user
    function registerUser (
        address _addr,
        string memory _userType,
        string memory _fullName,
        string memory _phone
    ) public returns (bool success){
        userCount ++;
        users[_addr].userType = _userType;
        users[_addr].accountId = userCount;
        users[_addr].fullName = _fullName;
        users[_addr].phone = _phone;
        users[_addr].wallet = _addr;
        emit UserCreated(userCount, _fullName);
        return true;
    }

    function getUser (address _addr) public returns(
        string memory phone,
        string memory fullName,
        string memory userType
    ) {
        return(
            users[_addr].phone,
            users[_addr].fullName,
            users[_addr].userType
        );
    }
}
