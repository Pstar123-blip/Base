import { useCallback, useEffect, useRef, useState } from 'react';

import { env } from '@/lib/env';
import {
  AUTH_POPUP_POLL_MS,
  AUTH_POPUP_REOPEN_MS,
  AUTH_POPUP_TIMEOUT_MS,
} from '@/shared/constants';

import { useAuthPopup } from './auth';
import { authService } from './services/auth-service';

type LoginMessage = {
  user?: { token?: string };
};

export const useLoginPopup = () => {
  const request = useAuthPopup((state) => state.request);
  const popup = useRef<Window | null>(null);
  const [status, setStatus] = useState<'waiting' | 'blocked' | 'exchanging'>(
    'waiting',
  );

  const openWindow = useCallback(() => {
    if (!request) return;

    if (popup.current && !popup.current.closed) {
      popup.current.focus();
      return;
    }

    popup.current = window.open(
      env.adfsLoginUrl,
      'adfs-sign-in',
      'popup,width=480,height=640',
    );
    setStatus(popup.current ? 'waiting' : 'blocked');
    popup.current?.focus();
  }, [request]);

  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    const { signal } = controller;
    const startedAt = Date.now();
    let nextOpenAt = startedAt + AUTH_POPUP_REOPEN_MS;
    let exchanging = false;

    const fail = (message: string) => {
      if (signal.aborted) return;
      controller.abort();
      request.fail(new Error(message));
    };

    const handleOnMessage = async (event: MessageEvent<LoginMessage>) => {
      if (
        signal.aborted ||
        exchanging ||
        !popup.current ||
        event.source !== popup.current
      )
        return;

      popup.current.close();
      const token = event.data?.user?.token;

      if (typeof token !== 'string' || !token.trim()) {
        fail('Sign-in failed');
        return;
      }

      exchanging = true;
      setStatus('exchanging');

      try {
        const applicationToken = await authService.createToken(token, signal);
        if (!signal.aborted) request.succeed(applicationToken);
      } catch {
        fail('Application token exchange failed');
      }
    };

    window.addEventListener('message', handleOnMessage);
    openWindow();
    // One timer handles timeout, a closed window, and automatic blocked-popup retries.
    const timer = window.setInterval(() => {
      if (Date.now() - startedAt >= AUTH_POPUP_TIMEOUT_MS) {
        fail('Sign-in timed out');
      } else if (!exchanging) {
        if (popup.current?.closed) fail('Sign-in window was closed');
        else if (!popup.current && Date.now() >= nextOpenAt) {
          openWindow();
          nextOpenAt = Date.now() + AUTH_POPUP_REOPEN_MS;
        }
      }
    }, AUTH_POPUP_POLL_MS);

    return () => {
      controller.abort();
      window.removeEventListener('message', handleOnMessage);
      window.clearInterval(timer);
      popup.current?.close();
      popup.current = null;
    };
  }, [request, openWindow]);

  return {
    isActive: !!request,
    blocked: status === 'blocked',
    busy: status === 'exchanging',
    openWindow,
  };
};
