import healthService from '../../services/health.service';
import styles from './ApiHealth.module.css';
import { useSse, type ConnectionState } from '@/shared/hooks/useSse';

const LABEL: Record<ConnectionState, string> = {
  connecting: 'API checking',
  connected: 'API ok',
  disconnected: 'API error',
};

export default function HealthCheck() {
  const { connectionState } = useSse<{ status: string }>(
    healthService.getLiveUrl(),
    true,
  );

  return (
    <div className={`${styles.pill} ${styles[connectionState]}`}>
      {LABEL[connectionState]}
    </div>
  );
}
