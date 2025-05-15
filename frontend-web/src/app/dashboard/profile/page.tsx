"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, Upload, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

// Initial user data structure
const initialUserData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  avatarUrl: "",
  role: "",
  status: "Active",
}

export default function ProfilePage() {
  const { user: authUser, isAuthenticated, loading } = useAuth()
  const [user, setUser] = useState(initialUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Calculate initials for avatar fallback
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()

  // Initialize user data from auth context
  useEffect(() => {
    if (authUser) {
      // Split the username into first and last name (if applicable)
      const nameParts = authUser.username.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""
      
      setUser({
        ...initialUserData,
        firstName,
        lastName,
        email: authUser.email || "",
        role: authUser.role || "Regular",
        status: "Active", // Default status
      })
    }
  }, [authUser])

  // Handler functions
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to your server
      // and update the avatarUrl
      console.log("Avatar file selected:", file.name)
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      // Reset form data when canceling edit
      if (authUser) {
        const nameParts = authUser.username.split(" ")
        const firstName = nameParts[0] || ""
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""
        
        setUser({
          ...user,
          firstName,
          lastName,
          email: authUser.email || "",
        })
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setUser(prevUser => ({
      ...prevUser,
      [id]: value,
    }))
  }

  const handleSavePersonalInfo = async () => {
    setIsSubmitting(true)
    setError("")
    setSuccess("")
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/api/userprofile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
          username: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          // Add other fields as needed
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update profile")
      }

      const data = await response.json()
      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      
      // If you have an updateUser function in your auth context, use it here
      // updateUser({
      //   username: data.username,
      //   email: data.email
      // })
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAddress = () => {
    // Implement address saving logic
    setSuccess("Address updated successfully!")
    setIsEditing(false)
  }

  const handleUpdatePassword = () => {
    // Implement password update logic
    setSuccess("Password updated successfully!")
  }

  const handleEnable2FA = () => {
    setIs2FAEnabled(!is2FAEnabled)
    setSuccess(is2FAEnabled ? "2FA disabled successfully!" : "2FA enabled successfully!")
  }

  const handleSavePreferences = () => {
    // Implement preferences saving logic
    setSuccess("Preferences updated successfully!")
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  // Not authenticated state
  if (!isAuthenticated || !authUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md p-6 bg-destructive/10 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Authentication Required</h2>
          <p>You must be logged in to view this page.</p>
        </div>
      </div>
    )
  }

  // Main profile UI
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Profile Header Card */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Upload */}
            <div className="relative group">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Avatar className="h-24 w-24 border-4 border-background group-hover:border-primary transition-colors duration-300">
                  <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-3xl">
                    {initials || <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="Change Avatar"
                >
                  <Upload className="h-4 w-4 text-foreground" />
                </div>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-2xl font-semibold">{`${user.firstName} ${user.lastName}`}</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-1">{user.email}</CardDescription>
              <div className="mt-3 flex gap-2 justify-center sm:justify-start">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
              </div>
            </div>
            {/* Edit Button */}
            <Button variant="outline" className="mt-4 sm:mt-0" onClick={handleEditToggle}>
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        {error && (
          <div className="px-6 py-2 bg-destructive/15 text-destructive text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="px-6 py-2 bg-green-100 text-green-800 text-sm">
            {success}
          </div>
        )}
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={user.firstName} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={user.lastName} onChange={handleInputChange} disabled={!isEditing} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={user.phone} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={user.company} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </CardContent>
            <CardFooter>
              {isEditing && (
                <Button 
                  onClick={handleSavePersonalInfo} 
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Personal Info
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your address details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" value={user.address} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={user.city} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={user.state} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" value={user.zip} onChange={handleInputChange} disabled={!isEditing} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={user.country} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </CardContent>
            <CardFooter>
              {isEditing && <Button onClick={handleSaveAddress}>Save Address</Button>}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdatePassword}>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-md border p-4 bg-muted/30">
                <div>
                  <p className="font-medium">Status: {is2FAEnabled ? "Enabled" : "Disabled"}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {is2FAEnabled
                      ? "Two-factor authentication is active."
                      : "Enable two-factor authentication for enhanced security."}
                  </p>
                </div>
                <Button variant="outline" onClick={handleEnable2FA}>
                  {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <Label className="font-medium" htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground mt-1">Receive notifications via email.</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <Label className="font-medium" htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground mt-1">Receive notifications via SMS.</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
