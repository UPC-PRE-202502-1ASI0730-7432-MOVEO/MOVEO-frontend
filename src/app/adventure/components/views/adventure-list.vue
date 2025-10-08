<!-- src/adventure/presentation/views/adventure-list.vue -->
<script setup lang="js">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { DataTable, Column, Button, ConfirmDialog, useConfirm } from "primevue";
import { useI18n } from "vue-i18n";
import useAdventureStore from "../../application/adventures.store.js";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();

const {
  adventures,
  adventuresLoaded,
  errors,
  fetchAdventures,
  deleteAdventure
} = useAdventureStore();

onMounted(async () => {
  if (!adventuresLoaded.value) await fetchAdventures()
})

const navigateToNew = () => router.push("/adventures/new");
const navigateToEdit = (id) => router.push(`/adventures/edit/${id}`);

const confirmDelete = (adventure) => {
  confirm.require({
    message: `¿Eliminar la aventura "${adventure.name}"?`,
    header: "Confirmar Eliminación",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Eliminar",
    rejectLabel: "Cancelar",
    accept: () => deleteAdventure(adventure)
  });
};
</script>

<template>
  <div class="p-6" style="background-color: var(--bg-base); min-height: 100vh;">
    <h1 class="heading-1" style="color: var(--text-primary); margin-bottom: 1rem;">Aventuras</h1>

    <Button
        label="Nueva Aventura"
        icon="pi pi-plus"
        class="mb-3"
        @click="navigateToNew"
        style="background-color: var(--brand-green); border: none;"
    />

    <DataTable
        :value="adventures"
        :loading="!adventuresLoaded"
        tableStyle="min-width: 50rem"
        :rows="5"
        :rowsPerPageOptions="[5,10,20]"
    >
      <Column field="id" header="ID" sortable />
      <Column field="title" header="Nombre" sortable />
      <Column field="description" header="Descripción" />
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" rounded text @click="navigateToEdit(slotProps.data.id)" />
          <Button icon="pi pi-trash" rounded severity="danger" text @click="confirmDelete(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <div v-if="errors.length" class="text-red-500 mt-3 paragraph-2">
      Ocurrió un error: {{ errors.map(e => e.message).join(', ') }}
    </div>

    <ConfirmDialog />
  </div>
</template>
