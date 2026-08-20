import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionState =
  | 'connected'
  | 'connecting'
  | 'disconnected'

export function useSse<T = unknown>(url: string, enabled: boolean) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    enabled ? 'connecting' : 'disconnected',
  );
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(function connectImpl() {
    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;


      eventSource.onopen = () => {
        setConnectionState('connected');
        setError(null);
      };

      eventSource.onmessage = (event: MessageEvent<string>) => {
        try {
          setData(JSON.parse(event.data) as T);
        } catch {
          setError('Erro parsing event to json');
        }
      };

      eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        setConnectionState('disconnected');

        if (eventSource.readyState === eventSource.CLOSED) {
          setError('Connection lost');
          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionState('connecting');
            connectImpl();
          }, 3000);
        }
      };

    } catch (err) {
      console.error('Error creating SSE connection:', err);
      setError('Connection creation error');
      setConnectionState('disconnected');
    };
  }, [url]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setConnectionState('disconnected');
  }, []);

  useEffect(() => {
    if (!enabled) {
      disconnect();
      return;
    }

    setConnectionState('connecting');
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled]);


  return { data, error, connectionState, connect, disconnect};
};
