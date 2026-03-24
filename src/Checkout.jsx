import React, { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";

const Checkout = ({ itensNoCarrinho, totalOriginal, usuario, setTela, setUltimoPedidoId, limparCarrinho }) => {
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [historico, setHistorico] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const valorFrete = metodoPagamento === 'Pix' ? 0 : 10.00;
  const valorTotalFinal = (parseFloat(totalOriginal) || 0) + valorFrete;

  // Função para formatar moeda brasileira
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor) || 0);
  };

  useEffect(() => {
    if (usuario) carregarHistorico();
  }, [usuario]);

  const carregarHistorico = async () => {
    try {
      const { data, error } = await supabase
        .from('view_compras_detalhadas')
        .select('*')
        .eq('id_usuario', usuario?.id)
        .order('id_pedido', { ascending: false });
      
      if (error) throw error;
      if (data) setHistorico(data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err.message);
    }
  };

  const finalizarCompra = async () => {
    if (!metodoPagamento) return alert("Escolha o pagamento!");
    if (!itensNoCarrinho.length) return alert("Seu carrinho está vazio!");
    
    setEnviando(true);
    try {
      const idPedidoGerado = Math.floor(10000 + Math.random() * 90000).toString();
      
      const listaProdutos = itensNoCarrinho.map(i => ({ 
        id: i.id, 
        foto: i.foto_url || '', 
        nome: i.descricao,
        qtd: i.qtd,
        precoUnitario: i.preco 
      }));

      const { error } = await supabase.from('pedidos').insert([{
        id_usuario: usuario.id,
        id_pedido: idPedidoGerado,
        nome_cliente: usuario.nome,
        id_produto: listaProdutos, 
        descricao: itensNoCarrinho.map(i => `${i.qtd}x ${i.descricao}`).join(', '),
        valor_total: valorTotalFinal, // Salvando como número
        metodo_pagamento: metodoPagamento,
        detalhes_envio: { 
            rua: usuario.endereco, 
            cep: usuario.cep, 
            tel: usuario.telefone,
            cpf: usuario.cpf
        }
      }]);

      if (error) throw error;
      
      setUltimoPedidoId(idPedidoGerado);
      limparCarrinho();
      setTela('sucesso');
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', padding: '20px', color: '#fff' }}>
      <button 
        onClick={() => setTela('loja')} 
        style={{ background: '#444', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        ⬅ Voltar para a Loja
      </button>
      
      
      
      <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '10px', border: '1px solid #444' }}>
 
        
        <select 
          value={metodoPagamento} 
          onChange={(e) => setMetodoPagamento(e.target.value)} 
          style={{ width: '100%', padding: '12px', margin: '15px 0', borderRadius: '5px', background: '#333', color: '#fff' }}
        >
          <option value="">Escolha a forma de pagamento</option>
          <option value="Pix">Pix (Entrega Grátis)</option>
          <option value="Cartão">Cartão de Crédito</option>
        </select>

        <button onClick={finalizarCompra} disabled={enviando || !itensNoCarrinho.length} className="btn-primary" style={{ width: '100%', padding: '15px' }}>
          {enviando ? "PROCESSANDO..." : "CONFIRMAR E PAGAR"}
        </button>
      </div>

      <hr style={{ margin: '40px 0', borderColor: '#444' }} />

      <h2 style={{ color: '#4caf50', marginTop: '30px' }}>📜 Meu Histórico de Pedidos</h2>

      {historico.length === 0 ? (
        <p style={{ color: '#888' }}>Nenhum pedido encontrado na sua conta.</p>
      ) : (
        historico.map((h, index) => (
          <div key={h.id_pedido || index} style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #333' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4caf50', marginBottom: '15px' }}>
              <strong>PEDIDO #{h.id_pedido}</strong>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>
                {h.data_compra ? new Date(h.data_compra).toLocaleDateString('pt-BR') : 'Data indisponível'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '15px' }}>
              {Array.isArray(h.id_produto) ? (
                h.id_produto.map((prod, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#222', padding: '10px', borderRadius: '8px' }}>
                    <img src={prod.foto || 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} alt="prod" />
                    <div style={{ fontSize: '0.75rem' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{prod.nome}</p>
                      <p style={{ margin: 0, color: '#4caf50' }}>{prod.qtd} un.</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.8rem', color: '#bbb' }}>{h.descricao}</p>
              )}
            </div>

            {/* Rodapé */}
            <div style={{ borderTop: '1px solid #222', paddingTop: '10px' }}>
              <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '0.85rem' }}>
                📍 <strong>Entrega:</strong> {h.endereco || 'Endereço padrão'} 
                {h.cep ? ` - CEP: ${h.cep}` : ''}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: '0', color: '#4caf50', fontWeight: 'bold', fontSize: '1rem' }}>
                   Total: {formatarMoeda(h.valor_total)}
                </p>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>
                  💳 {h.metodo_pagamento || 'Não informado'}
                </span>
                <span style={{ color: '#3da90a', fontSize: '0.8rem' }}>
                Pagamento efetuado com Sucesso..
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Checkout;