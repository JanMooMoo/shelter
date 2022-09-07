import React, { Component } from 'react';
import { drizzleConnect } from "drizzle-react";
import PropTypes from 'prop-types';
import ipfs from '../../utils/ipfs';


class ListRow extends Component {

    constructor(props, context) {
      super(props);
		  this.contracts = context.drizzle.contracts;
          this.member= this.contracts['Shelter'].methods.getMemberStatus.cacheCall(this.props.organizer);
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

	friendlyUrl = (hospitalName) =>{
        let rawTitle = hospitalName;
      	var titleRemovedSpaces = rawTitle;
	  	titleRemovedSpaces = titleRemovedSpaces.replace(/ /g, '-');

      	var pagetitle = titleRemovedSpaces.toLowerCase()
      	.split(' ')
      	.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
            
          this.props.history.push("/member/"+pagetitle+"/"+this.props.organizer);
    }

	getImage = () => {
		let image = '/images/loading_ipfs.png';
		if (this.state.ipfs_problem) image = '/images/problem_ipfs.png';
		if (this.state.image !== null) image = this.state.image;
		return image;
	}
	
		render() {
		let body = '';
			
		let memberSince='Kadena Member Since: '

		if (typeof this.props.contracts['Shelter'].getMemberStatus[this.member] !== 'undefined') {
			if (this.props.contracts['Shelter'].getMemberStatus[this.member].error) {
				body = <div className="text-center mt-5"><span role="img" aria-label="warning">🚨</span> Profile Not Found</div>;
			} else {
				
				let member_data = this.props.contracts['Shelter'].getMemberStatus[this.member].value;
				
				let image = this.getImage();
                let address = this.getAddress();
                let stars = <div className="rating"><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>

                let date = new Date(parseInt(member_data._time, 10) * 1000);
                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                memberSince = months[date.getMonth()]+ ". " + date.getDate() + ", " + date.getFullYear() 
                
                  
                  if (member_data._rating < 20 ){
                    stars = <div className="rating"><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
               else if (member_data._rating <= 25){
                stars = <div className="rating"> <i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <= 30){
                    stars = <div className="rating"> <i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <= 35){
                    stars = <div className="rating"><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>}
                else if (member_data._rating <=40){
                    stars = <div className="rating"><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/></div>}
                else {
                    stars = <div className="rating"> <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/></div>
                }; 

		
		 
				body =
					<tr className="cursor-pointer mt-2" onClick={()=>this.friendlyUrl(member_data._name)}>  
						<td>{this.props.count + 1}.
						<img src={image} className="list-img ml-2" alt="Profile"></img>

					</td>        
      				<td> {member_data._name}</td>
	  				<td>{member_data._country}</td>
	  				<td>{member_data._city}</td>
	  				<td>{address}</td>
	  				<td>{stars}</td>
	  				<td>{memberSince}</td>  
					</tr>;               
			}
			
		}

		return (
			<React.Fragment>
				{body}
			</React.Fragment>
		);
	}

	componentDidMount() {
        this._isMounted = true;
		this.updateIPFS();
	}

	componentDidUpdate() {
		this.updateIPFS();
		
    }
    
	componentWillUnmount() {
		this.isCancelled = true;
		this._isMounted = false;
	}
}

ListRow.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts,
		transactionStack: state.transactionStack
    };
};

const AppContainer = drizzleConnect(ListRow, mapStateToProps);
export default AppContainer;