import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { UserService } from "./../ui";
import { RoleEnum, roles } from "src/auth/roles";
const userService = new UserService();

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
    console.log(" validatedFields not successful end");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  } else {
    console.log(" hitting end");
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
        error: "Failed to sign up: ",
      };
    }
  }
}
