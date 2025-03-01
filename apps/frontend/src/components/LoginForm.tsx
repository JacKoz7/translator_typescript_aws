import { useTranslate } from "@/hooks";
import { IRegisterFormData, ISignUpState } from "@/lib";
import { ITranslateRequest } from "@sff/shared-types";
import { signUp } from "aws-amplify/auth";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export const RegistrationForm = ({
  onStepChange,
}: {
  onStepChange: (step: ISignUpState) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormData>();

  const onSubmit: SubmitHandler<IRegisterFormData> = async (
    { password, password2, email },
    event
  ) => {
    event && event.preventDefault();
    console.log("call on translate");
    // translate(data);
    // console.log(data);
    try {
      if (password != password2) {
        throw new Error("Password don't match");
      }
      const { nextStep } = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });

      console.log(nextStep.signUpStep);
      onStepChange(nextStep);
    } catch (e: unknown) {
      console.error(e);
    }
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">E-mail:</label>
        <input id="email" {...register("email", { required: true })} />
        {errors.email && <span>field is required</span>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <span>field is required</span>}
      </div>

      <div>
        <label htmlFor="password2">Confirm password:</label>
        <input
          id="password2"
          type="password"
          {...register("password2", { required: true })}
        />
        {errors.password2 && <span>field is required</span>}
      </div>

      <button className="btn bg-blue-500" type="submit">
        {"Register"}
      </button>
    </form>
  );
};
