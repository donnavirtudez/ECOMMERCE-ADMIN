"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title is required" })
    .max(20, { message: "Title must be at most 20 characters long" }),
  description: z
    .string()
    .min(2, { message: "Description is required" })
    .max(500, { message: "Description must be at most 500 characters long" })
    .trim(),
  image: z.string().min(1, { message: "Image is required" }),
});

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/collections/${initialData._id}`
        : "/api/collections";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Collection ${initialData ? "updated" : "created"}`, {
          duration: 2000,
          style: {
            transition: "none",
          },
        });
        window.location.href = "/collections";
        router.push("/collections");
      }
    } catch (err) {
      console.log("[collections_POST]", err);
      toast.error("Something went wrong! Please try again.", {
        duration: 2000,
        style: {
          transition: "none",
        },
      });
    }
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-[30px] leading-[100%] font-[700] text-[#616161]">
            Edit Collection
          </p>
          <Delete id={initialData._id} item="collection" />
        </div>
      ) : (
        <p className="text-[30px] leading-[100%] font-[700] text-[#616161]">
          Create Collection
        </p>
      )}
      <Separator className="bg-[#616161] mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                    className="focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
                  />
                </FormControl>
                <FormMessage className="text-[#DC0000]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="h-32 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-[#DC0000]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage className="text-[#DC0000]" />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-[#616161] text-[#FFFFFF]"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/collections")}
              className="cursor-pointer bg-[#DC0000] text-[#FFFFFF]"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
