import {
  SignupFormSchema,
  FormState,
  LoginFormSchema,
} from "src/lib/ui/definitions";
import { UserService } from "./../ui";
import { RoleEnum } from "src/auth/roles";
import { ValidatorService } from "./validator.service";
import { LoginService } from "./login.service";
const userService = new UserService();
const validatorService = new ValidatorService();

export async function signUpAction(state: FormState, formData): Promise<any> {
  console.log("sign up action");
  // Validate form fields
  const userCreateDto = {
    name: formData.get("name"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const validatedFields = SignupFormSchema.safeParse(userCreateDto);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log(" Validation: fields are not successful");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    const emailExists = await validatorService.emailExists(userCreateDto.email);
    if (emailExists) {
      return {
        error: "User with this email already exists!",
      };
    }
    const result = await userService.createUser({
      ...userCreateDto,
      roles: [RoleEnum.viewer],
    });
    if (result) {
      console.log(`signUpAction : success`);
      return {
        message: "You have successfully signed up!",
      };
    } else {
      console.log("sign up was not successful");
      return {
        error: "Failed to sign up...",
      };
    }
  }
}

export async function loginAction(state: FormState, formData): Promise<any> {
  const actionName = "Log In Action";
  // Validate form fields
  const userLoginDto = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const validatedFields = LoginFormSchema.safeParse(userLoginDto);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log(" Validation: fields are not successful");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    const emailExists = await validatorService.emailExists(userLoginDto.email);
    if (!emailExists) {
      return {
        error: "User with this email does not exist!",
      };
    }
    const result = await LoginService.login(userLoginDto);
    if (result) {
      console.log(`${actionName} : success`);
      return {
        message: "You have successfully logged in!",
      };
    } else {
      console.log("Log In was not successful");
      return {
        error: "Failed to log in...",
      };
    }
  }
}
