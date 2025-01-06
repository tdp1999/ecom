export const PRODUCT_PERMISSIONS = [
    { action: 'create', description: 'Create product', name: 'Create', resource: 'product' },
    { action: 'read', description: 'Read product', name: 'Read', resource: 'product' },
    { action: 'update', description: 'Update product', name: 'Update', resource: 'product' },
    { action: 'delete', description: 'Delete product', name: 'Delete', resource: 'product' },
] as const;

export type ProductPermission =
    `${(typeof PRODUCT_PERMISSIONS)[number]['resource']}:${(typeof PRODUCT_PERMISSIONS)[number]['action']}`;
