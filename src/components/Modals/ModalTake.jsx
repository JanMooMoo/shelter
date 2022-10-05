import React,{Component} from 'react';
import {Modal} from 'react-bootstrap';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import ipfs from '../../utils/ipfs';

export class ModalTake extends Component{


    componentDidMount(){
        this._isMounted = true;
 
       // this.setMail();
       this.updateIPFS();
       this.updateIPFS_user();
      }
    
      componentDidUpdate(prevProps) {
        this.updateIPFS();
        
        }

componentWillUnmount(){

  this._isMounted = false;
}

constructor(props,context){
    super(props)
    this.contracts = context.drizzle.contracts;
    this.member = this.contracts['Shelter'].methods.getMemberStatus.cacheCall(this.props.organizer);

    this.state = {

        summaryModalShow: false,
        hide:this.props.onHide,
        loading:false,
        loaded:false,
        amount:0,
        member:null,
        contact: null,
        user_contact: null,

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
              member:this.props.contracts['Shelter'].getMemberStatus[this.member].value._name,
							contact: data.contact,
							  
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

  updateIPFS_user = () => {
    console.log(this.props.accountDetails._ipfs)
		
				ipfs.get(this.props.accountDetails._ipfs).then((file) => {
					let data = JSON.parse(file[0].content.toString());
					if (!this.isCancelled && this._isMounted) {
						this.setState({user_contact: data.contact},()=>console.log(this.state.user_contact));
					}
				}).catch(() => {
					if (!this.isCancelled && this._isMounted) {
						this.setState({
							ipfs_problem: true
						});
					}
				});
			
	}


	
  getContact= () => {
		let contact = '';
		if (this.state.ipfs_problem) contact = ''
		if (this.state.contact !== null) contact = this.state.contact;
		return contact;
    }

  //amountChange
  amountChange = (event) => {		
    let amount = event.target.value;
    if(this._isMounted){
    this.setState({
        amount: amount
    },()=>console.log());
}
}

take = ()=>{
    this.contracts['Shelter'].methods.take.cacheSend(this.props.id,this.state.amount)
    this.setMail()
    }
  
  
    setMail = ()=>{
      this.props.setMail(this.state.contact,this.state.member,this.props.item,this.state.amount,this.props.title,this.props.url,'event_ticket','took',this.state.user_contact)

    }

    render(){


   
        let contact = this.getContact();
  

      
        let disabled = false;
        let minimum = this.props.minimum;
     
        if(this.state.amount > Number(this.props.committed)){
            disabled = true;
        }
      
        if(Number(this.props.committed) >=Number(this.props.minimum)){
          if(Number(this.state.amount) < Number(this.props.minimum)){
            disabled = true;
          }
        }

        else{
          minimum = Number(this.props.committed)
          if(Number(this.state.amount) !== Number(minimum)){
            disabled = true;
           }
          }
    return( 
      
      <Modal
        {...this.props}
        size="md"
        height="200px"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        
      <Modal.Header className="modalpie" closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        <div className="banana3">Take from {this.state.member}</div>
      </Modal.Title>
      </Modal.Header> 
        
      <Modal.Body> 
      <h5 className="banana3">Item Pool: {this.props.item}</h5>
      <p className="banana3">Current Amount In Pool: {this.props.committed}/{this.props.amount}</p>
      
      <div className="form-group row">
			<div className="col-lg-12">
				<label htmlFor="amount">You Will Take: {this.state.amount}</label>
					<div className="input-group mb-3">
					<div className="input-group-prepend">
					<span className="input-group-text">Amount</span>
					</div>
					<input type="number" min="1" className={"form-control "} id="amount" title={"Amount Needed"} autoComplete="off" onChange={this.amountChange} />
			    </div>
					<small className="form-text text-muted">Minimum of {minimum} items to take.</small>	
	
		    </div>
		</div>
    
            <button className="btn btn-outline-dark" title="Pledge" onClick={this.take} disabled={disabled}>Take</button>
            <button className="btn btn-outline-dark ml-2" title="Cancel" onClick={this.props.onHide}>Cancel</button>
       
      
      </Modal.Body>
            
      

      </Modal>
      )
    }

}

ModalTake.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack
    };
};

const AppContainer = drizzleConnect(ModalTake, mapStateToProps);
export default AppContainer;