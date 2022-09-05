import React, { Component } from 'react';
import 'react-datetime/css/react-datetime.css';


class Form extends Component {
	constructor(props) {
		super(props);

		this.form = {};

		this.state = {
			
			title_length: 0,
			description_length: 0,
			address_length: 0,
			contact_length:0,

			wrong_file: false,
			file_name: null,
			file: null,
			fileImg: "/images/event-placeholder.jpg",
			form_validation: [],

			title: '',
			entity:'Clinic',
			description:'',
			address:'',
			contact:'',
			country:'Japan',
			city:'',
			website:'',
			
			dateDisplay:new Date(parseInt('1577952000', 10) * 1000)
		}
	}


	//handleImage
	handleFile = (event) => {
		let file = event.target.files[0];

		if (
			file.size > 1024 * 1024 ||
			(file.type !== 'image/jpeg' && file.type !== 'image/png')
		) {
			this.setState({
				wrong_file: true,
				file: null
			});
		} else {
			this.setState({
				wrong_file: false,
				file_name: file.name,
				file: file,
				fileImg: URL.createObjectURL(event.target.files[0])
			});
		}
	}
	//Name
	titleChange = (event) => {
		let title = event.target.value;
		if (title.length > 80) {
			title = title.slice(0, 80);
		}
		this.setState({
			title: title,
			title_length: title.length
		});
	}

	websiteChange = (event) => {
		let website = event.target.value;
		
		this.setState({
			website: website,
		},()=>console.log());
	}

	//description
	descriptionChange = (event) => {
		let description = event.target.value;
		if (description.length > 500) {
			description = description.slice(0, 500);
		}
		this.setState({
			description: description,
			description_length: description.length
		});
	}

	addressChange = (event) => {
		let address = event.target.value;
		if (address.length > 100) {
			address = address.slice(0, 100);
		}
		this.setState({
			address: address,
			address_length: address.length
		});
	}

	//Contact
	contactChange = (event) => {
		let contact = event.target.value;
		if (contact.length > 100) {
			contact = contact.slice(0, 100);
		}
		this.setState({
			contact: contact,
			contact_length: contact.length
		});
	}

	//country
	countryChange = (event) => {
		let country = event.target.value;

		this.setState({
			country: country
		},()=>console.log);
	}

	//Entity
	countryChange = (event) => {
		let entity = event.target.value;

		this.setState({
			entity: entity
		},()=>console.log);
	}

	//city
	cityChange = (event) => {
		let city = event.target.value;
		
		this.setState({
			city:city,
		},()=>console.log);
	}

	//submit
	handleForm = (event) => {
		event.preventDefault();

		let form_validation = [];
		if (this.state.title === '') form_validation.push('name');
		if (this.state.entity === '') form_validation.push('entity');
		if (this.state.country === '') form_validation.push('country');
		if (this.state.city === '') form_validation.push('city');
		if (this.form.address.value === '') form_validation.push('address');
		if (this.form.description.value === '') form_validation.push('description');
		if (this.form.contact.value === '') form_validation.push('contact');
		if (this.state.website === '') form_validation.push('website');
		if (this.state.wrong_file === true || this.state.file === null) form_validation.push('image');
		
		this.setState({
			form_validation: form_validation
		});

		if (form_validation.length === 0) {
			this.props.registerHospital(
				this.state.title,
				this.state.entity,
				this.state.country,
				this.state.city,
				this.state.address,
				this.state.description,
				this.state.contact,
				this.state.website,
				this.state.file
			);
		}
	}


	render() {
		

		let file_label = !this.state.wrong_file && this.state.file_name !== '' ? this.state.file_name : 'Select file';

		let warning = {
			name: this.state.form_validation.indexOf('name') === -1 ? '' : 'is-invalid',
			entity: this.state.form_validation.indexOf('entity') === -1 ? '' : 'is-invalid',
			country: this.state.form_validation.indexOf('country') === -1 ? '' : 'is-invalid',
			city: this.state.form_validation.indexOf('city') === -1 ? '' : 'is-invalid',
			address: this.state.form_validation.indexOf('address') === -1 ? '' : 'is-invalid',
			description: this.state.form_validation.indexOf('description') === -1 ? '' : 'is-invalid',
			website: this.state.form_validation.indexOf('website') === -1 ? '' : 'is-invalid',
			contact: this.state.form_validation.indexOf('contact') === -1 ? '' : 'is-invalid',
			image: this.state.form_validation.indexOf('image') === -1 && !this.state.wrong_file ? '' : 'is-invalid',
		};

		let alert;

		if (this.state.form_validation.length > 0) {
			alert = <div className="alert alert-dark mt-2" role="alert">Required fields are missed.</div>
		}

		let disabled = false;
		if(this.props.account.length === 0){
			disabled = true;
		} 

		return (
			<React.Fragment>
			<div className="home-wrapper mb-5">		
			<h2><i className="fa fa-edit"></i> Registration</h2>
			</div>
			<div className="row">
			<div className="col col-xl-8 col-lg-8 col-md-12 col-sm-12">
			<form>
				
				<div className="form-group">
					<label htmlFor="name">Hospital Name:</label>
					<input type="text" className={"form-control " + warning.name} id="name" title="Hospital Name" value={this.state.title} onChange={this.titleChange} autoComplete="off" />
					<small className="form-text text-muted">{this.state.title_length}/80 characters available.</small>
				</div>

				<div className="form-group">
					<label htmlFor="entity">Entity Type:</label>
					<select className="form-control" id="entity" title="Entity Type" onChange={this.countryChange}>
						<option value="Clinic" key="1">Clinic</option>
						<option value="Government Body" key="4">Government Body</option>
						<option value="Non Profit Organization" key="5">Non Profit Organization</option>
						<option value="Private Hospital" key="2">Private Hospital</option>
                        <option value="Public Hospital" key="3">Public Hospital</option>							
					</select>
				</div>
				
				<div className="form-group">
					<label htmlFor="country">Country:</label>
					<select className="form-control" id="country" title="country" onChange={this.countryChange}>
						<option value="Japan" key="1">Japan</option>
						<option value="Philippines" key="2">Philippines</option>
                        <option value="Singapore" key="3">Singapore</option>
                        <option value="South Korea" key="4">South Korea</option>
						<option value="Thailand" key="5">Thailand</option>	
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="city">City:</label>
					<input type="text" className={"form-control " + warning.city} id="city" title="city" onChange={this.cityChange} autoComplete="off" />
				</div>

				<div className="form-group">
					<label htmlFor="address">Address:</label>
					<textarea className={"form-control " + warning.address} id="address" title="Hospital Address" rows="5" ref={(input) => this.form.address = input} onChange={this.addressChange} autoComplete="off"></textarea>
					<small className="form-text text-muted">{this.state.address_length}/100 characters available.</small>
				</div>

				
				<div className="form-group">
					<label htmlFor="description">Hospital Description:</label>
					<textarea className={"form-control " + warning.description} id="description" title="Hospital Description" rows="5" ref={(input) => this.form.description = input} onChange={this.descriptionChange} autoComplete="off"></textarea>
					<small className="form-text text-muted">{this.state.description_length}/500 characters available.</small>
				</div>

				<div className="form-group">
					<label htmlFor="contact">Contact:</label>
					<input type="text" className={"form-control " + warning.contact} id="contact" title="contact info" ref={(input) => this.form.contact = input} onChange={this.contactChange} autoComplete="off" />
					<small className="form-text text-muted">{this.state.contact_length}/100 characters available.</small>
				</div>

				<div className="form-group">
					<label htmlFor="website">Website:</label>
					<input type="text" className={"form-control " + warning.website} id="website" title="Website" value={this.state.website} onChange={this.websiteChange} autoComplete="off" />
					<small className="form-text text-muted">SAMPLE: https://www.google.com/</small> <small className="form-text text-muted">Type "None" if you don't have a Website.</small>
				</div>

				<div className="form-group">
					<p>Event Cover Image:</p>
					<div className="custom-file">
						<input type="file" className={"custom-file-input " + warning.image} id="customFile" title="Event Cover Image" onChange={this.handleFile} autoComplete="off" />
						<label className="custom-file-label" htmlFor="customFile">{file_label}</label>
					</div>
					<small className="form-text text-muted">Image format: jpg, png. Max file size 1mb.</small>
				</div>

				<br />
				{alert}
				<br />
				<button type="submit" className="btn btn-outline-dark" title="Register Hospital" onClick={this.handleForm} disabled={disabled}>Register Hospital</button>

			</form>
			</div>

			<div className="col col-xl-4 col-lg-4 col-md-12 col-sm-12 create-event">
			<label></label>
			<div className="card">
			<div className="image_wrapper">
				<img className="card-img-top event-image" src={this.state.fileImg} alt="Placeholder Event" />
			</div>

			<div className="card-body-form">
				{this.state.description}
			</div>
			
			<ul className="list-group list-group-flush">
			<li className="list-group-item-page"><strong>Hospital Name: {this.state.title}</strong>  </li>
			<li className="list-group-item-page"><strong>Entity Type:</strong> {this.state.entity} </li>
			<li className="list-group-item-page"><strong>Country:</strong> {this.state.country} </li>
			<li className="list-group-item-page"><strong>City:</strong> {this.state.city} </li>
			<li className="list-group-item-page"><strong>Address:</strong> {this.state.address} </li>
			<li className="list-group-item-page"><strong>Contact:</strong> {this.state.contact} </li>
			<li className="list-group-item-page"><strong>Website:</strong><a href={this.state.website} target="blank"> {this.state.website}</a>  </li>
			</ul>

			<div className="card-footer-form text-muted text-center">
				<button className="btnAlive" disabled=""> Profile</button>
			</div>
</div>
</div>
</div>
</React.Fragment>
		);
	}

}

export default Form;

