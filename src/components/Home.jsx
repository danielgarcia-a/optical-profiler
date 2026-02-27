import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../helper/supabaseClient';
import SensorStatus from './SensorStatus';
import Graphic from './Graphic';
import Tank from './Tank';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Tank selection
  const [selectedTank, setSelectedTank]           = useState(null);
  const [allTanks, setAllTanks]                   = useState([]);
  const [numSamples, setNumSamples]               = useState(390);

  // Selected tank configuration
  const [tankHeight, setTankHeight]               = useState(100);
  const [operationalCapacity, setOperationalCapacity] = useState(0);

  // Chart data series
  const [oilValues, setOilValues]     = useState([]);
  const [waterValues, setWaterValues] = useState([]);
  const [timeValues, setTimeValues]   = useState([]);

  // Current levels for Tank component [oil, water]
  const [levels, setLevels] = useState([0, 0]);

  // Load tank list on mount
  useEffect(() => {
    supabase
      .from('Tanque')
      .select('pk_tanque, nome_tanque')
      .order('nome_tanque', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('Error loading tanks:', error);
        else setAllTanks(data ?? []);
      });
  }, []);

  // Load tank data and start polling when a tank is selected
  useEffect(() => {
    if (selectedTank === null) return;

    const fetchData = async () => {
      // 1) Fetch tank configuration
      const { data: tankData, error: tankError } = await supabase
        .from('Tanque')
        .select('altura_tanque, capacidade_operacional')
        .eq('pk_tanque', selectedTank)
        .single();

      if (tankError) {
        console.error('Error fetching tank configuration:', tankError);
        return;
      }

      setTankHeight(tankData?.altura_tanque ?? 100);
      setOperationalCapacity(tankData?.capacidade_operacional ?? 0);

      // 2) Fetch the most recent level readings
      const { data, error } = await supabase
        .from('Niveis')
        .select('nivel_agua, nivel_oleo, data')
        .eq('fk_tanque', selectedTank)
        .order('data', { ascending: false })
        .limit(numSamples);

      if (error) {
        console.error('Error reading levels:', error);
        return;
      }

      // Chart data in chronological order (oldest → newest)
      const sorted = [...data].reverse();
      setTimeValues(sorted.map((r) => r.data));
      setOilValues(sorted.map((r) => r.nivel_oleo));
      setWaterValues(sorted.map((r) => r.nivel_agua));

      // Current level: most recent record (data[0] since ordered desc)
      const latest = data[0] ?? { nivel_agua: 0, nivel_oleo: 0 };

      // levels[0] = oil, levels[1] = water — matches Tank.jsx reading order
      setLevels([latest.nivel_oleo, latest.nivel_agua]);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedTank, numSamples]);

  // Convert absolute values to percentage relative to tank height
  const normalizedLevels = levels.map((v) =>
    tankHeight > 0 ? (v / tankHeight) * 100 : 0
  );

  const handleNumSamplesChange = (e) => {
    const value = Number(e.target.value);
    if (Number.isFinite(value) && value >= 1) {
      setNumSamples(value);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="container-home">
      <header className="header">
        <div className="search-container">
          <select
            value={selectedTank === null ? '' : selectedTank}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedTank(value === '' ? null : Number(value));
            }}
          >
            <option value="">Select a tank</option>
            {allTanks.map(({ pk_tanque, nome_tanque }) => (
              <option key={pk_tanque} value={pk_tanque}>
                {nome_tanque}
              </option>
            ))}
          </select>
        </div>

        <div className="nav-buttons">
          <button onClick={handleLogout}>Exit</button>
        </div>
      </header>

      <main className="grap-tank-grid">
        {/* Left column: sensors + chart */}
        <div className="left-col">
          <h2 className="col-title">Sensors</h2>
          <SensorStatus selectedTank={selectedTank} />

          <div className="graphic-wrapper">
            <Graphic
              xValues={timeValues}
              oilValues={oilValues}
              waterValues={waterValues}
            />
          </div>

          <div className="samples-control">
            <label htmlFor="numSamples">Samples:</label>
            {selectedTank !== null ? (
              <input
                id="numSamples"
                type="number"
                value={numSamples}
                min={1}
                onChange={handleNumSamplesChange}
              />
            ) : (
              <span>—</span>
            )}
          </div>
        </div>

        {/* Right column: tank */}
        <div className="right-col">
          <h2 className="col-title">Water & Oil Levels</h2>
          <Tank
            levels={normalizedLevels}
            operationalCapacity={operationalCapacity}
            totalHeight={tankHeight}
          />
        </div>
      </main>

      <footer id="footer">Optical Profiler</footer>
    </div>
  );
};

export default Home;
