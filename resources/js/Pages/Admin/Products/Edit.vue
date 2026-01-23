<script setup>
import {ref, onMounted} from 'vue';
import {router, usePage} from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import {useAuth} from '@/composables/useAuth';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const {token, logout} = useAuth();

const name = ref('');
const description = ref('');
const price = ref('');
const categoryId = ref('');

const categories = ref([]);

const loading = ref(false);
const error = ref(null);
const validationErrors = ref({});
const notFound = ref(false);

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

async function loadProduct() {
    loading.value = true;
    error.value = null;
    notFound.value = false;

    try {
        const response = await fetch(`/api/products/${props.id}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.status === 404) {
            notFound.value = true;
            return;
        }

        if (!response.ok) {
            throw new Error('Не удалось загрузить товар');
        }

        const data = await response.json();
        const product = data.data;

        name.value = product.name || '';
        description.value = product.description || '';
        price.value = product.price != null ? String(product.price) : '';
        categoryId.value = product.category ? product.category.id : '';
    } catch (e) {
        console.error(e);
        error.value = e.message || 'Ошибка при загрузке товара';
    } finally {
        loading.value = false;
    }
}

async function handleSubmit() {
    loading.value = true;
    error.value = null;
    validationErrors.value = {};

    try {
        const response = await fetch(`/api/products/${props.id}`, {
            method: 'PUT',
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
            throw new Error('Не удалось обновить товар.');
        }

        router.visit('/admin/products');
    } catch (e) {
        console.error(e);
        if (!validationErrors.value || Object.keys(validationErrors.value).length === 0) {
            error.value = e.message || 'Ошибка при обновлении товара.';
        }
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    await loadCategories();
    await loadProduct();
});
</script>

<template>
    <AdminLayout>
        <div class="max-w-lg bg-white border rounded p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">
                Редактирование товара #{{ props.id }}
            </h2>

            <div v-if="notFound" class="text-sm text-red-600">
                Товар не найден.
            </div>

            <div v-if="error && !notFound" class="mb-3 text-sm text-red-600">
                {{ error }}
            </div>

            <div v-if="loading && !notFound" class="mb-3 text-sm text-gray-600">
                Загрузка данных товара...
            </div>

            <form
                v-if="!loading && !notFound"
                @submit.prevent="handleSubmit"
                class="space-y-3"
            >
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
                    <span v-if="!loading">Сохранить изменения</span>
                    <span v-else>Сохранение...</span>
                </button>
            </form>
        </div>
    </AdminLayout>
</template>

<style scoped>

</style>
