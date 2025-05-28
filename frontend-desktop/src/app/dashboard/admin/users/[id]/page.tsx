import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, User } from "lucide-react"

// Mock user data
const userData = {
  id: "1",
  name: "John Smith",
  email: "john.smith@example.com",
  role: "User",
  status: "Active",
  joinedAt: "Jan 15, 2023",
  lastActive: "2 hours ago",
  scansUploaded: 24,
  scansAnalyzed: 18,
  subscription: "Pro",
  avatarUrl: "",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  // For static export, we need to provide the possible id values
  // In a real app, you would fetch this from your API
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params
  // In a real app, you would fetch user data based on id
  const user = userData

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Details</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View As User
          </Button>
          <Button>Edit User</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="mt-2 flex gap-2">
                <Badge>{user.role}</Badge>
                <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
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
                <dd>{user.id}</dd>
                <dt className="text-muted-foreground">Joined:</dt>
                <dd>{user.joinedAt}</dd>
                <dt className="text-muted-foreground">Last active:</dt>
                <dd>{user.lastActive}</dd>
                <dt className="text-muted-foreground">Subscription:</dt>
                <dd>{user.subscription}</dd>
              </dl>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Usage Statistics</h3>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-muted-foreground">Scans Uploaded:</dt>
                <dd>{user.scansUploaded}</dd>
                <dt className="text-muted-foreground">Scans Analyzed:</dt>
                <dd>{user.scansAnalyzed}</dd>
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
