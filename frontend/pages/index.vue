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
import { useRouter } from 'vue-router';
const router = useRouter();

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
const formValues = reactive({ email: '', password: '' });
type data = { email: string; id: string };

const onSubmit = handleSubmit(async (values) => {
  formValues.email = values.email;
  formValues.password = values.password;
  try {
    const data: data = await $fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(values),
      onResponse() {
        console.log('User Login POST request successful:');
      },
    });
    console.log('User Login POST request response:', data);
    toast({
      title: 'Success! Logging in...',
    });
    console.log('userId:', data.data.id);
    setTimeout(() => {
      navigateTo('/foodlogs/' + data.data.id);
    }, 2000); // Wait for 2 seconds before redirecting
  } catch (error: unknown) {
    console.error('API request response:', error);
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
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <FormField v-slot="{ componentField }" name="email">
                <FormItem v-auto-animate>
                  <Label>Email</Label>
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
                  <div class="flex items-center">
                    <Label for="password">Password</Label>
                  </div>
                  <FormControl>
                    <Input type="password" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <Button type="submit" class="w-full"> Login </Button>
          </div>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="signup" class="underline"> Sign up</a>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
