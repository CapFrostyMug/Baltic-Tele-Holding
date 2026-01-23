<script setup>
import {Link} from '@inertiajs/vue3';
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-100">
        <header class="bg-white shadow-sm">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div class="flex items-center gap-2">
          <span
              class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
            BTH
          </span>
                    <span class="font-semibold text-sm sm:text-base">
            Baltic Tele Holding
          </span>
                </div>

                <nav class="flex items-center gap-4 text-sm text-gray-600">
                    <Link href="/" class="hover:text-indigo-600">
                        Каталог
                    </Link>
                    <Link href="/admin/products" class="hover:text-indigo-600">
                        Админка
                    </Link>
                </nav>
            </div>
        </header>

        <main class="flex-1">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <slot/>
            </div>
        </main>

        <footer class="border-t border-gray-200 bg-white">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-gray-500 flex justify-between">
                <!--  -->
            </div>
        </footer>
    </div>
</template>
