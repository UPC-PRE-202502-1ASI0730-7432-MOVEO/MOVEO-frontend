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
        if (!response) {
            console.error('Adventures response error: response is null or undefined');
            return [];
        }

        let resources = [];

        if (Array.isArray(response)) {
            // Si response ya es un array directo
            resources = response;
        } else if (Array.isArray(response.data)) {
            resources = response.data;
        } else if (Array.isArray(response.data?.adventures)) {
            resources = response.data.adventures;
        } else {
            console.warn('No adventures found in response', response);
            return [];
        }

        return resources.map(r => this.toEntityFromResource(r));
    }
}

