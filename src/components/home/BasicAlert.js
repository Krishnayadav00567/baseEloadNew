'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactstrap = require('reactstrap');

var _buttons = require('@6d-ui/buttons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicAlert = function BasicAlert(props) {
  return _react2.default.createElement(
    _reactstrap.Modal,
    { className: 'center-alert_box', isOpen: props.isOpen, toggle: function toggle() {
        return props.close(0);
      }, modalTransition: { timeout: 20 }, backdropTransition: { timeout: 10 } },
    _react2.default.createElement(
      _reactstrap.ModalHeader,
      { toggle: function toggle() {
          return props.close(0);
        } },
      props.title
    ),
    _react2.default.createElement(
      _reactstrap.ModalBody,
      null,
      _react2.default.createElement(
        _reactstrap.Row,
        null,
        _react2.default.createElement(
          _reactstrap.Col,
          { sm: '2', className: 'alert_ico text-right' },
          _react2.default.createElement('i', { className: 'fa fa-exclamation-triangle' })
        ),
        _react2.default.createElement(
          _reactstrap.Col,
          { sm: '10', className: 'alert_text d-flex align-items-center' },
          props.content
        )
      )
    ),
    _react2.default.createElement(
      _reactstrap.ModalFooter,
      null,
      _react2.default.createElement(_buttons.CustomButton, {
        style: _buttons.BUTTON_STYLE.BRICK,
        type: _buttons.BUTTON_TYPE.ALERT_SECONDARY,
        size: _buttons.BUTTON_SIZE.MEDIUM_LARGE,
        color: _buttons.COLOR.SECONDARY,
        align: 'right',
        label: props.CancelBtnLabel || "Cancel",
        isButtonGroup: true,
        onClick: function onClick() {
          return props.close(0);
        }
      }),
      _react2.default.createElement(_buttons.CustomButton, {
        style: _buttons.BUTTON_STYLE.BRICK,
        type: _buttons.BUTTON_TYPE.ALERT_PRIMARY,
        size: _buttons.BUTTON_SIZE.MEDIUM_LARGE,
        align: 'right',
        label: props.confirmBtnLabel || "Confirm",
        isButtonGroup: true,
        onClick: function onClick() {
          props.close(0);props.onConfirmCallBack(props.rowId);
        }
      })
    )
  );
};
exports.default = BasicAlert;