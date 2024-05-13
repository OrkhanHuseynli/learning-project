// correspond to entity
export class UserCreateDto {
  name: string;
  lastName: string;
  email: string;
  roles: string[];
  password: string;

  constructor() {
    this.name = null;
    this.lastName = null;
    this.email = null;
    this.roles = null;
    this.password = null;
  }
}

export class UserLoginDto {
  email: string;
  password: string;

  constructor() {
    this.email = null;
    this.password = null;
  }
}
