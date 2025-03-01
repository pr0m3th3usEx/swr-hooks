import { SWRConfig } from "swr";
import { getUsers } from "./hooks/useGetUsersQuery";
import Users from "./components/users";
import UpdateUser from "./components/update-user";

export default function Page() {
  return (
    <SWRConfig
      // Note that there is no `await` here,
      // so it only blocks rendering of components that
      // actually rely on this data.
      value={{
        fallback: {
          'users': getUsers(),
          // You can also use unstable_serialize() for array style key
        },
      }}
    >
      <div>
        <UpdateUser />

        <p>Users</p>
        <Users />
      </div>
    </SWRConfig>
  );
}
