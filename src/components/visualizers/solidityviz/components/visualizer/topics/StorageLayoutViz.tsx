import { Database } from "lucide-react";
import { StorageLayoutVisualizer } from "../StorageLayoutVisualizer";

export function StorageLayoutViz() {
    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-8 w-full">
            <div className="grid md:grid-cols-2 gap-8 w-full">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Database className="w-4 h-4" /> Unpacked</h3>
                    <div className="border rounded-xl p-4 bg-card shadow-sm">
                        <StorageLayoutVisualizer scenario="unpacked" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-primary"><Database className="w-4 h-4" /> Packed</h3>
                    <div className="border rounded-xl p-4 bg-card shadow-sm ring-1 ring-primary/20">
                        <StorageLayoutVisualizer scenario="packed" />
                    </div>
                </div>
            </div>
        </div>
    );
}
