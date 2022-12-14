import React, { Component } from 'react';
import { drizzleConnect } from "drizzle-react";
import PropTypes from 'prop-types';
import ipfs from '../utils/ipfs';
import { CourierClient } from "@trycourier/courier";





class MemberCard extends Component {

    constructor(props, context) {
      super(props);
		  this.contracts = context.drizzle.contracts;
          this.member = this.contracts['Shelter'].methods.getMemberStatus.cacheCall(this.props.organizer);
          this.state = {
			  loading: false,
              loaded: false,
              
			  description: null,
              image: null,
              contact: null,
              address: null,

			  ipfs_problem: false,	

		  };
		  this.isCancelled = false;
	}



	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			typeof this.props.contracts['Shelter'].getMemberStatus[this.member] !== 'undefined' &&
			!this.props.contracts['Shelter'].getMemberStatus[this.member].error
		) {
			this.setState({
				loading: true
			}, () => {
				ipfs.get(this.props.contracts['Shelter'].getMemberStatus[this.member].value._ipfs).then((file) => {
					let data = JSON.parse(file[0].content.toString());
					if (!this.isCancelled && this._isMounted) {
						this.setState({
							loading: false,
							loaded: true,
							description: data.description,
							image: data.image,
							contact: data.contact,
							address: data.address
							  
						});
					}
				}).catch(() => {
					if (!this.isCancelled && this._isMounted) {
						this.setState({
							loading: false,
							loaded: true,
							ipfs_problem: true
						});
					}
				});
			});
		}
	}

	
    getContact= () => {
		let contact = '';
		if (this.state.ipfs_problem) contact = ''
		if (this.state.contact !== null) contact = this.state.contact;
		return contact;
    }
    
    getAddress= () => {
		let address = '';
		if (this.state.ipfs_problem) address = ''
		if (this.state.address !== null) address = this.state.address;
		return address;
	}

	friendlyUrl = (name) =>{

        let rawTitle = name;
      	var titleRemovedSpaces = rawTitle;
	  	titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, '-');

      	var pagetitle = titleRemovedSpaces.toLowerCase()
      	.split(' ')
      	.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
            
          this.props.history.push("/member/"+pagetitle+"/"+this.props.organizer);
    }

	async message(){

		const fetch = require('node-fetch');

		let body = 'Vlad Churov has taken 3 Shelter Tickets from Free Apartment Accommodation';
		let subject = 'Someone has taken Tickets';
		let recepient = 'moonmusic91@gmail.com'

		const options = {
			method:'POST',
			//mode: "no-cors",
			headers:{
				'Accept':'application/json',
				'Content-Type': 'application/json',
				"Access-Control-Expose-Headers": "Content-Length, X-JSON",
				'Origin':'*',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
				'Authorization':process.env.REACT_APP_COURIER_KEY,
				'Access-control-allow-credentials':'true',
				
				
			},
			
			body:JSON.stringify({
				message: {
					to: {
					  email: "moonmusic91@gmail.com",
					},
					template: "8N689A8MG54A06JCZAD48WFA1W1Y",
					data: {
					  taker_name: "Vlad Churov",
					  event_creator: "John",
					  event_title: "Free-apartment-accommodation",
					  action_performed: "took",
					  ticket_quantity: "3",
					  event_link: "https://shelter.services/give/Free-apartment-accommodation/5",
					},
				  },
			})
		}
		fetch('https://cors-anywhere.herokuapp.com/https://api.courier.com/send',options)
		//fetch('https://cors-anywhere.herokuapp.com/https://api.courier.com/send',options)
		.then(response => response.json())
		.then(response => console.log(response))


	  console.log('sent')
	}

	
		render() {
		let body = '';

		let memberSince='Kadena Member Since: '

		if (typeof this.props.contracts['Shelter'].getMemberStatus[this.member] !== 'undefined') {
			if (this.props.contracts['Shelter'].getMemberStatus[this.member].error) {
				body = <div className="text-center mt-5"><span role="img" aria-label="warning">????</span> Profile Not Found</div>;
			} else {

                let member_data = this.props.contracts['Shelter'].getMemberStatus[this.member].value;
               
                let address = this.getAddress();
                let contact = this.getContact();
                let stars = 'Member Reputation:'

                let date = new Date(parseInt(member_data._time, 10) * 1000);
                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                memberSince = months[date.getMonth()]+ ". " + date.getDate() + ", " + date.getFullYear() 
                
                  
                  if (member_data._rating < 20 ){
                    stars = <div className="rating">Reputation: <i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
               else if (member_data._rating <= 25){
                stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <= 30){
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <= 35){
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <=40){
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/></div>}
                else {
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/></div>
                }; 

		
		 
				body =
	
                <div className="cursor-pointer"  onClick={()=>this.friendlyUrl(member_data._name)}>
                <p className="small text-truncate mb-0"><strong>Name: {member_data._name}</strong></p>
                <p className="small text-truncate mb-0"><strong>Location: {member_data._city}, {member_data._country}</strong></p>
				<p className="small text-truncate mb-0"><strong>Address: {address} </strong></p>
                <p className="small text-truncate mb-0"><strong>Contact: {contact}</strong></p>
                <p className="small text-truncate mb-0" ><strong title={member_data._rating}>{stars}</strong></p>  
                </div>;
                
			}
			
		}

		return (
			<div className="mt-2">
				<h3><i class="fas fa-hospital-user ml-4"/> Oganizer Profile</h3>
                <p className="small text-truncate ml-1" ><strong>Shelter Member Since: {memberSince}</strong></p>
			
				<hr />
				{body}
			</div>
		);
	}

	componentDidMount() {
        this._isMounted = true;
		this.updateIPFS();
	}

	componentDidUpdate(prevProps) {
		this.updateIPFS();
		
    }
    
	componentWillUnmount() {
		this.isCancelled = true;
		this._isMounted = false;
	}
}

MemberCard .contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack
    };
};

const AppContainer = drizzleConnect(MemberCard, mapStateToProps);
export default AppContainer;