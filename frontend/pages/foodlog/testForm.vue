<script setup lang="ts">
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const schema = z.object({
  username: z.string(),
  food: z.array(z.string()).min(1),
});
const form = useForm({
  validationSchema: toTypedSchema(schema),
});

form.setFieldValue('username', 'bar');
form.setFieldValue('food', ['pizza', 'burger']);
</script>

<template>
  <AutoForm :form="form" :schema="schema" />
</template>
