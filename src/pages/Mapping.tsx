import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Network, Users, GraduationCap, Briefcase, Globe, Wrench, UserCircle } from 'lucide-react';
import { useData } from '@/src/contexts/DataContext';
import { Candidate, Pathway } from '@/src/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const PATHWAYS = [
  { id: 'Unmapped', title: 'Harmonization Pool', description: 'Assessed candidates ready to be mapped', icon: Users, color: 'bg-slate-100 text-slate-800 border-slate-200' },
  { id: 'Skill Development', title: 'Skill Development', description: 'Needs technical/practical enhancement', icon: Wrench, color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'Academics Mapping', title: 'Academics Mapping', description: 'Suitable for formal education/UG/PG', icon: GraduationCap, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Recruitment', title: 'Recruitment', description: 'Job-ready for immediate employment', icon: Briefcase, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'Global Mobility', title: 'Global Mobility', description: 'Eligible for international opportunities', icon: Globe, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'EDP (Entrepreneurship)', title: 'EDP', description: 'Self-employment / business setup', icon: Network, color: 'bg-teal-50 text-teal-700 border-teal-200' }
] as const;

export default function Mapping() {
  const { candidates, updateCandidate } = useData();

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    await updateCandidate(draggableId, { pathway: destination.droppableId as Pathway });
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Output Mapping</h1>
        <p className="text-muted-foreground">Map assessed candidates to their best-fit career pathways.</p>
      </div>

      {/* CEO Dashboard Snapshot / Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {PATHWAYS.map(pathway => {
          const count = candidates.filter(c => (c.pathway || 'Unmapped') === pathway.id).length;
          const percentage = candidates.length > 0 ? Math.round((count / candidates.length) * 100) : 0;
          
          return (
            <Card key={pathway.id} className={`${pathway.color} border shadow-none`}>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <pathway.icon className="w-8 h-8 opacity-75" />
                <div className="text-2xl font-bold">{percentage}%</div>
                <div className="text-xs font-semibold">{pathway.title}</div>
                <div className="text-[10px] opacity-70">{count} candidates</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-max items-start">
            {PATHWAYS.map(pathway => {
              const columnCandidates = candidates.filter(c => (c.pathway || 'Unmapped') === pathway.id);
              
              return (
                <div key={pathway.id} className="w-[300px] flex flex-col h-full bg-slate-50/50 rounded-xl border">
                  <div className={`p-3 border-b rounded-t-xl ${pathway.color}`}>
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <pathway.icon className="w-4 h-4" />
                        {pathway.title}
                      </div>
                      <Badge variant="secondary" className="bg-white/50">{columnCandidates.length}</Badge>
                    </div>
                    <p className="text-[10px] mt-1 opacity-80">{pathway.description}</p>
                  </div>
                  
                  <Droppable droppableId={pathway.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 p-2 overflow-y-auto space-y-2 transition-colors ${
                          snapshot.isDraggingOver ? 'bg-slate-100/80' : ''
                        }`}
                      >
                        {columnCandidates.map((candidate, index) => (
                          <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <Card className={`shadow-sm transition-shadow cursor-grab active:cursor-grabbing hover:shadow-md ${snapshot.isDragging ? 'opacity-80 shadow-md ring-2 ring-primary/20' : ''}`}>
                                  <CardContent className="p-3 space-y-2">
                                    <div className="flex items-start gap-2">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <UserCircle className="w-5 h-5 text-slate-500" />
                                      </div>
                                      <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-sm font-semibold truncate">{candidate.name}</span>
                                        <span className="text-[10px] text-muted-foreground truncate">{candidate.email}</span>
                                      </div>
                                    </div>
                                    <div className="text-[10px] flex items-center justify-between mt-2 pt-2 border-t">
                                      <span className="font-medium">{candidate.experience} yrs exp</span>
                                      <span className="text-muted-foreground truncate max-w-[100px]">{candidate.location}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {candidate.skills?.slice(0, 3).map(skill => (
                                        <Badge key={skill} variant="secondary" className="text-[9px] px-1 py-0 rounded-sm font-normal">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
