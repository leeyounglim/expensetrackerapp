'use client';

import { useState, useEffect } from "react";
import { createClient } from "./supabase/client";

interface fetchOptions{
  select?: string;
  filter?: { col: string; val: boolean | number };
  order?: { col: string; asc?: boolean };
  limit?: number;
}

const useFetch = (table: string, options:fetchOptions = {}) => {
  const [data, setData] = useState<any[]|null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let isCancelled = false;
    const supabase = createClient();

    const fetchData = async () => {
      setIsPending(true);
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      let query = supabase.from(table).select(options.select || "*").eq('user_id', userId);

      if (options.filter) query = query.eq(options.filter.col, options.filter.val);
      if (options.order)  query = query.order(options.order.col, { ascending: options.order.asc ?? true });
      if (options.limit)  query = query.limit(options.limit);

      const { data:fetchedData, error } = await query;

      if (!isCancelled) {
        if (error) {
          setError(error.message);
          setIsPending(false);
        } else {
          setData(fetchedData);
          setIsPending(false);
          setError(null);
        }
      }
    };

    fetchData();

    // replaces abortController — cancels state updates if component unmounts
    return () => { isCancelled = true; };

  }, [table, JSON.stringify(options)]);

  return { data, isPending, error };
};

export default useFetch;
