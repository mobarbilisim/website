import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Güncellenen çerezleri isteklere uyguluyoruz
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          
          supabaseResponse = NextResponse.next({
            request,
          });

          // Güncellenen çerezleri yanıt nesnesine de uyguluyoruz
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Oturum açmış bir kullanıcı var mı kontrol et
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin') && !isAuthPage;

  // Sadece admin sayfaları için koruma: Kullanıcı yoksa login'e at
  if (isAdminPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Eğer kullanıcı zaten giriş yapmışsa ve login sayfasına girmeye çalışıyorsa admin anasayfaya yönlendir
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return supabaseResponse;
}

// Hangi yollarda bu middleware'in çalışacağını belirliyoruz
export const config = {
  matcher: [
    // Next.js statik dosyalarını ve resimleri es geç
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
