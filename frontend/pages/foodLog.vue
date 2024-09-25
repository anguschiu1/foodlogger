<script setup lang="ts">
import * as z from 'zod';
import { h } from 'vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast/use-toast';
import { AutoForm } from '@/components/ui/auto-form';

const { toast } = useToast();

const schema = z.object({
  date: z.coerce.date(),
  mealName: z.enum(['Breakfast', 'Lunch', 'Dinner']),
  foodConsumed: z
    .array(
      z.object({
        name: z.string(),
        weight: z.coerce.number(),
      })
    )
    .describe('Food consumed today'),
});

function onSubmit(values: Record<string, unknown>) {
  toast({
    title: 'You submitted the following values:',
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))
    ),
  });
}
</script>

<template>
  <AutoForm class="w-2/3 space-y-6" :schema="schema" @submit="onSubmit">
    <Button type="submit"> Submit </Button>
  </AutoForm>
</template>
