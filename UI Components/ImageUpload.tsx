import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface Props {
  onImageSelect: (base64Image: string) => void;
  isLoading: boolean;
}

export function ImageUpload({ onImageSelect, isLoading }: Props) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPreviewUrl(null);
  };

  return (
    <Card
      className={`p-6 relative overflow-hidden transition-all duration-300 ${isDragging
        ? "border-primary border-2 bg-primary/5"
        : "bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-primary/20 hover:border-primary/40"
        } ${isLoading ? "opacity-75" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center gap-4">
        {previewUrl ? (
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!isLoading && (
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-primary animate-pulse-ring absolute inset-0" />
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-full bg-primary/10 p-4 transition-transform duration-300 transform group-hover:scale-110">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
        )}
        <div className="text-center">
          <h3 className="text-lg font-semibold bg-gradient-health text-transparent bg-clip-text">
            {isDragging ? "Drop Image Here" : "Upload Stool Image"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isDragging
              ? "Release to analyze"
              : "Upload or drag & drop a clear photo for accurate analysis"}
          </p>
        </div>
        <div className="mt-2">
          <Button
            disabled={isLoading}
            variant={previewUrl ? "secondary" : "default"}
            className="relative group overflow-hidden"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
            <Upload className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            {isLoading
              ? "Analyzing..."
              : previewUrl
                ? "Change Image"
                : "Select Image"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
