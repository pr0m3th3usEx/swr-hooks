import { useApiMutation } from "../../../../dist";
import { User } from "./useGetUsersQuery"

type UpdateUserRequest = Partial<Pick<User, | 'name' | 'username' | 'website'>> & { id: number };

export const useUpdateUser = () => {
  const mutationFn = async ({ id, ...body }: UpdateUserRequest): Promise<User> => {
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json() as Promise<User>);

  };

  const { trigger, isMutating } = useApiMutation<User, UpdateUserRequest>((key) => key === 'users', mutationFn);

  return {
    updateUser: trigger,
    isMutating,
  }
}