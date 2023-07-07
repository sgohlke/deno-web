export interface ServerOptions {
   denoServeOptions: Deno.ServeOptions | Deno.ServeTlsOptions
   enableCORS?: boolean
}
