export interface Address {
  street: string
  city: string
  country: string
  postCode?: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: Address
}

export function fullName(contact: Contact): string {
  return `${contact.firstName} ${contact.lastName}`
}

export function formatContact(contact: Contact): string {
  return `${fullName(contact)} <${contact.email}> - ${contact.address.city}`
}
