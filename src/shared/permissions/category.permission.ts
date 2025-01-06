export const CATEGORY_PERMISSIONS = [
    { action: 'create', description: 'Create category', name: 'Create', resource: 'category' },
    { action: 'read', description: 'Read category', name: 'Read', resource: 'category' },
    { action: 'update', description: 'Update category', name: 'Update', resource: 'category' },
    { action: 'delete', description: 'Delete category', name: 'Delete', resource: 'category' },
] as const;

export type CategoryPermission =
    `${(typeof CATEGORY_PERMISSIONS)[number]['resource']}:${(typeof CATEGORY_PERMISSIONS)[number]['action']}`;
