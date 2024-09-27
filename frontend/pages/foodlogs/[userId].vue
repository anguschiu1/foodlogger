<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/toast/use-toast';

const { toast } = useToast();
const route = useRoute();
const userId = route.params.userId;
console.log('User ID:', userId);
const { data: foodlogs } = await useFetch('/api/foodlogs/' + userId);
const deleteFoodlog = async (foodlogId) => {
  try {
    await $fetch('/api/foodlogs/' + userId + '/' + foodlogId, {
      method: 'DELETE',
      onResponse() {
        console.log('API DELETE request successful.');
      },
    });
    toast({
      description: 'Food log is deleted successfully.',
    });
    const index = foodlogs.value.findIndex(
      (foodlog) => foodlog.id === foodlogId
    );
    if (index !== -1) {
      foodlogs.value.splice(index, 1);
    }
  } catch (error) {
    console.error('API DELETE request failed:', error);
    toast({
      title: 'Error in deleting food log',
      variant: 'destructive',
      description: h(
        'pre',
        { class: 'mt-2 w-[340px] rounded-md bg-red-500 p-4' },
        h('code', { class: 'text-white' }, error.message)
      ),
    });
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div class="w-full flex justify-center">
        <Card class="w-full max-w-2xl">
          <CardHeader class="flex flex-row items-center">
            <div class="grid gap-2">
              <CardTitle>Food Logs</CardTitle>
              <CardDescription>
                All the meals and food details
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent meals.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[130px]"> Date </TableHead>
                  <TableHead>Id</TableHead>
                  <TableHead>Meals</TableHead>
                  <TableHead> Food Consumed </TableHead>
                  <TableHead> Actions </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="foodlog in foodlogs" :key="foodlog.id">
                  <TableCell class="font-medium">
                    {{ foodlog.date }}
                  </TableCell>
                  <TableCell>{{ foodlog.id }}</TableCell>
                  <TableCell>
                    {{
                      foodlog.Meals.map((meal) => meal.name).join(', ') ||
                      'No meals found'
                    }}
                  </TableCell>
                  <TableCell>
                    <img
                      v-for="meal in foodlog.Meals"
                      :key="meal.id"
                      :src="meal.image"
                      alt="food image"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      class="bg-red-500 hover:bg-red-700 text-white ml-2"
                      @click="deleteFoodlog(foodlog.id)"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button @click="navigateTo(`/foodlog/${userId}`)"
              >Create Food Log</Button
            >
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
