function ModalDoacao({ mostrar, fecharModal }) {
  if (!mostrar) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Registrar Doação</h5>
            <button type="button" className="btn-close" onClick={fecharModal}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Nome do Doador</label>
                <input type="text" className="form-control" autoFocus />
              </div>
              <div className="mb-3">
                <label className="form-label">Valor</label>
                <input type="number" className="form-control" />
              </div>
              <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDoacao;