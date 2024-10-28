import { z } from 'zod';
import { CategoryId } from './category.model';

export const CategoryBreadcrumbSchema = z.object({
    path: z.array(z.object({ id: CategoryId, name: z.string() })),
});

// Response Types
export type CategoryBreadcrumb = z.infer<typeof CategoryBreadcrumbSchema>;
