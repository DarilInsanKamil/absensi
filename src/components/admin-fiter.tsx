"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface FilterProps {
  classList: string[];
  onFilterChange: (filters: { startDate: Date | undefined; endDate: Date | undefined; kelas: string | null }) => void;
}

export function AdminFilter({ classList, onFilterChange }: FilterProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedClass, setSelectedClass] = useState<string>("");

  const handleApplyFilter = () => {
    onFilterChange({
      startDate,
      endDate,
      kelas: selectedClass === "all" ? null : selectedClass,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="noShadow"
              className={cn(
                "justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd MMM yyyy") : "Tanggal Mulai"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="noShadow"
              className={cn(
                "justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd MMM yyyy") : "Tanggal Akhir"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
          </PopoverContent>
        </Popover>
      </div>

     <Select value={selectedClass} onValueChange={setSelectedClass}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Pilih Kelas" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {classList.map((kelas) => (
              <SelectItem key={kelas} value={kelas}>
                {kelas}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button onClick={handleApplyFilter}>Terapkan Filter</Button>
    </div>
  );
}
