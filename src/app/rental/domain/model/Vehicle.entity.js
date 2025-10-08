// Entidad Vehicle
export class Vehicle {
  constructor({ id, ownerId, brand, model, year, color, licensePlate, seats, transmission, fuelType, dailyPrice, hourlyPrice, depositAmount, location, features, photos, isAvailable, restrictions, createdAt, status }) {
    this.id = id
    this.ownerId = ownerId
    this.brand = brand
    this.model = model
    this.year = year
    this.color = color
    this.licensePlate = licensePlate
    this.seats = seats
    this.transmission = transmission
    this.fuelType = fuelType
    this.dailyPrice = dailyPrice
    this.hourlyPrice = hourlyPrice
    this.depositAmount = depositAmount
    this.location = location
    this.features = features || []
    this.photos = photos || []
    this.isAvailable = isAvailable
    this.restrictions = restrictions || []
    this.createdAt = createdAt
    this.status = status
  }

  get fullName() {
    return `${this.brand} ${this.model}`
  }

  get primaryPhoto() {
    return this.photos?.[0] || null
  }
}
