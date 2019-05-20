pragma solidity ^0.5.2;

contract LoyalityProgram {
    address public owner;

    function LoyalityProgram() public {
        owner = msg.sender;
    }

    mapping(uint => User) public users;
    Partner[] public partners;

    struct User {
        uint accountId;
        string userType;
        string fullName;
        string phone;
        address wallet;
    }

    struct Partner {
        string name;
        string id;
        uint uId;
    }
}
