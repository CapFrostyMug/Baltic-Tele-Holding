<script setup>
import {ref, onMounted} from 'vue';
import {router} from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import {useAuth} from '@/composables/useAuth';

const {token, logout} = useAuth();

const name = ref('');
const description = ref('');
const price = ref('');
const categoryId = ref('');

const categories = ref([]);

const loading = ref(false);
const error = ref(null);
const validationErrors = ref({});

function authHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token.value ? {'Authorization': `Bearer ${token.value}`} : {}),
    };
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories', {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Не удалось загрузить категории');
        }

        const data = await response.json();
        categories.value = data.data || [];
    } catch (e) {
        console.error(e);
    }
}

async function handleSubmit() {
    loading.value = true;
    error.value = null;
    validationErrors.value = {};

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                name: name.value,
                description: description.value || null,
                price: price.value ? Number(price.value) : null,
                category_id: categoryId.value ? Number(categoryId.value) : null,
            }),
        });

        if (response.status === 401) {
            logout();
            router.visit('/login');
            return;
        }

        if (response.status === 422) {
            const data = await response.json();
            validationErrors.value = data.errors || {};
            throw new Error('Проверьте правильность заполнения формы.');
        }

        if (!response.ok) {
            throw new Error('Не удалось сохранить товар.');
        }

        router.visit('/admin/products');
    } catch (e) {
        console.error(e);
        if (!validationErrors.value || Object.keys(validationErrors.value).length === 0) {
            error.value = e.message || 'Ошибка при сохранении товара.';
        }
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadCategories();
});
</script>

<template>
    <AdminLayout>
        <div class="max-w-lg bg-white border rounded p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">
                Создание товара
            </h2>

            <div v-if="error" class="mb-3 text-sm text-red-600">
                {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-3">
                <div>
                    <label class="block text-sm mb-1" for="name">Название</label>
                    <input
                        id="name"
                        v-model="name"
                        type="text"
                        class="border rounded w-full px-2 py-1 text-sm"
                    >
                    <p v-if="validationErrors.name" class="text-xs text-red-600 mt-1">
                        {{ validationErrors.name[0] }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm mb-1" for="category">Категория</label>
                    <select
                        id="category"
                        v-model="categoryId"
                        class="border rounded w-full px-2 py-1 text-sm"
                    >
                        <option value="">Выберите категорию</option>
                        <option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                    <p v-if="validationErrors.category_id" class="text-xs text-red-600 mt-1">
                        {{ validationErrors.category_id[0] }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm mb-1" for="price">Цена</label>
                    <input
                        id="price"
                        v-model="price"
                        type="number"
                        step="0.01"
                        class="border rounded w-full px-2 py-1 text-sm"
                    >
                    <p v-if="validationErrors.price" class="text-xs text-red-600 mt-1">
                        {{ validationErrors.price[0] }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm mb-1" for="description">Описание</label>
                    <textarea
                        id="description"
                        v-model="description"
                        rows="4"
                        class="border rounded w-full px-2 py-1 text-sm"
                    ></textarea>
                    <p v-if="validationErrors.description" class="text-xs text-red-600 mt-1">
                        {{ validationErrors.description[0] }}
                    </p>
                </div>

                <button
                    type="submit"
                    class="border rounded px-3 py-1 text-sm bg-gray-800 text-white disabled:opacity-60"
                    :disabled="loading"
                >
                    <span v-if="!loading">Сохранить</span>
                    <span v-else>Сохранение...</span>
                </button>
            </form>
        </div>
    </AdminLayout>
</template>

<style scoped>

</style>
