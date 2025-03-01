# swr-hooks

A lightweight wrapper around SWR that simplifies data fetching and state management in React applications.

## Installation

```shell
# Npm
npm install swr swr-hooks
# Yarn
yarn add swr swr-hooks
# Pnpm
pnpm add swr swr-hooks
```

## Usage

This library provides three main hooks for different data fetching scenarios:

### `useApiQuery` - Automatic Data Fetching

Use this hook when you need to fetch data automatically when a component mounts.

```ts
import { useApiQuery } from 'swr-hooks';

function UserProfile({ userId }) {
  const { data, error, isLoading, isValidating, revalidate } = useApiQuery(
    `/api/users/${userId}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;
  
  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={revalidate}>Refresh</button>
    </div>
  );
}
```

### `useApiMutation` - Data Modifications

Use this hook when you need to create, update, or delete data.

```ts
import { useApiMutation } from 'swr-hooks';

function CreatePost() {
  const { trigger, isMutating } = useApiMutation(
    (key) => key?.startsWith('/api/posts'),
    async (newPost) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      return response.json();
    }
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPost = {
      title: formData.get('title'),
      content: formData.get('content'),
    };
    
    try {
      await trigger(newPost);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit" disabled={isMutating}>
        {isMutating ? 'Saving...' : 'Create Post'}
      </button>
    </form>
  );
}
```

### `useApiLazyQuery` - On-Demand Data Fetching

Use this hook when you want to fetch data only when a specific action occurs.

```ts
import { useApiLazyQuery } from 'swr-hooks';

function SearchResults() {
  const { data, error, isLoading, trigger, reset } = useApiLazyQuery(
    '/api/search',
    async (url, { arg }) => {
      const response = await fetch(`${url}?q=${arg.query}`);
      return response.json();
    },
    {}
  );
  
  const handleSearch = (query) => {
    trigger({ query });
  };
  
  return (
    <div>
      <input 
        type="text" 
        onChange={(e) => e.target.value ? handleSearch(e.target.value) : reset()}
        placeholder="Search..." 
      />
      
      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {data && (
        <ul>
          {data.results.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Additional Notes

- This library works with both client-side and server-side rendered Next.js applications (see examples)
- For SSR support, ensure you're using the 'use client' directive as shown at the top of the module


## Ways of improvements

- Optimistic updates integration
- Pagination integration using ```useSWRInfinite``` hook
- Subcription integration using ```useSWRSubscription``` hook
- and more...