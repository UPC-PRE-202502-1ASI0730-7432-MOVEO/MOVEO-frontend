import { ref } from 'vue'
import { AdventureAssembler } from './adventure.assembler.js'
import {BaseApi} from "@/app/shared/infrastructure/base-api.js";

const adventures = ref([])
const adventuresLoaded = ref(false)
const errors = ref([])

export class AdventuresApi extends BaseApi {
    export
    default
    function

    useAdventuresStore() {

        function fetchAdventures() {
            adventuresLoaded.value = true
            // No sobreescribimos adventures si quieres que se acumulen los agregados desde el form
        }

        function getAdventureById(id) {
            return adventures.value.find(a => a?.id === Number(id))
        }

        function addAdventure(adventure) {
            adventure.id = Date.now()  // genera un id único temporal
            adventures.value.push(adventure)
        }

        function updateAdventure(updatedAdventure) {
            const index = adventures.value.findIndex(a => a?.id === updatedAdventure.id)
            if (index !== -1) adventures.value[index] = updatedAdventure
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
}
