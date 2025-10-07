export class Adventure{
    constructor({
                    id = null,
                    title = '',
                    description = '',
                    location = '',
                    categoryId = null,
                    price = null,
                    rating = 0,
                    images = [],
                    tags = []
                } = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.categoryId = categoryId;
        this.price = price;
        this.rating = rating;
        this.images = images;
        this.tags = tags;
    }
}