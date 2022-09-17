import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ENCYPT_KEY } from '../../util/Constants';
import { encryptAuth } from '../ajax/elements/util/Utils';
import { setCredentials } from '../ajax/index';
import LoginContainer from './LoginContainer';

class Login extends Component {

    render() {
        const { login } = this.props;
        if (login && login.isLoggedIn) {
            setCredentials(login.userDetails.token, login.userDetails.userId);
        }
        if (login && login.userDetails && login.userDetails.forceChangePassword) {
            return <Redirect to={`/${encryptAuth("forceChangePassword", ENCYPT_KEY)}`} />
        }
        else if (login && login.isLoggedIn) {
            return <Redirect to={`/${encryptAuth("home", ENCYPT_KEY)}`}/>
        }
        else {
            setCredentials('', '');
            return (
                <div>
                    <LoginContainer
                        text={this.props.location.state}
                        login={this.props.login}
                        message={this.props.login.respMsg} />
                </div>
            );
        }

    }
}

function mapStateToProps(state) {
    return { login: state.login };
}

export default connect(mapStateToProps)(Login);
