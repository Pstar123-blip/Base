import { useCallback } from 'react';
import { create } from 'zustand/react';

import { env } from '@/lib/env';
import {
  AUTH_POPUP_POLL_MS,
  AUTH_POPUP_REOPEN_MS,
  AUTH_POPUP_TIMEOUT_MS,
} from '@/shared/constants';

import { AuthCancelledError, type PopupRequest, useAuthPopup } from './auth';
import { authService } from './services/auth-service';

type LoginMessage = {
  user?: { token?: string };
};

type PopupStatus = 'idle' | 'waiting' | 'blocked' | 'exchanging';

const usePopupStatus = create<{ status: PopupStatus }>(() => ({
  status: 'idle',
}));

const adfsOrigin = new URL(env.adfsLoginUrl).origin;

let popup: Window | null = null;

let open = () => {};

const managePopup = (request: PopupRequest) => {
  const controller = new AbortController();
  const { signal } = controller;
  const startedAt = Date.now();
  let nextOpenAt = startedAt + AUTH_POPUP_REOPEN_MS;
  let exchanging = false;

  open = () => {
    if (popup && !popup.closed) {
      popup.focus();
      return;
    }

    popup = window.open(
      env.adfsLoginUrl,
      'adfs-sign-in',
      'popup,width=480,height=640',
    );
    usePopupStatus.setState({ status: popup ? 'waiting' : 'blocked' });
    popup?.focus();
  };

  const fail = (message: string, error = new Error(message)) => {
    if (signal.aborted) {
      return;
    }

    controller.abort();
    request.fail(error);
  };

  const handleOnMessage = async (event: MessageEvent<LoginMessage>) => {
    if (
      signal.aborted ||
      exchanging ||
      !popup ||
      event.source !== popup ||
      event.origin !== adfsOrigin
    ) {
      return;
    }

    popup.close();
    const token = event.data?.user?.token;

    if (typeof token !== 'string' || !token.trim()) {
      fail('Sign-in failed');
      return;
    }

    exchanging = true;
    usePopupStatus.setState({ status: 'exchanging' });

    try {
      const applicationToken = await authService.createToken(token, signal);

      if (!signal.aborted) {
        request.succeed(applicationToken);
      }
    } catch {
      fail('Application token exchange failed');
    }
  };

  window.addEventListener('message', handleOnMessage);
  open();
  // One timer handles timeout, a closed window, and automatic blocked-popup retries.
  const timer = window.setInterval(() => {
    if (Date.now() - startedAt >= AUTH_POPUP_TIMEOUT_MS) {
      fail('Sign-in timed out');
    } else if (!exchanging) {
      if (popup?.closed) {
        fail('Sign-in window was closed', new AuthCancelledError());
      } else if (!popup && Date.now() >= nextOpenAt) {
        open();
        nextOpenAt = Date.now() + AUTH_POPUP_REOPEN_MS;
      }
    }
  }, AUTH_POPUP_POLL_MS);

  return () => {
    controller.abort();
    window.removeEventListener('message', handleOnMessage);
    window.clearInterval(timer);
    popup?.close();
    popup = null;

    open = () => {};

    usePopupStatus.setState({ status: 'idle' });
  };
};

let stopManaging: (() => void) | null = null;

const syncWithRequest = (request: PopupRequest | null) => {
  stopManaging?.();
  stopManaging = request ? managePopup(request) : null;
};

useAuthPopup.subscribe((state) => {
  syncWithRequest(state.request);
});
syncWithRequest(useAuthPopup.getState().request);

export const useLoginPopup = () => {
  const isActive = useAuthPopup((state) => !!state.request);
  const status = usePopupStatus((state) => state.status);
  const openWindow = useCallback(() => {
    open();
  }, []);

  return {
    isActive,
    blocked: status === 'blocked',
    busy: status === 'exchanging',
    openWindow,
  };
};
