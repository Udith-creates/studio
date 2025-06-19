
"use client";

import PaymentForm from "@/components/features/payments/payment-form";
import { useToast } from "@/hooks/use-toast";
import type { PaymentRecord } from "@/types"; // Assuming PaymentRecord is a defined type

export default function PaymentsPage() {
  const { toast } = useToast();

  const handlePaymentSuccess = (paymentDetails: any) => {
    // In a real app, you would record this payment.
    console.log("Payment successful on page:", paymentDetails);
    // Potentially add to a local list of payments or trigger a refetch of payment history.
    toast({
        title: "Payment Processed via Page",
        description: `Successfully paid ₹${paymentDetails.amount.toFixed(2)}.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 flex justify-center">
       <PaymentForm
          rideId="DEMO_RIDE_123"
          amountToPay={1000.50} // Example amount in INR
          riderName="Jane Doe"   // Example rider name
          onPaymentSuccess={handlePaymentSuccess}
        />
    </div>
  );
}

