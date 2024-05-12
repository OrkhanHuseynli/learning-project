import { UserCreateDto } from "../user.create.dto";

export function validateUserCreateDto(contentDto: Object): boolean {
  let keys = Object.keys(contentDto);
  const targetKeys = Object.keys(new UserCreateDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${UserCreateDto.name} failed`);
      return false;
    }
  }
  return true;
}
