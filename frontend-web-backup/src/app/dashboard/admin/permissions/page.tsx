"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ArrowLeft,
  Settings,
  Users,
  BarChart3,
  FileText,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { permissionService, roleService } from "@/services/api"
import Link from "next/link"

// Types for permission data from API
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermissions {
  [roleName: string]: {
    can_provide_expert_feedback: boolean;
    can_manage_users: boolean;
    can_access_analytics: boolean;
  };
}

interface Role {
  id: number;
  role_name: string;
  description: string;
  access_level: number;
  can_provide_expert_feedback: boolean;
  can_manage_users: boolean;
  can_access_analytics: boolean;
  user_count: number;
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

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({})
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  // Load permissions and roles on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [permissionsResponse, rolesResponse] = await Promise.all([
        permissionService.getPermissions(),
        roleService.listRoles()
      ])
      
      setPermissions(permissionsResponse.permissions)
      setRolePermissions(permissionsResponse.role_permissions)
      setRoles(rolesResponse.roles)
    } catch (error: unknown) {
      console.error('Error loading data:', error)
      alert('Failed to load permissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionChange = async (roleId: number, permissionId: string, checked: boolean) => {
    try {
      const role = roles.find(r => r.id === roleId)
      if (!role) return

      const updateData: Record<string, boolean | string | number> = {}
      updateData[permissionId] = checked

      await roleService.updateRole(roleId, updateData)
      
      // Update local state
      setRolePermissions(prev => ({
        ...prev,
        [role.role_name]: {
          ...prev[role.role_name],
          [permissionId]: checked
        }
      }))

      // Update roles state
      setRoles(prev => prev.map(r => 
        r.id === roleId 
          ? { ...r, [permissionId]: checked }
          : r
      ))

      alert('Permission updated successfully')
    } catch (error) {
      console.error('Error updating permission:', error)
      alert('Failed to update permission')
    }
  }

  const getPermissionIcon = (permissionId: string) => {
    switch (permissionId) {
      case 'can_provide_expert_feedback':
        return <FileText className="h-4 w-4" />
      case 'can_manage_users':
        return <Users className="h-4 w-4" />
      case 'can_access_analytics':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Analysis':
        return <Badge className="bg-blue-500 text-white">Analysis</Badge>
      case 'User Management':
        return <Badge className="bg-green-500 text-white">User Management</Badge>
      case 'Analytics':
        return <Badge className="bg-purple-500 text-white">Analytics</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

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
            <h2 className="text-2xl font-bold tracking-tight">Permission Settings</h2>
            <p className="text-muted-foreground">Configure role-based permissions</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Permissions
            </CardTitle>
            <CardDescription>
              Manage which roles have access to specific features
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-24 flex items-center justify-center">
                Loading permissions...
              </div>
            ) : (
              <div className="space-y-6">
                {permissions.map((permission) => (
                  <div key={permission.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      {getPermissionIcon(permission.id)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{permission.name}</h3>
                          {getCategoryBadge(permission.category)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {roles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{role.role_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {role.user_count} users
                            </Badge>
                          </div>
                          <Checkbox
                            checked={rolePermissions[role.role_name]?.[permission.id as keyof typeof rolePermissions[string]] || false}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(role.id, permission.id, !!checked)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Permission Matrix Overview */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Permission Matrix
            </CardTitle>
            <CardDescription>
              Overview of all role permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Expert Feedback</TableHead>
                    <TableHead>User Management</TableHead>
                    <TableHead>Analytics</TableHead>
                    <TableHead>Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{role.role_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.access_level === 3 ? 'default' : role.access_level === 2 ? 'secondary' : 'outline'}>
                          Level {role.access_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {role.can_provide_expert_feedback ? (
                            <Badge className="bg-green-500 text-white">✓ Enabled</Badge>
                          ) : (
                            <Badge variant="outline">✗ Disabled</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {role.can_manage_users ? (
                            <Badge className="bg-green-500 text-white">✓ Enabled</Badge>
                          ) : (
                            <Badge variant="outline">✗ Disabled</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {role.can_access_analytics ? (
                            <Badge className="bg-green-500 text-white">✓ Enabled</Badge>
                          ) : (
                            <Badge variant="outline">✗ Disabled</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{role.user_count}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 