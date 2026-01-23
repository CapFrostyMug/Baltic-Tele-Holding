<script setup>
import {ref, onMounted} from 'vue';
import {Link} from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const product = ref(null);
const loading = ref(false);
const error = ref(null);
const notFound = ref(false);

async function loadProduct() {
    loading.value = true;
    error.value = null;
    notFound.value = false;

    try {
        const response = await fetch(`/api/products/${props.id}`);

        if (response.status === 404) {
            notFound.value = true;
            return;
        }

        if (!response.ok) {
            throw new Error('Не удалось загрузить товар');
        }

        const data = await response.json();
        product.value = data.data || null;
    } catch (e) {
        console.error(e);
        error.value = e.message || 'Ошибка при загрузке товара';
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadProduct();
});
</script>

<template>
    <PublicLayout>
        <div class="space-y-4">
            <Link href="/" class="text-sm text-blue-600 hover:underline">
                Назад к каталогу
            </Link>

            <div v-if="loading" class="text-sm text-gray-600">
                Загрузка товара...
            </div>

            <div v-if="notFound" class="text-sm text-red-600">
                Товар не найден.
            </div>

            <div v-if="error && !notFound" class="text-sm text-red-600">
                {{ error }}
            </div>

            <div v-if="product && !loading && !notFound" class="bg-white border rounded p-4 shadow-sm">
                <h2 class="text-xl font-semibold mb-2">
                    {{ product.name }}
                </h2>

                <p class="text-sm text-gray-500 mb-2" v-if="product.category">
                    Категория: {{ product.category.name }}
                </p>

                <p class="text-lg font-semibold mb-3">
                    {{ product.price }} ₽
                </p>

                <p class="text-sm text-gray-800 whitespace-pre-line">
                    {{ product.description || 'Описание отсутствует.' }}
                </p>
            </div>
        </div>
    </PublicLayout>
</template>

<style scoped>

</style>
