// we dont need to use buttons to show translations, here we automate it
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { translateApi } from "@/lib";

export const useTranslate = () => {
  const ueryClient = useQueryClient();
  const queryKey = ["translate"];
  const translateQuery = useQuery({
    queryKey,
    queryFn: () => {
      console.log("translate query fn");
      return translateApi.getUsersTranslations();
    },
  });
  return {
    translations: !translateQuery.data ? [] : translateQuery.data,
    isLoading: translateQuery.status === "pending",
  };
};
