import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

class Notification extends Component {

    notify(message, hasError = false) {
        const options = {};
        toast.dismiss();
        hasError ? toast.error(message, options) : toast.success(message, options)
    };

    componentDidUpdate() {
        const {message, hasError} = this.props.toast;
        message && this.notify(message, hasError);
    }
    shouldComponentUpdate(nextProps) {
      return this.props.toast && nextProps.toast && (this.props.toast.timestamp !== nextProps.toast.timestamp)
    }

    render() {
        const {message} = this.props.toast;
        if (message) {
            return (
                <ToastContainer
                    position="top-right"
                    type="default"
                    autoClose={false}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                    className="toastify_class"
                    bodyClassName="toastify_body_class"
                    draggable={false}
                    closeOnClick={false}
                />
            );
        } else {
            return null;
        }
    }

}

export default Notification;
