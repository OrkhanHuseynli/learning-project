// correspond to entity
export class UserDto {
  id: number;
  name: string;
  lastName: string;
  email: string;
  roles: string[];

  constructor() {
    this.id = null;
    this.name = null;
    this.lastName = null;
    this.email = null;
    this.roles = null;
  }
}
