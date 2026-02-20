import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const SUPABASE_FUNCTIONS_BASE_URL = `${SUPABASE_URL}/functions/v1`;

export const FUNCTION_ENDPOINTS = {
  chat: `${SUPABASE_FUNCTIONS_BASE_URL}/chat`,
  saveChatInquiry: `${SUPABASE_FUNCTIONS_BASE_URL}/save-chat-inquiry`,
  savePopupResponse: `${SUPABASE_FUNCTIONS_BASE_URL}/save-popup-response`,
  imageProxy: `${SUPABASE_FUNCTIONS_BASE_URL}/image-proxy`,
} as const;

export async function getFunctionAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token || SUPABASE_PUBLISHABLE_KEY;

  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${token}`,
  };
}
