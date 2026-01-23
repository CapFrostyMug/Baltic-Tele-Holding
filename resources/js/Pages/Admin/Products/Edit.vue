<script setup>
import {computed} from 'vue';
import {usePage} from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';

const page = usePage();
const id = computed(() => page.props.id);
</script>

<template>
    <AdminLayout>
        <h2 class="text-lg font-semibold mb-4">
            Редактирование товара #{{ id }}
        </h2>
        <p class="text-sm text-gray-700">
            <span>Форма редактирования товара</span>
        </p>
    </AdminLayout>
</template>

<style scoped>

</style>
