import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface MoodboardState {
  id: string | null;
  name: string;
  canvasData: Json;
  isLoading: boolean;
  isSaving: boolean;
}

export function useMoodboard() {
  const [state, setState] = useState<MoodboardState>({
    id: null,
    name: "Untitled Moodboard",
    canvasData: {} as Json,
    isLoading: true,
    isSaving: false,
  });

  const sessionIdRef = useRef<string | null>(null);
  const isLocalModeRef = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const getLocalStorageKey = useCallback((sessionId: string) => `moodboard_local_state_${sessionId}`, []);

  const getSessionId = useCallback(() => {
    if (sessionIdRef.current) return sessionIdRef.current;
    
    let sessionId = localStorage.getItem("moodboard_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("moodboard_session_id", sessionId);
    }
    sessionIdRef.current = sessionId;
    return sessionId;
  }, []);

  const loadMoodboard = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = getSessionId();

      if (!user) {
        isLocalModeRef.current = true;
        const fallbackKey = getLocalStorageKey(sessionId);
        const raw = localStorage.getItem(fallbackKey);
        let parsedName = "Untitled Moodboard";
        let parsedCanvasData = {} as Json;

        if (raw) {
          try {
            const parsed = JSON.parse(raw) as { name?: string; canvasData?: Json };
            if (typeof parsed.name === "string" && parsed.name.trim()) {
              parsedName = parsed.name;
            }
            if (parsed.canvasData && typeof parsed.canvasData === "object") {
              parsedCanvasData = parsed.canvasData;
            }
          } catch {
            // Ignore malformed local state and use defaults
          }
        }

        setState({
          id: `local-${sessionId}`,
          name: parsedName,
          canvasData: parsedCanvasData,
          isLoading: false,
          isSaving: false,
        });

        return parsedCanvasData;
      }

      isLocalModeRef.current = false;
      
      let query = supabase
        .from("moodboards")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1);
      
      query = query.eq("user_id", user.id);
      
      const { data: existingMoodboard, error } = await query.single();
      
      if (existingMoodboard && !error) {
        setState({
          id: existingMoodboard.id,
          name: existingMoodboard.name,
          canvasData: existingMoodboard.canvas_data ?? ({} as Json),
          isLoading: false,
          isSaving: false,
        });
        return existingMoodboard.canvas_data;
      }
      
      const newMoodboard = {
        name: "Untitled Moodboard",
        canvas_data: {} as Json,
        user_id: user.id,
      };
      
      const { data: created, error: createError } = await supabase
        .from("moodboards")
        .insert(newMoodboard)
        .select()
        .single();
      
      if (createError) {
        console.error("Error creating moodboard:", createError);
        throw createError;
      }
      
      setState({
        id: created.id,
        name: created.name,
        canvasData: {} as Json,
        isLoading: false,
        isSaving: false,
      });
      
      return {} as Json;
    } catch (error) {
      console.error("Error loading moodboard:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return {} as Json;
    }
  }, [getLocalStorageKey, getSessionId]);

  const saveMoodboard = useCallback((canvasData: Json) => {
    if (!state.id) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      setState(prev => ({ ...prev, isSaving: true }));

      try {
        if (isLocalModeRef.current) {
          const sessionId = getSessionId();
          const localKey = getLocalStorageKey(sessionId);
          localStorage.setItem(localKey, JSON.stringify({
            name: state.name,
            canvasData,
          }));
        } else {
          const { error } = await supabase
            .from("moodboards")
            .update({
              canvas_data: canvasData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", state.id);

          if (error) throw error;
        }

        setState(prev => ({ ...prev, canvasData, isSaving: false }));
      } catch (error) {
        console.error("Error saving moodboard:", error);
        toast.error("Failed to save moodboard");
        setState(prev => ({ ...prev, isSaving: false }));
      }
    }, 1000);
  }, [getLocalStorageKey, getSessionId, state.id, state.name]);

  const updateName = useCallback(async (name: string) => {
    if (!state.id) return;
    
    try {
      if (isLocalModeRef.current) {
        const sessionId = getSessionId();
        const localKey = getLocalStorageKey(sessionId);
        localStorage.setItem(localKey, JSON.stringify({
          name,
          canvasData: state.canvasData,
        }));
      } else {
        const { error } = await supabase
          .from("moodboards")
          .update({ name })
          .eq("id", state.id);

        if (error) throw error;
      }

      setState(prev => ({ ...prev, name }));
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name");
    }
  }, [getLocalStorageKey, getSessionId, state.canvasData, state.id]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    loadMoodboard,
    saveMoodboard,
    updateName,
  };
}
