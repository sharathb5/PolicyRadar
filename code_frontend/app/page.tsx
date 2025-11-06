"use client"

import { useState } from "react"
import { PolicyFeed } from "@/components/policy-feed"
import { SavedDigest } from "@/components/saved-digest"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PolicyRadarPage() {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="sr-only">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="m-0">
          <PolicyFeed onNavigateToDigest={() => setActiveTab("saved")} />
        </TabsContent>

        <TabsContent value="saved" className="m-0">
          <SavedDigest />
        </TabsContent>
      </Tabs>
    </div>
  )
}
