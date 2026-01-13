import { useDebounce } from "@/app/hooks/useDebounce";
import { usePathname, useSearchParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function FilterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    const [clientName, setClientName] = useState(searchParams.get("clientName") || "");
    const [minValue, setMinValue] = useState(searchParams.get("minValue") || "");
    const debouncedClientName = useDebounce(clientName, 1000);
    const debouncedMinValue = useDebounce(minValue, 1000);
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
    
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedClientName) {
            params.set("clientName", debouncedClientName);
        }
        if (debouncedMinValue) {
            params.set("minValue", debouncedMinValue);
        }
        if (startDate) {
            params.set("startDate", startDate);
        }
        if (endDate) {
            params.set("endDate", endDate);
        }
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl);
    }, [debouncedClientName, debouncedMinValue, startDate, endDate, pathname, router]);
    const handleClear = () => {
        setClientName("");
        setMinValue("");
        setStartDate("");
        setEndDate("");
    }
    
    const activeFiltersCount = (clientName ? 1 : 0) + (minValue ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0);
    
    return (
        <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Inquiry Kanban Board</h1>
                    {activeFiltersCount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                {activeFiltersCount}
                            </span>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Client Name</label>
                        <input 
                            type="text" 
                            value={clientName} 
                            onChange={(e) => setClientName(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                            placeholder="Search by client name" 
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Min Value (CHF)</label>
                        <input 
                            type="number" 
                            value={minValue} 
                            onChange={(e) => setMinValue(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                            placeholder="Minimum value" 
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                            placeholder="Start Date" 
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                            placeholder="End Date" 
                        />
                    </div>
                </div>
                {activeFiltersCount > 0 && (
                    <div className="mt-3 flex justify-end">
                        <button 
                            onClick={handleClear} 
                            className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}