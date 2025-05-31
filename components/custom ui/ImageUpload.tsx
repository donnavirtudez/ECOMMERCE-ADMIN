import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (result: any) => {
    onChange(result.info.secure_url);
    setIsUploading(false);
  };

  const handleUploadError = (error: any) => {
    console.error("Upload failed:", error);
    setIsUploading(false);
  };

  const handleOpenUpload = (open: Function) => {
    if (isUploading) return;

    open();
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                size="sm"
                className="cursor-pointer bg-[#DC0000] text-[#FFFFFF]"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="myupload123"
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      >
        {({ open }) => {
          return (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleOpenUpload(open);
              }}
              className="cursor-pointer bg-[#4E71FF] text-[#FFFFFF]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
