'use client';

import { useState } from 'react';
import useSWR, {
  BareFetcher,
  Fetcher,
  Key,
  MutatorOptions,
  SWRConfiguration,
  useSWRConfig,
} from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

export const useApiQuery = <
  Result = unknown,
  Error = unknown,
  SWROptions extends
    | SWRConfiguration<Result, Error, BareFetcher<Result>>
    | undefined =
    | SWRConfiguration<Result, Error, BareFetcher<Result>>
    | undefined,
>(
  key: Key,
  queryFn: Fetcher<Result>,
  swrOptions?: SWROptions,
) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Result,
    Error
  >(key, queryFn, swrOptions);

  return {
    data,
    revalidate: () => mutate(undefined, { revalidate: true }),
    error,
    isLoading,
    isValidating,
  };
};

export const useApiMutation = <Result = unknown, Args = unknown>(
  key: (key?: Key) => boolean,
  mutationFn: (arg: Args) => Promise<Result>,
  swrOptions?: MutatorOptions<Result> | undefined,
) => {
  const { mutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState<boolean>();

  const trigger = async (data: Args) => {
    setIsMutating(true);

    try {
      const res = await mutationFn(data);
      await mutate<Result>(key, res, {
        ...swrOptions,
        revalidate: true,
        throwOnError: true,
        populateCache: false,
      });
      setIsMutating(false);

      return res;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    trigger,
    isMutating,
  };
};

export const useApiLazyQuery = <
  Result = unknown,
  Args = never,
  Error = unknown,
  SWROptions extends
    | SWRMutationConfiguration<Result, Error, BareFetcher<Result>>
    | undefined =
    | SWRMutationConfiguration<Result, Error, BareFetcher<Result>>
    | undefined,
>(
  key: Key,
  queryFn: (_: unknown, { arg }: { arg: Args }) => Promise<Result>,
  swrOptions?: SWROptions,
) => {
  const { trigger, reset, isMutating, data, error } = useSWRMutation<
    Result,
    Error,
    Key,
    Args
  >(key, queryFn, {
    ...swrOptions,
    revalidate: true,
  });

  return {
    data,
    error,
    trigger,
    reset,
    isLoading: isMutating,
  };
};
