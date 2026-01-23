<script setup>
import {computed} from 'vue';
import {usePage} from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';

const page = usePage();
const id = computed(() => page.props.id);
</script>

<template>
    <PublicLayout>
        <h2 class="text-lg font-semibold mb-4">
            Карточка товара #{{ id }}
        </h2>
        <p class="text-sm text-gray-700">
            <span>Информация о товаре</span>
        </p>
    </PublicLayout>
</template>

<style scoped>

</style>
