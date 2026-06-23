export const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'supabase';

export function resolveRepository<T>(supabaseImpl: T, memoryImpl: T): T {
  if (DATA_SOURCE === 'memory') {
    return memoryImpl;
  }
  return supabaseImpl;
}
