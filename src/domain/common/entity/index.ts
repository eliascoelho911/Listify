// Base identity trait for all entities
export type Entity = {
  id: string;
};

// Audit trail trait for entities with timestamps
export type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};
