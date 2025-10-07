import { Adventure } from "../domain/model/adventure.entity.js";

export class AdventureAssembler {
    static toEntityFromResource(resource = {}) {
        // Normalize resource fields to entity
        return new Adventure({
            id: resource.id ?? resource._id ?? null,
            title: resource.title ?? '',
            description: resource.description ?? '',
            location: resource.location ?? '',
            categoryId: resource.categoryId ?? null,
            price: resource.price ?? null,
            rating: resource.rating ?? 0,
            images: resource.images ?? (resource.photos ?? []),
            tags: resource.tags ?? []
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response || response.status !== 200) {
            console.error('Adventures response error', response && response.status);
            return [];
        }
        const resources = Array.isArray(response.data) ? response.data : (response.data.adventures || []);
        return resources.map(r => this.toEntityFromResource(r));
    }
}
