import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { useUserStore } from "@/stores/useUserStore";

export const useSocket = () => {
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    socket.connect();

    socket.on("moment:created", ({ visibility_type }: { visibility_type: string }) => {
      if (visibility_type === "nearby") {
        queryClient.invalidateQueries({ queryKey: ["nearby-moments"] });
      } else if (visibility_type === "circle") {
        queryClient.invalidateQueries({ queryKey: ["moment-attendee"] });
      }
    });

    socket.on("invite:moment", () => {
      queryClient.invalidateQueries({ queryKey: ["invite-moment-view"] });
    });

    socket.on("invite:circle", () => {
      queryClient.invalidateQueries({ queryKey: ["invite-circle-view"] });
    });

    socket.on("invite:decision", ({ target }: { target: string; status: string }) => {
      queryClient.invalidateQueries({ queryKey: ["invite-owner-view"] });
      queryClient.invalidateQueries({ queryKey: ["invite-owner-view-moment"] });
      if (target === "circle" || target === "moment") {
        queryClient.invalidateQueries({ queryKey: ["moment-attendee"] });
      }
    });

    return () => {
      socket.off("moment:created");
      socket.off("invite:moment");
      socket.off("invite:circle");
      socket.off("invite:decision");
      socket.disconnect();
    };
  }, [user?.id, queryClient]);

  const joinMoment = useCallback(
    (momentId: string) => {
      socket.emit("join:moment", momentId);

      socket.on("checkin:update", () => {
        queryClient.invalidateQueries({ queryKey: ["moment-attendees-with-details", momentId] });
      });

      socket.on("photo:new", (photo) => {
        queryClient.setQueryData(["moment-photos", momentId], (old: { data: { data: unknown[] } } | undefined) =>
          old ? { ...old, data: { data: [...(old.data?.data ?? []), photo] } } : old
        );
      });

      socket.on("photo:deleted", ({ photo_id }: { photo_id: string }) => {
        queryClient.setQueryData(["moment-photos", momentId], (old: { data: { data: { id: string }[] } } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: { data: old.data?.data?.filter((p) => p.id !== photo_id) ?? [] },
          };
        });
      });

      socket.on("moment:updated", (updated) => {
        queryClient.setQueryData(["moment", momentId], updated);
        queryClient.invalidateQueries({ queryKey: ["moment-owner"] });
        queryClient.invalidateQueries({ queryKey: ["nearby-moments"] });
      });

      socket.on("recap:ready", ({ recap }: { recap: string }) => {
        queryClient.setQueryData(["recap", momentId], recap);
      });
    },
    [queryClient]
  );

  const leaveMoment = useCallback((momentId: string) => {
    socket.emit("leave:moment", momentId);
    socket.off("checkin:update");
    socket.off("photo:new");
    socket.off("photo:deleted");
    socket.off("moment:updated");
    socket.off("recap:ready");
  }, []);

  return { joinMoment, leaveMoment };
};
