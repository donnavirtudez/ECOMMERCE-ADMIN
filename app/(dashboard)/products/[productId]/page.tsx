"use client";

import Loader from "@/components/custom ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

const ProductDetails = () => {
  const params = useParams();
  const productId = params?.productId as string;

  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  const getProductDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "GET",
      });
      const data = await res.json();
      setProductDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[productId_GET]", err);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) getProductDetails();
  }, [productId, getProductDetails]);

  return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
};

export default ProductDetails;
