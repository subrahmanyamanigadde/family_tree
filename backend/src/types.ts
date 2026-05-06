export interface Person {
  id: string;
  name: string;
  phone: string;
  created_at?: string;
}

export interface Relationship {
  id: string;
  person_id: string;
  related_person_id: string;
  relationship_type: 'parent' | 'child' | 'spouse' | 'sibling' | 'grandparent' | 'grandchild' | 'aunt' | 'uncle' | 'cousin';
  created_at?: string;
}

export interface PersonWithRelationships extends Person {
  relationships: Relationship[];
}
