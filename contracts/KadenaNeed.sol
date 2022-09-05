pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './KadenaRegistration.sol';

// SPDX-License-Identifier: MIT
/**
* @title KadenaNeed
* @dev Is a platform that Hospitals could utilize to connect & form alliance with other hospitals.
* Registered Hopitals in Kadena could call help & post/borrow essential items that they need at the moment or will be needing in the near future.
* Registered Hospital that has extra essential items could also post/give items that they think will be helpful to other hospitals.
* Every registered hospital in Kadena has a rating that corresponds to their actions on the platform.
* Some features/functions will be unavailable to a registered hospital if their rating drops a certain point.
*/

contract KadenaNeed is KadenaRegistration, Pausable{
	using SafeMath for uint;

	struct NeedHelp {
		address owner;
		string entity;
		string title;
		string category;
		string item;
		uint amount;
		uint committed;
		bool borrow;
		uint minimum;
		uint endDate;
		string ipfs;
	}
	
	NeedHelp[] private needHelp;
	mapping(address => uint256[]) private neededEvents;
	mapping(uint => mapping(address => bool)) hasPledged;

    event NeedAHand(address indexed ownerNeed, uint eventId, string hospital,string title,string item, uint amount, bool borrow, uint endDate, string ipfs);
    event Pledged(address indexed pledgedBy, string sender , string receiver,uint date, uint indexed eventId, string item, uint committed, address indexed pledgeTo,uint endDate,bool borrow, uint addedRating);


    /**
	* @dev Function creates the event to Call For Help.
	* @param _title string - The title of the event.
	* @param _category string - The category of the item.
	* @param _item string - The name of item.
	* @param _amount uint - The total amount of items needed.
	* @param _borrow bool - True if the items is expected to be returned in the future.
	* @param _minimumAmount - minimum amount to pledge.
	* @param _endDate - End date of the event.
	* @param _ipfs - The IPFS hash containing additional information about the event.

	* @notice Requires that the contract is not paused.
    * @notice Requires that the sender is registered.
	* @notice Requires that the event time is in the future.
	* @notice Requires that the sender rating is greater than or equal to 20.
    * @notice Requires that the amount is greater than 0.
	*/
	
	function callForHelp(
		string memory _title,
		string memory _category,
		string memory _item,
		uint _amount,
		bool _borrow,
		uint _minimumAmount,
		uint _endDate,
		string memory _ipfs
	
	)
    whenNotPaused()
    Registered()
		public
	{
	    require(now < _endDate);
	    require(registered[msg.sender].rating > 20);
	    require(_amount > 0 && _minimumAmount <= _amount);
   
	NeedHelp memory _event = NeedHelp({
			owner: msg.sender,
			entity: registered[msg.sender].name,
			title: _title,
			category: _category,
			item: _item,
			amount: _amount,
			committed:0,
			borrow: _borrow,
			minimum: _minimumAmount,
			endDate: _endDate,
			ipfs: _ipfs
			
			
		});
		needHelp.push(_event);
      	uint _eventId = needHelp.length.sub(1);
      	uint _subtractedRating;
		neededEvents[msg.sender].push(_eventId);
		
		if(registered[msg.sender].rating >= 25){
		     _subtractedRating = 5;
		}
		
		else {
		    _subtractedRating = registered[msg.sender].rating - 20;
		}
	    
		registered[msg.sender].rating = registered[msg.sender].rating.sub(_subtractedRating);
		emit NeedAHand(msg.sender, _eventId,registered[msg.sender].name,_title,_item, _amount, _borrow,_endDate,_ipfs); 

	}
	

    /**
	* @dev Function to show information about call for help event.
	* @param _id uint - Event ID.
	* return title string - The title of the event.
	* return category string - The category of needed item.
	* return item string - The name of the item.
	* return amount uint - The amount of items needed.
	* return commited uint - The amount of items currently committed.
	* return borrow bool - True if the item is to be returned in the future.
	* return minimum uint - Minimum amount to pledge.
	* return endDate uint - End date of the event.
	* return ipfs string - The IPFS hash containing additional information about event.
	* return owner address - The owner of the event.

	* @notice Requires that the events exist.
	*/
	
	function callForHelpDetails(uint _id)
		public
		view
	    returns(
		    string memory title,
		    string memory category,
	    	string memory item,
	    	uint amount,
	    	uint committed,
	    	bool borrow,
	    	uint minumum,
	    	uint endDate,
	    	string memory ipfs,
	    	address owner
    	) {
	    require(_id < needHelp.length);
	    NeedHelp memory _event = needHelp[_id];
		return(
			_event.title,
			_event.category,
			_event.item,
			_event.amount,
			_event.committed,
			_event.borrow,
			_event.minimum,
			_event.endDate,
			_event.ipfs,
			_event.owner
		);
	}
	
	/**
	* @dev Function to give item to the needed asstistance pool.
	* @param _eventId - The ID of the Call for Help Event.
	* @param _commit - The amount of the item to commit.
	
    * @notice Requires that the event exist.
    * @notice Requires that the commit is greater than 0.
    * @notice Requires that the amount of items to give is <= total needed items in the pool.
    * @notice Requires that the amount of items to give is <= current needed items in the pool.
    * @notice Requires that the giver is not the creator of the event.
    * @notice Requires that the events hasn't ended yet.
	*/
	
	function pledge(uint _eventId, uint _commit)
	    whenNotPaused()
	    Registered()
		public
		
	{
	    
		require(_eventId < needHelp.length);
		NeedHelp memory _event = needHelp[_eventId];
		
		require(_commit > 0);
		require(_commit <= needHelp[_eventId].amount && _commit <= needHelp[_eventId].amount.sub(needHelp[_eventId].committed));
		
		if((needHelp[_eventId].amount - needHelp[_eventId].committed) >= needHelp[_eventId].minimum){
	      require(_commit >= needHelp[_eventId].minimum);
	    }
		require(msg.sender != needHelp[_eventId].owner);
		require(needHelp[_eventId].endDate > now);
		uint _addedRating;
		
		needHelp[_eventId].committed = needHelp[_eventId].committed.add(_commit);
		
		if(hasPledged[_eventId][msg.sender] == false){
		if (registered[msg.sender].rating <= 57){
		     _addedRating = 3;
		}
		
		else{
		    _addedRating = 60 - registered[msg.sender].rating;
		}
		
		registered[msg.sender].rating = registered[msg.sender].rating.add(_addedRating);
		hasPledged[_eventId][msg.sender] = true;
		}
		emit Pledged(msg.sender,registered[msg.sender].name, registered[needHelp[_eventId].owner].name,now, _eventId,needHelp[_eventId].item, _commit, needHelp[_eventId].owner,needHelp[_eventId].endDate,needHelp[_eventId].borrow, _addedRating);
	}
	

	/**
	* @dev Function to show events of the specified address.
	* @param _owner address - The address to query the events of.
	* @return uint[] - Array of events IDs.
	*/
	function needsOf(address _owner) public view returns(uint[] memory) {
		return neededEvents[_owner];
	}


	/**
	* @dev Function returns number of all events.
	* @return uint - Number of events.
	*/
	function getNeededCount() public view returns(uint) {
		return needHelp.length;
	}
	
}