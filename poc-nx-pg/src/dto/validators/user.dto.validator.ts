import { UserCreateDto, UserLoginDto } from "../user.create.dto";

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

export function validateUserLoginDto(dto: Object): boolean {
  let keys = Object.keys(dto);
  const targetKeys = Object.keys(new UserLoginDto());
  for (let key of targetKeys) {
    if (!keys.includes(key)) {
      console.log(`Validation of ${UserLoginDto.name} failed`);
      return false;
    }
  }
  return true;
}
