import React from "react";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export default function Signin() {
  return (
    <div className="fixed inset-0 dark:bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="dark:bg-secondary rounded p-6 w-72 space-y-6">
          <Title>Sign In</Title>
          <FormInput label="Email" placeholder="john@gmail.com" name="email" />
          <FormInput label="Password" placeholder="********" name="password" />
          <Submit value="Sign In" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forgot-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </div>
  );
}
