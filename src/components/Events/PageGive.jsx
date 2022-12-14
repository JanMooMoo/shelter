import React, { Component } from 'react';
import { drizzleConnect } from "drizzle-react";
import PropTypes from 'prop-types';
import makeBlockie from 'ethereum-blockies-base64';

import ipfs from '../../utils/ipfs';
import Web3 from 'web3';


import Loading from '../Loaders/Loading';
import EventNotFound from '../ErrorHandling/EventNotFound';
import Clock from '../Clock';
import JwPagination from 'jw-react-pagination';
import {Kadena_ABI, Kadena_Address} from '../../config/Kadena';
import {ModalTake} from '../Modals/ModalTake'
import MemberCard from '../MemberCard';


let numeral = require('numeral');

const customStyles = {
    ul: {
		border:'rgb(10, 53, 88)'
        
    },
    li: {
		border:'rgb(10, 53, 88)'
       
    },
    a: {
		color: '#007bff',
		
	},
	
};

class PageGive extends Component {

    constructor(props, context) {
      super(props);
		  this.contracts = context.drizzle.contracts;
          this.event = this.contracts['Shelter'].methods.provideAssistanceDetails.cacheCall(this.props.match.params.id);
		 
		  this.state = {
			  load:true,
			  loading: false,
			  loaded: false,
			  description: null,
			  image: null,
			  location:null,
			  ipfs_problem: false,
			  organizer:null,

			  commited:[],
			  latestblocks:5000000,

			  pledgeModalShow:false,
			  commentView:false,

              pageTransactions:[],
              commits:0

		  };
		  this.isCancelled = false;
          this.onChangePage = this.onChangePage.bind(this);
          this.friendlyUrl = this.friendlyUrl.bind(this);
	}

	async loadblockhain(){

	const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://goerli.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
	const Kadena =  new web3.eth.Contract(Kadena_ABI, Kadena_Address);

    if (this._isMounted){
    this.setState({Kadena});}

    const blockNumber = await web3.eth.getBlockNumber();
    if (this._isMounted){
    this.setState({
		blocks:blockNumber - 50000,
	    latestblocks:blockNumber - 1,
		commited:[]
		});
    }
    if (this._isMounted){
        const committed = await Kadena.methods.provideAssistanceDetails(this.props.match.params.id).call()
    this.setState({commits:committed.committed})
	}
	
	
    Kadena.getPastEvents("Taken",{filter:{eventId:this.props.match.params.id},fromBlock: 5000000, toBlock:this.state.latestblocks})
    .then(events=>{
     if (this._isMounted){
    this.setState({load:true})
    var newest = events;
    var newsort= newest.concat().sort((a,b)=> b.blockNumber- a.blockNumber);
   
    this.setState({commited:newsort,check:newsort});
    this.setState({load:false})
    this.setState({active_length:this.state.commited.length});
  	}
    }).catch((err)=>console.error(err))

    Kadena.events.Taken({filter:{eventId:this.props.match.params.id},fromBlock: blockNumber, toBlock:'latest'})
  	.on('data', (log) =>setTimeout(()=> {
    this.setState({load:true});

    this.setState({commited:[...this.state.commited,log]});
    var newest = this.state.commited
    var newsort= newest.concat().sort((a,b)=> b.blockNumber- a.blockNumber);
    if (this._isMounted){ 
    setTimeout(async()=>{ 
    const committed = await Kadena.methods.provideAssistanceDetails(this.props.match.params.id).call()
    this.setState({commits:committed.committed})},10000)
    this.setState({commited:newsort});
    this.setState({active_length:this.state.commited.length})}
    this.setState({load:false});
    }),12000)
  }


	updateIPFS = () => {
		if (
			this.state.loaded === false &&
			this.state.loading === false &&
			typeof this.props.contracts['Shelter'].provideAssistanceDetails[this.event] !== 'undefined' &&
			!this.props.contracts['Shelter'].provideAssistanceDetails[this.event].error
		) {
			this.setState({
				loading: true,
				location: <span><span role="img" aria-label="dino">????</span>We are loading data...</span>
			}, () => {
				console.log(this.props.contracts['Shelter'].provideAssistanceDetails[this.event].value[8])
				ipfs.get(this.props.contracts['Shelter'].provideAssistanceDetails[this.event].value[8]).then((file) => {
				//	console.log(JSON.parse('fQmXsbQ2FKy37qiDiMYmcqHTbZ6qi2XDLNfUmjo42o11nPT'.content.toString())


					let data = JSON.parse(file[0].content.toString());
					if (!this.isCancelled) {
						this.setState({
							loading: false,
							loaded: true,
							description: data.remarks,
							image: data.image,
							location: data.location,
							organizer: data.organizer
							  
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
		if (this.state.ipfs_problem) description = <p><span role="img" aria-label="warning">????</span>We can not load description</p>;
		if (this.state.description !== null) description = <p>{this.state.description}</p>;
		return description;
    }
    
    friendlyUrl = (name,EthAddress) =>{

        let rawTitle = name;
      	var titleRemovedSpaces = rawTitle;
	  	titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, '-');

      	var pagetitle = titleRemovedSpaces.toLowerCase()
      	.split(' ')
      	.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
            
          this.props.history.push("/member/"+pagetitle+"/"+EthAddress);
    }


	onChangePage(pageTransactions) {
		this.setState({ pageTransactions });
	}

    parseDate = (take_date) => {
        let date = new Date(parseInt(take_date, 10) * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        let takeDate = months[date.getMonth()]+ ". " + date.getDate() + ", " + date.getFullYear() 
        return takeDate    
    }

		render() {
		let body = <Loading />;


		if (typeof this.props.contracts['Shelter'].provideAssistanceDetails[this.event] !== 'undefined' && this.props.contracts['Shelter'].provideAssistanceDetails[this.event].value) {
          
                let event_data = this.props.contracts['Shelter'].provideAssistanceDetails[this.event].value;
                let pledgeModalClose = () =>this.setState({pledgeModalShow:false});
               
				let image = this.getImage();
                let description = this.getDescription();
				
                let organizer = event_data.owner;
            
                 
				let buttonText = " Take";

				let symbol = event_data.borrow? 'Will Return:' : 'Will Close';
                
				let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
				
                let enddate = new Date(parseInt(event_data.endDate, 10) * 1000);
                let end_date = months[enddate.getMonth()]+ ". " + enddate.getDate() + ", " + enddate.getFullYear()
                let disabled = false;


				let commentText = "Take";
				let commentsView = false;
				let takeView= true;



				if(this.state.commentView){
					commentText = "Comments";
					commentsView = true;
				 	takeView= false;

				}

                if (enddate.getTime() < new Date().getTime()) {
					disabled = true;
					buttonText = " Closed";
				}
                
				let commits = true;
				if (Number(this.state.commits) === 0) {
					disabled = true;
                    buttonText = " None Left"

				}

				if(this.state.active_length <= 0){
					commits=false;
				}
				let percentage = numeral(this.state.commits*100/event_data.amount).format('0.00')+ "%";
 
		//Friendly URL Title
		let rawTitle = event_data.title;
      	var titleRemovedSpaces = rawTitle;
	  	titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, '-');

      	var pagetitle = titleRemovedSpaces.toLowerCase()
      	.split(' ')
      	.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      	.join(' ');

		if(this.props.match.params.page === pagetitle){

				body =
				<div className="row">
				<div className="col-12">
            	    <h3>Title: {event_data.title}</h3>

                <div className="card event-hero-sidebar mt-4">
					<img className="card-img-top event-image" src={image} alt="Event" />
                    <li className="list-group-item-page small"><div class="progress"><div class="progress-inner2" style={{"width":percentage }}></div><div class="progress-outer" style={{"width":"100%" }}></div><p className="  mb-0 text-center">{percentage}</p></div></li>
				<div className="card-header event-header">
           		 <br />
            
           		 {description}

            	<button className="btn btn-outline-dark mt-2 ml-3" onClick={() => this.setState({pledgeModalShow:true})} disabled={disabled}>{buttonText}</button>
				{this.state.pledgeModalShow && <ModalTake
      				show={this.state.pledgeModalShow}
					onHide={pledgeModalClose}
					id = {this.props.match.params.id }
					item = {event_data.item}
					committed = {this.state.commits}
					amount = {event_data.amount}
					account = {this.props.account}
					minimum = {event_data[6]}
		
					setMail = {this.props.setMail}
					title = {event_data.title}
					url={'/give/'+this.props.match.params.page +'/'+this.props.match.params.id}
					organizer={organizer}
					contracts = {this.props.contracts}
					accountDetails = {this.props.accountDetails}
      				/>}
            	<br />
                    <MemberCard organizer = {organizer} history={this.props.history}/>
				   

           		<br />
				</div>

				    <ul className="list-group list-group-flush">
					<li className="list-group-item-page small">Location: {this.state.location} </li>
					<li className="list-group-item-page small">Minimum Take: {event_data[6]} Items</li>
					<li className="list-group-item-page small">{symbol} {end_date} at {enddate.toLocaleTimeString()}</li>
					<li className="list-group-item-page small">Item Pool: {event_data.item}</li>
                    <li className="list-group-item-page small">Amount Left: {this.state.commits}/{event_data.amount}</li>
					</ul>
				</div>
						
                {this._isMounted && <Clock deadline = {enddate} event_unix = {event_data.endDate}/>}
              	<div className="new-transaction-wrapper">
  				
					<h4 className="transactions"><i class="fas fa-hand-holding-medical"></i> {commentText}  <div className="commentButton">	
				
					<button className="btn btn-outline-dark mt-2 mr-3" onClick={() => this.setState({commentView:false})} disabled={takeView}>Take History</button>
					<button className="btn btn-outline-dark mt-2" onClick={() => this.setState({commentView:true})} disabled={commentsView}>Comment Section</button></div>
				
					</h4> 
				
				
					{this.state.load &&<Loading/>}
                    {!this.state.commentView && this.state.pageTransactions.map((pledged,index)=>(<p className="sold_text col-md-12 small" key={index}><img className="float-left blockie" src={makeBlockie(pledged.returnValues.takenBy)} title={pledged.returnValues.takenBy} alt="blockie"/><strong className="black" onClick={()=>this.friendlyUrl(pledged.returnValues.receiver,pledged.returnValues.takenBy)}>{pledged.returnValues.receiver}</strong> has taken <strong ><a href={"https://goerli.etherscan.io/tx/" + pledged.transactionHash} target="blank" className="gold">{pledged.returnValues.received} {pledged.returnValues.item}</a> Tickets</strong> from <strong className="black" onClick={()=>this.friendlyUrl(pledged.returnValues.sender,pledged.returnValues.tookFrom)}>{pledged.returnValues.sender}</strong> <br/><span className="date-right small">on {this.parseDate(pledged.returnValues.date)}</span></p>
                    ))}


  					{!commits && !this.state.commentView && <p className="sold_text col-md-12 no-tickets">No one has taken a single item.</p>}
					{this.state.commentView && <p className="sold_text col-md-12 no-tickets">Under Construction.</p>}
					</div>

					<div className="pagination">
					{!this.state.commentView &&<JwPagination items={this.state.commited} onChangePage={this.onChangePage} maxPages={5} pageSize={5} styles={customStyles} />	}
				</div>
                        

				</div>

			<hr/>
			</div>;
				}
				
			else {
				body = <EventNotFound/>;
				}
			
			
		}

		return (
			<div className="event-page-wrapper">
				<h3><i class="fas fa-laptop-medical"></i> Lend A Hand</h3>
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
		this.updateIPFS();
		this.loadblockhain();
	}

	componentDidUpdate() {
		this.updateIPFS();
    }
    
	componentWillUnmount() {
		this.isCancelled = true;
        this._isMounted = false;
	}
}

PageGive.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack
    };
};

const AppContainer = drizzleConnect(PageGive, mapStateToProps);
export default AppContainer;