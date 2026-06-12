import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/news/:path*',
    '/admin/events/:path*',
    '/admin/applications/:path*',
    '/admin/gallery/:path*',
    '/admin/testimonials/:path*',
    '/admin/newsletter/:path*',
  ],
};
