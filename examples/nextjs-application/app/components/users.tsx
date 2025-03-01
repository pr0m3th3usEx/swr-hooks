'use client';

import { useGetUsersQuery } from "../hooks/useGetUsersQuery";

export default function Users() {
  const { data, error } = useGetUsersQuery();

  // As we always provide the Users in the parent
  // component via `fallback`, there's no need to
  // handle the loading state here.
  // To make TypeScript happy, let's add a guard.
  if (!data) throw new Error("Data must be available.");

  if (error) return <p>An error occured</p>;
 
  return (
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
  )
}