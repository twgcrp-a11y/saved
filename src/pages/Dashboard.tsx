/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, UserCircle, CheckCircle2, Search, BrainCircuit, Target, ArrowRight } from 'lucide-react';
import { useData } from '@/src/contexts/DataContext';

export default function Dashboard() {
  const { clients, jobs, candidates, applications } = useData();
  
  const stats = [
    { title: 'Total Clients', value: clients.length.toString(), icon: Users, color: 'text-blue-600' },
    { title: 'Active Jobs', value: jobs.filter(j => j.status === 'Open').length.toString(), icon: Briefcase, color: 'text-purple-600' },
    { title: 'Total Candidates', value: candidates.length.toLocaleString(), icon: UserCircle, color: 'text-orange-600' },
    { title: 'Placements', value: applications.filter(a => a.status === 'Joined').length.toString(), icon: CheckCircle2, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to RecruitOS.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="py-2">
        <h2 className="text-xl font-bold tracking-tight mb-4">Recruitment Workflow</h2>
        <Tabs defaultValue="sourcing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-4 bg-transparent p-0">
            <TabsTrigger 
              value="sourcing" 
              className="relative flex flex-col items-center gap-3 p-6 border-2 rounded-2xl data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50/50 transition-all hover:border-blue-200"
            >
              <div className="p-4 bg-blue-100 text-blue-600 rounded-full shadow-inner">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center">
                <span className="font-bold text-base block">1. Sourcing</span>
                <span className="text-xs text-muted-foreground font-normal hidden md:block">Find & Import</span>
              </div>
              <ArrowRight className="absolute -right-6 top-1/2 -translate-y-1/2 text-muted-foreground hidden md:block z-10" />
            </TabsTrigger>
            
            <TabsTrigger 
              value="screening" 
              className="relative flex flex-col items-center gap-3 p-6 border-2 rounded-2xl data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50/50 transition-all hover:border-purple-200"
            >
              <div className="p-4 bg-purple-100 text-purple-600 rounded-full shadow-inner">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center">
                <span className="font-bold text-base block">2. Screening</span>
                <span className="text-xs text-muted-foreground font-normal hidden md:block">AI Match Analysis</span>
              </div>
              <ArrowRight className="absolute -right-6 top-1/2 -translate-y-1/2 text-muted-foreground hidden md:block z-10" />
            </TabsTrigger>

            <TabsTrigger 
              value="interviewing" 
              className="relative flex flex-col items-center gap-3 p-6 border-2 rounded-2xl data-[state=active]:border-orange-500 data-[state=active]:bg-orange-50/50 transition-all hover:border-orange-200"
            >
              <div className="p-4 bg-orange-100 text-orange-600 rounded-full shadow-inner">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center">
                <span className="font-bold text-base block">3. Interviewing</span>
                <span className="text-xs text-muted-foreground font-normal hidden md:block">Client Rounds</span>
              </div>
              <ArrowRight className="absolute -right-6 top-1/2 -translate-y-1/2 text-muted-foreground hidden md:block z-10" />
            </TabsTrigger>

            <TabsTrigger 
              value="placement" 
              className="relative flex flex-col items-center gap-3 p-6 border-2 rounded-2xl data-[state=active]:border-green-500 data-[state=active]:bg-green-50/50 transition-all hover:border-green-200"
            >
              <div className="p-4 bg-green-100 text-green-600 rounded-full shadow-inner">
                <Target className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center">
                <span className="font-bold text-base block">4. Placement</span>
                <span className="text-xs text-muted-foreground font-normal hidden md:block">Offer & Onboard</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="sourcing" className="mt-0 outline-none">
              <Card className="border-blue-100 bg-blue-50/30 shadow-sm">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-blue-900">Candidate Sourcing & Import</h3>
                    <p className="text-sm text-blue-700/80 leading-relaxed">
                      Bulk import resumes via PDF, Word, or CSV. Our AI automatically extracts skills, experience, and contact details, standardizing them into your database instantly.
                    </p>
                  </div>
                  <div className="hidden md:flex gap-4">
                    <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                      <div className="text-3xl font-black text-blue-600">850+</div>
                      <div className="text-xs font-bold text-blue-600/70 uppercase tracking-wider mt-1">Sourced</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="screening" className="mt-0 outline-none">
              <Card className="border-purple-100 bg-purple-50/30 shadow-sm">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-purple-900">AI-Powered Screening</h3>
                    <p className="text-sm text-purple-700/80 leading-relaxed">
                      Instantly compare candidate profiles against job requirements. Get an AI-generated match score (0-100%) along with detailed reasoning to make faster, unbiased decisions.
                    </p>
                  </div>
                  <div className="hidden md:flex gap-4">
                    <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                      <div className="text-3xl font-black text-purple-600">68%</div>
                      <div className="text-xs font-bold text-purple-600/70 uppercase tracking-wider mt-1">Avg Match</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviewing" className="mt-0 outline-none">
              <Card className="border-orange-100 bg-orange-50/30 shadow-sm">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-orange-900">Interview Pipeline</h3>
                    <p className="text-sm text-orange-700/80 leading-relaxed">
                      Track candidates through the Kanban board. Schedule interviews, collect feedback from clients, and move candidates seamlessly across stages.
                    </p>
                  </div>
                  <div className="hidden md:flex gap-4">
                    <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                      <div className="text-3xl font-black text-orange-600">210</div>
                      <div className="text-xs font-bold text-orange-600/70 uppercase tracking-wider mt-1">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="placement" className="mt-0 outline-none">
              <Card className="border-green-100 bg-green-50/30 shadow-sm">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-green-900">Successful Placements</h3>
                    <p className="text-sm text-green-700/80 leading-relaxed">
                      Manage offers, track acceptances, and finalize placements. Monitor your conversion rates and time-to-fill metrics to optimize your recruitment strategy.
                    </p>
                  </div>
                  <div className="hidden md:flex gap-4">
                    <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-green-100">
                      <div className="text-3xl font-black text-green-600">18d</div>
                      <div className="text-xs font-bold text-green-600/70 uppercase tracking-wider mt-1">Time to Fill</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Candidate {i} was moved to Interview
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1 border-b pb-4 last:border-0">
                  <p className="text-sm font-medium">Software Engineer @ TechCorp</p>
                  <p className="text-xs text-muted-foreground">John Doe • 10:00 AM Today</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
