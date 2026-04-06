import React from 'react';

const Rodape = () => {
  return (
    <footer className="rodape">
      <div className="rodape-conteudo">
        <div className="info-contato">
          <h4>📞 Contacto</h4>
          <p>(11) 99999-9999</p>
          <p>suporte@supermarcadobairro.com</p>
        </div>
        <div className="endereco">
          <h4>📍 Localização</h4>
          <p>Rua do Bairro, 999 - Centro</p>
          <p>Cidade - Estado, 00000-000</p>
        </div>
        <div className="redes-sociais">
          <h4>📱 Redes Sociais</h4>
          <div className="icones">
            <span><img src="https://tse2.mm.bing.net/th/id/OIP.HEr8Hjj6LeVlYrNYJ0LRuwHaHZ?w=211&h=210&c=7&r=0&o=7&pid=1.7&rm=3" alt="Instagram" style={{ width: '30px', borderRadius: '40px' }} /> </span> | <span><img src="https://tse2.mm.bing.net/th/id/OIP.vn65vZk7W7nSLY9X_dUosAHaHa?w=210&h=210&c=7&r=0&o=7&pid=1.7&rm=3" alt="Facebook" style={{ width: '30px' }} /></span> | <span><img src="https://tse2.mm.bing.net/th/id/OIP.lTqMPiPP11QPJ0FFSx9h6gHaHc?w=209&h=210&c=7&r=0&o=7&pid=1.7&rm=3" alt="WhatsApp" style={{ width: '30px', borderRadius:'30px' }} /></span>
          </div>
        </div>
      </div>
      <div className="copyright">
        © 2024 Supermarco do Bairro - Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Rodape;