import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { drizzleConnect } from 'drizzle-react';
import { ToastContainer, toast } from 'react-toastify';
import Web3 from 'web3';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'startbootstrap-simple-sidebar/css/simple-sidebar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.css';

import Sidebar from './Sidebar';
import Home from './Tools/Home';
import AdminPage from './Tools/AdminPage';
import CreateEvent from './CreateEvent/';

import MemberProfile from './Profile/MemberProfile';
import MyProfile from './Profile/MyProfile';
import MemberList from './Profile/MemberList';
import CallForHelp from './Events/CallForHelp';
import LendAHand from './Events/LendAHand';
import {Kadena_ABI, Kadena_Address} from '../config/Kadena';

import Notify from './Norifications/Notify';
import NotifyLendAHand from './Norifications/NotifyLendAHand';
import NotifyCallForHelp from './Norifications/NotifyCallForHelp';

import NotifyRequest from './Norifications/NotifyRequest';
import NotifyPledge from './Norifications/NotifyPledge';
import NotifyTake from './Norifications/NotifyTake';
import NotifyApproved from './Norifications/NotifyApproved';

import PageNeed from './Events/PageNeed';
import PageGive from './Events/PageGive';

import MyTickets from './Ticket/MyTickets';
import TicketValidator from './Ticket/TicketValidator';
import TicketScanner from './Ticket/TicketScanner';

import NetworkError from './ErrorHandling/NetworkError';
import ChangeNetwork from './ErrorHandling/ChangeNetwork';
import HowItWorks from './Tools/HowItWorks';
import Requirements from './Tools/Requirements';
import About from './Tools/About';
import DaoPage from './Dao/DaoPage';
import LoadingApp from './Loaders/LoadingApp';

import { CourierClient } from "@trycourier/courier";

let ethereum= window.ethereum;
let web3=window.web3;
let chainId = 3

class App extends Component
{

	constructor(props) {
		super(props);
		this.state = {
			sent_tx: [],
			showSidebar: true,
			account:[],

			refresh:false,
			accountDetails:[],
			block:500000,

		};
		this.loadBlockchainData = this.loadBlockchainData.bind(this);
	}

	componentDidMount(){
		this.loadBlockchainData()
	}

	componentWillUpdate() {
		let sent_tx = this.state.sent_tx;

		for (let i = 0; i < this.props.transactionStack.length; i++) {
			if (sent_tx.indexOf(this.props.transactionStack[i]) === -1) {
				sent_tx.push(this.props.transactionStack[i]);

				toast(<Notify hash={this.props.transactionStack[i]} />, {
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true

				});
			}
		}

		if (sent_tx.length !== this.state.sent_tx.length) {
			this.setState({
				sent_tx: sent_tx
			});
		}

		/*if(!this.props.drizzleStatus.initialized && chainId !== 4){
			this.loadBlockchainData()
			console.log('metamaskdsd')
		}*/
	}


//Get Account
async loadBlockchainData() {

	if(typeof ethereum !=='undefined'){
	// console.log("metamask")
	 await ethereum.enable();
	 web3 = new Web3(ethereum);
	 this.getAccount()

	chainId = 4; // Rinkeby

if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(chainId) }]
        });
      } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Rinkeby Test Network',
                chainId: web3.utils.toHex(chainId),
                nativeCurrency: { name: 'RinkebyETH', decimals: 18, symbol: 'ETH' },
                rpcUrls: ['https://rinkeby.infura.io/v3/']
              }
            ]
          });
        }
      }
    }

	 window.ethereum.on('accountsChanged', function (accounts) {
		window.location.reload();
	   })
   
	   window.ethereum.on('networkChanged', function (netId) {
		window.location.reload();
	   })

 	}

 	else if (typeof web3 !== 'undefined'){
	console.log('Web3 Detected!')
	 window.web3 = new Web3(web3.currentProvider);
	 this.getAccount()
	 
	 }	



	 

 	else{console.log('No Web3 Detected')
 	window.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/72e114745bbf4822b987489c119f858b'));
	}


	}


	async getAccount(){

		const accounts = await web3.eth.getAccounts()
		this.setState({account: accounts[0]});
		const Kadena  =  new web3.eth.Contract(Kadena_ABI, Kadena_Address);
		this.setState({Kadena:Kadena});
		setInterval(async()=>{
			const get_account = await Kadena.methods.getMemberStatus(this.state.account).call();
		this.setState({accountDetails:get_account},()=>console.log())	
		},2000)

		const blockNumber = await web3.eth.getBlockNumber();
		this.setState({block:blockNumber})
		Kadena.events.allEvents({filter:{owner:this.state.account},fromBlock:blockNumber, toBlock:'latest'})

        .on('data',(log)=>{
			if(log.returnValues.owner === this.state.account){

				toast(<NotifyRequest hash={log.blockHash} hospital={log.returnValues.hospitalName}/>, {
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true

				});
			}
			if(log.returnValues.pledgedBy === this.state.account){

				toast(<NotifyPledge hash={log.blockHash} 
					receiver={log.returnValues.receiver} 
					item = {log.returnValues.item}
					committed = {log.returnValues.committed}/>, 
					{
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true
		
				});

				this.sendMail()
		
			}
			if(log.returnValues.takenBy === this.state.account){

				toast(<NotifyTake hash={log.blockHash} 
					sender={log.returnValues.sender} 
					item = {log.returnValues.item}
					received = {log.returnValues.received}/>, 
					{
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true
		
				});
				this.sendMail()
		
			}
			if(log.returnValues.applicant === this.state.account){

				toast(<NotifyApproved hash={log.blockHash} hospital={log.returnValues.registeredAs}/>, {
					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true

				});
			}

			if(log.returnValues.ownerGive === this.state.account){

				toast(<NotifyLendAHand hash={log.blockHash} 
					title={log.returnValues.title} 
					item={log.returnValues.item} 
					amount={log.returnValues.amount}
					eventId={log.returnValues.eventId}/>, {

					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true

				});
			}

			if(log.returnValues.ownerNeed === this.state.account){

				toast(<NotifyCallForHelp hash={log.blockHash} 
					title={log.returnValues.title} 
					item={log.returnValues.item} 
					amount={log.returnValues.amount}
					eventId={log.returnValues.eventId}/>, {

					position: "bottom-right",
					autoClose: true,
					pauseOnHover: true

				});
			}
		})	
	
	}

	refresh = () =>{
		if(this.state.refresh){
		this.setState({refresh:false},()=>console.log())}
		else{
			this.setState({refresh:true},()=>console.log())
			}
	}

	sendMail(){
		
	}
	render() {
		

		let body;
		let connecting = false;

		if (!this.props.drizzleStatus.initialized) {
			console.log(this.props.drizzleStatus.initialized)
			console.log(this.props.web3.networkId)

			body =
				<div>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route component={LoadingApp} />
					</Switch>
				</div>
			;
			connecting = true;

		  console.log('com',connecting)
		} else if (this.props.web3.status === 'failed') {

			body =
				<div>
					<Switch>
						<Route exact path="/" component={ChangeNetwork} />
						<Route component={NetworkError} />
					</Switch>
				</div>
			;
			connecting = true;
		} else if(
				(this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) ||
				(process.env.NODE_ENV === 'production' && this.props.web3.networkId !== 4)
				)
			{

			  

			  body = 
			  		<div>
			  		<Route exact path="/" render={props => <LendAHand  {...props} account ={this.state.account}/>} />
					<Route path="/needhelp/:page"  render={props => <CallForHelp  {...props} account ={this.state.account} /> }  />
					<Route path="/givehelp/:page"  render={props => <LendAHand  {...props} account ={this.state.account}/>}  />
					<Route path="/need/:page/:id"  render={props => <PageNeed {...props} />}/>
					<Route path="/give/:page/:id"  render={props => <PageGive {...props}/>}/>
					<Route path="/myprofile/" render={props => <MyProfile {...props} account={this.state.account}/>}/>
					<Route path="/mytickets" render={props => <MyTickets {...props} account={this.state.account}/>}/>
					<Route path="/validator/:hash/:block/:id" render={props => <TicketValidator {...props} account={this.state.account}/>}/>
					<Route path="/scanner" render={props => <TicketScanner {...props} account={this.state.account}/>}/>
					<Route path="/member/:page/:id"  render={props => <MemberProfile {...props}/>}/>
					<Route path="/member-list"  render={props => <MemberList {...props}/>}/>
					<Route path="/dao"  render={props => <DaoPage {...props} account={this.state.account}/>}/>
					<Route path="/register" render={props=><CreateEvent  {...props}
					account ={this.state.account}/>}/>
					<Route path="/requirements" component={Requirements} />
					<Route path="/about" component={About} />
					<Route path="/how-it-works" component={HowItWorks}/>
					<Route path="/admin" render={props =><AdminPage {...props} account = {this.state.account}/>}/>
					</div>
			
				}
		
		else {
		
			body =
				<div>
					<Route exact path="/" render={props => <LendAHand  {...props} account ={this.state.account}/>} />
					<Route path="/needhelp/:page"  render={props => <CallForHelp  {...props} account ={this.state.account} />}  />
					<Route path="/givehelp/:page"  render={props => <LendAHand  {...props} account ={this.state.account} />}  />
					<Route path="/need/:page/:id"  render={props => <PageNeed {...props} />}/>
					<Route path="/give/:page/:id"  render={props => <PageGive {...props}/>}/>
					<Route path="/myprofile"  render={props => <MyProfile {...props} account={this.state.account}/>}/>
					<Route path="/mytickets" render={props => <MyTickets {...props} account={this.state.account}/>}/>
					<Route path="/validator/:hash/:block/:id" render={props => <TicketValidator {...props} account={this.state.account}/>}/>
					<Route path="/scanner" render={props => <TicketScanner {...props} account={this.state.account}/>}/>
					<Route path="/member/:page/:id"  render={props => <MemberProfile {...props}/>}/>
					<Route path="/member-list"  render={props => <MemberList {...props}/>}/>
					<Route path="/dao"  render={props => <DaoPage {...props} account={this.state.account}/>}/>
					<Route path="/register" render={props=><CreateEvent  {...props}
					account ={this.state.account}/>}/>
					<Route path="/requirements" component={Requirements} />
					<Route path="/about" component={About} />
					<Route path="/how-it-works" component={HowItWorks}/>
					<Route path="/admin" render={props =><AdminPage {...props} account = {this.state.account}/>}/>
					
				</div>
			;
		}

		return(
			<Router>
				
				<div id="wrapper" className="toggled">
					<Sidebar connection={!connecting} account={this.state.account} accountDetails = {this.state.accountDetails} connect = {this.loadBlockchainData} refresh = {this.refresh}/>
			
					<div id="page-content-wrapper" className="sidebar-open">
						

						<div className="branding" style ={{textAlign:"center"}}>
						<div className="brand-wrapper">
						<div className = 'shelter-roof-app'/>
						<h5 className="shelter-logo-app">SHelteR</h5>

						
						</div>
						</div>
						<div className="container-fluid">
							<div className="page-wrapper-inner">
								<div>
									{body}
								</div>
							</div>
						</div>
					</div>
					<ToastContainer />

				</div>
				
			</Router>
		);
	}
}

const mapStateToProps = state => {
    return {
		drizzleStatus: state.drizzleStatus,
		web3: state.web3,
		accounts: state.accounts,
		transactionStack: state.transactionStack,
		transactions: state.transactions
    };
};


const AppContainer = drizzleConnect(App, mapStateToProps);
export default AppContainer;
