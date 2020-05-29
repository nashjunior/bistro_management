import Sequelize, { Model } from 'sequelize';

class OrdemPedidos extends Model {
  static init(sequelize) {
    super.init(
      {
        numero_pedido: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
          field: 'createdAt',
        },
        cliente: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        valor_total: {
          type: Sequelize.FLOAT,
        },
      },
      { sequelize, timestamps: false }
    );
    return this;
  }
}

export default OrdemPedidos;
