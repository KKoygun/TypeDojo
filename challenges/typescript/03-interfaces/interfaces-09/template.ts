// Challenge: Nested interfaces (Address + Contact) + fullName + formatContact
// Address: street, city, country (all string), postCode? (string)
// Contact: id, firstName, lastName, email (string), phone? (string), address (Address)
// fullName: "FirstName LastName"
// formatContact: "FirstName LastName <email> - city"

export interface Address {
  // your properties here
}

export interface Contact {
  // your properties here
}

export function fullName(contact: Contact): string {
  // your implementation
}

export function formatContact(contact: Contact): string {
  // your implementation
}
