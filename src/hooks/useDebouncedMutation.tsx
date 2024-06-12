import {
  DefaultError,
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import { useRef } from "react";

type DebouncedMutate<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
> = (
  variables: TVariables,
  {
    debounceMs,
    ...options
  }: UseMutationOptions<TData, TError, TVariables, TContext> & {
    debounceMs: number;
  }
) => void;
type UseDebouncedMutationReturn<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
> = Omit<
  UseMutationResult<TData, TError, TVariables, TContext>,
  "data" | "mutate"
> & { debouncedMutate: DebouncedMutate<TData, TError, TVariables, TContext> };

export function useDebouncedMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseDebouncedMutationReturn<TData, TError, TVariables, TContext> {
  const { mutate, ...mutation } = useMutation<
    TData,
    TError,
    TVariables,
    TContext
  >(options);
  const timer = useRef<NodeJS.Timeout>();
  const debouncedMutate: DebouncedMutate<
    TData,
    TError,
    TVariables,
    TContext
  > = (variables, { debounceMs, ...options }) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      mutate(variables, options);
    }, debounceMs);
  };
  return { debouncedMutate, ...mutation };
}
