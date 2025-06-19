"use client";

import { Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface DeleteProps {
  item: string;
  id: string;
}

const Delete: React.FC<DeleteProps> = ({ item, id }) => {
  const onDelete = async () => {
    try {
      const itemType = item === "product" ? "products" : "collections";
      const res = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        window.location.href = `/${itemType}`;
        toast.success("Deleted successfully", {
          duration: 2000,
          style: {
            transition: "none",
          },
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong! Please try again.", {
        duration: 2000,
        style: {
          transition: "none",
        },
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer bg-[#DC0000] text-[#FFFFFF]">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#FFFFFF] text-black border-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-[#DC0000] text-[#FFFFFF]"
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
