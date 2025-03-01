import { useApiQuery } from "swr-hooks";

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

export const useGetUsersQuery = () => {
  const queryFn = async () => {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json() as Promise<User[]>);
  }

  return useApiQuery('users', queryFn);
}