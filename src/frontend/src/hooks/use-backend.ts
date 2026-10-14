import { createActor } from "@/backend";
import type {
  IngredientUpdate,
  MenuItemUpdate,
  NewMenuItem,
  NewOrder,
  NewPromotion,
  OrderFilter,
  SettingsUpdate,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Shared query keys so mutations can invalidate the right caches. */
export const queryKeys = {
  orders: (filter?: OrderFilter) => ["orders", filter ?? {}] as const,
  queueSummary: ["queueSummary"] as const,
  deliverySummary: ["deliverySummary"] as const,
  riders: ["riders"] as const,
  promotions: ["promotions"] as const,
  advanceSlots: ["advanceSlots"] as const,
  menuItems: ["menuItems"] as const,
  ingredients: ["ingredients"] as const,
  salesReport: (period: string) => ["salesReport", period] as const,
  kpiSummary: ["kpiSummary"] as const,
  settings: ["settings"] as const,
  packageInfo: ["packageInfo"] as const,
  recommendation: ["recommendation"] as const,
};

/* ------------------------------- Queries ------------------------------- */

export function useOrders(filter: OrderFilter = {}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.orders(filter),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listOrders(filter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useQueueSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.queueSummary,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQueueSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeliverySummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.deliverySummary,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDeliverySummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRiders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.riders,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRiders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePromotions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.promotions,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPromotions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdvanceSlots() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.advanceSlots,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAdvanceSlots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMenuItems() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.menuItems,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIngredients() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.ingredients,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listIngredients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSalesReport(period: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.salesReport(period),
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSalesReport(period);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useKpiSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.kpiSummary,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getKpiSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePackageInfo() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.packageInfo,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPackageInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecommendation() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.recommendation,
    queryFn: async () => {
      if (!actor) return null;
      return actor.refreshRecommendation();
    },
    enabled: !!actor && !isFetching,
  });
}

/* ------------------------------ Mutations ------------------------------ */

export function useCreateOrder() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewOrder) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createOrder(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.queueSummary });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.deliverySummary,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.kpiSummary });
    },
  });
}

export function useAdvanceOrderStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.advanceOrderStatus(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.queueSummary });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.deliverySummary,
      });
    },
  });
}

export function useCreatePromotion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewPromotion) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createPromotion(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.promotions });
    },
  });
}

export function useCreateMenuItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewMenuItem) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createMenuItem(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: MenuItemUpdate }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateMenuItem(id, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.menuItems });
    },
  });
}

export function useUpdateIngredient() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: IngredientUpdate }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateIngredient(id, input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.ingredients });
    },
  });
}

export function useUpdateSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SettingsUpdate) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateSettings(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

export function useRefreshRecommendation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.refreshRecommendation();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.recommendation, data);
    },
  });
}
