// Challenge: Pick and Omit — derive PublicUser and CreateUserDto
// FullUser: id, name, email, password, createdAt, role
// PublicUser = Pick keeping: id, name, email, role
// CreateUserDto = Omit removing: id, createdAt
// toPublic: converts FullUser → PublicUser
// describeUser: returns "name (role)"

interface FullUser {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  role: string
}

export type PublicUser = Pick<FullUser, "id" | "name" | "email" | "role">
export type CreateUserDto = Omit<FullUser, "id" | "createdAt">

export function toPublic(user: FullUser): PublicUser {
  // your implementation
}

export function describeUser(user: PublicUser): string {
  // your implementation — "name (role)"
}
