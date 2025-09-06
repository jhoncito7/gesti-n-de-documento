import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FF6384', '#36A2EB', '#FFCE56'];

function Estadistica() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/lista')
      .then(res => setData(res.data));
  }, []);

  if (!data || data.length === 0) return <div className="estadistica-cargando">Cargando estadísticas...</div>;

  // Asume que la API devuelve un array de objetos: [{ categoria: 'PDF', total: 5 }, ...]
  return (
    <div className="estadistica-container">
      <h2>Estadísticas por Categoría</h2>
      <div className="estadistica-graficos">
        <div className="estadistica-grafico">
          <ResponsiveContainer width={400} height={300}>
            <BarChart data={data}>
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="estadistica-grafico">
          <ResponsiveContainer width={400} height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Estadistica;