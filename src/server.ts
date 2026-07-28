import app from './index.js';
import { CloudflareEnv } from './types/index.js';

export default {
  fetch: async (request: Request, env: CloudflareEnv, ctx: ExecutionContext) => {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const body = request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

    let responseStatus = 200;
    let responseHeaders = new Map<string, string>();
    let responseBody = '';

    const mockReq = {
      method: request.method,
      url: path,
      path,
      headers,
      body: body ? JSON.parse(body) : undefined,
      env,
      query: Object.fromEntries(url.searchParams)
    } as any;

    const mockRes = {
      status: (code: number) => {
        responseStatus = code;
        return mockRes;
      },
      json: (data: any) => {
        responseHeaders.set('Content-Type', 'application/json');
        responseBody = JSON.stringify(data);
        return mockRes;
      },
      setHeader: (key: string, value: string) => {
        responseHeaders.set(key, value);
      }
    } as any;

    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/registrations') && request.method === 'POST') {
      const { RegistrationController } = await import('./controllers/registrationController.js');
      await RegistrationController.register(mockReq, mockRes);
      return new Response(responseBody, {
        status: responseStatus,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (path.startsWith('/api/list') && request.method === 'GET') {
      const { RegistrationController } = await import('./controllers/registrationController.js');
      await RegistrationController.list(mockReq, mockRes);
      return new Response(responseBody, {
        status: responseStatus,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};