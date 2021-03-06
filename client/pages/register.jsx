import React from 'react';

export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      companyName: '',
      registration: 'pending'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.homepageDrawerClose = this.homepageDrawerClose.bind(this);
    this.handleBadRegister = this.handleBadRegister.bind(this);
    this.handleBadRegisterMessage = this.handleBadRegisterMessage.bind(this);
    this.handleHideRegister = this.handleHideRegister.bind(this);
    this.handleViewSuccess = this.handleViewSuccess.bind(this);
  }

  handleBadRegister() {
    if (this.state.registration === 'failed') {
      return 'view';
    } else if (this.state.registration === 'connection failed') {
      return 'view';
    } else {
      return 'visibility-hidden';
    }
  }

  handleBadRegisterMessage() {
    if (this.state.registration === 'failed') {
      return 'Username already taken';
    } else if (this.state.registration === 'connection failed') {
      return 'Bad Request, please check your internet connection';
    }
    return 'Username already taken';
  }

  handleHideRegister() {
    if (this.state.registration === 'success') { return 'hidden'; }
    return 'view';
  }

  handleViewSuccess() {
    if (this.state.registration === 'success') { return 'view'; }
    return 'hidden';
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      registration: 'pending'
    });
  }

  homepageDrawerClose(event) {
    if (this.props.isOpen === 'yes') {
      this.props.onDrawerClick();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/auth/${action}`, req)
      .then(res => res.json())
      .then(result => {
        if (result.error === 'username already taken') {
          this.setState({
            registration: 'failed'
          });
        } else if (result.error === 'an unexpected error occurred') {
          this.setState({
            registration: 'connection failed'
          });
        } else if (action === 'register') {
          this.setState({ registration: 'success' });
          window.location.hash = '#registration-successful';
        }
      });
  }

  render() {
    const { handleChange, handleSubmit } = this;
    const badRegistration = this.handleBadRegister();
    const badRegistrationMessage = this.handleBadRegisterMessage();

    return (
      <>
        <div className='my-container whole-register width-80p flex align-items-center justify-content-center'
      onClick={this.homepageDrawerClose}>
        <div className="registration-form-holder position-absolute top-20 my-row  align-items-center">
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="cancel-x-holder my-row">
              <a className="clean-links" href="#"><i className="fas fa-times registration-x"></i></a>
            </div>
            <div className="registration-border">
              <div className="column-half">
                <h3 className="register-main-text">REGISTER</h3>
                <p className="register-p">Create Username</p>
                <input className="register-input" type="text" name="username" onChange={handleChange} required />
                <p className={`username-taken ${badRegistration}`}>{badRegistrationMessage}</p>
                <p className="register-p">Create Password</p>
                <input className="register-input" type="password" name="password" onChange={handleChange} required />
              </div>
              <div className="column-half">
                <div className="registration-bottom-half flex">
                  <div className="first-name-input-holder column-half">
                    <p className="register-p">First Name</p>
                    <input className="register-input" type="text" name="firstName" onChange={handleChange} required />
                  </div>
                  <div className="last-name-input-holder column-half">
                    <p className="register-p">Last Name</p>
                    <input className="register-input" type="text" name="lastName" onChange={handleChange} required />
                  </div>
                </div>
                <p className="register-p">Registered Company Name</p>
                <input className="register-input" type="text" name="companyName" onChange={handleChange} />
              </div>
              <div className="submit-button-holder text-align-right">
                <button className="registration-submit-button" type="submit">SUBMIT</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      </>
    );
  }
}
