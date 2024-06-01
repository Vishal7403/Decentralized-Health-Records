// pragma solidity ^0.8.24;

// // Uncomment this line to use console.log
// // import "hardhat/console.sol";

// contract PatientData {
//     struct File{
//         string Name;
//         string FileURI;

//     }
//     mapping (address => File[]) Users;

//     function addData  (string memory URI,string memory name) public
//     {
//         Users[msg.sender].push(File({Name:name,FileURI:URI}));
//     }

//     function getData(address User) view public returns(File [] memory){
//         return Users[User];
//     }
// }

// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

contract PatientData {
    mapping(address => address) data;
    event UserRegistered(address indexed user, address indexed adr);

    function getUserData() public {
        Patient P=new Patient(msg.sender);
        data[msg.sender] = address(P);
        emit UserRegistered(msg.sender, address(P));
    }
}

contract Patient {
    address Owner;
    struct File {
        string Name;
        string FileURI;
    }
    mapping(address => uint) Permits;
    mapping(address => uint) Requests;
    address [] permits;
    address[] requests;
    constructor(address User) {
        Owner = User;
    }

    File[] Files;

    function print() public view returns (address){
        return Owner;
    }
    function addData(string memory URI, string memory name) public {
        require(msg.sender == Owner, "You don't have required permissions");
        Files.push(File({Name: name, FileURI: URI}));
    }

    function getData() public view returns (File[] memory) {
        require(
            msg.sender == Owner || Permits[msg.sender]>0,
            "User does not have required permissions to access the data"
        );
        return Files;
    }

    function requestPermission() public {
        require(
            msg.sender != Owner &&
                Permits[msg.sender]==0 &&
                Requests[msg.sender]==0,
            "Action denied"
        );
        requests.push(msg.sender);
        Requests[msg.sender] =requests.length;
    }

    function handlePermission(address User, bool data) public {
        require(
            msg.sender == Owner,
            "You don't have accessibility to change permissions"
        );
        if (Requests[User]>0) {
            uint idx=Requests[User]-1;
            uint len=requests.length;
            Requests[requests[len-1]]=idx;
            (requests[idx],requests[len-1])=(requests[len-1],requests[idx]);
            delete Requests[User];
            //delete requests[len-1];
            requests.pop();
        }
        if (data) {
            permits.push(User);
            Permits[User] =permits.length;
        }
    }

    function RemovePermission(address User) public {
        require(
            msg.sender == Owner,
            "You don't have accessibility to change permissions"
        );
            uint idx=Permits[User]-1;
            uint len=permits.length;
            Permits[permits[len-1]]=idx;
            (permits[idx],permits[len-1])=(permits[len-1],permits[idx]);
            delete Permits[User];
            //delete permits[len-1];
            permits.pop();
    }
    function getPendingRequests() public view  returns (address [] memory)
    {
        require(msg.sender==Owner,"You don't have required permissions to access data");
        return requests;
    }
    function getPermits() public view returns (address [] memory)
    {
         require(msg.sender==Owner,"You don't have required permissions to access data");
        return permits;
    }
}
