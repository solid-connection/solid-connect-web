"use client";

import {
  type MutateOptions,
  type UseMutationOptions,
  type UseMutationResult,
  useMutation as useReactQueryMutation,
} from "@tanstack/react-query";

export type { MutateOptions, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";

export type MutationFailureHandler<TError, TVariables, TContext> = {
  onFailure?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
};

export type MutationOptionsWithFailure<TData, TError, TVariables, TContext> = UseMutationOptions<
  TData,
  TError,
  TVariables,
  TContext
> &
  MutationFailureHandler<TError, TVariables, TContext>;

export type MutateOptionsWithFailure<TData, TError, TVariables, TContext> = MutateOptions<
  TData,
  TError,
  TVariables,
  TContext
> &
  MutationFailureHandler<TError, TVariables, TContext>;

const mergeOnError = <TError, TVariables, TContext>(
  onError?: UseMutationOptions<unknown, TError, TVariables, TContext>["onError"],
  onFailure?: (error: TError, variables: TVariables, context: TContext | undefined) => void,
): UseMutationOptions<unknown, TError, TVariables, TContext>["onError"] => {
  if (!onError && !onFailure) return undefined;
  return (...args: Parameters<NonNullable<UseMutationOptions<unknown, TError, TVariables, TContext>["onError"]>>) => {
    onError?.(...args);
    onFailure?.(args[0], args[1], args[2]);
  };
};

const normalizeMutationOptions = <TData, TError, TVariables, TContext>(
  options: MutationOptionsWithFailure<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> => {
  const { onFailure, onError, ...rest } = options;
  const mergedOnError = mergeOnError<TError, TVariables, TContext>(onError, onFailure);
  return mergedOnError
    ? { ...rest, onError: mergedOnError as UseMutationOptions<TData, TError, TVariables, TContext>["onError"] }
    : rest;
};

const normalizeMutateOptions = <TData, TError, TVariables, TContext>(
  options?: MutateOptionsWithFailure<TData, TError, TVariables, TContext>,
): MutateOptions<TData, TError, TVariables, TContext> | undefined => {
  if (!options) return undefined;
  const { onFailure, onError, ...rest } = options;
  const mergedOnError = mergeOnError<TError, TVariables, TContext>(onError, onFailure);
  return mergedOnError
    ? { ...rest, onError: mergedOnError as MutateOptions<TData, TError, TVariables, TContext>["onError"] }
    : rest;
};

export type MutationResultWithFailure<TData, TError, TVariables, TContext> = UseMutationResult<
  TData,
  TError,
  TVariables,
  TContext
> & {
  mutate: (variables: TVariables, options?: MutateOptionsWithFailure<TData, TError, TVariables, TContext>) => void;
  mutateAsync: (
    variables: TVariables,
    options?: MutateOptionsWithFailure<TData, TError, TVariables, TContext>,
  ) => Promise<TData>;
};

export const useMutation = <TData, TError, TVariables, TContext>(
  options: MutationOptionsWithFailure<TData, TError, TVariables, TContext>,
): MutationResultWithFailure<TData, TError, TVariables, TContext> => {
  const mutation = useReactQueryMutation<TData, TError, TVariables, TContext>(normalizeMutationOptions(options));

  const mutate: MutationResultWithFailure<TData, TError, TVariables, TContext>["mutate"] = (
    variables,
    mutateOptions,
  ) => {
    mutation.mutate(variables, normalizeMutateOptions(mutateOptions));
  };

  const mutateAsync: MutationResultWithFailure<TData, TError, TVariables, TContext>["mutateAsync"] = (
    variables,
    mutateOptions,
  ) => mutation.mutateAsync(variables, normalizeMutateOptions(mutateOptions));

  return {
    ...mutation,
    mutate,
    mutateAsync,
  };
};
