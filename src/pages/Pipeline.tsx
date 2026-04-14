/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCircle, 
  Briefcase,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PIPELINE_STAGES } from '@/src/constants';
import { Application, PipelineStatus } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { InterviewScheduler } from '@/src/components/InterviewScheduler';
import { CalendarIcon } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';

const MOCK_APPLICATIONS: (Application & { candidateName: string; jobTitle: string; skills: string[] })[] = [
  {
    id: 'app1',
    candidateId: '1',
    candidateName: 'John Doe',
    jobId: '1',
    jobTitle: 'Senior Frontend Engineer',
    skills: ['React', 'TypeScript'],
    status: 'Shortlisted',
    matchScore: 92,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: 'app2',
    candidateId: '2',
    candidateName: 'Jane Smith',
    jobId: '1',
    jobTitle: 'Senior Frontend Engineer',
    skills: ['Python', 'Django'],
    status: 'Interview',
    matchScore: 85,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
  {
    id: 'app3',
    candidateId: '3',
    candidateName: 'Alice Johnson',
    jobId: '2',
    jobTitle: 'Backend Developer',
    skills: ['Node.js', 'PostgreSQL'],
    status: 'Offered',
    matchScore: 88,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  },
];

export default function Pipeline() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selectedJob, setSelectedJob] = useState<string | 'all'>('all');
  const [schedulingAppId, setSchedulingAppId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const canEdit = user?.role === 'Admin' || user?.role === 'Recruiter';

  const moveApplication = (id: string, newStatus: PipelineStatus) => {
    if (!canEdit) return;
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status: newStatus, updatedAt: Date.now() } : app
    ));
  };

  const handleScheduleInterview = (details: { date: string; time: string; interviewer: string; location: string }) => {
    if (!schedulingAppId) return;
    
    setApplications(apps => apps.map(app => 
      app.id === schedulingAppId 
        ? { ...app, interviewDetails: details, updatedAt: Date.now() } 
        : app
    ));
  };

  const schedulingApp = applications.find(a => a.id === schedulingAppId);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Pipeline</h1>
          <p className="text-muted-foreground">Track candidates across different stages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Badge className={stage.color}>{stage.label}</Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  {applications.filter(app => app.status === stage.id).length}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 rounded-xl bg-muted/30 p-2 border border-dashed">
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {applications
                    .filter(app => app.status === stage.id)
                    .map((app) => (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{app.candidateName}</p>
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" /> {app.jobTitle}
                                  </p>
                                </div>
                              </div>
                              {app.matchScore && (
                                <Badge variant="secondary" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                                  {app.matchScore}% Match
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {app.skills.map(skill => (
                                <Badge key={skill} variant="outline" className="text-[9px] px-1 py-0 h-4">
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            {app.interviewDetails && (
                              <div className="bg-blue-50 border border-blue-100 rounded-md p-2 mt-2 text-xs text-blue-800">
                                <div className="flex items-center gap-1 font-medium mb-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {app.interviewDetails.date} at {app.interviewDetails.time}
                                </div>
                                <div className="text-[10px] opacity-80">
                                  With: {app.interviewDetails.interviewer}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t mt-2">
                              <div className="flex gap-1">
                                {canEdit && stage.id !== 'Dropped' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => moveApplication(app.id, 'Dropped')}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="flex gap-1">
                                {canEdit && stage.id === 'Interview' && !app.interviewDetails && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-[10px] gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                                    onClick={() => setSchedulingAppId(app.id)}
                                  >
                                    <CalendarIcon className="h-3 w-3" /> Schedule
                                  </Button>
                                )}
                                {canEdit && PIPELINE_STAGES.findIndex(s => s.id === stage.id) < PIPELINE_STAGES.length - 1 && stage.id !== 'Dropped' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 text-[10px] gap-1"
                                    onClick={() => {
                                      const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                                      moveApplication(app.id, PIPELINE_STAGES[currentIndex + 1].id as PipelineStatus);
                                    }}
                                  >
                                    Next Stage <ArrowRight className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>

      {schedulingApp && (
        <InterviewScheduler
          isOpen={!!schedulingAppId}
          onClose={() => setSchedulingAppId(null)}
          candidateName={schedulingApp.candidateName}
          jobTitle={schedulingApp.jobTitle}
          onSchedule={handleScheduleInterview}
        />
      )}
    </div>
  );
}
