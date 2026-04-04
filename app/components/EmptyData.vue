<script setup lang="ts">
import {Database} from 'lucide-vue-next';
import {defineProps} from 'vue';
import { Box } from '~/base/ui/box'

defineProps({
    title: {
        type: String,
        default: 'Empty Data'
    },
    message: {
        type: String,
        default: 'Data that you requested does not exist.'
    },
    isWithBox :{
        required: false,
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <component :is="isWithBox ? Box : 'div'">
        <div class="flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <Database class="mb-4 text-gray-700 text-2xl"/>
            <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
            <p>{{ message }}</p>
        </div>
    </component>
</template>
