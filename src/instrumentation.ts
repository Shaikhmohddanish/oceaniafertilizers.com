import type { Instrumentation } from 'next';

/**
 * Server errors are written to the log as one JSON line each, which Vercel's
 * log view can search and filter. Visitors only ever see the generic error page.
 *
 * Request headers are never logged (they carry cookies), and the query string is
 * dropped from the path. Form contents are not part of the error and are not logged.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  const failure: Error & { digest?: string } = error instanceof Error ? error : new Error(String(error));
  console.error(
    JSON.stringify({
      level: 'error',
      event: 'request_error',
      name: failure.name,
      message: failure.message,
      digest: failure.digest,
      method: request.method,
      path: request.path.split('?')[0],
      routePath: context.routePath,
      routeType: context.routeType,
      renderSource: context.renderSource,
      revalidateReason: context.revalidateReason,
      stack: failure.stack?.split('\n').slice(0, 8).join('\n'),
    }),
  );
};
