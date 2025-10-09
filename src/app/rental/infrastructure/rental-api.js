

export const RentalApi = {
    async getVehiclesByOwner(ownerId) {
        try {
            const response = await fetch('http://localhost:3000/vehicles')
            if (!response.ok) throw new Error('Error al obtener vehículos')

            const data = await response.json()

            // 🔧 convertir ownerId a número antes de comparar
            return Array.isArray(data)
                ? data.filter(v => Number(v.ownerId) === Number(ownerId))
                : []
        } catch (error) {
            console.error('getVehiclesByOwner:', error)
            return []
        }
    }
}