pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

// SPDX-License-Identifier: MIT
/**
* @title KadenaRegistration
* @dev Is a platform that Hospitals could utilize to connect & form alliance with other hospitals.
* Registered Hopitals in Kadena could call help & post/borrow essential items that they need at the moment or will be needing in the near future.
* Registered Hospital that has extra essential items could also post/give items that they think will be helpful to other hospitals.
* Every registered hospital in Kadena has a rating that corresponds to their actions on the platform.
* Some features/functions will be unavailable to a registered hospital if their rating drops a certain point.
*/

contract KadenaRegistration is Ownable {
	using SafeMath for uint;

	struct Entity {
	    address owner;
	    string name;
	    string entityType;
	    string country;
	    string city;
	    string ipfs;
	    uint time;
	    bool pending;
	    bool registered;
	    uint rating;
	}
	
	
    Entity[] public entity;
	mapping(address => Entity) public registered;

    event RegistrationRequest(address indexed owner, string name, string entityType, string country, string city, string ipfs, uint time, bool pending, bool registered);	
    event Registration(address Admin, address indexed applicant, string registeredAs, string entityType, uint time, bool pending, bool indexed registrationStatus, uint rating);


   /**
	* @dev Function Request Hospital Registration.
	* @param _hospitalName string - Name of Hospital.
	* @param _country string - The country where the hospital is located.
	* @param _city string - The city where the hospital is located.
	* @param _ipfs - The IPFS hash containing additional information about the Hospital.

	* @notice Requires that the contract is not paused.
	* @notice Requires that the applicant address is not yet registered & does not have a pending registration.
	*/
    
function registerHospital(
		string memory _hospitalName,
		string memory _entityType,
	    string memory _country,
	    string memory _city,
	    string memory _ipfs
    	)
		public
		
	{
        require(!registered[msg.sender].registered && !registered[msg.sender].pending, "You are Registered or have pending registration");    

		Entity memory _registerHospital = Entity({
			owner: msg.sender,
			name: _hospitalName,
			entityType: _entityType,
		    country: _country,
			city: _city,
			ipfs: _ipfs,
			time: now,
			pending: true,
			registered: false,
			rating:0
			
		});

		registered[msg.sender].owner = msg.sender;
		registered[msg.sender].name = _hospitalName;
		registered[msg.sender].entityType = _entityType;
		registered[msg.sender].country = _country;
		registered[msg.sender].city = _city;
		registered[msg.sender].ipfs = _ipfs;
		registered[msg.sender].time = now;
		registered[msg.sender].pending = true;
		registered[msg.sender].registered = false;
		emit RegistrationRequest(msg.sender, _hospitalName, _entityType, _country, _city, _ipfs, now, true, false);
	}
	
    /**
	* @dev Function to Accept/Reject or Revoke Registration .
	* @param _applicant address - The Ethereum Address of the applicant.
	* @param _accepted - If true Ethereum Address Registration is accepted.

	* @notice Requires that the contract is not paused.
	* @notice Requires that the approver is the owner of contract.
	* @notice Requires that the applicant address does not have a pending registration.
	*/
	
   function register(address _applicant, bool _accepted)
		public
        onlyOwner()

	{   
	    if(_accepted){
        require(registered[_applicant].pending , "Status not Pending");
        
        registered[_applicant].time = now;
        registered[_applicant].pending = false;
        registered[_applicant].registered = true;
        registered[_applicant].rating = 35;
	    }
        
        else{
		registered[_applicant].time = now;
        registered[_applicant].pending = false;
        registered[_applicant].registered = false;
        }
        
         emit Registration(msg.sender, registered[_applicant].owner,registered[_applicant].name,registered[_applicant].entityType,now,registered[_applicant].pending,registered[_applicant].registered,registered[_applicant].rating);
	}
	
    /**
	* @dev Function to show information about the hospital.
	* @param _owner address - The Ethereum Address of the hospital.
	* return _hospitalName string - The name of the hospital.
	* return _country string - The country where the hospital is located.
	* return _city string - The city where the hospital is located.
	* return _ipfs string - The IPFS hash containing additional information about event.
	* return _pending bool - If true account has a pending registration.
	* return _registered bool - If true account is registered.
	* return _time uint - time of registration.
	* return _rating uint - The rating of the account.

	*/
	
	function getHospitalStatus(address _owner)
	    public
	    view
	    returns(
	        string memory _hospitalName,
	        string memory _entityType,
	        string memory _country,
	        string memory _city,
	        string memory _ipfs,
	        bool  _pending, 
	        bool  _registered,
	        uint  _time,
	        uint  _rating
	    ){
	   Entity memory _registerhospital = registered[_owner];
	    return(

		    _registerhospital.name,
		    _registerhospital.entityType,
			_registerhospital.country,
			_registerhospital.city,
			_registerhospital.ipfs,
			_registerhospital.pending,
			_registerhospital.registered,
			_registerhospital.time,
			_registerhospital.rating
			
		);
	}

	modifier Registered() {
	     require(registered[msg.sender].registered == true && registered[msg.sender].pending == false, "You are Not Registered");
    _;
	    
	}


	function getHospitalCount() public view returns(uint) {
		return entity.length;
	}
	
}