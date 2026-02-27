import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import supabase from '../helper/supabaseClient';
import './SensorStatus.css';

export default function SensorStatus({ selectedTank }) {
  const [fbgValues, setFbgValues] = useState([]);
  const [loading, setLoading]     = useState(false);

  // Concurrency control — prevents stale responses from overwriting state
  const reqIdRef = useRef(0);

  // Tracks which tank's data is currently settled (loaded and displayed)
  const settledTankRef = useRef(null);

  // Per-tank cache: { [tankId]: { values: number[], timestamp: string } }
  const cacheRef = useRef(new Map());

  // Must stay in sync with CSS variable --ss-dur-in
  const MIN_MASK_MS = 200;

  useEffect(() => {
    if (selectedTank === null) {
      // No tank selected: show empty state
      setFbgValues([]);
      setLoading(false);
      settledTankRef.current = null;
      return;
    }

    let isMounted = true;
    const myReqId = ++reqIdRef.current;

    // 1) If cached, show immediately without loading mask
    const cached     = cacheRef.current.get(selectedTank);
    const usedCache  = Boolean(cached);

    if (usedCache) {
      setFbgValues(cached.values);
      settledTankRef.current = selectedTank;
      setLoading(false);
    } else {
      // 2) First access: show brief loading mask to avoid flash
      setLoading(true);
    }

    const t0 = performance.now();

    async function loadFBG() {
      const { data, error } = await supabase
        .from('Lambdas')
        .select('lambda_medido, data')
        .eq('fk_tanque', selectedTank)
        .order('data', { ascending: false });

      if (!isMounted || myReqId !== reqIdRef.current) return;

      if (error || !data || data.length === 0) {
        console.error('Error loading sensor data:', error);
        setFbgValues([]);
      } else {
        // Keep only readings from the most recent timestamp
        const latestTimestamp = data[0].data;
        const latestReadings  = data.filter((r) => r.data === latestTimestamp);
        const newValues       = latestReadings.map((r) => r.lambda_medido);

        setFbgValues(newValues);
        cacheRef.current.set(selectedTank, { values: newValues, timestamp: latestTimestamp });
      }

      if (!usedCache) {
        // Respect minimum mask duration for a consistent fade transition
        const elapsed   = performance.now() - t0;
        const remaining = Math.max(0, MIN_MASK_MS - elapsed);

        const finalize = () => {
          if (!isMounted || myReqId !== reqIdRef.current) return;
          settledTankRef.current = selectedTank;
          setLoading(false);
        };

        if (remaining > 0) setTimeout(finalize, remaining);
        else finalize();
      } else {
        settledTankRef.current = selectedTank;
      }
    }

    loadFBG();
    return () => { isMounted = false; };
  }, [selectedTank]);

  // Metrics
  const totalSensors = fbgValues.length;
  const activeCount  = fbgValues.filter((v) => v !== 0).length;
  const failCount    = totalSensors - activeCount;
  const pctActive    = totalSensors > 0 ? Math.round((activeCount / totalSensors) * 100) : 0;

  // Traffic light status
  let trafficClass = 'traffic-red';
  if (pctActive === 100)      trafficClass = 'traffic-blue';
  else if (pctActive >= 90)   trafficClass = 'traffic-green';
  else if (pctActive >= 60)   trafficClass = 'traffic-yellow';

  // Visual state flags
  const noTankSelected = selectedTank === null;
  const isMasked       = selectedTank !== null && settledTankRef.current !== selectedTank;
  const showTraffic    = !noTankSelected && !isMasked;
  const NBSP           = '\u00A0';

  return (
    <div className={`sensor-status-container ${(loading || isMasked) ? 'is-loading' : ''}`}>
      <div className="sensor-status-item">
        <div className="label">Active</div>
        <div className="value">
          {noTankSelected ? '-' : (isMasked ? NBSP : activeCount)}
        </div>
      </div>

      <div className="sensor-status-separator" />

      <div className="sensor-status-item">
        <div className="label">Failures</div>
        <div className="value">
          {noTankSelected ? '-' : (isMasked ? NBSP : failCount)}
        </div>
      </div>

      <div className="sensor-status-separator" />

      <div className={`sensor-status-item ${showTraffic ? trafficClass : ''}`}>
        <div className="label">System status</div>
        <div className="value">
          {noTankSelected ? '-' : (isMasked ? NBSP : `${pctActive}%`)}
        </div>
      </div>
    </div>
  );
}

SensorStatus.propTypes = {
  selectedTank: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
};
