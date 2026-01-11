"use client";

import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FileDropzoneProps {
  onFileLoad: (data: Uint8Array, fileName: string) => void;
  accept?: string;
}

export function FileDropzone({
  onFileLoad,
  accept = ".sav,.dat",
}: FileDropzoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [onFileLoad],
  );

  const handleFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    onFileLoad(data, file.name);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    };
    input.click();
  };

  return (
    <Card
      className="border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">📁</div>
        <p className="text-lg font-medium mb-2">Drop your save file here</p>
        <p className="text-sm text-muted-foreground">or click to browse</p>
        <p className="text-xs text-muted-foreground mt-2">
          Supports: .sav, .dat (Gen 1-3)
        </p>
      </CardContent>
    </Card>
  );
}
