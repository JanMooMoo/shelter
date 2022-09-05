export const KadenaRegistration_Address = '0x25D452BF158f71000DA685C34Ca3168D34e8922f';

export const KadenaRegistration_ABI = [
  {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "registered",
    "outputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "entityType",
        "type": "string"
      },
      {
        "name": "country",
        "type": "string"
      },
      {
        "name": "city",
        "type": "string"
      },
      {
        "name": "ipfs",
        "type": "string"
      },
      {
        "name": "time",
        "type": "uint256"
      },
      {
        "name": "pending",
        "type": "bool"
      },
      {
        "name": "registered",
        "type": "bool"
      },
      {
        "name": "rating",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "entity",
    "outputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "entityType",
        "type": "string"
      },
      {
        "name": "country",
        "type": "string"
      },
      {
        "name": "city",
        "type": "string"
      },
      {
        "name": "ipfs",
        "type": "string"
      },
      {
        "name": "time",
        "type": "uint256"
      },
      {
        "name": "pending",
        "type": "bool"
      },
      {
        "name": "registered",
        "type": "bool"
      },
      {
        "name": "rating",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "entityType",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "country",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "city",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "ipfs",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "pending",
        "type": "bool"
      },
      {
        "indexed": false,
        "name": "registered",
        "type": "bool"
      }
    ],
    "name": "RegistrationRequest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "Admin",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "applicant",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "registeredAs",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "entityType",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "pending",
        "type": "bool"
      },
      {
        "indexed": true,
        "name": "registrationStatus",
        "type": "bool"
      },
      {
        "indexed": false,
        "name": "rating",
        "type": "uint256"
      }
    ],
    "name": "Registration",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_hospitalName",
        "type": "string"
      },
      {
        "name": "_entityType",
        "type": "string"
      },
      {
        "name": "_country",
        "type": "string"
      },
      {
        "name": "_city",
        "type": "string"
      },
      {
        "name": "_ipfs",
        "type": "string"
      }
    ],
    "name": "registerHospital",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_applicant",
        "type": "address"
      },
      {
        "name": "_accepted",
        "type": "bool"
      }
    ],
    "name": "register",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getHospitalStatus",
    "outputs": [
      {
        "name": "_hospitalName",
        "type": "string"
      },
      {
        "name": "_entityType",
        "type": "string"
      },
      {
        "name": "_country",
        "type": "string"
      },
      {
        "name": "_city",
        "type": "string"
      },
      {
        "name": "_ipfs",
        "type": "string"
      },
      {
        "name": "_pending",
        "type": "bool"
      },
      {
        "name": "_registered",
        "type": "bool"
      },
      {
        "name": "_time",
        "type": "uint256"
      },
      {
        "name": "_rating",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getHospitalCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]