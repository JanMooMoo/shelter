import React from 'react';


function NotifyConnection(props) {
	return (
		<div className="notify">
			
			<p>No Connection to Blockchain Network or Unregistered User</p>
            <a href={"https://www.shelter.services/requirements"} title={'require'} target = "blank" className="notifyHeader mb-2"> Please see requirements page or register.</a> 

			
		</div>
	);
}

export default NotifyConnection;