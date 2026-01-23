<script setup>

</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <header class="bg-white shadow mb-4">
            <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 class="text-xl font-semibold">
                    Каталог товаров
                </h1>
                <nav class="space-x-4 text-sm">
                    <a href="/" class="hover:underline">Главная</a>
                    <a href="/admin/products" class="hover:underline">Админка</a>
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
