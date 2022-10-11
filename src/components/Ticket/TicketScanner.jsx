import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import ipfs from '../../utils/ipfs';

import Loading from '../Loaders/Loading';
import html2canvas from "html2canvas";
import Web3 from 'web3';
import {Kadena_ABI, Kadena_Address} from '../../config/Kadena';
import { QrReader } from 'react-qr-reader';
import { useParams } from "react-router-dom";
//import { Web3Storage } from 'web3.storage';



var QRCode = require('qrcode.react');


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



let id = ''
let hash =  ''
let block = ''

class TicketScanner extends Component {
    constructor(props, context) {
        super(props);
		this.contracts = context.drizzle.contracts;
        this.id = this.props.match.params.id;
        this.hash =  this.props.match.params.hash;
        this.block = this.props.match.params.block;

		//this.event = this.contracts['Shelter'].methods.provideAssistanceDetails.cacheCall(this.id);
		this.address = null;
		this.state = {
			loading: false,
			loaded: false,
			description: null,
			image: null,
			location:null,
			ipfs_problem: false,
			card_tab: 1,
			wrong_address: false,
			capture:false,
            ticket:[],
            tickethash:[],
		};
		this.isCancelled = false;
	}


    async loadblockhain(){

       // let hash =  this.props.match.params.hash;
        //let block = this.props.match.params.block;

        const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://goerli.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));
        const Kadena =  new web3.eth.Contract(Kadena_ABI, Kadena_Address);
        this.setState({Shelter:Kadena})
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
      
       let txhash = await web3.eth.getTransaction(this.hash) 

        this.setState({tickethash:txhash,loading:false},()=>console.log());

        Kadena.getPastEvents("Taken",{filter:{takenBy:this.state.tickethash.from},fromBlock: this.block, toBlock:this.block})
        .then(events=>{
        if(this._isMounted && events[0].transactionHash === this.hash){
        this.setState({ticket: events[0].returnValues},()=>console.log())
       
          }
        }).catch((err)=>console.error(err))
        }

	updateIPFS = () => {
       // console.log(this.state.loaded, this.state.loading,typeof this.props.contracts['Shelter'].provideAssistanceDetails[this.event])
		if (this.state.loaded === false && this.state.loading === false && typeof this.props.contracts['Shelter'].provideAssistanceDetails[this.event] !== 'undefined') {
			this.setState({
				loading: true
			}, () => {
				 ipfs.get(this.props.contracts['Shelter'].provideAssistanceDetails[this.event].value[8]).then((file) => {
					let data = JSON.parse(file[0].content.toString());
					if (!this.isCancelled) {
						this.setState({
							loading: false,
							loaded: true,
							description: data.remarks,
							image: data.image,
							location:data.location
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
		if (this.state.ipfs_problem) description = <p className="text-center mb-0 event-description"><span role="img" aria-label="monkey">🙊</span>We can not load description</p>;
		if (this.state.description !== null) {
			let text = this.state.description.length > 30 ? this.state.description.slice(0, 65) + '...' : this.state.description;
			description = <strong>{text}</strong>;
			
		}
		return description;
	}

	getLocation = () => {
		let location = ''
		if (this.state.ipfs_problem) location = <p className="text-center mb-0 event-description"><span role="img" aria-label="monkey">🙊</span>We can not load location</p>;
		if (this.state.location !== null) {
			let place= this.state.location

			location = {place}
		}
		return location;
	}


	

	
	downloadQR = () => {
		
	  };
	  dload =(id,title)=>{
	
setTimeout(()=>this.setState({capture:true},()=>this.capture(id,title)),500)
		

	}

	capture(id,title){
		html2canvas(document.querySelector('#ticket-'+id)).then(canvas => {

			const pngUrl = canvas
			.toDataURL("image/png")
			.replace("image/png", "image/octet-stream");
			let downloadLink = document.createElement("a");
			downloadLink.href = pngUrl;
			downloadLink.download = title + "-Ticket.png";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink)
				//document.body.appendChild(canvas)
			});
			this.setState({capture:false},()=>console.log())

	}


    checkQR= (data) =>{
       
console.log('console.log',data)
        
    }


	render() {

		let border = 'ticket-validity';
		let lineCut = 'line-cut';
		let shelterLogo = 'ticket-roof' 
		let QR= 'myTicketQR'
		if(this.state.capture){
			 border = 'ticketCapture';
			 lineCut = 'line-cut-capture'
			 shelterLogo ='ticket-roof-capture'
			 QR = 'myTicketQR-capture'
		}

		let disabled = false;
		let buttontext = 'download ticket'
		if(this.state.loading||!this.state.loaded||this.state.ipfs_problem){
			 disabled = true;
			 buttontext = 'cannot download'
		}

        let validity = ''
        let validtext = ''

		let body = <div>
            <QrReader className="QR_scan"

delay={100}
onResult={(result, error) => {
    
      this.checkQR(result);
    
}
}

onError={() => {return}}
style={{ width: 'auto' }}


/>
           
      <p></p>
    
            
         <div className="ticket-wrap"><div class='ticketing' id={'ticket-'+this.hash}>					
        <div class="ticket-content-wrapper" >
           <h1 className="ticket-title text-center">{}</h1>
       <div className={lineCut}></div>
       <div className="ticket-hash"><p> {this.hash}</p></div>
         <div className="ticket-details">
           <div className='ticket-blockie-wrapper '>	
               <img className="ticket-blockie-validator" src={'/images/problem_ipfs.png'} alt={''} />
               <div className="menu mt-4">


<div className = {shelterLogo}/>
<h5 className="ticket-shelter">SHelteR</h5>
</div>

               <h1 className="ticket-organizer-validity">Organized By: {this.state.ticket[2]}</h1>

           </div>
           <div className="ticket-item"><p>Item</p> <h1>{} - {}x  </h1></div>
           <div className="ticket-validity"><p>Valid Until</p> <h1>{} {}</h1></div>
           <div className="ticket-location"><p>{this.state.location}.</p></div>
       
           <p className={QR + " text-center"}>
           <QRCode 
               id={ "-"}
               value={'https://www.shelter.services/validator/'+ this.hash+'/'+this.block+'/'+this.id}
               size={90}
               level={"L"}
               bgColor="black" 
               fgColor="white" 
               imageSettings = {{
               src:'/images/hydro.png',
               height:20,
               width:20,
               x: null,
               y:75,
               excavate: false,}}/></p>	
       <h1 className="ticket-quantity">{}x  </h1>


       </div>

         </div>
   </div>
                                                 
   </div></div>;

		if (typeof this.props.contracts['Shelter'].provideAssistanceDetails[this.event] !== 'undefined' && this.props.contracts['Shelter'].provideAssistanceDetails[this.event].value ) {
			let image = this.getImage();
			let location = this.getLocation();


            let ticket_data = this.state.ticket
            
			let event_data = this.props.contracts['Shelter'].provideAssistanceDetails[this.event].value;

            let date = new Date(parseInt(event_data.endDate, 10) * 1000);


                if(ticket_data.length === 0 || this.id !== ticket_data.eventId){
                    validity = 'validity-invalid';
                    validtext = '!!! INVALID TICKET !!!';
               }
				else if (date.getTime() < new Date().getTime()) {
                    validity = 'validity-expired';
                    validtext = '!!! EXPIRED TICKET !!!';

				}

                else{
                    validity = 'validity-valid';
                    validtext = '!!! VALID TICKET !!!';


                }

           
			let card_body;

			    
				card_body =  <div className="ticket-wrap"><div class='ticketing' id={'ticket-'+this.hash}>					
                             	<div class="ticket-content-wrapper" >
									<h1 className="ticket-title text-center">{event_data.title}</h1>
								<div className={lineCut}></div>
								<div className="ticket-hash"><p> {this.hash}</p></div>
  								<div className="ticket-details">
									<div className='ticket-blockie-wrapper '>	
										<img className="ticket-blockie-validator" src={image} alt={event_data[0]} />
										<div className="menu mt-4">
					
					
						<div className = {shelterLogo}/>
						<h5 className="ticket-shelter">SHelteR</h5>
						</div>
					
										<h1 className="ticket-organizer-validity">Organized By: {this.state.ticket[2]}</h1>

									</div>
									<div className="ticket-item"><p>Item</p> <h1>{ticket_data.item} - {ticket_data.received}x  </h1></div>
									<div className="ticket-validity"><p>Valid Until</p> <h1>{date.toDateString().slice(4)+' - '+date.toLocaleTimeString().slice(0,5)} {date.toLocaleTimeString().slice(8,11)}</h1></div>
									<div className="ticket-location"><p>{this.state.location}.</p></div>
								
									<p className={QR + " text-center"}>
									<QRCode 
										id={event_data[0] +"-"+ticket_data[1]}
										value={'https://www.shelter.services/validator/'+ this.hash+'/'+this.block+'/'+this.id}
										size={90}
										level={"L"}
										bgColor="black" 
										fgColor="white" 
										imageSettings = {{
										src:'/images/hydro.png',
										height:20,
										width:20,
										x: null,
    									y:75,
    									excavate: false,}}/></p>	
								<h1 className="ticket-quantity">{ticket_data.received}x  </h1>


								</div>

  								</div>
							</div>
																		  
							</div>
                
				;
			 

			body =
            <div className="retract-page-inner-wrapper-alternative mt-5 text-center">
				<br/>
				<br/>
		   <p style ={{textAlign:"center"}} ><i class="fas fa-info-circle"></i> Present valid ticket to gain access to events & services or, to redeem items from the organizer. </p>
		   <hr/>
			<div className="home-wrapper">

									
                {card_body}
           
               <h1 className = {validity } >{validtext}</h1>

			</div>
			
           
		   <hr/>
		   <p style ={{textAlign:"center"}}><i class="fas fa-info-circle"></i> Data & information displayed in this site are mock data. It does not represent or in any way connected to real entity or organization. </p>
 
 
	
   

		</div>
            
			;
		}

		return (
			
			<div >
                
				{body}
                
			</div>
		);
	}

	clear(){
		this.setState({
			loading: false,
			loaded: false,
			description: null,
			image: null,
			location:null,
			ipfs_problem: false,
			wrong_address: false,
			capture:false
		},()=>console.log())
	}

	componentDidUpdate(prevProps) {
	
		this.updateIPFS();
		
	}

	componentDidMount() {
        this._isMounted = true;
		//this.updateIPFS();
        //this.loadblockhain();
	}

	componentWillUnmount() {
		this.isCancelled = true;
	}
}

TicketScanner.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts
    };
};

const AppContainer = drizzleConnect(TicketScanner, mapStateToProps);
export default AppContainer;