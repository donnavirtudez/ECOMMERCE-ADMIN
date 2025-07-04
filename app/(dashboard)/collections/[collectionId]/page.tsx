"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import Loader from "@/components/custom ui/Loader";
import CollectionForm from "@/components/collections/CollectionForm";

const CollectionDetails = () => {
  const params = useParams();
  const collectionId = params?.collectionId as string;

  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);

  const getCollectionDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "GET",
      });
      const data = await res.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[collectionId_GET]", err);
    }
  }, [collectionId]);

  useEffect(() => {
    if (collectionId) {
      getCollectionDetails();
    }
  }, [collectionId, getCollectionDetails]);

  return loading ? (
    <Loader />
  ) : (
    <CollectionForm initialData={collectionDetails} />
  );
};

export default CollectionDetails;
