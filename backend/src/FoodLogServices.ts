export const getFoodLogs = async (user_id: number) => {
  const data = [
    {
      date: '12-31-2023',
      id: 1,
      meals: [
        {
          finished_at: '12-31-2023 10:00:00',
          food_consumed: [
            {
              name: 'White bread',
              weight: 100,
            },
            {
              name: 'Butter',
              weight: 8,
            },
          ],
          id: 0,
          image: '123.jpg',
          name: 'Breakfast',
        },
        {
          finished_at: '12-31-2023 13:30:00',
          food_consumed: [
            {
              name: 'Boiled potatoes',
              weight: 50,
            },
            {
              name: 'butter',
              weight: 15,
            },
          ],
          id: 0,
          image: '456.jpg',
          name: 'Lunch',
        },
      ],
      owner: {
        id: user_id,
      },
    },
  ];
  return data;
};
