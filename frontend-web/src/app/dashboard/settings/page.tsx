"use client" // Add this line

import { useState } from "react" // Import useState
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes" // Import useTheme for theme handling

export default function SettingsPage() {
  const { theme, setTheme } = useTheme() // Use next-themes hook

  // --- State for Settings ---
  // General - Appearance
  const [language, setLanguage] = useState("en")
  const [compactMode, setCompactMode] = useState(false)
  // General - Analysis
  const [analysisQuality, setAnalysisQuality] = useState("high")
  const [autoEnhance, setAutoEnhance] = useState(true)
  const [saveOriginal, setSaveOriginal] = useState(true)
  // Notifications - Email
  const [notifyAnalysisComplete, setNotifyAnalysisComplete] = useState(true)
  const [notifySecurityAlerts, setNotifySecurityAlerts] = useState(true)
  const [notifyProductUpdates, setNotifyProductUpdates] = useState(false)
  // Notifications - In-App
  const [notifyInAppAlerts, setNotifyInAppAlerts] = useState(true)
  const [notifyInAppTips, setNotifyInAppTips] = useState(true)
  // Privacy
  const [allowDataCollection, setAllowDataCollection] = useState(true)
  const [allowThirdPartySharing, setAllowThirdPartySharing] = useState(false)

  return (
    // Removed max-w-4xl and mx-auto
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks and feels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  {/* Use next-themes state and setter */}
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  {/* Bind Select to state */}
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-mode" className="cursor-pointer">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Display more content on screen.</p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="compact-mode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {/* Add onClick handler */}
                <Button onClick={handleSaveAppearance}>Save Appearance</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Configuration</CardTitle>
                <CardDescription>Configure how fingerprint analyses are processed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis-quality">Analysis Quality</Label>
                  {/* Bind Select to state */}
                  <Select value={analysisQuality} onValueChange={setAnalysisQuality}>
                    <SelectTrigger id="analysis-quality">
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Faster)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (More Accurate)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-enhance" className="cursor-pointer">Auto-Enhance Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically enhance fingerprint images before analysis.
                    </p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="auto-enhance"
                    checked={autoEnhance}
                    onCheckedChange={setAutoEnhance}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-original" className="cursor-pointer">Save Original Images</Label>
                    <p className="text-sm text-muted-foreground">Keep original images alongside enhanced versions.</p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="save-original"
                    checked={saveOriginal}
                    onCheckedChange={setSaveOriginal}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {/* Add onClick handler */}
                <Button onClick={handleSaveAnalysisConfig}>Save Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure when you receive email notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analysis-complete" className="cursor-pointer">Analysis Complete</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when your fingerprint analysis is complete.
                    </p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="analysis-complete"
                    checked={notifyAnalysisComplete}
                    onCheckedChange={setNotifyAnalysisComplete}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security-alerts" className="cursor-pointer">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about security-related events.
                    </p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="security-alerts"
                    checked={notifySecurityAlerts}
                    onCheckedChange={setNotifySecurityAlerts}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="product-updates" className="cursor-pointer">Product Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and improvements.
                    </p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="product-updates"
                    checked={notifyProductUpdates}
                    onCheckedChange={setNotifyProductUpdates}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {/* Add onClick handler */}
                <Button onClick={handleSaveEmailPrefs}>Save Email Preferences</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>In-App Notifications</CardTitle>
                <CardDescription>Configure notifications within the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="in-app-alerts" className="cursor-pointer">System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Show important system notifications in-app.</p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="in-app-alerts"
                    checked={notifyInAppAlerts}
                    onCheckedChange={setNotifyInAppAlerts}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="in-app-tips" className="cursor-pointer">Tips & Tutorials</Label>
                    <p className="text-sm text-muted-foreground">
                      Show helpful tips and tutorials while using the app.
                    </p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="in-app-tips"
                    checked={notifyInAppTips}
                    onCheckedChange={setNotifyInAppTips}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {/* Add onClick handler */}
                <Button onClick={handleSaveInAppPrefs}>Save In-App Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Privacy</CardTitle>
                <CardDescription>Control how your data is used and stored.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection" className="cursor-pointer">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection to improve the service.
                    </p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="data-collection"
                    checked={allowDataCollection}
                    onCheckedChange={setAllowDataCollection}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="third-party" className="cursor-pointer">Third-Party Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing anonymized data with trusted partners.
                    </p>
                  </div>
                  {/* Bind Switch to state */}
                  <Switch
                    id="third-party"
                    checked={allowThirdPartySharing}
                    onCheckedChange={setAllowThirdPartySharing}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {/* Add onClick handler */}
                <Button onClick={handleSavePrivacy}>Save Privacy Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data and account information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Export Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of all your data and analysis history.
                  </p>
                  {/* Add onClick handler */}
                  <Button variant="outline" onClick={handleExportData}>Export Data</Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                  {/* Add onClick handler */}
                  <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
