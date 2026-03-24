import React, { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import './Catalogo.css'; // Importando o CSS aqui

const Catalogo = ({ adicionarAoCarrinho }) => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  useEffect(() => {
    async function buscar() {
      setCarregando(true);
      try {
        let query = supabase.from('estoque').select('*');
        if (categoriaAtiva !== 'Todos') {
          query = query.eq('categoria', categoriaAtiva);
        }
        const { data, error } = await query;
        if (error) throw error;
        setProdutos(data || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error.message);
      } finally {
        setCarregando(false);
      }
    }
    buscar();
  }, [categoriaAtiva]);

  return (
    <main className="catalogo-container">
      <nav className="categoria-nav">
        {['Todos', 'Mercearia', 'Bazar', 'DPH'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`btn-categoria ${categoriaAtiva === cat ? 'ativa' : ''}`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {carregando && <p>Carregando produtos...</p>}

      <div className="produtos-grid">
        {produtos.map(item => (
          <div key={item.id} className="produto-card">
            <div className="produto-img-container">
              <img 
                src={item.foto_url} 
                alt={item.descricao} 
                className="produto-img" 
              />
            </div>

            <div className="produto-info">
              <h3 className="produto-titulo">{item.descricao}</h3>
              <p className="produto-preco">
                R$ {Number(item.preco).toFixed(2).replace('.', ',')}
              </p>
            </div>

            <button 
              onClick={() => adicionarAoCarrinho(item)}
              className="btn-comprar"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Catalogo;