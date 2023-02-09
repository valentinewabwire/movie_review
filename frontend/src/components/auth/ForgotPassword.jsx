import React, { useState } from "react";
import { forgetPassword } from "../../api/auth";
import { useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const { updateNotification } = useNotification();
  /**
   * The handleChange function takes an event object as an argument, and then uses the event object to
   * set the state of the userInfo object.
   */
  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  /**
   * If the email is not valid, return an error message, otherwise, if there is an error, return an error
   * message, otherwise, return a success message.
   * @returns const { error, message } = await forgetPassword(email);
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email))
      return updateNotification("error", "Invalid email!");
    const { error, message } = await forgetPassword(email);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Please Enter your Email</Title>
          <FormInput
            onChange={handleChange}
            value={email}
            label="Email"
            placeholder="john@gmail.com"
            name="email"
          />
          <Submit value="Send Link" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign In</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
