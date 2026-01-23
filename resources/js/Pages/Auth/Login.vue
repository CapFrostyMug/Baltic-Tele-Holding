<script setup>
import {ref} from 'vue';
import {router} from '@inertiajs/vue3';
import PublicLayout from '@/Layouts/PublicLayout.vue';
import {useAuth} from '@/composables/useAuth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);

const {login, isAuthenticated} = useAuth();

async function handleSubmit() {
    loading.value = true;
    error.value = null;

    try {
        await login(email.value, password.value);
        router.visit('/admin/products');
    } catch (e) {
        error.value = e.message || 'Ошибка авторизации.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <PublicLayout>
        <div class="max-w-sm mx-auto bg-white border rounded p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">
                Вход в админку
            </h2>

            <div
                v-if="isAuthenticated"
                class="mb-3 text-sm text-green-600"
            >
                Вы уже авторизованы.
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-3">
                <div>
                    <label class="block text-sm mb-1" for="email">Email</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        class="border rounded w-full px-2 py-1 text-sm"
                        autocomplete="email"
                        required
                    >
                </div>

                <div>
                    <label class="block text-sm mb-1" for="password">Пароль</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        class="border rounded w-full px-2 py-1 text-sm"
                        autocomplete="current-password"
                        required
                    >
                </div>

                <div v-if="error" class="text-sm text-red-600">
                    {{ error }}
                </div>

                <button
                    type="submit"
                    class="border rounded px-3 py-1 text-sm bg-gray-800 text-white disabled:opacity-60"
                    :disabled="loading"
                >
                    <span v-if="!loading">Войти</span>
                    <span v-else>Вход...</span>
                </button>
            </form>
        </div>
    </PublicLayout>
</template>

<style scoped>

</style>
