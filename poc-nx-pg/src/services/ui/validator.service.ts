const endpoint = "api/users/available";

export class ValidatorService {
  async emailExists(email): Promise<boolean> {
    const queryParams = new URLSearchParams({
      email,
    });
    const result = await fetch(`${endpoint}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      return true;
    }

    return false;
  }
}
