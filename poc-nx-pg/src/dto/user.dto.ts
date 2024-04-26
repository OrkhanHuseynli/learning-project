// correspond to entity
export class UserDto {
    id: number;
    name: string;
    email: string;
    roles: boolean;
  
    constructor() {
      this.id = null;
      this.name = null;
      this.email = null;
      this.roles = null;
    }
}