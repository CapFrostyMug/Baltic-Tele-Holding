<script setup>
import {onMounted, ref} from 'vue';
import {Link, router} from '@inertiajs/vue3';
import {useAuth} from '@/composables/useAuth';

const {isAuthenticated, logout} = useAuth();
const ready = ref(false);

onMounted(() => {
    if (!isAuthenticated.value) {
        router.visit('/login');
        return;
    }

    ready.value = true;
});

function handleLogout() {
    logout();
    router.visit('/');
}
</script>

<template>
    <div v-if="ready" class="min-h-screen bg-gray-100">
        <header class="bg-white shadow mb-4">
            <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 class="text-xl font-semibold">
                    Админка
                </h1>
                <nav class="space-x-4 text-sm flex items-center">
                    <Link href="/admin/products" class="hover:underline">
                        Управление товарами
                    </Link>

                    <button
                        type="button"
                        class="text-red-600 hover:underline"
                        @click="handleLogout"
                    >
                        Выйти
                    </button>
                </nav>
            </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-4">
            <slot/>
        </main>
    </div>
</template>

<style scoped>

</style>
