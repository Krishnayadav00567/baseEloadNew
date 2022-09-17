import React from 'react';
import { connect } from 'react-redux';

import LoginForm from './LoginForm';
import { logIn, setLoading, logInWithOtp } from '../../actions';

function LoginContainer(props) {
    const onLoginClick = (userName, password,captcha,captchaTotal) => {
        props.setLoading({ isLoading: true });
        props.logIn({ username: userName, password,captcha,captchaTotal });
    }
    const onLoginWithOtp = (userName, password,otp,captcha,captchaTotal) => {
        props.setLoading({ isLoading: true });
        props.logInWithOtp({ username: userName, password, otp,captcha,captchaTotal});
    }

    return <LoginForm
        isLoading={props.isLoading}
        onSubmit={onLoginClick}
        message={props.message}
        login={props.login}
        text={props.text}
        logInWithOtp = {onLoginWithOtp}
    />
}

function mapStateToProps({ loader }) {
    return { isLoading: loader.isLoading };
}
export default connect(mapStateToProps, { logIn, setLoading, logInWithOtp })(LoginContainer);
