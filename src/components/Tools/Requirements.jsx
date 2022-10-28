import React, { Component } from 'react';

class Requirements extends Component {

	render() {
		
		
		return(
			<div className="home-wrapper">
			
				<div className = "centerLabel">
				<h1 className = "hopeLabel" style ={{textAlign:"center"}}> Requirements</h1>
				
                <h5 className = "hopeLabel" >
                    <a href="https://metamask.io/download.html" target="blank">
                    1. Metamask <img className="list-img mb-3 mt-3" src="/images/Metamask.png" alt ="Metamask"/> </a>
                    <p >
                    MetaMask is used by browser to be able to interact & connect to blockchain based applications like Shelter.
                    </p>
                    <a href="https://goerlifaucet.com/" target="blank">                 
                     2. Goerli Test Ether <img className="list-img mb-3 mt-3" src="/images/ethereum2.png" alt ="Rinkeby"/>       
                    </a>
                    <p >
                    Goerli Test Ether is a test-net token that is used in ethereum goerli network to be able to write on blockchain or transact on 
                    the blockchain network. It does not have monetary value & is used mainly for testing purposes.                   
                    </p>
				</h5>
               
				</div>
				<hr />
				<p style ={{textAlign:"center"}}><i class="fas fa-info-circle"></i> Data & information displayed in this site are mock data. It does not represent any real entity or organization. </p>
				
			</div>
		);
	}

}


export default Requirements;