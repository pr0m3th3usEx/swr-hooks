import { act } from 'react';
import { useApiLazyQuery, useApiMutation, useApiQuery } from '../src';
import { renderHook } from '@testing-library/react';

// Mock data and fetch functions
const fetchData = jest.fn().mockResolvedValue('fetched');
const mutateData = jest.fn().mockResolvedValue('mutated');

const useTestMutation = () => {
  return useApiMutation<void, void>((key) => key === 'testKey', mutateData);
};

test('Should fetch automatically', async () => {
  const { result } = await act(() =>
    renderHook(() => useApiQuery(`testKey`, fetchData)),
  );

  expect(result.current.data).toBe('fetched');
});

test('Should refech after mutation', async () => {
  const { result: query, rerender: waitForQueryUpdate } = await act(() =>
    renderHook(() => useApiQuery(`testKey`, fetchData)),
  );
  const { result: mutation, rerender: waitForMutationUpdate } = await act(() =>
    renderHook(() => useTestMutation()),
  );

  expect(query.current.data).toBe('fetched');

  await act(async () => {
    await mutation.current.trigger();
  });

  // Wait for mutation to complete
  await waitForMutationUpdate();

  // Wait for query to refetch after mutation
  await waitForQueryUpdate();

  // Verify query was refetched
  expect(fetchData).toHaveBeenCalledTimes(2);
  expect(query.current.data).toBe('fetched');
});

test('Should fetch data only after trigger', async () => {
  const { result: query } = await act(() =>
    renderHook(() => useApiLazyQuery<number>(`testKey`, fetchData)),
  );

  expect(query.current.data).toBeUndefined();

  await act(async () => {
    await query.current.trigger();
  });

  expect(query.current.data).toBe('fetched');
});
