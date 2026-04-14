/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Briefcase, 
  MapPin,
  Clock,
  DollarSign,
  Users,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job, Client } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

import { useData } from '@/src/contexts/DataContext';

export default function Jobs() {
  const { jobs, clients, addJob, deleteJob } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    roleTitle: '',
    clientId: '',
    location: '',
    experienceRequired: 0,
    salaryRange: '',
    openings: 1,
    jobType: 'Full-time',
    description: '',
    skillsRequired: [],
  });
  const { user } = useAuth();
  
  const canEdit = user?.role === 'Admin' || user?.role === 'Recruiter';

  const handleAddJob = async () => {
    if (!newJob.roleTitle || !newJob.clientId) {
      toast.error('Role title and client are required');
      return;
    }

    const client = clients.find(c => c.id === newJob.clientId);

    try {
      await addJob({
        clientId: newJob.clientId || '',
        clientName: client?.name || 'Unknown Client',
        roleTitle: newJob.roleTitle || '',
        description: newJob.description || '',
        skillsRequired: newJob.skillsRequired || [],
        experienceRequired: newJob.experienceRequired || 0,
        salaryRange: newJob.salaryRange || '',
        openings: newJob.openings || 1,
        location: newJob.location || '',
        jobType: newJob.jobType as any || 'Full-time',
        status: 'Open',
      });

      setIsAddDialogOpen(false);
      setNewJob({
        roleTitle: '',
        clientId: '',
        location: '',
        experienceRequired: 0,
        salaryRange: '',
        openings: 1,
        jobType: 'Full-time',
        description: '',
        skillsRequired: [],
      });
      toast.success('Job posted successfully');
    } catch (error) {
      // Error handled by context
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (user?.role === 'HiringManager') {
      return matchesSearch && user.assignedJobs?.includes(job.id);
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Openings</h1>
          <p className="text-muted-foreground">Manage job requisitions from your clients.</p>
        </div>
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Post Job
            </Button>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
                <DialogDescription>
                  Create a new job requisition for a client.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleTitle">Role Title</Label>
                    <Input 
                      id="roleTitle" 
                      placeholder="e.g. Senior React Developer" 
                      value={newJob.roleTitle}
                      onChange={e => setNewJob({...newJob, roleTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Select onValueChange={val => setNewJob({...newJob, clientId: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g. New York, NY or Remote" 
                      value={newJob.location}
                      onChange={e => setNewJob({...newJob, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select onValueChange={val => setNewJob({...newJob, jobType: val as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input 
                      id="experience" 
                      type="number" 
                      value={newJob.experienceRequired}
                      onChange={e => setNewJob({...newJob, experienceRequired: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input 
                      id="salary" 
                      placeholder="e.g. $100k - $120k" 
                      value={newJob.salaryRange}
                      onChange={e => setNewJob({...newJob, salaryRange: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openings">Openings</Label>
                    <Input 
                      id="openings" 
                      type="number" 
                      value={newJob.openings}
                      onChange={e => setNewJob({...newJob, openings: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (Comma separated)</Label>
                  <Input 
                    id="skills" 
                    placeholder="React, TypeScript, Node.js" 
                    onChange={e => setNewJob({...newJob, skillsRequired: e.target.value.split(',').map(s => s.trim())})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the role and responsibilities..." 
                    className="min-h-[100px]"
                    value={newJob.description}
                    onChange={e => setNewJob({...newJob, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" onClick={handleAddJob}>Post Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs or clients..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{job.roleTitle}</span>
                      <div className="flex gap-1 mt-1">
                        {job.skillsRequired.slice(0, 2).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-[10px] px-1 py-0 h-4">
                            {skill}
                          </Badge>
                        ))}
                        {job.skillsRequired.length > 2 && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                            +{job.skillsRequired.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{job.clientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{job.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{job.experienceRequired}+ years</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'Open' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {canEdit ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2">
                              <ExternalLink className="h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Users className="h-4 w-4" /> View Candidates
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => deleteJob(job.id)}>
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button variant="ghost" size="sm">View</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredJobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No jobs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
