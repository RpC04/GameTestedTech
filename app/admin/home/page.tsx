"use client";

import { useState, useEffect } from "react";
import { useHomeStats } from "@/hooks/useHomeStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminHomePage() {
  const { stats, loading, error, updateStat, refetch } = useHomeStats();
  const [editedStats, setEditedStats] = useState(stats);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedStats(stats);
  }, [stats]);

  const handleInputChange = (id: number, field: 'value' | 'label', newValue: string) => {
    setEditedStats(prev => 
      prev.map(stat => 
        stat.id === id ? { ...stat, [field]: newValue } : stat
      )
    );
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    const stat = editedStats.find(s => s.id === id);
    if (!stat) return;

    const result = await updateStat(id, stat.value, stat.label);
    
    if (result.success) {
      toast.success("Statistic updated successfully");
    } else {
      toast.error(`Error: ${result.error}`);
    }
    setSaving(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    let hasError = false;

    for (const stat of editedStats) {
      if (stat.id) {
        const result = await updateStat(stat.id, stat.value, stat.label);
        if (!result.success) {
          hasError = true;
          toast.error(`Error updating ${stat.label}: ${result.error}`);
        }
      }
    }

    if (!hasError) {
      toast.success("All statistics have been updated");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Manage Home Statistics</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Manage Home Statistics</h1>
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Home Statistics</h1>
          <div className="flex gap-3">
            <Button 
              onClick={refetch} 
              variant="outline"
              className="bg-transparent border-gray-600 hover:border-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={handleSaveAll}
              disabled={saving}
              className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {editedStats.map((stat, index) => (
            <Card key={stat.id} className="bg-[#1a1a2e] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Statistic {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`value-${stat.id}`} className="text-gray-300">
                    Value (ej: 1.2M+, 10K+)
                  </Label>
                  <Input
                    id={`value-${stat.id}`}
                    value={stat.value}
                    onChange={(e) => handleInputChange(stat.id!, 'value', e.target.value)}
                    className="bg-[#0f0f23] border-gray-600 text-white mt-1"
                    placeholder="Ej: 1.2M+"
                  />
                </div>

                <div>
                  <Label htmlFor={`label-${stat.id}`} className="text-gray-300">
                    Label
                  </Label>
                  <Input
                    id={`label-${stat.id}`}
                    value={stat.label}
                    onChange={(e) => handleInputChange(stat.id!, 'label', e.target.value)}
                    className="bg-[#0f0f23] border-gray-600 text-white mt-1"
                    placeholder="Ej: Community Members"
                  />
                </div>

                <Button
                  onClick={() => handleSave(stat.id!)}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Section */}
        <Card className="mt-8 bg-[#1a1a2e] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {editedStats.map((stat, i) => (
                <div key={stat.id} className="p-4">
                  <p className={
                    "text-2xl md:text-3xl font-bold " +
                    (i === 0
                      ? "text-white"
                      : i === 2
                        ? "text-[#ff6b35]"
                        : "text-blue-400")
                  }>
                    {stat.value}
                  </p>
                  <p className="text-gray-400 mt-1 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}