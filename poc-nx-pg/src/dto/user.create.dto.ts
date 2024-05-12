// correspond to entity
export class UserCreateDto {
  name: string;
  email: string;
  roles: string[];

  constructor() {
    this.name = null;
    this.email = null;
    this.roles = null;
  }
}
