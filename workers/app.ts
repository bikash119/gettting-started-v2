import { createRequestHandler } from "react-router";
import { createClient } from '@supabase/supabase-js';

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    const { data, error } = await supabase.from("sales_deals").select('*');
    ctx.props.data = data
    ctx.props.error = error
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
