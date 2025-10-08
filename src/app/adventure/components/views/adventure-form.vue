<script setup lang="js">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { InputText, Textarea, Button } from "primevue";
import useAdventureStore from "../../application/adventures.store.js";
import { Adventure } from "../../domain/model/adventure.entity.js";

const router = useRouter();
const route = useRoute();
const store = useAdventureStore();

const { adventures, getAdventureById, addAdventure, updateAdventure } = store;

const isEditMode = ref(false);
const formTitle = ref("Nueva Aventura");

const adventureForm = ref(new Adventure({ title: "", description: "", categoryId: null }));

onMounted(() => {
  const id = route.params.id;
  if (id) {
    const adventure = getAdventureById(id);
    if (adventure) {
      adventureForm.value = { ...adventure };
      isEditMode.value = true;
      formTitle.value = "Editar Aventura";
    }
  }
});

function saveAdventure() {
  if (isEditMode.value) {
    updateAdventure(adventureForm.value);
  } else {
    addAdventure(adventureForm.value);
  }
  router.push("/adventures");
}

function cancel() {
  router.push("/adventures");
}
</script>

<template>
  <div class="form-container">
    <h1 class="heading-1 form-title">{{ formTitle }}</h1>

    <div class="form-group">
      <label class="paragraph-2" for="name">Nombre</label>
      <InputText
          id="title"
          v-model="adventureForm.title"
          placeholder="Ej. Escalada en los Andes"
          class="input"
      />
    </div>

    <div class="form-group">
      <label class="paragraph-2" for="description">Descripción</label>
      <Textarea
          id="description"
          v-model="adventureForm.description"
          placeholder="Describe la experiencia..."
          rows="5"
          class="input"
      />
    </div>

    <div class="form-buttons">
      <Button
          :label="isEditMode ? 'Actualizar' : 'Crear'"
          icon="pi pi-check"
          class="btn-save"
          @click="saveAdventure"
      />
      <Button
          label="Cancelar"
          icon="pi pi-times"
          class="btn-cancel"
          @click="cancel"
      />
    </div>
  </div>
</template>

<style scoped>
.form-container {
  background-color: var(--bg-base);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;
}

.form-title {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.input {
  width: 100%;
  border: 1px solid var(--bg-muted);
  border-radius: 8px;
  padding: 0.75rem;
  font-family: var(--font-family-primary);
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--brand-green);
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.btn-save {
  background-color: var(--brand-green);
  border: none;
  color: white;
}

.btn-cancel {
  background-color: var(--brand-pink);
  border: none;
  color: white;
}
</style>
