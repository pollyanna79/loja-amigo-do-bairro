export const SucessoCard = ({ pedidoId, setTela, limparCarrinho }) => (
  <div className="container" style={{ textAlign: 'center', padding: '40px 20px' }}>
    <div style={{ fontSize: '60px', color: '#4caf50', marginBottom: '20px' }}>✅</div>
    <h2 style={{ color: '#4caf50' }}>Pedido Recebido!</h2>
    <p>Obrigado por comprar conosco.</p>
    
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      padding: '20px', 
      borderRadius: '10px', 
      margin: '20px 0',
      border: '1px dashed #4caf50' 
    }}>
      <span style={{ fontSize: '0.9rem', color: '#888' }}>NÚMERO DO PEDIDO</span>
      <h1 style={{ margin: '10px 0', color: '#fff', letterSpacing: '2px' }}>#{pedidoId}</h1>
    </div>

    <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '30px' }}>
      Preparamos seu pedido com carinho. <br/>
      Você receberá atualizações no seu WhatsApp.
    </p>

    <button 
      className="btn-primary" 
      onClick={() => {
        limparCarrinho();
        setTela('loja');
      }}
      style={{ width: '100%', padding: '15px' }}
    >
      VOLTAR PARA A LOJA
    </button>
  </div>
);