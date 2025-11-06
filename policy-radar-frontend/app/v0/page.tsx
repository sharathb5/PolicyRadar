"use client"

import { useState } from "react"
import { PolicyFeed } from "@/components/policy-feed"
import { SavedDigest } from "@/components/saved-digest"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PolicyRadarV0Page() {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="feed" data-testid="tab-feed">Feed</TabsTrigger>
          <TabsTrigger value="saved" data-testid="tab-saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="m-0">
          <PolicyFeed />
        </TabsContent>

        <TabsContent value="saved" className="m-0">
          <div data-testid="saved-digest">
            <SavedDigest />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


