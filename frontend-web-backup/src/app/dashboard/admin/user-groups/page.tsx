"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Users,
  Shield,
  Activity,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { userGroupService } from "@/services/api"
import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Types for user group data from API
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  // Load user groups on component mount
  useEffect(() => {
    loadUserGroups()
  }, [])

  const loadUserGroups = async () => {
    try {
      setLoading(true)
      const response = await userGroupService.getUserGroups()
      setGroups(response.groups)
    } catch (error: unknown) {
      console.error('Error loading user groups:', error)
      alert('Failed to load user groups. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'role':
        return <Shield className="h-5 w-5 text-blue-500" />
      case 'status':
        return <Activity className="h-5 w-5 text-green-500" />
      default:
        return <Users className="h-5 w-5 text-gray-500" />
    }
  }

  const getGroupTypeBadge = (type: string) => {
    switch (type) {
      case 'role':
        return <Badge className="bg-blue-500 text-white">Role-based</Badge>
      case 'status':
        return <Badge className="bg-green-500 text-white">Status-based</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getGroupStats = () => {
    const totalUsers = groups.reduce((sum, group) => sum + group.user_count, 0)
    const roleGroups = groups.filter(g => g.type === 'role').length
    const statusGroups = groups.filter(g => g.type === 'status').length

    return { totalUsers, roleGroups, statusGroups }
  }

  const stats = getGroupStats()

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User Groups</h2>
            <p className="text-muted-foreground">View and manage user groups</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groups.length}</div>
              <p className="text-xs text-muted-foreground">
                {stats.roleGroups} role-based, {stats.statusGroups} status-based
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Across all groups
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Group Size</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {groups.length > 0 ? Math.round(stats.totalUsers / groups.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Users per group
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* User Groups List */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Groups
            </CardTitle>
            <CardDescription>
              Groups are automatically organized by role and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-24 flex items-center justify-center">
                Loading user groups...
              </div>
            ) : groups.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                No user groups found.
              </div>
            ) : (
              <div className="space-y-4">
                {groups.map((group) => (
                  <Collapsible
                    key={group.id}
                    open={expandedGroups.includes(group.id)}
                    onOpenChange={() => toggleGroupExpansion(group.id)}
                  >
                    <Card className="border">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getGroupIcon(group.type)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-base">{group.name}</CardTitle>
                                  {getGroupTypeBadge(group.type)}
                                </div>
                                <CardDescription className="mt-1">
                                  {group.description}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {group.user_count} users
                              </Badge>
                              {expandedGroups.includes(group.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium mb-3">Group Members</h4>
                            {group.users.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No users in this group.</p>
                            ) : (
                              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                                {group.users.map((user) => (
                                  <div
                                    key={user.id}
                                    className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                                  >
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-xs font-medium">
                                        {user.full_name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">
                                        {user.full_name || user.username}
                                      </div>
                                      <div className="text-xs text-muted-foreground truncate">
                                        {user.email}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common group management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/dashboard/admin/users">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Manage Individual Users
                </Button>
              </Link>
              <Link href="/dashboard/admin/roles">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Configure Roles
                </Button>
              </Link>
              <Link href="/dashboard/admin/permissions">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Activity className="h-4 w-4" />
                  Set Permissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 