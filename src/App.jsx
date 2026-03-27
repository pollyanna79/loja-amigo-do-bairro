import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import { AuthCard } from "./Logica"; 
import Checkout from './Checkout'; 
import { SucessoCard } from './SucessoCard'; 
import './App.css';
import Rodape from './Rodape';

import { ShoppingCart, Search, User, Flame } from 'lucide-react';

function App() {
  const [estoque, setEstoque] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [ultimoPedidoId, setUltimoPedidoId] = useState(null);
  const [telaAtual, setTelaAtual] = useState('loja');
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [formData, setFormData] = useState({});
  const [tempo, setTempo] = useState(24 * 60 * 60);

  // Timer do Cronômetro
  useEffect(() => {
    const timer = setInterval(() => {
      setTempo((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatarTempo = (segundosTotal) => {
    const horas = Math.floor(segundosTotal / 3600);
    const minutos = Math.floor((segundosTotal % 3600) / 60);
    const segundos = segundosTotal % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  // Carregar Estoque do Supabase
  useEffect(() => {
   async function carregarDados() {
    const { data, error } = await supabase
      .from('estoque_loja')
      .select('*')
      .order('descricao', { ascending: true }); // Opcional: mantém em ordem alfabética

    if (error) {
      console.error("Erro ao atualizar estoque:", error.message);
    } else if (data) {
      setEstoque(data);
    }
  }

  // Só dispara a busca se o usuário estiver na tela da loja
  if (telaAtual === 'loja') {
    carregarDados();
  }
}, [telaAtual]);

  const adicionarAoCarrinho = (p) => {
    const ex = carrinho.find(i => i.id === p.id);
    if (ex) {
      setCarrinho(carrinho.map(i => i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i));
    } else {
      setCarrinho([...carrinho, { ...p, qtd: 1 }]);
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('loja_amigo_do_bairro')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .single();

      if (error || !data) {
        alert("Usuário não encontrado!");
      } else {
        setUsuario(data);
        setTelaAtual('pagamento');
      }
    } catch (err) {
      alert("Erro na conexão.");
    }
  };

  const handleCadastro = async () => {
    const { error } = await supabase.from('loja_amigo_do_bairro').insert([{ ...formData, email, senha }]);
    if (!error) {
      alert("Cadastrado! Faça login.");
      setTelaAtual('login');
    }
  };

  // --- 1. TELA DO CARRINHO ---
  if (telaAtual === 'carrinho') {
    return (
      <div className="container" style={{background: '#1a1a1a', color: 'white', minHeight: '100vh', padding: '20px'}}>
        <h2 style={{color: '#4caf50', textAlign: 'center'}}>🛒 Seu Carrinho</h2>
        
        <div className="lista-carrinho" style={{marginTop: '20px'}}>
          {carrinho.length === 0 ? (
            <p style={{textAlign: 'center', color: '#888'}}>Seu carrinho está vazio!</p>
          ) : (
            carrinho.map(item => (
              <div key={item.id} className="item-carrinho">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={item.foto_url} 
                    style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} 
                    alt={item.descricao} 
                  />
                  <span>{item.descricao}</span>
                </div>
                <span className="preco-item">
                  {item.qtd}x R$ {Number(item.preco).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{textAlign: 'right', marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px'}}>
           <h3 style={{fontSize: '1.8rem'}}>Total: <span style={{color: '#4caf50'}}>R$ {carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0).toFixed(2)}</span></h3>
        </div>

      <button 
  className="btn-primary" 
  style={{width: '100%', padding: '15px', marginTop: '20px', fontSize: '1.2rem'}} 
  onClick={() => {
    if (usuario) {
      setTelaAtual('pagamento'); // Se já está logado, vai pro pagamento
    } else {
      setTelaAtual('login'); // Se NÃO está logado, pede email e senha primeiro
    }
  }}
>
  FINALIZAR PEDIDO
</button>
        
        <button onClick={() => setTelaAtual('loja')} style={{width: '100%', marginTop: '10px', background: '#444', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer'}}>
          ← Continuar Comprando
        </button>
      </div>
    );
  }

  // --- 2. OUTRAS TELAS (LOGIN, PAGAMENTO, SUCESSO) ---
  if (telaAtual === 'login' || telaAtual === 'cadastro') {
    return <AuthCard tela={telaAtual} setTela={setTelaAtual} handleAction={telaAtual === 'login' ? handleLogin : handleCadastro} setFormData={setFormData} formData={formData} setEmail={setEmail} setSenha={setSenha} />;
  }

  if (telaAtual === 'pagamento') {
    return <Checkout usuario={usuario} itensNoCarrinho={carrinho} totalOriginal={carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0)} setTela={setTelaAtual} setUltimoPedidoId={setUltimoPedidoId} limparCarrinho={() => setCarrinho([])} />;
  }

  if (telaAtual === 'sucesso') {
    return <SucessoCard pedidoId={ultimoPedidoId} setTela={setTelaAtual} limparCarrinho={() => setCarrinho([])} />;
  }

  // --- 3. TELA PRINCIPAL (LOJA) ---
  return (
    <div className="app-wrapper" style={{background: '#000', color: 'white', minHeight: '100vh'}}>
      
      <button className="meus-pedidos" onClick={() => setTelaAtual(usuario ? 'pagamento' : 'login')}>
        <Search size={18} /> Meus Pedidos
      </button>

      <button className="cart-button" onClick={() => setTelaAtual('carrinho')}>
        <ShoppingCart size={20} /> Carrinho ({carrinho.reduce((acc, i) => acc + i.qtd, 0)})
      </button>

      {/* Header com Cronômetro e Logo */}
      <header className="header-principal" style={{paddingTop: '60px'}}>
     <div className="barra-topo-urgente">
  <Flame className="icone-fogo-piscante" />
  <span className="texto-oferta">APROVEITE! A OFERTA TERMINA EM:</span>
  <strong className="cronometro-gigante">{formatarTempo(tempo)}</strong>
  <Flame className="icone-fogo-piscante" />
</div>

        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', margin: '30px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <User size={70} color="#1d6417" style={{ marginRight: '-20px', zIndex: 1 }} /> 
            <ShoppingCart size={75} color="#4caf50" strokeWidth={2.5} />
          </div>
          <h1 className="titulo-principal-piscante">Amigo do Bairro</h1>
        </div>
      </header>

      {/* Grid de Produtos */}
      <main style={{padding: '20px'}}>
        <div className="grid-produtos">
          {estoque.length === 0 ? (
            <p style={{textAlign: 'center'}}>Carregando estoque...</p>
          ) : (
            estoque.map(item => (
              <div key={item.id} className="card-produto">
                <img 
                  src={item.foto_url} 
                  alt={item.descricao} 
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
                <h3>{item.descricao}</h3>
                <p className="preco-card">R$ {Number(item.preco).toFixed(2)}</p>
                <button className="btn-primary" onClick={() => adicionarAoCarrinho(item)}>
                  Adicionar
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <Rodape />
    </div>
  );
}

export default App;