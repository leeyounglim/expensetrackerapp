'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ReceiptForm from '@/components/ReceiptForm'; // Adjust path as needed

const Review = () => {
    const [pendingData, setPendingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const router = useRouter();
    const params = useParams();
    // Safely extract the ID exactly like your Edit page
    const id = Array.isArray(params.id) ? params.id[0] : params.id; 
    
    const supabase = createClient();

    useEffect(() => {
        // If there's no ID yet (sometimes happens on first render), don't fetch
        if (!id) return; 

        const fetchPending = async () => {
            const { data, error } = await supabase
                .from('pendingReceipts')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                // Strip the "$" from the amount so your regex doesn't reject it
                const formattedPrice = data.price ? String(data.price).replace('$', '') : '';
                
                setPendingData({
                    ...data,
                    price: formattedPrice,
                    // Format date for the <input type="date">
                    date: data.date ? new Date(data.date).toISOString().split('T')[0] : ''
                });
            }
            
            if (error) console.error("Error fetching pending receipt:", error);
            setIsLoading(false);
        };

        fetchPending();
    }, [id]); // Add id to dependency array

    const handleReviewSubmit = async (formData: any) => {
        // 1. Insert into permanent receipts table
        const { error: insertError } = await supabase
            .from('receipts')
            .insert(formData);

        if (insertError) {
            console.error("Failed to insert receipt:", insertError);
            return;
        }

        // 2. Delete from the staging table using the extracted id
        await supabase
            .from('pendingReceipts')
            .delete()
            .eq('id', id);

        // 3. Send back to inbox
        router.push('/inbox');
    };

    if (isLoading) return <p>Loading receipt...</p>;
    if (!pendingData) return <p>Receipt not found.</p>;

    return (
        <div className="review-page">
            <ReceiptForm 
                initialData={pendingData} 
                onSubmit={handleReviewSubmit} 
                buttonText="Save & Add" 
            />
        </div>
    );
}

export default Review;