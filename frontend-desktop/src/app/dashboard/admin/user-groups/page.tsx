"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Users, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { userGroupService } from "@/services/api"

interface UserGroup {
  id: string;
  name: string;
  type: string;
  description: string;
  user_count: number;
  users: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  }[];
}

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      setLoading(true)
      const response = await userGroupService.getUserGroups()
      setGroups(response.groups)
    } catch (error) {
      console.error('Error loading user groups:', error)
      alert('Failed to load user groups. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = () => {
    alert('Create group functionality - This would open a create form')
  }

  const handleEditGroup = (group: UserGroup) => {
    alert(`Edit group functionality for ${group.name} - This would open an edit form`)
  }

  const getGroupTypeBadge = (type: string) => {
    switch (type) {
      case 'auto':
        return <Badge variant="secondary">Automatic</Badge>
      case 'manual':
        return <Badge variant="outline">Manual</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/admin/users" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to User Management
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Groups</h1>
            <p className="text-muted-foreground">Organize users into manageable groups</p>
          </div>
          <Button onClick={handleCreateGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading user groups...</div>
            </CardContent>
          </Card>
        ) : groups.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">No user groups found.</div>
            </CardContent>
          </Card>
        ) : (
          groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {group.name}
                    </CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getGroupTypeBadge(group.type)}
                    <Button variant="outline" size="sm" onClick={() => handleEditGroup(group)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Total Members: <span className="font-medium text-foreground">{group.user_count}</span>
                    </div>
                  </div>
                  
                  {group.users.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sample Members:</h4>
                      <div className="grid gap-2">
                        {group.users.slice(0, 3).map((user) => (
                          <div key={user.id} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
                            <div>
                              <div className="font-medium text-sm">{user.full_name || user.username}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        ))}
                        {group.user_count > 3 && (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            +{group.user_count - 3} more members
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 