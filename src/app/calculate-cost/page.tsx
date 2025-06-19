import CostCalculatorForm from "@/components/features/cost-calculator-form";

export default function CalculateCostPage() {
  return (
    <div className="container mx-auto py-8 px-4 flex justify-center">
      <div className="w-full max-w-2xl">
        <CostCalculatorForm />
      </div>
    </div>
  );
}
