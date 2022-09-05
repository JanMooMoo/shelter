pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './KadenaRegistration.sol';

// SPDX-License-Identifier: MIT
/**
* @title KadenaGive
* @dev Is a platform that Hospitals could utilize to connect & form alliance with other hospitals.
* Registered Hopitals in Kadena could call help & post/borrow essential items that they need at the moment or will be needing in the near future.
* Registered Hospital that has extra essential items could also post/give items that they think will be helpful to other hospitals.
* Every registered hospital in Kadena has a rating that corresponds to their actions on the platform.
* Some features/functions will be unavailable to a registered hospital if their rating drops a certain point.
*/

contract KadenaGive is KadenaRegistration, Pausable{
	using SafeMath for uint;

	struct GiveHelp {
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
	
  
	GiveHelp[] private giveHelp;
	mapping(address => uint256[]) private givenEvents;

    event LendAHand(address indexed ownerGive, uint eventId, string name,string title, string item, uint amount, bool borrow, uint endDate, string ipfs);
    event Taken(address indexed takenBy, string receiver , string sender,uint date, uint indexed eventId,string item,uint received, address indexed tookFrom,uint endDate,bool borrow, uint addedRating);


    /**
	* @dev Function creates the event to Provide Assistance.
	* @param _title string - The title of the event.
	* @param _category string - The category of the item.
	* @param _item string - The name of item.
	* @param _amount uint - The total amount of items to be given.
	* @param _borrow bool - True if the items is expected to be returned in the future.
	* @param _minimumAmount - minimum amount to take.
	* @param _endDate - End date of the event.
	* @param _ipfs - The IPFS hash containing additional information about the event.

	* @notice Requires that the contract is not paused.
    * @notice Requires that the sender is registered.
	* @notice Requires that the event time is in the future.
    * @notice Requires that the amount is greater than 0.
	*/
	
	function provideAssistance(
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
	    require(_amount > 0 && _minimumAmount <= _amount);
   
	    GiveHelp memory _event = GiveHelp({
			owner: msg.sender,
			entity: registered[msg.sender].name,
			title: _title,
			category: _category,
			item: _item,
			amount: _amount,
			committed:_amount,
			borrow: _borrow,
		    minimum: _minimumAmount,
			endDate: _endDate,
			ipfs: _ipfs
		});
		giveHelp.push(_event);
      	uint _eventId = giveHelp.length.sub(1);
      	uint _addedRating;
		givenEvents[msg.sender].push(_eventId);
		
		if(registered[msg.sender].rating < 55){
		    _addedRating = 5;
		}
		else {
		    _addedRating = 60 - registered[msg.sender].rating;
		}
	    
		if(registered[msg.sender].rating < 60){
		registered[msg.sender].rating = registered[msg.sender].rating.add(_addedRating);
		    
		}
	    emit LendAHand(msg.sender, _eventId,registered[msg.sender].name,_title,_item, _amount, _borrow,_endDate,_ipfs);    
  
	}
	
	/**
	* @dev Function to show information about give assitance event.
	* @param _id uint - Event ID.
	* return title string - The title of the event.
	* return category string - The category of needed item.
	* return item string - The name of the item.
	* return amount uint - The total amount of items.
	* return committed uint - The amount of items left.
	* return borrow bool - True if the item is to be returned in the future.
	* return minimum uint - Minimum amount an entity could take.
	* return endDate uint - End date of the event.
	* return ipfs string - The IPFS hash containing additional information about event.
	* return owner address - The owner of the event.

	* @notice Requires that the events exist.
	*/
	
	function provideAssistanceDetails(uint _id)
		public
		view
	    returns(
		    string memory title,
		    string memory category,
	    	string memory item,
	    	uint amount,
	    	uint committed,
	    	bool borrow,
	    	uint minimum,
	    	uint endDate,
	    	string memory ipfs,
	    	address owner
    	) {
	    require(_id < giveHelp.length);
	    GiveHelp memory _event = giveHelp[_id];
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
	* @dev Function to take item from the given asstistance pool.
	* @param _eventId - The ID of the Assistance Event.
	* @param _take - The amount of the item to take.
	
    * @notice Requires that the event exist.
    * @notice Requires that the sender rating is greater than or equal to 10.
    * @notice Requires that the amount to take is greater than 0.
    * @notice Requires that the amount to take is greater than minimum.
    * @notice Requires that the amount of items to take is <= current available items in the pool.
    * @notice Requires that the taker is not the creator of the event.
    * @notice Requires that the events hasn't ended yet.
	*/
	
	function take(uint _eventId, uint _take)
	    whenNotPaused()
	    Registered()
		public
		
	{
	    require(_eventId < giveHelp.length);
	    
	    GiveHelp memory _event = giveHelp[_eventId];
		
		require(registered[msg.sender].rating > 10);
	    require(_take > 0 && _take <= giveHelp[_eventId].committed);
	    require(msg.sender != giveHelp[_eventId].owner);
	    require(giveHelp[_eventId].endDate > now);
	    
	    if(giveHelp[_eventId].committed >= giveHelp[_eventId].minimum){
	      require(_take >= giveHelp[_eventId].minimum);
	    }
	    
		giveHelp[_eventId].committed = giveHelp[_eventId].committed.sub(_take);
	    uint _subtractRating;
		if (registered[msg.sender].rating >= 13){
		     _subtractRating = 3;
		}
		
		else{
		    _subtractRating = registered[msg.sender].rating - 10;
		}
		
		registered[msg.sender].rating = registered[msg.sender].rating.sub(_subtractRating);
		emit Taken(msg.sender,registered[msg.sender].name, registered[giveHelp[_eventId].owner].name,now, _eventId,giveHelp[_eventId].item,_take, giveHelp[_eventId].owner,giveHelp[_eventId].endDate,giveHelp[_eventId].borrow, _subtractRating);
	}
	
	

	
	function assistsOf(address _owner) public view returns(uint[] memory) {
		return givenEvents[_owner];
	}


	/**
	* @dev Function returns number of all events.
	* @return uint - Number of events.
	*/
	
	function getAssistCount() public view returns(uint) {
		return giveHelp.length;
	}
	

}