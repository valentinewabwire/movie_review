import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function ConfirmPassword() {
  const [password, setPassword] = useState({
    passwordOne: "",
    passwordTwo: "",
  });
  /* Getting the token and id from the url. */
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    isValidToken();
  }, []);

  /**
   * If the token is valid, set the isValid state to true, otherwise set it to false.
   * @returns The function isValidToken is returning the result of the async function
   * verifyPasswordResetToken.
   */
  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);

    /* If there is an error, then the user will be redirected to the reset password page. */
    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return updateNotification("error", error);
    }
    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }
    setIsValid(true);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setPassword({ ...password, [name]: value });
  };

  /**
   * It takes the password from the form and sends it to the server to reset the password.
   * @returns const { error, message } = await resetPassword({
   *       newPassword: password.passwordOne,
   *       userId: id,
   *       token,
   *     });
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.passwordOne.trim())
      return updateNotification("error", "Password is missing!");
    if (password.passwordOne.trim().length < 8)
      return updateNotification("error", "Password must be 8 characters long!");

    if (password.passwordOne !== password.passwordTwo)
      return updateNotification("error", "Password Do not match!");

    const { error, message } = await resetPassword({
      newPassword: password.passwordOne,
      userId: id,
      token,
    });
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    navigate("/auth/signin", { replace: true });
  };

  /* This is the first condition that is checked. If the isVerifying state is true, then the function
will return the JSX code. */
  if (isVerifying)
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary">
              Please wait we are verifying your token
            </h1>
            <ImSpinner3 className="animate-spin text-4xl dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );

  /* This is the second condition that is checked. If the isValid state is false, then the function
will return the JSX code. */
  if (!isValid)
    return (
      <FormContainer>
        <Container>
          <h1 className="text-4xl font-semibold dark:text-white text-primary">
            Sorry the token is invalid
          </h1>
        </Container>
      </FormContainer>
    );
  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <Title>Enter New Password</Title>
          <FormInput
            value={password.passwordOne}
            onChange={handleChange}
            label="New Password"
            placeholder="*********"
            name="passwordOne"
            type="password"
          />
          <FormInput
            value={password.passwordTwo}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="*********"
            name="passwordTwo"
            type="password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
