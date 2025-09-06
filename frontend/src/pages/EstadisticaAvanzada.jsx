import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FF6384', '#36A2EB', '#FFCE56'];

function EstadisticaAvanzada() {
  const [data, setData] = useState({ porUsuario: [], porExtension: [], porHora: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/estadisticas-avanzadas')
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="estadistica-cargando">Cargando estadísticas avanzadas...</div>;

  return (
    <div className="estadistica-container">
      <h2>Estadísticas Avanzadas</h2>
      <div className="estadistica-graficos">
        <div className="estadistica-grafico">
          <h4>Documentos por Usuario</h4>
          <ResponsiveContainer width={400} height={300}>
            <BarChart data={data.porUsuario}>
              <XAxis dataKey="usuario" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#36A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="estadistica-grafico">
          <h4>Documentos por Extensión</h4>
          <ResponsiveContainer width={400} height={300}>
            <PieChart>
              <Pie
                data={data.porExtension}
                dataKey="total"
                nameKey="extension"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#FFBB28"
                label
              >
                {data.porExtension.map((entry, index) => (
                  <Cell key={`cell-ext-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="estadistica-grafico">
          <h4>Documentos por Hora</h4>
          <ResponsiveContainer width={400} height={300}>
            <BarChart data={data.porHora.map(item => ({
              ...item,
              horaLabel: item.hora === null ? 'Sin hora' :
                (item.hora === 0 ? '12 AM' :
                item.hora < 12 ? `${item.hora} AM` :
                item.hora === 12 ? '12 PM' : `${item.hora - 12} PM`)
            }))}>
              <XAxis dataKey="horaLabel" label={{ value: 'Hora', position: 'insideBottomRight', offset: 0 }} angle={-20} textAnchor="end" interval={0} height={60} />
              <YAxis />
              <Tooltip formatter={(value, name, props) => [value, 'Cantidad']} labelFormatter={(label, payload) => `Hora: ${label}`} />
              <Legend />
              <Bar dataKey="total" fill="#FF6384" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default EstadisticaAvanzada;
