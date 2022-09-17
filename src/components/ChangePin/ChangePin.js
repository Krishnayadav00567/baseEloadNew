import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Container } from "reactstrap";
import { withRouter } from "react-router-dom";
import {
	FieldItem,
	useFieldItem,
	FIELD_TYPES,
	validateForm,
} from "@6d-ui/fields";
import {
	CustomButton,
	BUTTON_SIZE,
	BUTTON_STYLE,
	BUTTON_TYPE,
} from "@6d-ui/buttons";
import {
	VALIDATE_OTP_URL,
	GENERATE_OTP_URL,
	CHANGE_PIN_URL,
	MESSAGES,
} from "../../util/Constants";

const FIELDS = {
	msisdn: {
		name: "msisdn",
		placeholder: "XXXXXXXXX",
		label: "MDN",
		width: "md",
		type: FIELD_TYPES.TEXT,
		ismandatory: true,
		//maxLength: 12,
		regex: /^[0-9]+$/,
		messages: {
			regex: "Only numbers allowed",
		},
	},
	pin: {
		name: "pin",
		placeholder: "xxxxx",
		label: "Existing PIN",
		width: "md",
		type: FIELD_TYPES.TEXT,
		ismandatory: true,
		regex: /^[0-9]+$/,
		maxLength: 6,
		messages: {
			regex: "Only numbers allowed",
		},
	},
	newpin: {
		name: "newpin",
		placeholder: "xxxxx",
		label: "New PIN",
		width: "md",
		type: FIELD_TYPES.TEXT,
		ismandatory: true,
		regex: /^[0-9]+$/,
		maxLength: 6,
		messages: {
			regex: "Only numbers allowed",
		},
	},
	confirmpin: {
		name: "confirmpin",
		placeholder: "xxxxx",
		label: "Confirm New PIN",
		width: "md",
		type: FIELD_TYPES.TEXT,
		ismandatory: true,
		regex: /^[0-9]+$/,
		maxLength: 6,
		messages: {
			regex: "Only numbers allowed",
		},
	},
	otp: {
		name: "otp",
		placeholder: "XXXXXX",
		label: "OTP",
		width: "md",
		type: FIELD_TYPES.TEXT,
		ismandatory: true,
		maxLength: 6,
		regex: /^[0-9]+$/,
		messages: {
			regex: "Only numbers allowed",
		},
	},
	secretAnswer: {
		name: "secretAnswer",
		placeholder: "Secret Answer",
		label: "Secret Answer",
		width: "md",
		type: FIELD_TYPES.TEXT,
	},
}
let webNotTimer;
var id2;
function ChangePin(props) {
	const { ajaxUtil, onCancel } = props;
	const [values, fields, handleChange, { validateValues }] = useFieldItem(
		FIELDS,
		{},
		{ onValueChange }
	);
	const [otpSend, setOtpSend] = useState(false);
	const [otpValidated, setOtpValidated] = useState(false);
	const [isresendOtp, setIsresendOtp] = useState(false);
	const [message, setMessage] = useState("");
	const [validationToken, setValidationToken] = useState("");
	const [expiryTime,setExpiryTime] = useState("")
	const [timer,setTimer] = useState("")
	// const [random, setRandom]= useState()
	useEffect(() => {
		handleChange("msisdn", props.login.userDetails.msisdn);
		return () => {
			if (webNotTimer) clearInterval(webNotTimer);
		};
	}, []);

	// function showResendOtp(rsntOtpSec) {
	// 	webNotTimer = setTimeout(function () {
	// 		setIsresendOtp(true);
	// 	}, rsntOtpSec);
	// }

	// function resendOTPfn(rsntOtpSec) {
	// 	var id1;
	// 	var count = rsntOtpSec; 
	// 	id1 = setInterval(function() {
	// 		count--;
	// 		if(count < 0){
	// 			clearInterval(id1);
	// 			setExpiryTime("")
	// 		}else{
	// 			setExpiryTime("Resend OTP? Try again after "+ count + " seconds.")
	// 		}
	// 	},1000);
	// }

	function showResendOtp() {
		webNotTimer = setTimeout(function () {
			setIsresendOtp(true);
		}, 10000);
	}
	function startTimer(duration) {
		var timer = duration, minutes, seconds;
		// setRandom(Math.floor(100000000000 + Math.random() * 900000000000));
		id2=setInterval(function () {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);
	
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
	
			setTimer("Your OTP will expire in " +minutes + ":" + seconds);
	
			if (--timer < 0) {
				clearInterval(id2);
				setTimer("");
			}
		}, 1000);
	}

	const validateOtp = () => {
		const req = {
			msisdn: values.msisdn,
			otp: values.otp,
			serviceId: 106,
		};
		ajaxUtil.sendRequest(
			VALIDATE_OTP_URL,
			req,
			(response, hasError) => {
				if (!hasError) {
					setOtpValidated(true);
					setValidationToken(response.validationToken);
				} else {
					props.setNotification({
						hasError: true,
						message: response.responseMessage,
					});
				}
			},
			props.loadingFunction,
			{ method: "POST", isShowSuccess: false, isShowFailure: false }
		);
	};

	function onValueChange(name, value, values, fieldValues) {
		if (value && value != null) {
			return [
				{
					...values,
					[name]: value,
				},
			];
		} else return [null];
	}

	const onSaveWithOtp = () => {
		const hasError = validateValues(["pin", "newpin", "confirmpin"]);
		if (values.newpin !== values.confirmpin || !values.pin) {
			let validation1 = !values.pin ? "Exisitng PIN cannot be empty." : "";
			let validation2 = values.newpin !== values.confirmpin ? "New PIN and confirm new PIN are not same." : "";
			ajaxUtil.setNotification({
				message: `${validation1} ${validation2}`,
				hasError: true,
			});
			return;
		}
		if (!hasError) {
			let currentTime = new Date();
			let cDate = `${currentTime.getFullYear()}-${
				currentTime.getMonth() + 1
			}-${currentTime.getDate()}`;
			let cTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
			let dateTime = cDate + " " + cTime;
			const req = {
				wsUsername: "sixdee",
				wsPassword: "sixdee",
				extTxnId: Math.floor(
					100000000000 + Math.random() * 900000000000
				).toString(),
				requestTime: dateTime,
				channel: "WEB",
				senderMsisdn: values.msisdn,
				senderUserId: props.login.userDetails.userId,
				pin: values.pin,
				newPin: values.newpin,
				confirmPin: values.confirmpin,
				secretAnswer: values.secretAnswer
			};
			props.ajaxUtil.sendRequest(
				CHANGE_PIN_URL,
				req,
				(response, hasError) => {
					if  (!hasError) {
							ajaxUtil.setNotification({
								message: response.responseMsg,
								hasError: false,
							});
							onCancel();
						}
						else {
							ajaxUtil.setNotification({
								message: response.responseMsg,
								hasError: true,
							});
							//onCancel();
					}
				},
				props.loadingFunction,
				{ isShowSuccess: false,isShowFailure: false, method: "POST" }
			);
		} else {
			props.setNotification({
				message: MESSAGES.FILED_MANDATORY,
				hasError: true,
			});
		}
	};

	const getOtp = (type = "") => {
		if(id2) clearInterval(id2);
		const req = {
			msisdn: values.msisdn,
			serviceId: 106,
		};
		props.ajaxUtil.sendRequest(
			GENERATE_OTP_URL,
			req,
			(response, hasError) => {
				if (!hasError) {
					setOtpSend(true);
					// showResendOtp((response.expiryMinutes)*1000);
					// resendOTPfn(response.expiryMinutes)
					showResendOtp()
					setIsresendOtp(false)
					startTimer((response.expiryMinutes)*60)
					if (type === "resend") {
						setMessage("OTP has been Re-sent to your MDN");
					}
						
					else setMessage("OTP has been sent to your MDN");
				}
			},
			props.loadingFunction,
			{ method: "POST", isShowSuccess: false }
		);
	};
	return (
		<>
			<div className="custom-container">
				<Container className=" mb-3">
					{!otpValidated ? (
						<>
							{otpSend && message && (
								<div
									className="successMsg_login text-center"
									style={{ border: "none" }}
								>
									{message}
								</div>
							)}
							<Row className="mx-0 mb-2">
								<Col md="12" className="channel-type modal-eload">
									<FieldItem
										{...FIELDS.msisdn}
										onChange={(...e) =>
											handleChange("msisdn", ...e)
										}
										value={values.msisdn || ""}
										touched={
											fields.msisdn &&
											fields.msisdn.hasError
										}
										error={
											fields.msisdn &&
											fields.msisdn.errorMsg
										}
										type={FIELD_TYPES.TEXT_BOX_DISABLED}
									/>
								</Col>
							</Row>
							{otpSend && (
								<Row className="mx-0 mb-2">
									<Col
										md="12"
										className="channel-type modal-eload"
									>
										<FieldItem
											{...FIELDS.otp}
											onChange={(...e) =>
												handleChange("otp", ...e)
											}
											value={values.otp || ""}
											touched={
												fields.otp &&
												fields.otp.hasError
											}
											error={
												fields.otp &&
												fields.otp.errorMsg
											}
										/>
										<span className="pl-3" style={{ color: 'gray'}}>{timer}</span>
									</Col>
								</Row>
							)}
						</>
					) : (
						<>
							<Row className="mx-0 mb-2">
								<Col
									md="12"
									className="channel-type modal-eload"
								>
									<FieldItem
										{...FIELDS.pin}
										onChange={(...e) =>
											handleChange("pin", ...e)
										}
										value={values.pin || ""}
										touched={
											fields.pin && fields.pin.hasError
										}
										error={
											fields.pin && fields.pin.errorMsg
										}
										inputType="password"
									/>
								</Col>
							</Row>
							<Row className="mx-0 mb-2">
								<Col
									md="12"
									className="channel-type modal-eload"
								>
									<FieldItem
										{...FIELDS.newpin}
										onChange={(...e) =>
											handleChange("newpin", ...e)
										}
										value={values.newpin || ""}
										touched={
											fields.newpin &&
											fields.newpin.hasError
										}
										error={
											fields.newpin &&
											fields.newpin.errorMsg
										}
										inputType="password"
									/>
								</Col>
							</Row>
							<Row className="mx-0 mb-2">
								<Col
									md="12"
									className="channel-type modal-eload"
								>
									<FieldItem
										{...FIELDS.confirmpin}
										onChange={(...e) =>
											handleChange("confirmpin", ...e)
										}
										value={values.confirmpin || ""}
										touched={
											fields.confirmpin &&
											fields.confirmpin.hasError
										}
										error={
											fields.confirmpin &&
											fields.confirmpin.errorMsg
										}
										inputType="password"
									/>
								</Col>
							</Row>
							<Row className="mx-0 mb-2">
								<Col
									md="12"
									className="channel-type modal-eload"
								>
									<FieldItem
										{...FIELDS.secretAnswer}
										onChange={(...e) =>
											handleChange("secretAnswer", ...e)
										}
										value={values.secretAnswer || ""}
										touched={
											fields.secretAnswer &&
											fields.secretAnswer.hasError
										}
										error={
											fields.secretAnswer &&
											fields.secretAnswer.errorMsg
										}
									/>
								</Col>
							</Row>
						</>
					)}
				</Container>
				<div>
					{!otpSend ? (
						<CustomButton
							style={BUTTON_STYLE.BRICK}
							type={BUTTON_TYPE.PRIMARY}
							size={BUTTON_SIZE.MEDIUM}
							align="right"
							label="Get OTP"
							isButtonGroup={true}
							onClick={getOtp}
						/>
					) : (
						<CustomButton
							style={BUTTON_STYLE.BRICK}
							type={BUTTON_TYPE.PRIMARY}
							size={BUTTON_SIZE.MEDIUM}
							align="right"
							label={otpValidated ? "Change" : "Submit"}
							isButtonGroup={true}
							onClick={otpValidated ? onSaveWithOtp : validateOtp}
						/>
					)}
					{isresendOtp && !otpValidated ? (
						<CustomButton
							style={BUTTON_STYLE.BRICK}
							type={BUTTON_TYPE.SECONDARY}
							size={BUTTON_SIZE.MEDIUM}
							align="right"
							label="Resend OTP"
							isButtonGroup={true}
							onClick={() => getOtp("resend")}
						/>
					) 
					// : expiryTime? <span className="float-right margin-left otpExpiryTime mt-1">{expiryTime}</span>
					:(false)}
				</div>
			</div>
		</>
	);
}

export default withRouter(ChangePin);
