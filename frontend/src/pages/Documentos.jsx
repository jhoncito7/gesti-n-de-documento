import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

function Documentos() {
    const [documentos, setDocumentos] = useState([]);
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoDoc, setNuevoDoc] = useState({ categoria_id: '', usuario_id: '', descripcion: '' });
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [editDoc, setEditDoc] = useState({ nombre_documento: '', categoria_id: '', extension: '' });
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    //=========================
    // Obtener usuario logueado del token

    let usuarioLogueado = null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            usuarioLogueado = payload;
        } catch (e) {}
    }
    const fileInputRef = useRef();

    useEffect(() => {
        obtenerDocumentos();
        obtenerCategorias();
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/usuarios', config);
            setUsuarios(res.data);
        } catch (err) {
            setMensaje('Error al cargar usuarios');
        }
    };
    const obtenerDocumentos = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/documentos', config);
            setDocumentos(res.data);
        } catch (err) {
            setMensaje('Error al cargar documentos');
        }
    };

    const obtenerCategorias = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/categorias', config);
            setCategorias(res.data);
        } catch (err) {
            setMensaje('Error al cargar categorías');
        }
    };

    const agregarDocumento = async (e) => {
        e.preventDefault();
        if (!archivo) {
            setMensaje('Selecciona un archivo');
            return;
        }

        //=========================
        // Usar usuario logueado

        const usuario_id = usuarioLogueado?.id_usuario;
        if (!usuario_id) {
            setMensaje('No se pudo obtener el usuario logueado');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('archivo', archivo);
            formData.append('categoria_id', nuevoDoc.categoria_id);
            formData.append('usuario_id', usuario_id);
            formData.append('descripcion', nuevoDoc.descripcion);
            await axios.post('http://localhost:3000/api/documentos/uploads', formData, config);
            setMensaje('Archivo subido correctamente');
            setNuevoDoc({ categoria_id: '', usuario_id: '' });
            setArchivo(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            obtenerDocumentos();
        } catch (err) {
            setMensaje('Error al subir archivo');
        }
    };

    const eliminarDocumento = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/documentos/${id}`, config);
            setMensaje('Documento eliminado');
            obtenerDocumentos();
        } catch (err) {
            setMensaje('Error al eliminar documento');
        }
    };

    const iniciarEdicion = (doc) => {
        setEditandoId(doc.id_documento);
        setEditDoc({
            nombre_documento: doc.nombre_documento,
            categoria_id: doc.id_categoria,
            extension: doc.extension
        });
    };

    const actualizarDocumento = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/documentos/${editandoId}`, {
                nombre_documento: editDoc.nombre_documento,
                categoria_id: editDoc.categoria_id,
                extension: editDoc.extension
            }, config);
            setMensaje('Documento actualizado');
            setEditandoId(null);
            obtenerDocumentos();
        } catch (err) {
            setMensaje('Error al actualizar documento');
        }
    };

    const documentosFiltrados = tipoFiltro
        ? documentos.filter(doc => doc.extension === tipoFiltro)
        : documentos;
    //=========================
    // Obtener tipos únicos de archivos
    const tiposUnicos = Array.from(new Set(documentos.map(doc => doc.extension))).filter(Boolean);

    return (
        <div>
            <h2>Documentos</h2>
            <label>Filtrar por tipo:&nbsp;
                <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
                    <option value="">Todos</option>
                    {tiposUnicos.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo.toUpperCase()}</option>
                    ))}
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="docx">DOCX</option>
                    <option value="txt">TXT</option>
                    <option value="rtf">RTF</option>
                    <option value="odt">ODT</option>
                    <option value="xls">XLS</option>
                    <option value="xlsx">XLSX</option>
                    <option value="csv">CSV</option>
                    <option value="ppt">PPT</option>
                    <option value="pptx">PPTX</option>
                    <option value="jpg">JPG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="gif">GIF</option>
                    <option value="bmp">BMP</option>
                    <option value="svg">SVG</option>
                    <option value="webp">WEBP</option>
                    <option value="tiff">TIFF</option>
                </select>
            </label>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '2rem' }}>
                <form onSubmit={agregarDocumento} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', maxWidth: '400px', minWidth: '320px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#007bff' }}>Subir nuevo archivo</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <select
                            value={nuevoDoc.categoria_id}
                            onChange={e => setNuevoDoc({ ...nuevoDoc, categoria_id: e.target.value })}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">Seleccione categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.categoria_nombre}</option>
                            ))}
                        </select>
                        {/* Mostrar campo descripción solo si hay categoría seleccionada */}
                        {nuevoDoc.categoria_id && (
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={nuevoDoc.descripcion}
                                onChange={e => setNuevoDoc({ ...nuevoDoc, descripcion: e.target.value })}
                                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        )}
                        {/* El usuario logueado no puede seleccionar usuario */}
                        {usuarioLogueado && (
                            <input type="hidden" value={usuarioLogueado.id_usuario} />
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={e => setArchivo(e.target.files[0])}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer' }}>Subir archivo</button>
                    </div>
                </form>
                {editandoId && (
                    <form onSubmit={actualizarDocumento} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', minWidth: '320px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <h3>Editar documento</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editDoc.nombre_documento}
                            onChange={e => setEditDoc({ ...editDoc, nombre_documento: e.target.value })}
                            style={{ marginBottom: '0.5rem', width: '95%' }}
                        />
                        <select
                            value={editDoc.categoria_id}
                            onChange={e => setEditDoc({ ...editDoc, categoria_id: e.target.value })}
                            style={{ marginBottom: '0.5rem', width: '100%' }}
                        >
                            <option value="">Seleccione categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.categoria_nombre}</option>
                            ))}
                        </select>
                        <select
                            value={editDoc.extension}
                            onChange={e => setEditDoc({ ...editDoc, extension: e.target.value })}
                            style={{ marginBottom: '0.5rem', width: '100%' }}
                        >
                            {tiposUnicos.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo.toUpperCase()}</option>
                            ))}
                        </select>
                        <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem' }}>Actualizar</button>
                        <button type="button" onClick={() => setEditandoId(null)} style={{ marginLeft: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem' }}>Cancelar</button>
                    </form>
                )}
            </div>
            {mensaje && <p>{mensaje}</p>}
            <div className="documentos-table-container">
            <table className="documentos-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th className="file-icon">Tipo</th>
                        <th>Nombre</th>
                        <th>Peso (MB)</th>
                        <th>Fecha</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Usuario</th>
                        {/* <th>Login</th> */}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {documentosFiltrados.map(doc => {
                        let icon;
                        switch (doc.extension) {
                            case 'pdf':
                                icon = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/pdf.svg';
                                break;
                            case 'doc':
                            case 'docx':
                                icon = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/word.svg';
                                break;
                            case 'xls':
                            case 'xlsx':
                            case 'csv':
                                icon = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/excel.svg';
                                break;
                            case 'ppt':
                            case 'pptx':
                                icon = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/powerpoint.svg';
                                break;
                            case 'jpg':
                            case 'jpeg':
                            case 'png':
                            case 'gif':
                            case 'bmp':
                            case 'svg':
                            case 'webp':
                            case 'tiff':
                                icon = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/image.svg';
                                break;
                            case 'txt':
                                icon = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/file.svg';
                                break;
                            default:
                                icon = 'https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/file.svg';
                        }
                        const extensionesImagen = ['jpg','jpeg','png','gif','bmp','svg','webp','tiff'];
                        const esImagen = extensionesImagen.includes(doc.extension.toLowerCase());
                        return (
                            <tr key={doc.id_documento}>
                                <td>{doc.id_documento}</td>
                                <td className="file-icon"><img src={icon} alt={doc.extension} className="file-icon-img" /></td>
                                <td>
                                    {doc.nombre_documento}
                                    {esImagen && (
                                        <div style={{marginTop:'6px'}}>
                                            <img src={`http://localhost:3000/api/documentos/${doc.id_documento}/download`} alt={doc.nombre_documento} style={{maxWidth:'80px',maxHeight:'80px',borderRadius:'6px',boxShadow:'0 1px 4px rgba(0,0,0,0.12)'}} />
                                        </div>
                                    )}
                                </td>
                                <td>{doc.peso}</td>
                                <td>{doc.fecha_hora}</td>
                                <td>{doc.categoria_nombre || doc.id_categoria}</td>
                                <td>{doc.categoria_descripcion || doc.id_categoria}</td>
                                <td>{doc.estado || ''}</td>
                                <td>{doc.nombre_usuario} {doc.apellido_usuario}</td>
                                {/* <td>{doc.usuario_login}</td> */}
                                <td className="acciones-columna">
                                    <button className="documentos-btn documentos-btn-eliminar" onClick={() => eliminarDocumento(doc.id_documento)}>Eliminar</button>
                                    <button className="documentos-btn documentos-btn-editar" onClick={() => iniciarEdicion(doc)}>Editar</button>
                                    <a
                                        className="documentos-btn documentos-btn-descargar"
                                        href={`http://localhost:3000/uploads/${doc.ruta}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Descargar
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>

        </div>
    );
}

export default Documentos;



