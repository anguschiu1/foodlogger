<script setup lang="ts">
import * as z from 'zod';
import { h } from 'vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast/use-toast';
import { AutoForm, AutoFormField } from '@/components/ui/auto-form';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

const { toast } = useToast();
const route = useRoute();
const userId = route.params.userId;
console.log('User ID:', userId);

const schema = z.object({
  file: z.string().optional(),
  date: z.coerce.date(),
  meals: z
    .array(
      z.object({
        name: z.enum([
          'Breakfast',
          'Lunch',
          'Dinner',
          'Tea',
          'Snack',
          'Drink',
          'Supper',
          'Others',
        ]),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59),
        foodConsumed: z
          .array(
            z
              .object({
                name: z.string().max(100),
                weight: z.number().min(0).max(10000),
              })
              .describe('Food / ingredients')
          )
          .describe('Food consumed in this meal'),
      })
    )
    .describe('Define meals'),
});

const form = useForm({
  validationSchema: toTypedSchema(schema),
});

async function prefillFood() {
  const imageFile = form.values.file;
  if (!imageFile) return;
  console.log('Image file:', imageFile);

  const formData = new FormData();
  console.log('image file size is ' + imageFile.length + 'bytes');
  // formData.append('image', imageFile);

  // Convert base64 to Blob
  const byteString = atob(imageFile.split(',')[1]);
  const mimeString = imageFile.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  formData.append('image', blob, 'image.jpg');

  try {
    const data = await $fetch('/api/foodimages/1', {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
      onResponse() {
        console.log('API POST request successful.');
      },
    });
    console.log(data);
    const prefillData = {
      meals: [
        {
          foodConsumed: data.food.map((food) => ({
            name: food.name,
            weight: food.weight,
          })),
        },
      ],
    };
    form.setFieldValue('meals', prefillData.meals);
    toast({
      title: 'Image processed, food/ingredient identified',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h(
          'code',
          { class: 'text-white' },
          JSON.stringify(prefillData.meals, null, 2)
        )
      ),
    });

    // toast({
    //   title: 'Food log created successfully',
    //   description: h(
    //     'pre',
    //     { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
    //     h('code', { class: 'text-white' }, JSON.stringify(data, null, 2))
    //   ),
    // });
  } catch (error: unknown) {
    console.error('Image processing API failed:', error);
    toast({
      title: 'Uh oh! Something went wrong.',
      variant: 'destructive',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h(
          'code',
          { class: 'text-white' },
          error instanceof Error ? error.message : String(error)
        )
      ),
    });
  }

  // const prefillData = {
  //   // date: new Date(),
  //   meals: [
  //     {
  //       // name: 'Breakfast',
  //       // hour: 8,
  //       // minute: 0,
  //       foodConsumed: [
  //         { name: 'Cereal', weight: 0 },
  //         { name: 'Bread', weight: 0 },
  //       ],
  //     },
  //   ],
  // };
  // form.setFieldValue('meals', prefillData.meals);
  // toast({
  //   title: 'Image processed, food/ingredient identified',
  //   description: h(
  //     'pre',
  //     { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
  //     h(
  //       'code',
  //       { class: 'text-white' },
  //       JSON.stringify(prefillData.meals, null, 2)
  //     )
  //   ),
  // });
}

async function onSubmit(values: Record<string, unknown>) {
  const reqBody = { ...values };
  reqBody.meals = values.meals.map((meal) => ({
    name: meal.name,
    finishedAt: new Date(
      new Date(values.date).setHours(meal.hour, meal.minute)
    ).toISOString(),

    foodConsumed: meal.foodConsumed.map((food) => ({
      name: food.name,
      weight: food.weight,
    })),
  }));
  console.log('Form submitted:', reqBody);
  try {
    const data = await $fetch('/api/foodlogs/' + userId, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      onResponse() {
        console.log('API POST request successful.');
      },
    });
    console.log(data);
    toast({
      title: 'Food log created successfully',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h('code', { class: 'text-white' }, JSON.stringify(data, null, 2))
      ),
    });
    setTimeout(() => {
      navigateTo('/foodlogs/' + userId);
    }, 3000); // Wait for 3 seconds before redirecting
  } catch (error: unknown) {
    console.error('API request failed:', error);
    toast({
      title: 'Uh oh! Something went wrong.',
      variant: 'destructive',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h(
          'code',
          { class: 'text-white' },
          error instanceof Error ? error.message : String(error)
        )
      ),
    });
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div class="w-full flex justify-center">
        <Card class="w-full max-w-2xl">
          <CardHeader class="flex flex-row items-center">
            <div class="grid gap-2">
              <CardTitle>Add New Food Logs</CardTitle>
              <CardDescription> Add meals and food details </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AutoForm
              class="w-2/3 space-y-6"
              :schema="schema"
              :form="form"
              :field-config="{
                file: {
                  label: 'Image file',
                  component: 'file',
                },
              }"
              @submit="onSubmit"
            >
              <div class="flex gap-4">
                <Button type="submit"> Submit </Button>
                <Button
                  variant="secondary"
                  @click="navigateTo(`/foodlogs/${userId}`)"
                  >Cancel</Button
                >
              </div>
              <template #file="slotProps">
                <div class="flex items-end space-x-2">
                  <AutoFormField v-bind="slotProps" class="w-full" />
                  <Button type="button" @click="prefillFood"> Check </Button>
                </div>
              </template>
            </AutoForm>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
