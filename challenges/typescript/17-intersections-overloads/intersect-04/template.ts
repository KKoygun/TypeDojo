// Challenge: intersection-based mixin types

export type Identifiable = { id: string }
export type Timestamped = { createdAt: string; updatedAt: string }
export type Auditable = { createdBy: string; updatedBy: string }

export type Entity = Identifiable & Timestamped
export type AuditedEntity = Entity & Auditable

export function createEntity(id: string): Entity {
  // set id, createdAt and updatedAt to current ISO string
}

export function withAudit(entity: Entity, user: string): AuditedEntity {
  // spread entity and add audit fields
}

export function isAudited(e: Entity | AuditedEntity): e is AuditedEntity {
  // check for audit fields
}
