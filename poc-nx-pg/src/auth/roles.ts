// this file is temporary

import { Role } from "@prisma/client";

// roles must be retrieved from an auth service or DB
export const roles = new Map<string, string>([
  [Role.admin, Role.admin],
  [Role.site_owner, Role.site_owner],
  [Role.site_editor, Role.site_editor],
  [Role.viewer, Role.viewer],
]);

export class RoleEnum {
  static admin: string = Role.admin;
  static siteOwner: string = Role.site_owner;
  static siteEditor: string = Role.site_editor;
  static viewer: string = Role.viewer;
}
