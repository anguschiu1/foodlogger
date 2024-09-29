<script setup lang="ts">
import { h } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
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
const route = useRoute();
const userId = route.params.userId;
console.log('User ID:', userId);

const { toast } = useToast();

const { data: user } = await useFetch('/api/users/' + userId);
console.log('User:', user.value);
const formSchema = toTypedSchema(
  z
    .object({
      firstName: z.string().min(2).max(50).default(user.firstName),
      lastName: z.string().min(2).max(50).default(user.lastName),
      city: z.string().min(2).max(50).default(user.city),
      email: z.string().email().default(user.email),
      password: z.string().min(8).max(50),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Passwords must match.',
      path: ['confirm'],
    })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    firstName: user.value?.firstName || '',
    lastName: user.value?.lastName || '',
    city: user.value?.city || '',
    email: user.value?.email || '',
    password: '',
    confirm: '',
  },
});
const formValues = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  city: '',
});
const onSubmit = handleSubmit(async (values) => {
  Object.assign(formValues, values);
  try {
    const data = await $fetch('/api/users/' + userId, {
      method: 'PATCH',
      body: JSON.stringify(values),
      onResponse() {
        console.log('API POST request successful.');
      },
    });
    console.log(data);
    toast({
      title: 'User details updated. Returning to login page...',
    });
    setTimeout(() => {
      navigateTo('/');
    }, 2000); // Wait for 2 seconds before redirecting
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
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl"> User Profile </CardTitle>
        <CardDescription>
          Enter your information to update your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="firstName">
                  <FormItem v-auto-animate>
                    <Label for="first-name">First name</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-2">
                <FormField v-slot="{ componentField }" name="lastName">
                  <FormItem v-auto-animate>
                    <Label for="last-name">Last name</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Doe"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="city">
                <FormItem v-auto-animate>
                  <Label for="city">City</Label>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Cambridge"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="email">
                <FormItem v-auto-animate>
                  <Label for="email">Email</Label>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="password">
                <FormItem v-auto-animate>
                  <Label for="password">Password</Label>
                  <FormControl>
                    <Input type="password" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="confirm">
                <FormItem v-auto-animate>
                  <Label for="confirm">Confirm password</Label>
                  <FormControl>
                    <Input type="password" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <Button type="submit" class="w-full"> Create an account </Button>
            <!-- <Button variant="outline" class="w-full"> Sign up with GitHub </Button> -->
          </div>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <a href="/" class="underline"> Sign in </a>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
