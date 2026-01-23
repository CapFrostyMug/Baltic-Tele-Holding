<script setup>
import {ref, computed, onMounted} from 'vue';
import {Link, router} from '@inertiajs/vue3';
import AdminLayout from '@/Layouts/AdminLayout.vue';
import {useAuth} from '@/composables/useAuth';

const {token, logout} = useAuth();

const products = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);

const loading = ref(false);
const error = ref(null);
const deletingId = ref(null);

const pages = computed(() => {
    const result = [];
    for (let page = 1; page <= lastPage.value; page++) {
        result.push(page);
    }
    return result;
});

function authHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token.value ? {'Authorization': `Bearer ${token.value}`} : {}),
    };
}

async function loadProducts(page = 1) {
    loading.value = true;
    error.value = null;

    try {
        const params = new URLSearchParams();
        params.set('page', String(page));

        const response = await fetch(`/api/products?${params.toString()}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.status === 401) {
            logout();
            router.visit('/login');
            return;
        }

        if (!response.ok) {
            throw new Error('Не удалось загрузить список товаров');
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

async function handleDelete(product) {
    if (!confirm(`Удалить товар "${product.name}"?`)) {
        return;
    }

    deletingId.value = product.id;
    error.value = null;

    try {
        const response = await fetch(`/api/products/${product.id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });

        if (response.status === 401) {
            logout();
            router.visit('/login');
            return;
        }

        if (response.status !== 204) {
            throw new Error('Не удалось удалить товар');
        }

        products.value = products.value.filter((p) => p.id !== product.id);
        total.value = Math.max(0, total.value - 1);
    } catch (e) {
        console.error(e);
        error.value = e.message || 'Ошибка при удалении товара';
    } finally {
        deletingId.value = null;
    }
}

function goToPage(page) {
    if (page < 1 || page > lastPage.value || page === currentPage.value) {
        return;
    }

    loadProducts(page);
}

onMounted(() => {
    loadProducts(1);
});
</script>

<template>
    <AdminLayout>
        <div class="flex justify-between items-center mb-4">
            <div>
                <h2 class="text-lg font-semibold">Управление товарами</h2>
                <p class="text-sm text-gray-600" v-if="total">
                    Всего товаров: {{ total }}
                </p>
            </div>

            <Link
                href="/admin/products/create"
                class="border rounded px-3 py-1 text-sm bg-gray-800 text-white hover:bg-gray-700"
            >
                + Добавить товар
            </Link>
        </div>

        <div v-if="error" class="mb-3 text-sm text-red-600">
            {{ error }}
        </div>

        <div v-if="loading" class="mb-3 text-sm text-gray-600">
            Загрузка товаров...
        </div>

        <div v-if="!loading && !products.length" class="text-sm text-gray-600">
            Товаров пока нет.
        </div>

        <div v-if="products.length" class="overflow-x-auto">
            <table class="min-w-full text-sm border border-slate-200 rounded-md overflow-hidden bg-white">
                <thead class="bg-gray-50">
                <tr>
                    <th class="border px-2 py-1 text-left">ID</th>
                    <th class="border px-2 py-1 text-left">Название</th>
                    <th class="border px-2 py-1 text-left">Категория</th>
                    <th class="border px-2 py-1 text-left">Цена</th>
                    <th class="border px-2 py-1 text-left">Действия</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="product in products"
                    :key="product.id"
                    class="hover:bg-slate-50 transition-colors"
                >
                    <td class="border px-2 py-1">
                        {{ product.id }}
                    </td>
                    <td class="border px-2 py-1">
                        {{ product.name }}
                    </td>
                    <td class="border px-2 py-1">
                        {{ product.category ? product.category.name : '—' }}
                    </td>
                    <td class="border px-2 py-1">
                        {{ product.price }}
                    </td>
                    <td class="border px-2 py-1 space-x-2">
                        <Link
                            :href="`/admin/products/${product.id}/edit`"
                            class="text-blue-600 hover:underline"
                        >
                            Редактировать
                        </Link>
                        <button
                            type="button"
                            class="text-red-600 hover:underline"
                            :disabled="deletingId === product.id"
                            @click="handleDelete(product)"
                        >
                            <span v-if="deletingId === product.id">Удаление...</span>
                            <span v-else>Удалить</span>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
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
    </AdminLayout>
</template>

<style scoped>

</style>
