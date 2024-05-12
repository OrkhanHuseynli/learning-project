import { SignupFormSchema, FormState } from "@/app/lib/definitions";

export function signUpAction(state: FormState, formData): any {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log(`signUpAction : success`);
  // Call the provider or db to create a user...
}
