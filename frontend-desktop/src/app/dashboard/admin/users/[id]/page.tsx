"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, User } from "lucide-react"
import Link from "next/link"
import { adminService } from "@/services/api"

// Interface for user detail from API
interface UserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  analyses_count: number;
  is_staff: boolean;
  is_superuser: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function UserDetailPage({ params }: PageProps) {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserDetail = async () => {
      try {
        const resolvedParams = await params
        setLoading(true)
        const response = await adminService.getUser(parseInt(resolvedParams.id))
        setUserDetail(response)
      } catch (error) {
        console.error('Error loading user detail:', error)
        alert('Failed to load user details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    loadUserDetail()
  }, [params])

  const handleViewAsUser = () => {
    if (userDetail) {
      alert(`Viewing as ${userDetail.username} - This feature would switch user context`)
    }
  }

  const handleEditUser = () => {
    if (userDetail) {
      // Navigate to edit user page or open edit dialog
      alert(`Edit user functionality for ${userDetail.username} - This would open an edit form`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading user details...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!userDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg">User not found</div>
            <Link href="/dashboard/admin/users" className="text-primary hover:underline">
              Return to Users
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const fullName = `${userDetail.first_name} ${userDetail.last_name}`.trim() || userDetail.username

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewAsUser}>
            <Eye className="mr-2 h-4 w-4" />
            View As User
          </Button>
          <Button onClick={handleEditUser}>Edit User</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={fullName} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{fullName}</CardTitle>
              <CardDescription>{userDetail.email}</CardDescription>
              <div className="mt-2 flex gap-2">
                <Badge>{userDetail.role}</Badge>
                <Badge variant={userDetail.is_active ? "default" : "destructive"}>{userDetail.is_active ? "Active" : "Inactive"}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium">Account Information</h3>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-muted-foreground">User ID:</dt>
                <dd>{userDetail.id}</dd>
                <dt className="text-muted-foreground">Joined:</dt>
                <dd>{userDetail.date_joined}</dd>
                <dt className="text-muted-foreground">Last active:</dt>
                <dd>{userDetail.last_login}</dd>
              </dl>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Usage Statistics</h3>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-muted-foreground">Scans Analyzed:</dt>
                <dd>{userDetail.analyses_count}</dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scans">
        <TabsList>
          <TabsTrigger value="scans">Fingerprint Scans</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="scans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fingerprint Scans</CardTitle>
              <CardDescription>All fingerprint scans uploaded by this user.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 p-4 text-sm font-medium">
                  <div>Scan ID</div>
                  <div>Date</div>
                  <div>Type</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {[
                    { id: "FP-001", date: "Feb 12, 2023", type: "Right Index", status: "Analyzed" },
                    { id: "FP-002", date: "Feb 12, 2023", type: "Left Index", status: "Analyzed" },
                    { id: "FP-003", date: "Feb 20, 2023", type: "Right Thumb", status: "Analyzed" },
                    { id: "FP-004", date: "Mar 05, 2023", type: "Left Thumb", status: "Processing" },
                  ].map((scan, i) => (
                    <div key={i} className="grid grid-cols-4 p-4 text-sm">
                      <div>{scan.id}</div>
                      <div>{scan.date}</div>
                      <div>{scan.type}</div>
                      <div>
                        <Badge variant={scan.status === "Analyzed" ? "secondary" : "outline"}>{scan.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                View All Scans
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent user activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Logged in", date: "Apr 8, 2023 - 10:24 AM" },
                  { action: "Uploaded new fingerprint scan", date: "Apr 8, 2023 - 10:30 AM" },
                  { action: "Updated profile information", date: "Apr 7, 2023 - 3:45 PM" },
                  { action: "Changed password", date: "Apr 5, 2023 - 5:12 PM" },
                  { action: "Viewed scan results", date: "Apr 4, 2023 - 9:30 AM" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="min-w-[120px] text-xs text-muted-foreground">{activity.date}</div>
                    <div className="text-sm">{activity.action}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Subscription and payment details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Current Plan</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Pro Plan</div>
                        <div className="text-sm text-muted-foreground">$29.99/month</div>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">Next billing date: May 15, 2023</div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Payment Method</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">•••• 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/24</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Billing History</Button>
              <Button variant="destructive">Cancel Subscription</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
