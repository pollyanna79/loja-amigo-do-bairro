import React from 'react';

// Card de Login/Cadastro
export const AuthCard = ({ tela, setTela, handleAction, setFormData, formData, setEmail, setSenha }) => (
  <div className="container" style={{ textAlign: 'center' }}>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
      <button className="btn-voltar-home" onClick={() => setTela('loja')}>🏠 Início</button>
      <button className="btn-voltar-home" onClick={() => setTela('carrinho')}>🛒 Carrinho</button>
    </div>

    <h2 style={{ color: '#4caf50' }}>
      {tela === 'login' ? '🔐 Identificação' : '📝 Criar sua Conta'}
    </h2>
    {/* BOTÃO VOLTAR - Essencial para navegação */}
    <div style={{ marginBottom: '20px' }}>
      <button 
        className="btn-voltar-home" 
        onClick={() => setTela('loja')}
        style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '20px', border: '1px solid #444', background: '#333', color: '#fff' }}
      >
        🏠 Voltar ao Início
      </button>
    </div>
    
    <div className="auth-form">
      {tela === 'cadastro' && (
        <>
          <input placeholder="Nome Completo" onChange={e => setFormData({...formData, nome: e.target.value})} />
          <div style={{ display: 'flex', gap: '5px' }}>
             <input placeholder="CPF" style={{ flex: 2 }} onChange={e => setFormData({...formData, cpf: e.target.value})} />
             <input placeholder="CEP" style={{ flex: 1 }} onChange={e => setFormData({...formData, cep: e.target.value})} />
          </div>
          <input placeholder="Endereço de Entrega" onChange={e => setFormData({...formData, endereco: e.target.value})} />
          <input placeholder="Telefone (WhatsApp)" onChange={e => setFormData({...formData, telefone: e.target.value})} />
        </>
      )}
      
      <input placeholder="Seu E-mail" type="email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Crie uma Senha" type="password" onChange={e => setSenha(e.target.value)} />
      
      <button className="btn-primary" style={{ marginTop: '10px', fontSize: '1.1rem' }} onClick={handleAction}>
        {tela === 'login' ? 'ENTRAR E PAGAR' : 'CONCLUIR CADASTRO'}
      </button>
      
      <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#151313' }}>
        {tela === 'login' ? "Ainda não é cliente?" : "Já possui cadastro?"}
        <button 
          className="btn-link" 
          style={{ marginLeft: '5px', fontWeight: 'bold' }}
          onClick={() => setTela(tela === 'login' ? 'cadastro' : 'login')}
        >
          {tela === 'login' ? 'Cadastre-se aqui' : 'Faça Login'}
        </button>
      </p>
    </div>
  </div>
);
// Card de Pagamento/Resumo
export const CheckoutCard = ({ usuario, total, setTela }) => (
  <div className="container">
    <h2>Resumo do Pedido</h2>
    <div style={{ backgroundColor: '#1c1818', padding: '20px', borderRadius: '8px', color: 'white', textAlign:'center' }}>
      <p>Olá, <strong>{usuario?.nome}</strong>!</p>
      <p>📍 Enviar para: {usuario?.endereco}</p>
      <p>💰 Subtotal: R$ {total.toFixed(2)}</p>
      <p>🚚 Frete: R$ 15,00</p>
      <hr/>
      <h3>Total: R$ {(total + 15).toFixed(2)}</h3>
      <button className="btn-primary" style={{width: '100%'}} onClick={() => setTela('sucesso')}>PAGAR AGORA</button>
    </div>
  </div>
);