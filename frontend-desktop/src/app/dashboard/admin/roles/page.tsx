"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Edit,
  Plus,
  Shield,
  Users,
  ArrowLeft,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { roleService } from "@/services/api"
import Link from "next/link"

// Types for role data from API
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

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [newRoleForm, setNewRoleForm] = useState({
    role_name: "",
    description: "",
    access_level: 1,
    can_provide_expert_feedback: false,
    can_manage_users: false,
    can_access_analytics: false
  })

  // Load roles on component mount
  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const response = await roleService.listRoles()
      setRoles(response.roles)
    } catch (error: unknown) {
      console.error('Error loading roles:', error)
      alert('Failed to load roles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleForm.role_name) {
      alert('Role name is required')
      return
    }

    try {
      await roleService.createRole(newRoleForm)
      alert('Role created successfully')
      setIsAddRoleOpen(false)
      setNewRoleForm({
        role_name: "",
        description: "",
        access_level: 1,
        can_provide_expert_feedback: false,
        can_manage_users: false,
        can_access_analytics: false
      })
      loadRoles()
    } catch (error) {
      console.error('Error creating role:', error)
      alert('Failed to create role')
    }
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setNewRoleForm({
      role_name: role.role_name,
      description: role.description,
      access_level: role.access_level,
      can_provide_expert_feedback: role.can_provide_expert_feedback,
      can_manage_users: role.can_manage_users,
      can_access_analytics: role.can_access_analytics
    })
    setIsEditRoleOpen(true)
  }

  const handleUpdateRole = async () => {
    if (!editingRole) return

    try {
      await roleService.updateRole(editingRole.id, {
        description: newRoleForm.description,
        access_level: newRoleForm.access_level,
        can_provide_expert_feedback: newRoleForm.can_provide_expert_feedback,
        can_manage_users: newRoleForm.can_manage_users,
        can_access_analytics: newRoleForm.can_access_analytics
      })
      alert('Role updated successfully')
      setIsEditRoleOpen(false)
      setEditingRole(null)
      loadRoles()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update role')
    }
  }

  const handleDeleteRole = async (role: Role) => {
    if (confirm(`Are you sure you want to delete the role "${role.role_name}"?`)) {
      try {
        await roleService.deleteRole(role.id)
        alert('Role deleted successfully')
        loadRoles()
      } catch (error) {
        console.error('Error deleting role:', error)
        alert('Failed to delete role')
      }
    }
  }

  const getAccessLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return <Badge variant="outline">Basic</Badge>
      case 2:
        return <Badge className="bg-blue-500 text-white">Intermediate</Badge>
      case 3:
        return <Badge className="bg-primary text-primary-foreground">Advanced</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const isDefaultRole = (roleName: string) => {
    return ['Admin', 'Expert', 'Regular'].includes(roleName)
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
            <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="gap-2 button-hover-effect" onClick={() => setIsAddRoleOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Roles
            </CardTitle>
            <CardDescription>
              Configure roles and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading roles...
                      </TableCell>
                    </TableRow>
                  ) : roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No roles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{role.role_name}</span>
                            {isDefaultRole(role.role_name) && (
                              <Badge variant="secondary" className="text-xs">System</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {role.description || 'No description'}
                          </span>
                        </TableCell>
                        <TableCell>{getAccessLevelBadge(role.access_level)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{role.user_count}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {role.can_provide_expert_feedback && (
                              <Badge variant="outline" className="text-xs">Expert Feedback</Badge>
                            )}
                            {role.can_manage_users && (
                              <Badge variant="outline" className="text-xs">User Management</Badge>
                            )}
                            {role.can_access_analytics && (
                              <Badge variant="outline" className="text-xs">Analytics</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            {!isDefaultRole(role.role_name) && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive" 
                                onClick={() => handleDeleteRole(role)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role_name" className="text-right">
                Role Name *
              </Label>
              <Input 
                id="role_name" 
                placeholder="Enter role name" 
                className="col-span-3" 
                value={newRoleForm.role_name}
                onChange={(e) => setNewRoleForm(prev => ({ ...prev, role_name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea 
                id="description" 
                placeholder="Role description" 
                className="col-span-3" 
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="access_level" className="text-right">
                Access Level
              </Label>
              <Input 
                id="access_level" 
                type="number" 
                min="1" 
                max="3" 
                className="col-span-3" 
                value={newRoleForm.access_level}
                onChange={(e) => setNewRoleForm(prev => ({ ...prev, access_level: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="expert_feedback"
                    checked={newRoleForm.can_provide_expert_feedback}
                    onCheckedChange={(checked) => 
                      setNewRoleForm(prev => ({ ...prev, can_provide_expert_feedback: !!checked }))
                    }
                  />
                  <Label htmlFor="expert_feedback" className="text-sm">
                    Can provide expert feedback
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manage_users"
                    checked={newRoleForm.can_manage_users}
                    onCheckedChange={(checked) => 
                      setNewRoleForm(prev => ({ ...prev, can_manage_users: !!checked }))
                    }
                  />
                  <Label htmlFor="manage_users" className="text-sm">
                    Can manage users
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="access_analytics"
                    checked={newRoleForm.can_access_analytics}
                    onCheckedChange={(checked) => 
                      setNewRoleForm(prev => ({ ...prev, can_access_analytics: !!checked }))
                    }
                  />
                  <Label htmlFor="access_analytics" className="text-sm">
                    Can access analytics
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreateRole}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role permissions and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_role_name" className="text-right">
                Role Name
              </Label>
              <Input 
                id="edit_role_name" 
                value={newRoleForm.role_name}
                disabled
                className="col-span-3 bg-muted"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_description" className="text-right">
                Description
              </Label>
              <Textarea 
                id="edit_description" 
                placeholder="Role description" 
                className="col-span-3" 
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_access_level" className="text-right">
                Access Level
              </Label>
              <Input 
                id="edit_access_level" 
                type="number" 
                min="1" 
                max="3" 
                className="col-span-3" 
                value={newRoleForm.access_level}
                onChange={(e) => setNewRoleForm(prev => ({ ...prev, access_level: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_expert_feedback"
                    checked={newRoleForm.can_provide_expert_feedback}
                    onCheckedChange={(checked) => 
                      setNewRoleForm(prev => ({ ...prev, can_provide_expert_feedback: !!checked }))
                    }
                  />
                  <Label htmlFor="edit_expert_feedback" className="text-sm">
                    Can provide expert feedback
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_manage_users"
                    checked={newRoleForm.can_manage_users}
                    onCheckedChange={(checked) => 
                      setNewRoleForm(prev => ({ ...prev, can_manage_users: !!checked }))
                    }
                  />
                  <Label htmlFor="edit_manage_users" className="text-sm">
                    Can manage users
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_access_analytics"
                    checked={newRoleForm.can_access_analytics}
                    onCheckedChange={(checked) => 
                      setNewRoleForm(prev => ({ ...prev, can_access_analytics: !!checked }))
                    }
                  />
                  <Label htmlFor="edit_access_analytics" className="text-sm">
                    Can access analytics
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 