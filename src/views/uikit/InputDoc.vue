<script>
import supabase from '../../supabaseClient';

export default {
    data() {
        return {
            supervisors: [], // Datos para la tabla de supervisores
            colaboradores: [], // Datos para la tabla de colaboradores
            errorSupervisors: null, // Errores en la consulta de supervisores
            errorColaboradores: null, // Errores en la consulta de colaboradores
            visibleUpdateSupervisor: false,
            visibleUpdateColaborador: false,
            visibleDeleteSupervisor: false,
            visibleDeleteColaborador: false,
            selectedSupervisor: null,
            selectedColaborador: null,
            nombre: '',
            cargo: '',
            telefono: '',
            correo: '',
            nombreC: '',
            cargoC: '',
            telefonoC: '',
            correoC: '',
        };
    },
    async mounted() {
        await this.fetchSupervisors();
        await this.fetchColaboradores();
    },
    methods: {
        async fetchSupervisors() {
            try {
                const { data, error } = await supabase
                    .from('supervisor')
                    .select('id_supervisor, nombre, cargo, telefono, correo')
                    .order('id_supervisor', { ascending: true });  // Ordenar por id_supervisor de menor a mayor

                if (error) {
                    this.errorSupervisors = error.message;
                    console.error('Error al cargar supervisores:', error.message);
                    return;
                }
                this.supervisors = data;
            } catch (err) {
                this.errorSupervisors = 'Error general de conexión';
                console.error('Error general al cargar supervisores:', err.message);
            }
        },
        async fetchColaboradores() {
            try {
                const { data, error } = await supabase
                    .from('colaborador')
                    .select('id_colaborador, nombre, cargo, telefono, correo')
                    .order('id_colaborador', { ascending: true });  // Ordenar por id_colaborador de menor a mayor

                if (error) {
                    this.errorColaboradores = error.message;
                    console.error('Error al cargar colaboradores:', error.message);
                    return;
                }
                this.colaboradores = data;
            } catch (err) {
                this.errorColaboradores = 'Error general de conexión';
                console.error('Error general al cargar colaboradores:', err.message);
            }
        }
        ,
        editarSupervisor(supervisor) {
            this.selectedSupervisor = supervisor;
            this.nombre = supervisor.nombre;
            this.cargo = supervisor.cargo;
            this.telefono = supervisor.telefono;
            this.correo = supervisor.correo;
            this.visibleUpdateSupervisor = true;
        },
        async updateSupervisor() {
            try {
                const { error } = await supabase
                    .from('supervisor')
                    .update({
                        nombre: this.nombre,
                        cargo: this.cargo,
                        telefono: this.telefono,
                        correo: this.correo,
                    })
                    .eq('id_supervisor', this.selectedSupervisor.id_supervisor);

                if (error) {
                    console.error('Error al actualizar supervisor:', error.message);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar supervisor.', life: 3000 });
                    return;
                }

                // Recargar datos después de actualizar
                await this.fetchSupervisors();
                this.visibleUpdateSupervisor = false;
                this.$toast.add({ severity: 'success', summary: 'Dato actualizado', detail: 'Supervisor se actualizó correctamente.', life: 3000 });
            } catch (err) {
                console.error('Error general al actualizar supervisor:', err.message);
            }
        },
        eliminarSupervisor(supervisor) {
            this.selectedSupervisor = supervisor;
            this.visibleDeleteSupervisor = true;
        },
        async deleteSupervisor() {
            try {
                const { error } = await supabase
                    .from('supervisor')
                    .delete()
                    .eq('id_supervisor', this.selectedSupervisor.id_supervisor);

                if (error) {
                    console.error('Error al eliminar supervisor:', error.message);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar supervisor.', life: 3000 });
                    return;

                }

                // Recargar datos después de eliminar
                await this.fetchSupervisors();
                this.visibleDeleteSupervisor = false;
                this.$toast.add({ severity: 'success', summary: 'Dato eliminado', detail: 'Supervisor se eliminó correctamente.', life: 3000 });
            } catch (err) {
                console.error('Error general al eliminar supervisor:', err.message);
            }
        },
        editarColaborador(colaborador) {
            this.selectedColaborador = colaborador;
            this.nombreC = colaborador.nombre;
            this.cargoC = colaborador.cargo;
            this.telefonoC = colaborador.telefono;
            this.correoC = colaborador.correo;
            this.visibleUpdateColaborador = true;
        },
        async updateColaborador() {
            try {
                const { error } = await supabase
                    .from('colaborador')
                    .update({
                        nombre: this.nombreC,
                        cargo: this.cargoC,
                        telefono: this.telefonoC,
                        correo: this.correoC,
                    })
                    .eq('id_colaborador', this.selectedColaborador.id_colaborador);

                if (error) {
                    console.error('Error al actualizar colaborador:', error.message);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar colaborador.', life: 3000 });
                    return;

                }

                // Recargar datos después de actualizar
                await this.fetchColaboradores();
                this.visibleUpdateColaborador = false;
                this.$toast.add({ severity: 'success', summary: 'Dato actualizado', detail: 'Colaborador se actualizó correctamente.', life: 3000 });
            } catch (err) {
                console.error('Error general al actualizar colaborador:', err.message);
            }
        },
        eliminarColaborador(colaborador) {
            this.selectedColaborador = colaborador;
            this.visibleDeleteColaborador = true;
        },
        async deleteColaborador() {
            try {
                const { error } = await supabase
                    .from('colaborador')
                    .delete()
                    .eq('id_colaborador', this.selectedColaborador.id_colaborador);

                if (error) {
                    console.error('Error al eliminar colaborador:', error.message);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar colaborador.', life: 3000 });
                    return;
                    return;
                }

                // Recargar datos después de eliminar
                await this.fetchColaboradores();
                this.visibleDeleteColaborador = false;
                this.$toast.add({ severity: 'success', summary: 'Dato eliminado', detail: 'Colaborador se eliminó correctamente.', life: 3000 });
            } catch (err) {
                console.error('Error general al eliminar colaborador:', err.message);
            }
        }
    }
};
</script>


<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <Toast />
        <h1 class="text-3xl font-bold mb-6 text-center">Tablas de Supervisores y Colaboradores</h1>

        <!-- Tabla de Supervisores -->
        <section class="mb-10">
            <h2 class="text-2xl font-semibold mb-4">Supervisores</h2>
            <p v-if="errorSupervisors" class="text-red-600 mb-4">Error: {{ errorSupervisors }}</p>
            <p v-if="!supervisors.length && !errorSupervisors" class="text-gray-500 mb-4">No hay supervisores
                disponibles.</p>
            <div v-if="supervisors.length" class="overflow-x-auto">
                <DataTable :value="supervisors" sortMode="single" class="p-datatable-gridlines" :rows="10"
                    :paginator="true" responsiveLayout="scroll">
                    <Column field="id_supervisor" header="ID Supervisor"></Column>
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="cargo" header="Cargo"></Column>
                    <Column field="telefono" header="Teléfono"></Column>
                    <Column field="correo" header="Correo"></Column>
                    <Column>
                        <template #header>Acciones</template>
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" type="button" class="p-button-success p-mr-2"
                                @click="editarSupervisor(slotProps.data)" />
                            <Dialog v-model:visible="visibleUpdateSupervisor" modal header="Actualizar Supervisor"
                                :style="{ width: '40vw' }">
                                <div class="flex flex-col gap-4">
                                    <InputText label="Nombre" v-model="nombre" />
                                    <InputText label="Cargo" v-model="cargo" />
                                    <InputText label="Teléfono" v-model="telefono" />
                                    <InputText label="Correo" v-model="correo" />
                                </div>
                                <template #footer>
                                    <Button label="Actualizar" @click="updateSupervisor" />
                                </template>
                            </Dialog>
                            <Button icon="pi pi-trash" type="button" class="p-button-danger"
                                @click="eliminarSupervisor(slotProps.data)" />
                            <Dialog v-model:visible="visibleDeleteSupervisor" modal header="¿Eliminar Supervisor?"
                                :style="{ width: '30vw' }">
                                <p>Esta acción es irreversible.</p>
                                <template #footer>
                                    <Button label="Eliminar" @click="deleteSupervisor" class="p-button-danger" />
                                </template>
                            </Dialog>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </section>

        <!-- Tabla de Colaboradores -->
        <section class="mb-10">
            <h2 class="text-2xl font-semibold mb-4">Colaboradores</h2>
            <p v-if="errorColaboradores" class="text-red-600 mb-4">Error: {{ errorColaboradores }}</p>
            <p v-if="!colaboradores.length && !errorColaboradores" class="text-gray-500 mb-4">No hay colaboradores
                disponibles.
            </p>
            <div v-if="colaboradores.length" class="overflow-x-auto">
                <DataTable :value="colaboradores" sortMode="single" class="p-datatable-gridlines" :rows="10"
                    :paginator="true" responsiveLayout="scroll">
                    <Column field="id_colaborador" header="ID"></Column>
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="cargo" header="Cargo"></Column>
                    <Column field="telefono" header="Teléfono"></Column>
                    <Column field="correo" header="Correo"></Column>
                    <Column>
                        <template #header>Acciones</template>
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" type="button" class="p-button-success p-mr-2"
                                @click="editarColaborador(slotProps.data)" />
                            <Dialog v-model:visible="visibleUpdateColaborador" modal header="Actualizar Colaborador"
                                :style="{ width: '40vw' }">
                                <div class="flex flex-col gap-4">
                                    <InputText label="Nombre" v-model="nombreC" />
                                    <InputText label="Cargo" v-model="cargoC" />
                                    <InputText label="Teléfono" v-model="telefonoC" />
                                    <InputText label="Correo" v-model="correoC" />
                                </div>
                                <template #footer>
                                    <Button label="Actualizar" @click="updateColaborador" />
                                </template>
                            </Dialog>
                            <Button icon="pi pi-trash" type="button" class="p-button-danger"
                                @click="eliminarColaborador(slotProps.data)" />
                            <Dialog v-model:visible="visibleDeleteColaborador" modal header="¿Eliminar Colaborador?"
                                :style="{ width: '30vw' }">
                                <p>Esta acción es irreversible.</p>
                                <template #footer>
                                    <Button label="Eliminar" @click="deleteColaborador" class="p-button-danger" />
                                </template>
                            </Dialog>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </section>
    </div>
</template>
