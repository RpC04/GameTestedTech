// app/admin/home/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useHomeStats } from "@/hooks/useHomeStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminHomePage() {
  const { stats, heroStats, loading, error, updateStat, refetch } = useHomeStats();
  const [editedStats, setEditedStats] = useState(stats);
  const [editedHeroStats, setEditedHeroStats] = useState(heroStats);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedStats(stats);
  }, [stats]);

  useEffect(() => {
    setEditedHeroStats(heroStats);
  }, [heroStats]);

  const handleInputChange = (
    id: number, 
    field: 'value' | 'label', 
    newValue: string, 
    type: 'home' | 'hero'
  ) => {
    if (type === 'home') {
      setEditedStats(prev => 
        prev.map(stat => 
          stat.id === id ? { ...stat, [field]: newValue } : stat
        )
      );
    } else {
      setEditedHeroStats(prev => 
        prev.map(stat => 
          stat.id === id ? { ...stat, [field]: newValue } : stat
        )
      );
    }
  };

  const handleSave = async (id: number, type: 'home' | 'hero') => {
    setSaving(true);
    const statsArray = type === 'home' ? editedStats : editedHeroStats;
    const stat = statsArray.find(s => s.id === id);
    if (!stat) return;

    const result = await updateStat(id, stat.value, stat.label, type);
    
    if (result.success) {
      toast.success(`${type === 'home' ? 'Home Statistic' : 'Hero Statistic'} updated successfully`);
    } else {
      toast.error(`Error: ${result.error}`);
    }
    setSaving(false);
  };

  const handleSaveAll = async (type: 'home' | 'hero') => {
    setSaving(true);
    let hasError = false;
    const statsArray = type === 'home' ? editedStats : editedHeroStats;

    for (const stat of statsArray) {
      if (stat.id) {
        const result = await updateStat(stat.id, stat.value, stat.label, type);
        if (!result.success) {
          hasError = true;
          toast.error(`Error updating ${stat.label}: ${result.error}`);
        }
      }
    }

    if (!hasError) {
      toast.success(`All ${type === 'home' ? 'home' : 'hero'} statistics have been updated`);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Manage Home Statistics</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Manage Home Statistics</h1>
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Home Statistics</h1>
          <Button 
            onClick={refetch} 
            variant="outline"
            className="bg-transparent border-gray-600 hover:border-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="bg-[#1a1a2e] border-gray-700">
            <TabsTrigger value="hero" className="data-[state=active]:text-white data-[state=active]:bg-[#ff6b35]">
              Hero Statistics
            </TabsTrigger>
            <TabsTrigger value="home" className="data-[state=active]:text-white data-[state=active]:bg-[#ff6b35] ">
              Community Statistics
            </TabsTrigger>
          </TabsList>

          {/* Hero Stats Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div className="flex justify-end">
              <Button 
                onClick={() => handleSaveAll('hero')}
                disabled={saving}
                className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save All Hero"}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {editedHeroStats.map((stat, index) => (
                <Card key={stat.id} className="bg-[#1a1a2e] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Hero Stat {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`hero-value-${stat.id}`} className="text-gray-300">
                        Value (ej: 500+, 50K+)
                      </Label>
                      <Input
                        id={`hero-value-${stat.id}`}
                        value={stat.value}
                        onChange={(e) => handleInputChange(stat.id!, 'value', e.target.value, 'hero')}
                        className="bg-[#0f0f23] border-gray-600 text-white mt-1"
                        placeholder="Ej: 500+"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`hero-label-${stat.id}`} className="text-gray-300">
                        Label
                      </Label>
                      <Input
                        id={`hero-label-${stat.id}`}
                        value={stat.label}
                        onChange={(e) => handleInputChange(stat.id!, 'label', e.target.value, 'hero')}
                        className="bg-[#0f0f23] border-gray-600 text-white mt-1"
                        placeholder="Ej: Articles"
                      />
                    </div>

                    <Button
                      onClick={() => handleSave(stat.id!, 'hero')}
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

            {/* Preview Hero Stats */}
            <Card className="bg-[#1a1a2e] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Preview - Hero Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8 text-center">
                  {editedHeroStats.map((stat, index) => (
                    <div key={stat.id} className="text-center">
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Home Stats Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="flex justify-end">
              <Button 
                onClick={() => handleSaveAll('home')}
                disabled={saving}
                className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save All Community"}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {editedStats.map((stat, index) => (
                <Card key={stat.id} className="bg-[#1a1a2e] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Community Statistic {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`home-value-${stat.id}`} className="text-gray-300">
                        Value (ej: 1.2M+, 10K+)
                      </Label>
                      <Input
                        id={`home-value-${stat.id}`}
                        value={stat.value}
                        onChange={(e) => handleInputChange(stat.id!, 'value', e.target.value, 'home')}
                        className="bg-[#0f0f23] border-gray-600 text-white mt-1"
                        placeholder="Ej: 1.2M+"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`home-label-${stat.id}`} className="text-gray-300">
                        Label
                      </Label>
                      <Input
                        id={`home-label-${stat.id}`}
                        value={stat.label}
                        onChange={(e) => handleInputChange(stat.id!, 'label', e.target.value, 'home')}
                        className="bg-[#0f0f23] border-gray-600 text-white mt-1"
                        placeholder="Ej: Community Members"
                      />
                    </div>

                    <Button
                      onClick={() => handleSave(stat.id!, 'home')}
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

            {/* Preview Home Stats */}
            <Card className="bg-[#1a1a2e] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Preview - Community Stats</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}