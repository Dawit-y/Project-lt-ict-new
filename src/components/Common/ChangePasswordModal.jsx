import {
	Modal,
	ModalBody,
	ModalHeader,
	Form,
	Label,
	Input,
	Button,
	FormFeedback,
	InputGroup,
	InputGroupText,
	Spinner,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useChangeOwnPassword } from "../../queries/users_query";
import { checkPasswordStrength } from "../../utils/Validation/validation";

const ChangePasswordModal = ({ isOpen, toggle }) => {
	const { t } = useTranslation();
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState("");

	const { mutateAsync: changeUserPassword, isPending } = useChangeOwnPassword();

	const handlePasswordChange = async (values) => {
		try {
			await changeUserPassword({
				old_password: values.oldPassword,
				password: values.password,
			});
			toast.success("Password changed successfully!", { autoClose: 3000 });
			toggle();
		} catch (error) {
			if (
				error.response &&
				error.response.status === 400 &&
				error.response.data?.type === "auth_error"
			) {
				// Show API message on the old password field
				validation.setFieldError("oldPassword", error.response.data.errorMsg);
				throw error;
			} else {
				toast.error("Failed to change password", { autoClose: 3000 });
			}
		}
	};

	const validation = useFormik({
		initialValues: {
			oldPassword: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: Yup.object({
			oldPassword: Yup.string().required("Old password is required"),
			password: Yup.string()
				.min(8, "Password must be at least 8 characters")
				.required("New password is required"),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref("password"), null], "Passwords must match")
				.required("Please confirm your password"),
		}),
		onSubmit: handlePasswordChange,
	});

	const handlePasswordInputChange = (e) => {
		validation.handleChange(e);
		const strength = checkPasswordStrength(e.target.value);
		setPasswordStrength(strength);
	};

	// Reset form when modal opens
	useEffect(() => {
		if (isOpen) {
			validation.resetForm();
		}
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} toggle={toggle} backdrop="static" centered>
			<ModalHeader toggle={toggle}>{t("change_password")}</ModalHeader>
			<ModalBody>
				<Form onSubmit={validation.handleSubmit}>
					{/* Old Password Field */}
					<div className="mb-3">
						<Label>{t("old_password")}</Label>
						<InputGroup>
							<Input
								name="oldPassword"
								type={showOldPassword ? "text" : "password"}
								placeholder={t("enter_old_password")}
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.oldPassword}
								invalid={
									validation.touched.oldPassword &&
									!!validation.errors.oldPassword
								}
							/>
							<InputGroupText
								onClick={() => setShowOldPassword((prev) => !prev)}
								style={{ cursor: "pointer" }}
							>
								{showOldPassword ? <FaEyeSlash /> : <FaEye />}
							</InputGroupText>
							{validation.touched.oldPassword &&
								validation.errors.oldPassword && (
									<FormFeedback>{validation.errors.oldPassword}</FormFeedback>
								)}
						</InputGroup>
					</div>

					{/* New Password Field */}
					<div className="mb-3">
						<Label>{t("new_password")}</Label>
						<InputGroup>
							<Input
								name="password"
								type={showPassword ? "text" : "password"}
								placeholder={t("enter_new_password")}
								onChange={handlePasswordInputChange}
								onBlur={validation.handleBlur}
								value={validation.values.password}
								invalid={
									validation.touched.password && !!validation.errors.password
								}
							/>
							<InputGroupText
								onClick={() => setShowPassword((prev) => !prev)}
								style={{ cursor: "pointer" }}
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</InputGroupText>
							{validation.touched.password && validation.errors.password && (
								<FormFeedback>{validation.errors.password}</FormFeedback>
							)}
						</InputGroup>

						{/* Password Strength Checker */}
						{validation.values.password && (
							<div
								className={`mt-1 text-sm ${
									passwordStrength === "Strong"
										? "text-success"
										: passwordStrength === "Moderate"
											? "text-warning"
											: "text-danger"
								}`}
							>
								{t(passwordStrength)}
							</div>
						)}
					</div>

					{/* Confirm Password Field */}
					<div className="mb-3">
						<Label>{t("confirm_password")}</Label>
						<InputGroup>
							<Input
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder={t("confirm_password")}
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.confirmPassword}
								invalid={
									validation.touched.confirmPassword &&
									!!validation.errors.confirmPassword
								}
							/>
							<InputGroupText
								onClick={() => setShowConfirmPassword((prev) => !prev)}
								style={{ cursor: "pointer" }}
							>
								{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
							</InputGroupText>
							{validation.touched.confirmPassword &&
								validation.errors.confirmPassword && (
									<FormFeedback>
										{validation.errors.confirmPassword}
									</FormFeedback>
								)}
						</InputGroup>
					</div>

					{/* Submit Button */}
					<div className="text-end">
						<Button color="primary" type="submit" disabled={isPending}>
							{isPending ? (
								<span>
									<Spinner size="sm" className="me-1" /> {t("change_password")}
								</span>
							) : (
								t("change_password")
							)}
						</Button>
					</div>
				</Form>
			</ModalBody>
		</Modal>
	);
};

export default ChangePasswordModal;
