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
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import Loader from "../custom ui/Loader";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }).max(20),
  description: z
    .string()
    .min(2, { message: "Description is required" })
    .max(500)
    .trim(),
  media: z
    .array(z.string())
    .min(1, { message: "At least one image is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  collections: z
    .array(z.string())
    .min(1, { message: "At least one collection is required" }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }),
  sizes: z
    .array(z.string())
    .min(1, { message: "At least one size is required" }),
  colors: z
    .array(z.string())
    .min(1, { message: "At least one color is required" }),
  price: z.coerce
    .number()
    .min(0.1, { message: "Price must be greater than 0.1" }),
  expense: z.coerce
    .number()
    .min(0.1, { message: "Expense must be greater than 0.1" }),
});

interface ProductFormProps {
  initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.log("[collections_GET]", err);
      toast.error("Something went wrong! Please try again.", {
        duration: 2000,
        style: {
          transition: "none",
        },
      });
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map(
            (collection) => collection._id
          ),
        }
      : {
          title: "",
          description: "",
          media: [],
          category: "",
          collections: [],
          tags: [],
          sizes: [],
          colors: [],
          price: 0.1,
          expense: 0.1,
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
      console.log("Submitting form with values:", values);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`, {
          duration: 2000,
          style: {
            transition: "none",
          },
        });
        window.location.href = "/products";
        router.push("/products");
      }
    } catch (err) {
      setLoading(false);
      console.log("[products_POST]", err);
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
          <p className="text-[30px] leading-[100%] font-[700] text-gray-900">
            Edit Product
          </p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-[30px] leading-[100%] font-[700] text-gray-900">
          Create Product
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
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage className="text-[#DC0000]" />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8 space-y-2 md:space-y-0">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Price (₱)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
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
              name="expense"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Expense (₱)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense"
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
              name="category"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category"
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-[#DC0000]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Colors"
                      value={field.value}
                      onChange={(color) =>
                        field.onChange([...field.value, color])
                      }
                      onRemove={(colorToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (color) => color !== colorToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-[#DC0000]" />
                </FormItem>
              )}
            />
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collections"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (collectionId) => collectionId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-[#DC0000]" />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Sizes"
                      value={field.value}
                      onChange={(size) =>
                        field.onChange([...field.value, size])
                      }
                      onRemove={(sizeToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (size) => size !== sizeToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-[#DC0000]" />
                </FormItem>
              )}
            />
          </div>
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
              onClick={() => router.push("/products")}
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

export default ProductForm;
