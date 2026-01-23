<script setup>
import {ref, computed, onMounted} from 'vue';
import {Link} from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';

const products = ref([]);
const categories = ref([]);

const selectedCategoryId = ref(null);

const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

const loading = ref(false);
const error = ref(null);

const pages = computed(() => {
    const result = [];
    for (let page = 1; page <= lastPage.value; page++) {
        result.push(page);
    }
    return result;
});

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');

        if (!response.ok) {
            throw new Error('Не удалось загрузить категории');
        }

        const data = await response.json();
        categories.value = data.data || [];
    } catch (e) {
        console.error(e);
    }
}

async function loadProducts(page = 1) {
    loading.value = true;
    error.value = null;

    try {
        const params = new URLSearchParams();
        params.set('page', String(page));

        if (selectedCategoryId.value) {
            params.set('category_id', String(selectedCategoryId.value));
        }

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
            throw new Error('Не удалось загрузить товары');
        }

        const data = await response.json();

        products.value = data.data || [];

        currentPage.value = data.meta?.current_page ?? 1;
        lastPage.value = data.meta?.last_page ?? 1;
        total.value = data.meta?.total ?? 0;
    } catch (e) {
        console.error(e);
        error.value = e.message || 'Ошибка при загрузке товаров';
    } finally {
        loading.value = false;
    }
}

function handleCategoryChange(event) {
    const value = event.target.value || null;
    selectedCategoryId.value = value ? Number(value) : null;
    currentPage.value = 1;
    loadProducts(1);
}

function goToPage(page) {
    if (page < 1 || page > lastPage.value || page === currentPage.value) {
        return;
    }
    loadProducts(page);
}

onMounted(async () => {
    await loadCategories();
    await loadProducts(1);
});
</script>

<template>
    <PublicLayout>
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between gap-2">
                <h2 class="text-lg font-semibold">
                    Каталог товаров
                </h2>
                <p class="text-sm text-gray-600" v-if="total">
                    Найдено товаров: {{ total }}
                </p>
            </div>

            <div class="flex items-center gap-2">
                <label class="text-sm">
                    Категория:
                </label>
                <select
                    class="border rounded px-2 py-1 text-sm"
                    :value="selectedCategoryId || ''"
                    @change="handleCategoryChange"
                >
                    <option value="">Все категории</option>
                    <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <div v-if="error" class="text-sm text-red-600">
                {{ error }}
            </div>

            <div v-if="loading" class="text-sm text-gray-600">
                Загрузка товаров...
            </div>

            <div
                v-if="!loading && !error && products.length"
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <article
                    v-for="product in products"
                    :key="product.id"
                    class="border rounded p-3 bg-white shadow-sm"
                >
                    <h3 class="font-semibold mb-1">
                        <Link :href="`/product/${product.id}`" class="hover:underline">
                            {{ product.name }}
                        </Link>
                    </h3>

                    <p class="text-xs text-gray-500 mb-1" v-if="product.category">
                        Категория: {{ product.category.name }}
                    </p>

                    <p class="text-sm font-semibold mb-1">
                        {{ product.price }} ₽
                    </p>

                    <p class="text-sm text-gray-700 line-clamp-3">
                        {{ product.description }}
                    </p>
                </article>
            </div>

            <div v-if="!loading && !error && !products.length" class="text-sm text-gray-600">
                Товаров не найдено.
            </div>

            <div
                v-if="lastPage > 1"
                class="flex items-center gap-2 mt-4 flex-wrap"
            >
                <button
                    type="button"
                    class="border rounded px-2 py-1 text-sm"
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                >
                    Назад
                </button>

                <button
                    v-for="page in pages"
                    :key="page"
                    type="button"
                    class="border rounded px-2 py-1 text-sm"
                    :class="page === currentPage ? 'bg-gray-800 text-white' : 'bg-white'"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>

                <button
                    type="button"
                    class="border rounded px-2 py-1 text-sm"
                    :disabled="currentPage === lastPage"
                    @click="goToPage(currentPage + 1)"
                >
                    Вперёд
                </button>
            </div>
        </div>
    </PublicLayout>
</template>

<style scoped>

</style>
