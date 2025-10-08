import { ref } from "vue";
import { Adventure } from "../domain/model/adventure.entity.js";
import { AdventuresApi } from "../infrastructure/adventures-api.assembler.js";
import { AdventureAssembler } from "../infrastructure/adventure.assembler.js";

const adventureApi = new AdventuresApi();

export default function useAdventuresStore() {
    const adventures = ref([]);
    const adventuresLoaded = ref(true)
    const errors = ref([]);

    async function fetchAdventures() {
        try {
            const response = await adventureApi.getAdventures();
            adventures.value = AdventureAssembler.toEntitiesFromResponse(response);
            adventuresLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
            console.error("Error fetching adventures:", error);
        }
    }

    function getAdventureById(id) {
        return adventures.value.find(a => a.id === Number(id));
    }

    function addAdventure(adventure) {
        adventure.id = Date.now() // id único temporal
        adventures.value.push(new Adventure({ ...adventure })) // crea instancia
    }


    function updateAdventure(updatedAdventure) {
        const index = adventures.value.findIndex(a => a.id === updatedAdventure.id);
        if (index !== -1) adventures.value[index] = updatedAdventure;
    }

    function deleteAdventure(adventure) {
        adventures.value = adventures.value.filter(a => a.id !== adventure.id);
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
    };
}
