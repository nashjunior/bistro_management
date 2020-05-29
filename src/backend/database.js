import Sequelize from 'sequelize';
import Estoques from '../models/Estoques';
import MovimentosEstoque from '../models/MovimentosEstoque';
import ItensCardapio from '../models/ItensCardapio';
import ItensCardapiosXEstoques from '../models/ItensCardapiosXEstoques';
import OrdemPedidos from '../models/OrdemPedidos';
import Pedidos from '../models/Pedidos';
import databaseConfig from './config/database';

const models = [
  MovimentosEstoque,
  Estoques,
  ItensCardapio,
  ItensCardapiosXEstoques,
  OrdemPedidos,
  Pedidos,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
