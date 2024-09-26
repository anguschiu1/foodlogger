<script setup lang="ts">
import { h } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/toast/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
const { toast } = useToast();

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const callcount = ref(0);
const didItWork = ref(false);
const formValues = reactive({ email: '', password: '' });

// const { error, data, execute } = await useFetch('/api/users/1', {
//   method: 'GET',
//   immediate: false,
//   watch: false,
//   onResponse() {
//     callcount.value++;
//   },
//   onResponseError() {
//     console.error('API request failed:', error);
//     didItWork.value = false;
//     toast({
//       title: 'Uh oh! Something went wrong.',
//       variant: 'destructive',
//       description: h(
//         'pre',
//         { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
//         h('code', { class: 'text-white' }, error.value?.message)
//       ),
//     });
//   },
// });

// const executeUseFetch = async () => {
//   console.log('Fetching data from API...');
//   await execute();
// };

// const body = computed(() => ({
//   email: formValues.email,
//   password: formValues.password,
// }));

const onSubmit = handleSubmit(async (values) => {
  formValues.email = values.email;
  formValues.password = values.password;
  // executeUseFetch();
  // if (!error.value) {
  //   didItWork.value = true;
  //   toast({
  //     title: 'Returned userId is',
  //     description: h(
  //       'pre',
  //       { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
  //       h('code', { class: 'text-white' }, data.value?.email)
  //     ),
  //   });
  // }
  try {
    const data = await $fetch('/api/users/1', {
      method: 'GET',
      onResponse() {
        callcount.value++;
        console.log('API request successful:');
      },
    });
    console.log('API request successful:', data);
    toast({
      title: 'Returned userId is',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h('code', { class: 'text-white' }, data.email)
      ),
    });
  } catch (error) {
    console.error('API request failed:', error);
    toast({
      title: 'Uh oh! Something went wrong.',
      variant: 'destructive',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
        h('code', { class: 'text-white' }, error.message)
      ),
    });
  }
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <div class="grid gap-4">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <div class="grid gap-2">
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="joe.doe@example.com"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <div class="grid gap-2">
                  <div class="flex items-center">
                    <Label for="password">Password</Label>
                    <a
                      href="foodlogs"
                      class="ml-auto inline-block text-sm underline"
                    >
                      Try demo access
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full"> Login </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="signup" class="underline"> Sign up</a>
          <div>{{ callcount }}</div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
