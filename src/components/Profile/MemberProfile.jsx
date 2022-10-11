import React, { Component } from 'react';
import { drizzleConnect } from "drizzle-react";
import PropTypes from 'prop-types';

import ipfs from '../../utils/ipfs';
import Web3 from 'web3';

import Loading from '../Loaders/Loading';
import NotFound from '../ErrorHandling/NotFound';

import ActivityPledge from '../Activity/ActivityPledge';
import ActivityTake from '../Activity/ActivityTake';
import ActivityCallForHelp from '../Activity/ActivityCallForHelp';
import ActivityLendAHand from '../Activity/ActivityLendAHand';

import ReminderPledge from '../Reminders/ReminderPledge';
import ReminderTake from '../Reminders/ReminderTake';

import ReminderReturnTake from '../Reminders/ReminderReturnTake';
import ReminderReturnPledge from '../Reminders/ReminderReturnPledge';


import {Kadena_ABI, Kadena_Address} from '../../config/Kadena';

class MemberProfile extends Component {

    constructor(props, context) {
      super(props);
		  this.contracts = context.drizzle.contracts;
          this.member = this.contracts['Shelter'].methods.getMemberStatus.cacheCall(this.props.match.params.id);
          this.state = {
			  load:true,
			  loading: false,
              loaded: false,
              
			  description: null,
              image: null,
              contact: null,
              address: null,

			  ipfs_problem: false,
			  organizer:null,

			  commited:[],
              latestblocks:5000000,
              Kadena:null,

			  pledgeModalShow:false,
			  isReturn:true,

		  };
		  this.isCancelled = false;
	}

	async loadblockhain(){

	const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://goerli.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
	const Kadena =  new web3.eth.Contract(Kadena_ABI, Kadena_Address);

    if (this._isMounted){
    this.setState({Kadena:Kadena});}

    const blockNumber = await web3.eth.getBlockNumber();
    if (this._isMounted){
    this.setState({
		blocks:blockNumber - 50000,
	    latestblocks:blockNumber - 1,
		commited:[]
		});
	}

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
					if (!this.isCancelled) {
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
					if (!this.isCancelled) {
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

	getImage = () => {
		let image = '/images/loading_ipfs.png';
		if (this.state.ipfs_problem) image = '/images/problem_ipfs.png';
		if (this.state.image !== null) image = this.state.image;
		return image;
	}

	getDescription = () => {
		let description = <Loading />;
		if (this.state.ipfs_problem) description = <p><span role="img" aria-label="warning">🚨</span>We can not load description</p>;
		if (this.state.description !== null) description = <p>{this.state.description}</p>;
		return description;
    }
    
    getAddress = () => {
		let address = '';
		if (this.state.ipfs_problem) address = ''
		if (this.state.address !== null) address = this.state.address;
		return address;
	}

	
    getContact= () => {
		let contact = '';
		if (this.state.ipfs_problem) contact = ''
		if (this.state.contact !== null) contact = this.state.contact;
		return contact;
    }

    parseDate = (pledge_date) => {
        let date = new Date(parseInt(pledge_date, 10) * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let pledgeDate = months[date.getMonth()]+ ". " + date.getDate() + ", " + date.getFullYear() 
        return pledgeDate    
	}
	
	ReturnTrue=()=>{
		this.setState({
			isReturn: true,
		})
    }
    
  	ReturnFalse=()=>{
      this.setState({
        isReturn: false,
      })
      
      }

		render() {
		let body = <Loading />;

		let myReturn='';
		let theyReturn ='disabled';

	
		if (typeof this.props.contracts['Shelter'].getMemberStatus[this.member] !== 'undefined') {
			if (this.props.contracts['Shelter'].getMemberStatus[this.member].error) {
				body = <div className="text-center mt-5"><span role="img" aria-label="warning">🚨</span> Profile Not Found</div>;
			} else {

				if (this.state.isReturn){
					 myReturn = 'disabled';
					 theyReturn = '';
				}

                let member_data = this.props.contracts['Shelter'].getMemberStatus[this.member].value;

				let image = this.getImage();
                let description = this.getDescription();
				let address = this.getAddress();
				let contact = this.getContact();
                let stars = 'Rating:'

                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
			
                let startdate = new Date(parseInt(member_data._time, 10) * 1000);
                let memberSince = months[startdate.getMonth()]+ ". " + startdate.getDate() + ", " + startdate.getFullYear()
               

                let rawTitle = member_data._name;
      	        var titleRemovedSpaces = rawTitle;
	  	        titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, '-');

      	        var pagetitle = titleRemovedSpaces.toLowerCase()
      	        .split(' ')
      	        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ');
                  
                  if (member_data._rating < 20 ){
                    stars = <div className="rating">Reputation: <i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
               else if (member_data._rating <= 25){
                stars = <div className="rating">Reputation <i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <= 30){
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <= 35){
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <=40){
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/></div>}
                else {
                    stars = <div className="rating">Reputation: <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/></div>
                }; 

		if(this.props.match.params.page === pagetitle){
		 
				body =
				<div className="row">
                <div className="col-12">
            	<h3>{member_data._name}</h3>
                </div>
                <div className = "card-hospital-wrapper col-lg-4 col-md-6 col-sm-12 mt-3">
					<img className="card-hospital-img-top" src={image} alt="Event" />
                </div>
                <div className= "description-wrapper col-lg-8 col-md-6 col-sm-12 br-50 mt-3">
                <p>{description}</p>
                </div>
                 
				
               
				<div className=" col-12 mt-4">
                
                <ul className="list-group list-group-flush profile-list">
					<li className="list-group-item-page small "><strong>Country: {member_data._country}</strong> </li>
                    <li className="list-group-item-page small"><strong>City: {member_data._city}</strong> </li>
					<li className="list-group-item-page small"><strong>Address: {address} </strong></li>
					<li className="list-group-item-page small"><strong>Contact: {contact} </strong></li>
                    <li className="list-group-item-page small"><strong>Shelter Member Since: {memberSince} </strong></li>
                    <li className="list-group-item-page small" title={member_data._rating}><strong>{stars}</strong></li>
					</ul>      

				</div>

            <h3 className="col-lg-12 mt-4"><i class="fas fa-users"></i> Activities</h3>
            <hr/>
			
            
            
            <ActivityCallForHelp Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>
            <ActivityLendAHand Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>

            <ActivityPledge Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>
            <ActivityTake Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>

			<br/>
			
			<button className="btn btn-outline-dark mt-2" onClick={this.ReturnTrue.bind(this)} disabled={myReturn}>Borrowed Items</button>
            <button className="btn btn-outline-dark mt-2 ml-3" onClick={this.ReturnFalse.bind(this)} disabled={theyReturn}>Returning Items</button>
			
			<h1>{this.state.isReturn}</h1>
			{this.state.isReturn?<h3 className="col-lg-12 mt-4"><i class="fas fa-bell"></i> Items That You Should Return</h3>:<h3 className="col-lg-12 mt-4"><i class="fas fa-bell"></i> Items That Should Return To You</h3>}
            <hr/>
			
			{!this.state.isReturn &&<ReminderPledge Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>}
			{!this.state.isReturn &&<ReminderTake Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>}
			{this.state.isReturn &&<ReminderReturnPledge Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>}
			{this.state.isReturn &&<ReminderReturnTake Kadena = {this.state.Kadena} account={this.props.match.params.id} history={this.props.history}/>}

            </div>;
				}
				
			else {
				body = <NotFound/>;
				}
                
			}
			
		}

		return (
			<div className="event-page-wrapper">
				<h3><i class="fas fa-id-badge"></i> Member Profile</h3>
				<hr />
				{body}
				<hr/>
				<div className="topics-wrapper">
                <br/>
                <p style ={{textAlign:"center"}}><i class="fas fa-info-circle"></i> Data & information displayed in this site are mock data. It does not represent or in any way connected to any real entity or organization. </p>
                </div>
			</div>
		);
	}

	componentDidMount() {
        this._isMounted = true;
        this.account = this.props.match.params.id
        this.page = this.props.match.params.page
		this.updateIPFS();
		this.loadblockhain();
	}

	componentDidUpdate(prevProps) {
		this.updateIPFS();
		
    }
    
	componentWillUnmount() {
		this.isCancelled = true;
		this._isMounted = false;
	}
}

MemberProfile.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack
    };
};

const AppContainer = drizzleConnect(MemberProfile, mapStateToProps);
export default AppContainer;