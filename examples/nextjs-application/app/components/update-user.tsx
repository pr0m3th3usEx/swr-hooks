'use client';

import { useUpdateUser } from "../hooks/useUpdateUser";

export default function UpdateUser() {
  const { updateUser, isMutating } = useUpdateUser();

  const onSubmit = () => {
    /// As we are using a placehoolder API to test the mutation
    /// We won't use form in this example to get the parameters
    /// for the request
    updateUser({ id: 1, name: "Sana" })
      .then((user) => console.log('User updated: ', user))
      .catch((error) => console.error(error));
  }


  if (isMutating) return <p>Updating ...</p>;

  return (
    <button onClick={onSubmit}>Update user</button>
  )
}