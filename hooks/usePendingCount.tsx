'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/providers';

export function usePendingCount() {
    const [count, setCount] = useState(0);
    const { user } = useAuth();
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;

        // 1. Fetch the initial count on page load
        const fetchCount = async () => {
            const { count, error } = await supabase
                .from('pendingReceipts')
                .select('*', { count: 'exact', head: true }) // head: true means "don't download the data, just count it"
                .eq('user_id', user.id);

            if (!error && count !== null) {
                setCount(count);
            }
        };

        fetchCount();

        // 2. Subscribe to Realtime changes!
        // This listens to INSERT and DELETE events on pending_receipts
        const channel = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'pendingReceipts', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    // If an email is fetched/inserted, increase count
                    if (payload.eventType === 'INSERT') {
                        setCount((prev) => prev + 1);
                    }
                    // If a receipt is reviewed/dismissed, decrease count
                    if (payload.eventType === 'DELETE') {
                        setCount((prev) => Math.max(0, prev - 1));
                    }
                }
            )
            .subscribe();

        // Cleanup subscription when component unmounts
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    return count;
}