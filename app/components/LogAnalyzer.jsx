"use client";

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from 'lucide-react';
import _ from 'lodash';

// Sortable column header component
const SortableColumnHeader = ({ id, children, onSort, sortConfig }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    position: 'relative',
    userSelect: 'none',
  };

  const handleClick = (e) => {
    // Only trigger sort if we're clicking the sort button
    if (e.target.closest('.sort-button')) {
      onSort(id);
    }
  };

  return (
    <TableHead 
      ref={setNodeRef} 
      style={style}
      {...attributes} 
      {...listeners}
      className="font-bold relative whitespace-nowrap"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{children}</span>
        <button className="sort-button p-1 hover:bg-gray-100 rounded">
          <ArrowUpDown className="h-4 w-4" />
          {sortConfig.key === id && (
            <span className="ml-1">
              {sortConfig.direction === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </button>
      </div>
    </TableHead>
  );
};

const LogAnalyzer = () => {
  const [logInput, setLogInput] = useState('');
  const [logData, setLogData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const parseLogData = (logText) => {
    const lines = logText.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parsed = {};
      
      // Extract timestamp
      const timeMatch = line.match(/time="([^"]+)"/);
      if (timeMatch) parsed.timestamp = timeMatch[1];

      // Extract level
      const levelMatch = line.match(/level=(\w+)/);
      if (levelMatch) parsed.level = levelMatch[1];

      // Extract message
      const msgMatch = line.match(/msg="([^"]+)"|msg=([^ ]+)/);
      if (msgMatch) parsed.message = msgMatch[1] || msgMatch[2];

      // Extract user
      const userMatch = line.match(/user=([^ ]+)/);
      if (userMatch) parsed.user = userMatch[1];

      // Extract request_id
      const requestMatch = line.match(/request_id=([^ ]+)/);
      if (requestMatch) parsed.request_id = requestMatch[1];

      // Extract method
      const methodMatch = line.match(/method=(\w+)/);
      if (methodMatch) parsed.method = methodMatch[1];

      // Extract path
      const pathMatch = line.match(/path=([^ ]+)/);
      if (pathMatch) parsed.path = pathMatch[1];

      // Extract status
      const statusMatch = line.match(/status=(\d+)/);
      if (statusMatch) parsed.status = statusMatch[1];

      // Extract duration
      const durationMatch = line.match(/duration=([^ ]+)/);
      if (durationMatch) parsed.duration = durationMatch[1];

      // Extract API
      const apiMatch = line.match(/api=([^ ]+)/);
      if (apiMatch) parsed.api = apiMatch[1];

      // Extract size
      const sizeMatch = line.match(/size=(\d+)/);
      if (sizeMatch) parsed.size = sizeMatch[1];

      // Extract human_size
      const humanSizeMatch = line.match(/human_size="([^"]+)"/);
      if (humanSizeMatch) parsed.human_size = humanSizeMatch[1];

      // Extract params
      const paramsMatch = line.match(/params=({[^}]+})/);
      if (paramsMatch) {
        try {
          parsed.params = JSON.parse(paramsMatch[1]);
        } catch (e) {
          parsed.params = paramsMatch[1];
        }
      }

      return parsed;
    });
  };

  const handleLogInput = (event) => {
    setLogInput(event.target.value);
  };

  const handleParseClick = () => {
    const parsedData = parseLogData(logInput);
    setLogData(parsedData);
    setFilteredData(parsedData);
    if (parsedData.length > 0) {
      setColumns(Object.keys(parsedData[0]));
    }
  };

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
    
    const sorted = _.orderBy(filteredData, [column], [direction]);
    setFilteredData(sorted);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = logData.filter(row =>
      Object.values(row).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Log Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea 
            placeholder="Paste your logs here..." 
            className="min-h-[200px] font-mono text-sm"
            value={logInput}
            onChange={handleLogInput}
          />
          <Button 
            onClick={handleParseClick}
            className="w-full"
          >
            Parse Logs
          </Button>
        </div>

        {logData.length > 0 && (
          <>
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>

            <div className="overflow-x-auto">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableContext 
                        items={columns}
                        strategy={horizontalListSortingStrategy}
                      >
                        {columns.map((column) => (
                          <SortableColumnHeader 
                            key={column} 
                            id={column}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                          >
                            {column}
                          </SortableColumnHeader>
                        ))}
                      </SortableContext>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((column) => (
                          <TableCell key={column}>
                            {typeof row[column] === 'object' 
                              ? JSON.stringify(row[column]) 
                              : row[column] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LogAnalyzer;