import { ref } from "vue";
import { Adventure } from "../domain/model/adventure.entity.js";
import { AdventuresApi } from "../infrastructure/adventures-api.assembler.js";
import { AdventureAssembler } from "../infrastructure/adventure.assembler.js";

const adventureApi = new AdventuresApi();

const adventures = ref([]);
const adventuresLoaded = ref(false);
const errors = ref([]);

export default function useAdventuresStore() {

    function fetchAdventures() {
        adventuresLoaded.value = true;
        // No sobreescribimos adventures para mantener las agregadas desde el form
    }

    function getAdventureById(id) {
        return adventures.value.find(a => a.id === Number(id));
    }

    function addAdventure(adventure) {
        adventure.id = Date.now(); // ID temporal único
        adventures.value.push(new Adventure({ ...adventure }));
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
