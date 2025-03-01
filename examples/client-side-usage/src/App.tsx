import { useGetUsersQuery } from './hooks/useGetUsersQuery'
import { useUpdateUser } from './hooks/useUpdateUser';

function App() {
  const { data, error, isLoading } = useGetUsersQuery();
  const { updateUser, isMutating } = useUpdateUser();
  
  const onSubmit = () => {
    /// As we are using a placehoolder API to test the mutation
    /// We won't use form in this example to get the parameters
    /// for the request
    updateUser({ id: 1, name: "Dahyun" })
      .then((user) => console.log('User updated: ', user))
      .catch((error) => console.error(error));
  }

  if (isMutating) return <p>Updating ...</p>;

  if (isLoading) return <p>Loading ...</p>;

  if (data) {
    return (
      <div>
        <button onClick={onSubmit}>Update user</button>

        <p>Users: </p>
        <ul>
          {
            data.map((user) => {
              return (
                <li key={user.id}>
                  <p>{user.id} - {user.email}</p>
                </li>
              );
            })
          }
        </ul>
      </div>
    )
  }

  console.log(error);

  return <p>An error occured</p>;
}

export default App
