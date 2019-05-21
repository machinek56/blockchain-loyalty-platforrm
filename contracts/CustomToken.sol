pragma solidity ^0.5.2;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract CustomToken is ERC20Mintable {
    string public constant name = "Custom Token";
    string public constant symbol = "CTK";
    uint32 public constant decimals = 18;
}
