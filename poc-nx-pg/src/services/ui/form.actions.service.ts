import { SignupFormSchema, FormState } from "@/app/lib/ui/definitions";
import { UserService } from "./../ui";
import { RoleEnum} from "src/auth/roles";
import { ValidatorService } from "./validator.service";
const userService = new UserService();
const validatorService = new ValidatorService();

export async function signUpAction(state: FormState, formData): Promise<any> {
  console.log("sign up action");
  // Validate form fields
  const userCreateDto = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    lastName: formData.get("lastName"),
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
