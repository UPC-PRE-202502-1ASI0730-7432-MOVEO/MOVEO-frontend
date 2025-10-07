import { ref } from 'vue'
import { AdventuresApi } from '../infrastructure/adventures-api.assembler.js'
import { AdventureAssembler } from '../infrastructure/adventure.assembler.js'

const adventureApi = new AdventuresApi()

export default function useAdventuresStore() {
    const adventures = ref([])
    const adventuresLoaded = ref(false)
    const errors = ref([])

    function fetchAdventures() {
        try {
            const response = adventureApi.getAdventures()
            adventures.value = AdventureAssembler.toEntitiesFromResponse(response)
            adventuresLoaded.value = true
        } catch (error) {
            errors.value.push(error)
        }
    }

    function getAdventureById(id) {
        return adventures.value.find(a => a?.id === Number(id))
    }

    function addAdventure(adventure) {
        adventure.id = Date.now()
        adventures.value.push(adventure)
    }

    function updateAdventure(updatedAdventure) {
        const index = adventures.value.findIndex(a => a?.id === updatedAdventure.id)
        if (index !== -1) {
            adventures.value[index] = updatedAdventure
        }
    }

    function deleteAdventure(adventure) {
        adventures.value = adventures.value.filter(a => a?.id !== adventure.id)
    }

    return {
        adventures,
        adventuresLoaded,
        errors,
        fetchAdventures,
        getAdventureById,
        addAdventure,
        updateAdventure,
        deleteAdventure
    }
}
