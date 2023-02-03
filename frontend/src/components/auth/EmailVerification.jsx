import React, { useEffect, useRef } from "react";
import { useState } from "react";
import Container from "../Container";
import Submit from "../form/Submit";
import Title from "../form/Title";

const OTP_LENGTH = 6;

/**
 * When the user types in a character, the character is added to the otp array, and the focus is moved
 * to the next input field
 * @returns A React component.
 */
export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const inputRef = useRef();

  /**
   * When the user enters a digit, focus on the next input field.
   */
  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };
  /**
   * If the index is not 0, then set the next index to the difference between the current index and 1,
   * otherwise set the next index to 0.
   */
  const focusPrevInputFiled = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  };

  /**
   * When the user types in a character, the character is added to the otp array, and the focus is moved
   * to the next input field.
   */
  const handleOtpChange = ({ target }, index) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1, value.length);

    if (!value) focusPrevInputFiled(index);
    else focusNextInputField(index);
    setOtp([...newOtp]);
  };

  /**
   * If the key pressed is the backspace key, then focus on the previous input field.
   */
  const handleKeyDown = ({ key }, index) => {
    if (key === "Backspace") {
      focusPrevInputFiled(index);
    }
  };

  /* Focusing the input field. */
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 w-96 space-y-6">
          <div>
            <Title>Please Enter the OTP to verify your account</Title>
            <p className="text-center text-dark-subtle">
              OTP has been sent tour email
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 border-dark-subtle focus:border-white rounded bg-transparent outline-none text-center text-white font-semibold text-xl spin-button-none"
                />
              );
            })}
          </div>

          <Submit value="Verify Account" />
        </form>
      </Container>
    </div>
  );
}
