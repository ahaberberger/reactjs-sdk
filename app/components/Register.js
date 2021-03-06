
//--------------------------------------------------------------------------
//  Import modules
//--------------------------------------------------------------------------
import React from 'react';
import {Router, Link, hashHistory} from 'react-router';
import {Modal, ModalClose} from 'react-modal-bootstrap';


//--------------------------------------------------------------------------
//  Register User
//--------------------------------------------------------------------------
var Header = React.createClass({
    render: function () {
        return (
            <div className="navbar navbar-default navbar-static-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <img src="./img/DreamFactory-logo-horiz.png" className="header-logo-align" height="25" />
                    </div>
                </div>
            </div>
        );
    }
});

var RegisterForm = React.createClass({
	getInitialState: function() {
    	return {
            value_firstname: '', 
            value_lastname: '',
            value_email: '', 
            value_password: '',
            isOpen: false,
            modalContent: {
                headline: '',
                body: '',
                extended: ''
            }
        }
  	},
	handleClick: function(event){
        var url = this.props.url;

        if(event.target.id === 'register_user') {
        	$.ajax({
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                url: url + '/api/v2/user/register?login=true',
                data: JSON.stringify({
                    "first_name": this.state.value_firstname,
                    "last_name": this.state.value_lastname,
                    "email": this.state.value_email,
                    "new_password": this.state.value_password
                }),
                cache:false,
                method:'POST',
                success:function (response) {
                    var session_token = response.session_token;
                    localStorage.setItem('session_token', session_token);
                    hashHistory.push('/groups');
                },
                error: function(response) {
                    console.log(response)
                    this.setState({
                        modalContent: {
                            headline: response.statusText,
                            body: response.responseJSON.error.message,
                            extended: response.responseText
                        }
                    })
                    
                    this.openModal();
                }.bind(this)
            });
        }
    },
    openModal: function() {
        this.setState({isOpen: true});
    },
    closeModal: function() {
        this.setState({isOpen: false})
    },
    handleChange: function (name, e) {
      var change = {};
      change[name] = e.target.value;
      this.setState(change);
    },
	render: function() {
		return (
			<div>
				<div className="row"></div>
				<div className="col-md-2"></div>
	            <div className="col-md-8">
	                <div className="login">
	                    <form>
	                        <div className="form-group form-control-size" >
	                            <input type="text" className="form-control" id="register_firstname" placeholder="First Name" value={this.state.value_firstname} onChange={this.handleChange.bind(this, 'value_firstname')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <input type="text" className="form-control" id="register_lastname" placeholder="Last Name" value={this.state.value_lastname} onChange={this.handleChange.bind(this, 'value_lastname')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <input type="email" className="form-control" id="register_email" placeholder="Email" value={this.state.value_email} onChange={this.handleChange.bind(this, 'value_email')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <input type="password" className="form-control" id="register_password" placeholder="Password" value={this.state.value_password} onChange={this.handleChange.bind(this, 'value_password')} />
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <button id="register_user" className="btn btn-default login-btn-signin" type="button" onClick={this.handleClick}>Register User</button>
	                        </div>
	                        <div className="form-group form-control-size" >
	                            <Link to="/login" className="btn btn-default login-btn-cancel" >Cancel</Link>
	                        </div>
	                    </form>
	                </div>
	            </div>
	            <div className="col-md-2"></div>
                <ErrorModal 
                    isOpen={this.state.isOpen} 
                    headline={this.state.modalContent.headline}
                    body={this.state.modalContent.body}
                    extended={this.state.modalContent.extended}
                    closeModal={this.closeModal}
                />
	        </div>
	    );
	}
});

var Register = React.createClass({
    render: function() {
    	var { url } = this.props;

        return (
            <div>
                <Header/>
                <div className="container">
                    <div className="row">
                        <div className="center-block trim">
                            <RegisterForm url={url} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


//--------------------------------------------------------------------------
//  Modal Messages
//--------------------------------------------------------------------------
var ErrorModal = React.createClass({
    hideModal: function() {
        this.props.closeModal();
    },
    render: function() {
        var { isOpen, headline, body, extended } = this.props;

        return (
            <Modal isOpen={isOpen} onRequestHide={this.hideModal}>
                <div className='modal-header'>
                    <ModalClose onClick={this.hideModal}/>
                    <h4 className='modal-title'>{headline}</h4>
                </div>
                <div className='modal-body'>
                    <p>{body}</p>
                    <div>
                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseError" aria-expanded="false" aria-controls="collapseError">
                            <h6>Show/hide full message</h6>
                        </button>
                        <div className="collapse" id="collapseError">
                            <div className="well" id="errorMsg">{extended}</div>
                        </div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-default' onClick={this.hideModal}>
                        Close
                    </button>
                </div>
            </Modal>
        )
    }
});


//--------------------------------------------------------------------------
//  Module Export
//--------------------------------------------------------------------------
module.exports = Register;

